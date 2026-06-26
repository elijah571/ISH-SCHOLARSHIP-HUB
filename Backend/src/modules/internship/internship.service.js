import { internshipRepo } from './internship.repository.js';
import { uploadsToCloudinary, deleteFromCloudinary } from '../../config/cloudinary.js';
import { AppError } from '../../utils/AppError.js';
import { logActivity } from '../admin/admin.service.js';

export const createInternshipService = async (data, createdByUser) => {
  let imageUrl, imagePublicId;
  if (data.image) {
    const uploaded = await uploadsToCloudinary(data.image.buffer, 'internships');
    imageUrl = uploaded.secure_url;
    imagePublicId = uploaded.public_id;
  }

  const internship = await internshipRepo.create({
    title: data.title, institution: data.institution,
    description: data.description, country: data.country,
    deadline: data.deadline ? new Date(data.deadline) : null,
    type: data.type, link: data.link,
    startDate: data.startDate ? new Date(data.startDate) : null,
    endDate: data.endDate ? new Date(data.endDate) : null,
    imageUrl, imagePublicId,
    createdById: createdByUser.id,
  });

  logActivity({
    userId: createdByUser.id, userName: createdByUser.fullName, userEmail: createdByUser.email,
    action: 'internship_created', targetType: 'internship',
    targetId: internship.id, targetTitle: internship.title,
  });

  return internship;
};

export const getInternshipsService = (params) => internshipRepo.findAll(params);

export const getInternshipService = async (id) => {
  const internship = await internshipRepo.findById(id);
  if (!internship) throw new AppError('Internship not found', 404);
  return internship;
};

export const updateInternshipService = async (id, data, updatingUser) => {
  const internship = await internshipRepo.findById(id);
  if (!internship) throw new AppError('Internship not found', 404);

  const updateData = {};

  if (data.image) {
    if (internship.imagePublicId) await deleteFromCloudinary(internship.imagePublicId).catch(() => {});
    const uploaded = await uploadsToCloudinary(data.image.buffer, 'internships');
    updateData.imageUrl = uploaded.secure_url;
    updateData.imagePublicId = uploaded.public_id;
  }

  for (const key of ['title', 'institution', 'description', 'country', 'type', 'link']) {
    if (data[key] !== undefined) updateData[key] = data[key];
  }
  for (const key of ['deadline', 'startDate', 'endDate']) {
    if (data[key] !== undefined) updateData[key] = data[key] ? new Date(data[key]) : null;
  }

  const updated = await internshipRepo.update(id, updateData);

  logActivity({
    userId: updatingUser.id, userName: updatingUser.fullName, userEmail: updatingUser.email,
    action: 'internship_updated', targetType: 'internship',
    targetId: id, targetTitle: updated?.title || internship.title,
  });

  return updated || internship;
};

export const deleteInternshipService = async (id, deletingUser) => {
  const internship = await internshipRepo.findById(id);
  if (!internship) throw new AppError('Internship not found', 404);

  if (internship.imagePublicId) await deleteFromCloudinary(internship.imagePublicId).catch(() => {});
  await internshipRepo.delete(id);

  logActivity({
    userId: deletingUser.id, userName: deletingUser.fullName, userEmail: deletingUser.email,
    action: 'internship_deleted', targetType: 'internship',
    targetId: id, targetTitle: internship.title,
  });
};
