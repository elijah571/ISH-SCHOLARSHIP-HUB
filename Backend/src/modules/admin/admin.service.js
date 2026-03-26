import mongoose from 'mongoose';
import argon2 from 'argon2';
import { User } from '../../models/user.model.js';
import { Scholarship } from '../../models/scholarship.js';
import { Internship } from '../../models/internship.model.js';
import { Blog } from '../../models/blog.model.js';
import { Activity } from '../../models/activity.model.js';
import { AppError } from '../../utils/AppError.js';

export const getDashboardStats = async () => {
  const [userCount, scholarshipCount, internshipCount, blogCount, recentActivity] = await Promise.all([
    User.countDocuments({ role: 'user' }),
    Scholarship.countDocuments(),
    Internship.countDocuments(),
    Blog.countDocuments({ published: true }),
    Activity.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .lean(),
  ]);

  return {
    counts: {
      users: userCount,
      scholarships: scholarshipCount,
      internships: internshipCount,
      blogs: blogCount,
    },
    recentActivity: recentActivity.map((activity) => ({
      id: activity._id,
      user: activity.userName,
      userEmail: activity.userEmail,
      action: activity.action,
      targetType: activity.targetType,
      item: activity.targetTitle,
      time: formatTimeAgo(activity.createdAt),
      createdAt: activity.createdAt,
    })),
  };
};

export const logActivity = async ({ user, action, targetType, targetId, targetTitle }) => {
  await Activity.create({
    user: user._id || user,
    userName: typeof user === 'object' ? user.fullName : 'Unknown User',
    userEmail: typeof user === 'object' ? user.email : '',
    action,
    targetType,
    targetId,
    targetTitle,
  });
};

function formatTimeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hour${Math.floor(seconds / 3600) > 1 ? 's' : ''} ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} day${Math.floor(seconds / 86400) > 1 ? 's' : ''} ago`;
  return new Date(date).toLocaleDateString();
}

/* ================= USER CRUD ================= */

export const getAllUsersService = async ({ page = 1, limit = 10, search = '', role = '' }) => {
  const skip = (page - 1) * limit;

  const query = {};

  if (search) {
    query.$or = [
      { fullName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  if (role) {
    query.role = role;
  }

  const [users, total] = await Promise.all([
    User.find(query)
      .select('-password -sessions -refreshToken -resetPasswordToken')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    User.countDocuments(query),
  ]);

  return {
    users: users.map((user) => ({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      createdAt: user.createdAt,
      appliedScholarships: user.appliedScholarships?.length || 0,
    })),
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
  };
};

export const getUserByIdService = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError('Invalid user ID', 400);
  }

  const user = await User.findById(id)
    .select('-password -sessions -refreshToken -resetPasswordToken')
    .lean();

  if (!user) {
    throw new AppError('User not found', 404);
  }

  return {
    _id: user._id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    isEmailVerified: user.isEmailVerified,
    savedScholarships: user.savedScholarships,
    appliedScholarships: user.appliedScholarships,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

export const createUserService = async ({ fullName, email, password, role = 'user' }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError('User with this email already exists', 400);
  }

  const hashedPassword = await argon2.hash(password);

  const user = await User.create({
    fullName,
    email,
    password: hashedPassword,
    role,
    isEmailVerified: true, // Admin-created users are auto-verified
  });

  await logActivity({
    user: user,
    action: role === 'admin' ? 'admin_created' : 'user_created',
    targetType: 'user',
    targetId: user._id,
    targetTitle: user.fullName,
  });

  return {
    _id: user._id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    isEmailVerified: user.isEmailVerified,
    createdAt: user.createdAt,
  };
};

export const updateUserService = async (id, updates) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError('Invalid user ID', 400);
  }

  const allowedUpdates = ['fullName', 'email', 'role'];
  const sanitizedUpdates = {};

  for (const key of allowedUpdates) {
    if (updates[key] !== undefined) {
      sanitizedUpdates[key] = updates[key];
    }
  }

  if (Object.keys(sanitizedUpdates).length === 0) {
    throw new AppError('No valid updates provided', 400);
  }

  if (updates.email) {
    const existingUser = await User.findOne({ email: updates.email, _id: { $ne: id } });
    if (existingUser) {
      throw new AppError('Email already in use by another user', 400);
    }
  }

  const user = await User.findByIdAndUpdate(
    id,
    { $set: sanitizedUpdates },
    { new: true, runValidators: true }
  ).select('-password -sessions -refreshToken -resetPasswordToken');

  if (!user) {
    throw new AppError('User not found', 404);
  }

  await logActivity({
    user: user,
    action: 'user_updated',
    targetType: 'user',
    targetId: user._id,
    targetTitle: user.fullName,
  });

  return user;
};

export const deleteUserService = async (id, requestingUserId) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError('Invalid user ID', 400);
  }

  if (id === requestingUserId.toString()) {
    throw new AppError('You cannot delete your own account', 400);
  }

  const user = await User.findByIdAndDelete(id);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  await logActivity({
    user: requestingUserId,
    action: 'user_deleted',
    targetType: 'user',
    targetId: user._id,
    targetTitle: user.fullName,
  });

  return { deleted: true, id };
};
