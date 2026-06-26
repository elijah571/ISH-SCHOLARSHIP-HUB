import { scholarshipRepo } from './scholarship.repository.js';
import { uploadsToCloudinary, deleteFromCloudinary } from '../../config/cloudinary.js';
import { AppError } from '../../utils/AppError.js';
import { logActivity } from '../admin/admin.service.js';

export const createScholarshipService = async (data, createdByUser) => {
  let imageUrl, imagePublicId;
  if (data.image) {
    const uploaded = await uploadsToCloudinary(data.image.buffer, 'scholarships');
    imageUrl = uploaded.secure_url;
    imagePublicId = uploaded.public_id;
  }

  const scholarship = await scholarshipRepo.create({
    title: data.title, description: data.description, country: data.country,
    duration: data.duration, link: data.link,
    deadline: new Date(data.deadline),
    fundingType: data.funding_type,
    fieldOfStudy: data.fieldOfStudy, location: data.location,
    university: data.university, tuitionFees: data.tuitionFees,
    format: data.format, attendance: data.attendance,
    degreeType: data.degreeType, specialProgramme: data.specialProgramme,
    imageUrl, imagePublicId,
    createdById: createdByUser.id,
  });

  logActivity({
    userId: createdByUser.id, userName: createdByUser.fullName, userEmail: createdByUser.email,
    action: 'scholarship_created', targetType: 'scholarship',
    targetId: scholarship.id, targetTitle: scholarship.title,
  });

  return scholarship;
};

export const getCountriesService = () => scholarshipRepo.getCountries();

export const getScholarshipsService = (params) => scholarshipRepo.findAll(params);

export const getScholarshipByIdService = async (id) => {
  const s = await scholarshipRepo.findById(id);
  if (!s) throw new AppError('Scholarship not found', 404);
  return s;
};

export const updateScholarshipService = async (id, data, updatingUser) => {
  const scholarship = await scholarshipRepo.findById(id);
  if (!scholarship) throw new AppError('Scholarship not found', 404);

  const updateData = {};

  if (data.image) {
    if (scholarship.imagePublicId) await deleteFromCloudinary(scholarship.imagePublicId).catch(() => {});
    const uploaded = await uploadsToCloudinary(data.image.buffer, 'scholarships');
    updateData.imageUrl = uploaded.secure_url;
    updateData.imagePublicId = uploaded.public_id;
  }

  const fieldMap = {
    title: 'title', description: 'description', country: 'country', duration: 'duration',
    link: 'link', funding_type: 'fundingType', fieldOfStudy: 'fieldOfStudy', location: 'location',
    university: 'university', tuitionFees: 'tuitionFees', format: 'format',
    attendance: 'attendance', degreeType: 'degreeType', specialProgramme: 'specialProgramme',
  };

  for (const [src, dest] of Object.entries(fieldMap)) {
    if (data[src] !== undefined) updateData[dest] = data[src];
  }
  if (data.deadline !== undefined) updateData.deadline = new Date(data.deadline);

  const updated = await scholarshipRepo.update(id, updateData);

  logActivity({
    userId: updatingUser.id, userName: updatingUser.fullName, userEmail: updatingUser.email,
    action: 'scholarship_updated', targetType: 'scholarship',
    targetId: id, targetTitle: updated?.title || scholarship.title,
  });

  return updated || scholarship;
};

export const deleteScholarshipService = async (id, deletingUser) => {
  const scholarship = await scholarshipRepo.findById(id);
  if (!scholarship) throw new AppError('Scholarship not found', 404);

  if (scholarship.imagePublicId) await deleteFromCloudinary(scholarship.imagePublicId).catch(() => {});
  await scholarshipRepo.delete(id);

  logActivity({
    userId: deletingUser.id, userName: deletingUser.fullName, userEmail: deletingUser.email,
    action: 'scholarship_deleted', targetType: 'scholarship',
    targetId: id, targetTitle: scholarship.title,
  });
};
