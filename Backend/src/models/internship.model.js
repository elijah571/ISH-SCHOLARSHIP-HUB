import mongoose from 'mongoose';

const internshipSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    institution: { type: String, required: true },
    description: { type: String, required: true },
    country: { type: String, required: true },
    deadline: { type: Date, required: true },
    type: { type: String, required: true },
    link: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },

    image: {
      url: String,
      publicId: String,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

internshipSchema.index({ title: 'text', country: 'text' });

export const Internship = mongoose.model('Internship', internshipSchema);
