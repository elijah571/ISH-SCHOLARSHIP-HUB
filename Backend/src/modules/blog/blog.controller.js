import { asyncHandler } from '../../middleware/asyncHandler.js';
import {
  createBlogService,
  deleteBlogService,
  getBlogByIdService,
  getBlogsService,
  updateBlogService,
} from './blog.service.js';
import { CreateBlogDTO, UpdateBlogDTO } from './blog.validation.js';

/* ===================== CREATE BLOG ===================== */
export const createBlogController = asyncHandler(async (req, res) => {
  const dto = new CreateBlogDTO({
    ...req.body,
    image: req.file,
  });

  const validatedData = dto.validate();

  const blog = await createBlogService({
    ...validatedData,
    published: validatedData.published,
    createdBy: req.user._id,
  });

  res.status(201).json({
    success: true,
    message: 'Blog created successfully',
    data: blog,
  });
});

/* ===================== GET ALL BLOGS ===================== */
export const getBlogsController = asyncHandler(async (req, res) => {
  const result = await getBlogsService(req.query);

  res.status(200).json({
    success: true,
    ...result,
  });
});

/* ===================== GET ONE BLOG ===================== */
export const getBlogByIdController = asyncHandler(async (req, res) => {
  const blog = await getBlogByIdService(req.params.id);

  res.status(200).json({
    success: true,
    data: blog,
  });
});

/* ===================== UPDATE BLOG ===================== */
export const updateBlogController = asyncHandler(async (req, res) => {
  const dto = new UpdateBlogDTO({
    ...req.body,
    image: req.file,
  });

  const validatedData = dto.validate();

  const blog = await updateBlogService(req.params.id, {
    ...validatedData,
    published: validatedData.published,
  });

  res.status(200).json({
    success: true,
    data: blog,
  });
});

/* ===================== DELETE BLOG ===================== */
export const deleteBlogController = asyncHandler(async (req, res) => {
  await deleteBlogService(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Blog deleted successfully',
  });
});
