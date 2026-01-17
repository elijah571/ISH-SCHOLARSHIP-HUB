import mongoose from 'mongoose';

const scholarshipSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    deadline: {
      type: Date,
      required: true,
    },
    funding_type: {
      type: String,
    },
    image: {
      url: String,
      publicId: String,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

scholarshipSchema.index({ title: 'text', country: 'text', deadline: 'text' });

export const Scholarship = mongoose.model('Scholarship', scholarshipSchema);
