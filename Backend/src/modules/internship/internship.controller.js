import { asyncHandler } from '../../middleware/asyncHandler.js';
import {
  createInternshipService,
  deleteInternshipService,
  getInternshipService,
  getInternshipsService,
  updateInternshipService,
} from './internship.service.js';
import { CreateInternshipDTO, UpdateInternshipDTO } from './internship.validate.js';

export const createInternshipController = asyncHandler(async (req, res) => {
  // Prepare DTO input
  const dto = new CreateInternshipDTO({
    ...req.body,
    image: req.file, // multer adds this if file exists
  });

  // Validate request data
  const validatedData = dto.validate();

  // Call service

  const internship = await createInternshipService({ ...validatedData, image: req.file }, req.user);

  res.status(201).json({
    success: true,
    message: 'Internship created successfully',
    data: internship,
  });
});

/* ===================== GET ALL ===================== */
export const getInternshipsController = asyncHandler(async (req, res) => {
  const result = await getInternshipsService(req.query);

  res.status(200).json({
    success: true,
    data: result.internships,
    internships: result.internships,
    pagination: result.pagination,
  });
});

/* ===================== GET ONE ===================== */
export const getInternshipByIdController = asyncHandler(async (req, res) => {
  const scholarship = await getInternshipService(req.params.id);

  res.status(200).json({ success: true, data: scholarship });
});

/* ===================== UPDATE ===================== */
export const updateInternshipController = asyncHandler(async (req, res) => {
  const dto = new UpdateInternshipDTO({
    ...req.body,
    image: req.file,
  });

  const validatedData = dto.validate();

  const scholarship = await updateInternshipService(req.params.id, { ...validatedData, image: req.file }, req.user);

  res.status(200).json({ success: true, data: scholarship });
});

/* ===================== DELETE ===================== */
export const deleteInternshipController = asyncHandler(async (req, res) => {
  await deleteInternshipService(req.params.id, req.user);

  res.status(200).json({
    success: true,
    message: 'Internship deleted successfully',
  });
});
