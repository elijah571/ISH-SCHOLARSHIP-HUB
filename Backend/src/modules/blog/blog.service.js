import {
  uploadsToCloudinary,
  deleteFromCloudinary,
} from '../../config/cloudinary.js';
import { AppError } from '../../utils/AppError.js';
import { Blog } from '../../models/blog.model.js';

/* ===================== CREATE BLOG ===================== */
export const createBlogService = async ({
  title,
  content,
  slug,
  image,
  published,
  createdBy,
}) => {
  let uploadedImage = null;

  // Upload image if provided
  if (image) {
    uploadedImage = await uploadsToCloudinary(image.buffer, 'blogs');
  }

  const blog = await Blog.create({
    title,
    content,
    slug,
    published,
    image: uploadedImage
      ? {
          url: uploadedImage.secure_url,
          publicId: uploadedImage.public_id,
        }
      : undefined,
    createdBy,
  });

  if (!blog) {
    throw new AppError('Failed to create blog', 500);
  }

  return blog;
};

/* ===================== GET ALL BLOGS ===================== */
export const getBlogsService = async ({ page = 1, limit = 10, search }) => {
  const query = { published: true };

  // Text search
  if (search) {
    query.$text = { $search: search };
  }

  const skip = (page - 1) * limit;

  const [blogs, total] = await Promise.all([
    Blog.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    Blog.countDocuments(query),
  ]);

  return {
    total,
    page: Number(page),
    pages: Math.ceil(total / limit),
    blogs,
  };
};

/* ===================== GET ONE BLOG ===================== */
export const getBlogByIdService = async (id) => {
  const blog = await Blog.findById(id);
  if (!blog) throw new AppError('Blog not found', 404);
  return blog;
};

/* ===================== UPDATE BLOG ===================== */
export const updateBlogService = async (id, data) => {
  const blog = await Blog.findById(id);
  if (!blog) throw new AppError('Blog not found', 404);

  // Replace image if provided
  if (data.image) {
    if (blog.image?.publicId) {
      await deleteFromCloudinary(blog.image.publicId);
    }

    const uploaded = await uploadsToCloudinary(data.image.buffer, 'blogs');

    data.image = {
      url: uploaded.secure_url,
      publicId: uploaded.public_id,
    };
  }

  // Update only provided fields
  Object.keys(data).forEach((key) => {
    if (data[key] !== undefined) {
      blog[key] = data[key];
    }
  });

  await blog.save();
  return blog;
};

/* ===================== DELETE BLOG ===================== */
export const deleteBlogService = async (id) => {
  const blog = await Blog.findById(id);
  if (!blog) throw new AppError('Blog not found', 404);

  if (blog.image?.publicId) {
    await deleteFromCloudinary(blog.image.publicId);
  }

  await blog.deleteOne();
};
