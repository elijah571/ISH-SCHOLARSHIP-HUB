import { blogRepo } from './blog.repository.js';
import { uploadsToCloudinary, deleteFromCloudinary } from '../../config/cloudinary.js';
import { AppError } from '../../utils/AppError.js';
import { logActivity } from '../admin/admin.service.js';

export const createBlogService = async ({ title, content, slug, image, published }, createdByUser) => {
  let imageUrl, imagePublicId;
  if (image) {
    const uploaded = await uploadsToCloudinary(image.buffer, 'blogs');
    imageUrl = uploaded.secure_url;
    imagePublicId = uploaded.public_id;
  }

  const blog = await blogRepo.create({
    title, content, slug, published: published ?? false,
    imageUrl, imagePublicId, createdById: createdByUser.id,
  });

  logActivity({
    userId: createdByUser.id, userName: createdByUser.fullName, userEmail: createdByUser.email,
    action: 'blog_created', targetType: 'blog', targetId: blog.id, targetTitle: blog.title,
  });

  return blog;
};

export const getBlogsService = (params) => blogRepo.findAll({ ...params, publishedOnly: true });

export const getBlogByIdService = async (id) => {
  const blog = await blogRepo.findById(id);
  if (!blog) throw new AppError('Blog not found', 404);
  return blog;
};

export const updateBlogService = async (id, data, updatingUser) => {
  const blog = await blogRepo.findById(id);
  if (!blog) throw new AppError('Blog not found', 404);

  const updateData = {};

  if (data.image) {
    if (blog.imagePublicId) await deleteFromCloudinary(blog.imagePublicId).catch(() => {});
    const uploaded = await uploadsToCloudinary(data.image.buffer, 'blogs');
    updateData.imageUrl = uploaded.secure_url;
    updateData.imagePublicId = uploaded.public_id;
  }

  for (const key of ['title', 'content', 'slug', 'published']) {
    if (data[key] !== undefined) updateData[key] = data[key];
  }

  const updated = await blogRepo.update(id, updateData);

  logActivity({
    userId: updatingUser.id, userName: updatingUser.fullName, userEmail: updatingUser.email,
    action: 'blog_updated', targetType: 'blog', targetId: id, targetTitle: updated?.title || blog.title,
  });

  return updated || blog;
};

export const deleteBlogService = async (id, deletingUser) => {
  const blog = await blogRepo.findById(id);
  if (!blog) throw new AppError('Blog not found', 404);

  if (blog.imagePublicId) await deleteFromCloudinary(blog.imagePublicId).catch(() => {});
  await blogRepo.delete(id);

  logActivity({
    userId: deletingUser.id, userName: deletingUser.fullName, userEmail: deletingUser.email,
    action: 'blog_deleted', targetType: 'blog', targetId: id, targetTitle: blog.title,
  });
};
