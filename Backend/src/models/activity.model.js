import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
    },
    action: {
      type: String,
      required: true,
      enum: [
        'registered',
        'applied',
        'saved',
        'unsaved',
        'blog_created',
        'blog_updated',
        'blog_deleted',
        'scholarship_created',
        'scholarship_updated',
        'scholarship_deleted',
        'internship_created',
        'internship_updated',
        'internship_deleted',
        'newsletter_subscribed',
      ],
    },
    targetType: {
      type: String,
      required: true,
      enum: ['user', 'scholarship', 'internship', 'blog', 'newsletter'],
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    targetTitle: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

activitySchema.index({ createdAt: -1 });
activitySchema.index({ action: 1 });
activitySchema.index({ user: 1 });

export const Activity = mongoose.model('Activity', activitySchema);
