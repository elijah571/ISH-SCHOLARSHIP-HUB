import { Scholarship } from '../../models/scholarship.js';
import {
  uploadsToCloudinary,
  deleteFromCloudinary,
} from '../../config/cloudinary.js';
import { AppError } from '../../utils/AppError.js';
import { logActivity } from '../admin/admin.service.js';

export const createScholarshipService = async ({
  title,
  description,
  country,
  deadline,
  funding_type,
  link,
  duration,
  image,
  createdBy,
}) => {
  let uploadedImage = null;

  if (image) {
    uploadedImage = await uploadsToCloudinary(image.buffer, 'scholarships');
  }

  const scholarship = await Scholarship.create({
    title,
    description,
    country,
    deadline,
    funding_type,
    link: link || undefined,
    duration: duration || undefined,
    image: uploadedImage
      ? {
          url: uploadedImage.secure_url,
          publicId: uploadedImage.public_id,
        }
      : undefined,
    createdBy,
  });

  if (!scholarship) {
    throw new AppError('Failed to create scholarship', 500);
  }

  const creator = await import('../../models/user.model.js').then(m => m.User.findById(createdBy).lean());
  await logActivity({
    user: creator || { _id: createdBy, fullName: 'Admin', email: '' },
    action: 'scholarship_created',
    targetType: 'scholarship',
    targetId: scholarship._id,
    targetTitle: scholarship.title,
  });

  return scholarship;
};

/* ===================== GET ALL (SEARCH + FILTER + PAGINATION) ===================== */
export const getScholarshipsService = async ({
  page = 1,
  limit = 10,
  search,
  country,
  funding_type,
  deadline,
}) => {
  const query = {};

  // 🔍 Text search
  if (search) {
    query.$text = { $search: search };
  }

  // 🎯 Filters
  if (country) query.country = country;
  if (funding_type) query.funding_type = funding_type;
  if (deadline) query.deadline = { $gte: new Date(deadline) };

  const skip = (page - 1) * limit;

  const [scholarships, total] = await Promise.all([
    Scholarship.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Scholarship.countDocuments(query),
  ]);

  return {
    total,
    page: Number(page),
    pages: Math.ceil(total / limit),
    scholarships,
  };
};

/* ===================== GET ONE ===================== */
export const getScholarshipByIdService = async (id) => {
  const scholarship = await Scholarship.findById(id);
  if (!scholarship) throw new AppError('Scholarship not found', 404);
  return scholarship;
};

/* ===================== UPDATE ===================== */
export const updateScholarshipService = async (id, data) => {
  const scholarship = await Scholarship.findById(id);
  if (!scholarship) throw new AppError('Scholarship not found', 404);

  // 🖼 Replace image if provided
  if (data.image) {
    if (scholarship.image?.publicId) {
      await deleteFromCloudinary(scholarship.image.publicId);
    }

    const uploaded = await uploadsToCloudinary(
      data.image.buffer,
      'scholarships'
    );

    data.image = {
      url: uploaded.secure_url,
      publicId: uploaded.public_id,
    };
  }

  // 🔥 Only assign defined fields
  for (const key of Object.keys(data)) {
    if (data[key] !== undefined) {
      scholarship[key] = data[key];
    }
  }

  await scholarship.save();

  const creator = await import('../../models/user.model.js').then(m => m.User.findById(scholarship.createdBy).lean());
  await logActivity({
    user: creator || { _id: scholarship.createdBy, fullName: 'Admin', email: '' },
    action: 'scholarship_updated',
    targetType: 'scholarship',
    targetId: scholarship._id,
    targetTitle: scholarship.title,
  });

  return scholarship;
};

/* ===================== DELETE ===================== */
export const deleteScholarshipService = async (id) => {
  const scholarship = await Scholarship.findById(id);
  if (!scholarship) throw new AppError('Scholarship not found', 404);

  if (scholarship.image?.publicId) {
    await deleteFromCloudinary(scholarship.image.publicId);
  }

  const title = scholarship.title;
  const creator = await import('../../models/user.model.js').then(m => m.User.findById(scholarship.createdBy).lean());
  await scholarship.deleteOne();

  await logActivity({
    user: creator || { _id: scholarship.createdBy, fullName: 'Admin', email: '' },
    action: 'scholarship_deleted',
    targetType: 'scholarship',
    targetId: id,
    targetTitle: title,
  });
};
