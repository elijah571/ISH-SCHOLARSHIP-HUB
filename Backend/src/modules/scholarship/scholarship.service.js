import { Scholarship } from '../../models/scholarship.js';
import { uploadsToCloudinary, deleteFromCloudinary } from '../../config/cloudinary.js';
import { AppError } from '../../utils/AppError.js';

export const createScholarshipService = async ({
  title,
  description,
  country,
  deadline,
  funding_type,
  image, // optional
  createdBy,
}) => {
  let uploadedImage = null;

  // ✅ Upload image only if provided
  if (image) {
    uploadedImage = await uploadsToCloudinary(image.buffer, 'scholarships');
  }

  const scholarship = await Scholarship.create({
    title,
    description,
    country,
    deadline,
    funding_type,
    link,
    image: uploadedImage
      ? {
          url: uploadedImage.secure_url,
          publicId: uploadedImage.public_id,
        }
      : undefined, // 👈 image remains optional
    createdBy,
  });

  if (!scholarship) {
    throw new AppError('Failed to create scholarship', 500);
  }

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
    Scholarship.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
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

    const uploaded = await uploadsToCloudinary(data.image.buffer, 'scholarships');

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

  return scholarship;
};

/* ===================== DELETE ===================== */
export const deleteScholarshipService = async (id) => {
  const scholarship = await Scholarship.findById(id);
  if (!scholarship) throw new AppError('Scholarship not found', 404);

  if (scholarship.image?.publicId) {
    await deleteFromCloudinary(scholarship.image.publicId);
  }

  await scholarship.deleteOne();
};
