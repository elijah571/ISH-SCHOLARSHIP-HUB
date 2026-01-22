import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    image: {
      url: String,
      publicId: String,
    },
    published: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

// Text index for search
blogSchema.index({ title: 'text', content: 'text' });

export const Blog = mongoose.model('Blog', blogSchema);
