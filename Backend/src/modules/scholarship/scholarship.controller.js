import { asyncHandler } from '../../middleware/asyncHandler.js';
import {
  createScholarshipService,
  getScholarshipsService,
  getScholarshipByIdService,
  updateScholarshipService,
  deleteScholarshipService,
} from './scholarship.service.js';
import {
  CreateScholarshipDTO,
  UpdateScholarshipDTO,
} from './scholarship.validation.js';

export const createScholarshipController = asyncHandler(async (req, res) => {
  // Prepare DTO input
  const dto = new CreateScholarshipDTO({
    ...req.body,
    image: req.file, // multer adds this if file exists
  });

  // Validate request data
  const validatedData = dto.validate();

  // Call service

  const scholarship = await createScholarshipService({
    ...validatedData,
    createdBy: req.user._id, // ✅ pass user ID here
  });

  res.status(201).json({
    success: true,
    message: 'Scholarship created successfully',
    data: scholarship,
  });
});

/* ===================== GET ALL ===================== */
export const getScholarshipsController = asyncHandler(async (req, res) => {
  const result = await getScholarshipsService(req.query);

  res.status(200).json({
    success: true,
    ...result,
  });
});

/* ===================== GET ONE ===================== */
export const getScholarshipByIdController = asyncHandler(async (req, res) => {
  const scholarship = await getScholarshipByIdService(req.params.id);

  res.status(200).json({ success: true, data: scholarship });
});

/* ===================== UPDATE ===================== */
export const updateScholarshipController = asyncHandler(async (req, res) => {
  const dto = new UpdateScholarshipDTO({
    ...req.body,
    image: req.file,
  });

  const validatedData = dto.validate();

  const scholarship = await updateScholarshipService(
    req.params.id,
    validatedData
  );

  res.status(200).json({ success: true, data: scholarship });
});

/* ===================== DELETE ===================== */
export const deleteScholarshipController = asyncHandler(async (req, res) => {
  await deleteScholarshipService(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Scholarship deleted successfully',
  });
});
