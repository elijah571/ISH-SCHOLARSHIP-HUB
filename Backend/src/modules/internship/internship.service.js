import { Internship } from '../../models/internship.model.js';
import {
  uploadsToCloudinary,
  deleteFromCloudinary,
} from '../../config/cloudinary.js';
import { AppError } from '../../utils/AppError.js';
import { logActivity } from '../admin/admin.service.js';

export const createInternshipService = async (data) => {
  let uploadedImage;

  if (data.image) {
    uploadedImage = await uploadsToCloudinary(data.image.buffer, 'internships');
  }

  const internship = new Internship({
    ...data,
    image: uploadedImage
      ? { url: uploadedImage.secure_url, publicId: uploadedImage.public_id }
      : undefined,
  });

  await internship.save();

  const creator = await import('../../models/user.model.js').then(m => m.User.findById(data.createdBy).lean());
  await logActivity({
    user: creator || { _id: data.createdBy, fullName: 'Admin', email: '' },
    action: 'internship_created',
    targetType: 'internship',
    targetId: internship._id,
    targetTitle: internship.title,
  });

  return internship;
};

/* ===================== GET ALL (SEARCH + FILTER + PAGINATION) ===================== */
export const getInternshipsService = async ({
  page = 1,
  limit = 10,
  search,
  country,
  type,
  deadline,
  startDate,
  endDate,
}) => {
  const query = {};

  // 🔍 Text search
  if (search) {
    query.$text = { $search: search };
  }

  // 🎯 Filters
  if (country) query.country = country;
  if (type) query.type = type;
  if (deadline) query.deadline = { $gte: new Date(deadline) };
  if (startDate) query.startDate = startDate;
  if (endDate) query.endDate = { $gte: new Date(endDate) };

  const skip = (page - 1) * limit;

  const [internship, total] = await Promise.all([
    Internship.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Internship.countDocuments(query),
  ]);

  return {
    total,
    page: Number(page),
    pages: Math.ceil(total / limit),
    internship,
  };
};

/* ===================== GET ONE ===================== */
export const getInternshipService = async (id) => {
  const internship = await Internship.findById(id);
  if (!internship) throw new AppError('Internship not found', 404);
  return internship;
};

/* ===================== UPDATE ===================== */
export const updateInternshipService = async (id, data) => {
  const internship = await Internship.findById(id);
  if (!internship) throw new AppError('Internship not found', 404);

  // 🖼 Replace image if provided
  if (data.image) {
    if (internship.image?.publicId) {
      await deleteFromCloudinary(internship.image.publicId);
    }

    const uploaded = await uploadsToCloudinary(
      data.image.buffer,
      'internships'
    );

    data.image = {
      url: uploaded.secure_url,
      publicId: uploaded.public_id,
    };
  }

  // 🔥 Only assign defined fields
  for (const key of Object.keys(data)) {
    if (data[key] !== undefined) {
      internship[key] = data[key];
    }
  }

  await internship.save();

  const creator = await import('../../models/user.model.js').then(m => m.User.findById(internship.createdBy).lean());
  await logActivity({
    user: creator || { _id: internship.createdBy, fullName: 'Admin', email: '' },
    action: 'internship_updated',
    targetType: 'internship',
    targetId: internship._id,
    targetTitle: internship.title,
  });

  return internship;
};

/* ===================== DELETE ===================== */
export const deleteInternshipService = async (id) => {
  const internship = await Internship.findById(id);
  if (!internship) throw new AppError('Scholarship not found', 404);

  if (internship.image?.publicId) {
    await deleteFromCloudinary(internship.image.publicId);
  }

  const title = internship.title;
  const creator = await import('../../models/user.model.js').then(m => m.User.findById(internship.createdBy).lean());
  await internship.deleteOne();

  await logActivity({
    user: creator || { _id: internship.createdBy, fullName: 'Admin', email: '' },
    action: 'internship_deleted',
    targetType: 'internship',
    targetId: id,
    targetTitle: title,
  });
};
