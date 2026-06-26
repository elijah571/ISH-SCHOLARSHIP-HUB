import argon2 from 'argon2';
import { userAdminRepo, activityRepo } from './admin.repository.js';
import { AppError } from '../../utils/AppError.js';
import { logger } from '../../utils/logger.js';
import { Scholarship, Internship, Blog } from '../../database/models/index.js';

/* ─── Activity helper ────────────────────────────────────────────────────── */
export const logActivity = (data) =>
  activityRepo.create(data).catch((e) => logger.warn('logActivity failed:', e.message));

function formatTimeAgo(date) {
  const s = Math.floor((Date.now() - new Date(date)) / 1000);
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)} min ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  if (s < 604800) return `${Math.floor(s / 86400)}d ago`;
  return new Date(date).toLocaleDateString();
}

/* ─── Dashboard Stats ────────────────────────────────────────────────────── */
export const getDashboardStats = async () => {
  const [userCount, scholarshipCount, internshipCount, blogCount, recentActivity] = await Promise.all([
    userAdminRepo.countUsers(),
    Scholarship.count(),
    Internship.count(),
    Blog.count({ where: { published: true } }),
    activityRepo.findRecent(10),
  ]);

  return {
    counts: { users: userCount, scholarships: scholarshipCount, internships: internshipCount, blogs: blogCount },
    recentActivity: recentActivity.map((a) => ({
      id: a.id,
      user: a.userName,
      userEmail: a.userEmail,
      action: a.action,
      targetType: a.targetType,
      item: a.targetTitle,
      time: formatTimeAgo(a.createdAt),
      createdAt: a.createdAt,
    })),
  };
};

/* ─── Users ──────────────────────────────────────────────────────────────── */
export const getAllUsersService = async (params) => {
  const { users, total, page, limit, pages } = await userAdminRepo.findAll(params);
  return {
    users: users.map((u) => ({
      _id: u.id, fullName: u.fullName, email: u.email, role: u.role,
      isEmailVerified: u.isEmailVerified, createdAt: u.createdAt,
    })),
    pagination: { total, page, limit, pages },
  };
};

export const getUserByIdService = async (id) => {
  const user = await userAdminRepo.findById(id);
  if (!user) throw new AppError('User not found', 404);
  return { _id: user.id, fullName: user.fullName, email: user.email, role: user.role, isEmailVerified: user.isEmailVerified, createdAt: user.createdAt };
};

export const createUserService = async ({ fullName, email, password, role = 'user' }) => {
  const existing = await userAdminRepo.findByEmailExcluding(email.toLowerCase(), '00000000-0000-0000-0000-000000000000');
  if (existing) throw new AppError('User with this email already exists', 400);

  const hashed = await argon2.hash(password);
  const user = await userAdminRepo.create({
    fullName, email: email.toLowerCase(), password: hashed, role, isEmailVerified: true,
  });

  logActivity({
    userId: user.id, userName: user.fullName, userEmail: user.email,
    action: role === 'admin' ? 'admin_created' : 'user_created',
    targetType: 'user', targetId: user.id, targetTitle: user.fullName,
  });

  return { _id: user.id, fullName: user.fullName, email: user.email, role: user.role, createdAt: user.createdAt };
};

export const updateUserService = async (id, updates, requestingUser) => {
  const allowed = ['fullName', 'email', 'role'];
  const data = {};
  for (const key of allowed) {
    if (updates[key] !== undefined) data[key] = updates[key];
  }
  if (!Object.keys(data).length) throw new AppError('No valid updates provided', 400);

  if (data.email) {
    data.email = data.email.toLowerCase();
    const conflict = await userAdminRepo.findByEmailExcluding(data.email, id);
    if (conflict) throw new AppError('Email already in use', 400);
  }

  const user = await userAdminRepo.update(id, data);
  if (!user) throw new AppError('User not found', 404);

  logActivity({
    userId: requestingUser.id, userName: requestingUser.fullName, userEmail: requestingUser.email,
    action: 'user_updated', targetType: 'user', targetId: id, targetTitle: user.fullName,
  });

  return user;
};

export const deleteUserService = async (id, requestingUser) => {
  if (id === requestingUser.id) throw new AppError('You cannot delete your own account', 400);

  const user = await userAdminRepo.findById(id);
  if (!user) throw new AppError('User not found', 404);

  await userAdminRepo.delete(id);

  logActivity({
    userId: requestingUser.id, userName: requestingUser.fullName, userEmail: requestingUser.email,
    action: 'user_deleted', targetType: 'user', targetId: id, targetTitle: user.fullName,
  });

  return { deleted: true, id };
};
