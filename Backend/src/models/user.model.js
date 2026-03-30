import mongoose from 'mongoose';
import argon2 from 'argon2';
import { AppError } from '../utils/AppError.js';
import { logger } from '../utils/logger.js';
const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    resetPasswordToken: {
      type: String,
      default: undefined,
    },
    resetPasswordTokenExpires: {
      type: Date,
      default: undefined,
    },
    refreshToken: {
      type: String,
      default: null,
    },
    sessions: [
      {
        refreshToken: String,
        userAgent: String,
        ipAddress: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    savedScholarships: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Scholarship',
      },
    ],

    appliedScholarships: [
      {
        scholarship: { type: mongoose.Schema.Types.ObjectId, ref: 'Scholarship' },
        appliedAt: { type: Date, default: Date.now },
      },
    ],

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  try {
    this.password = await argon2.hash(this.password);
  } catch (err) {
    logger.error(`Password hashing failed: ${err.message}`);
    throw new AppError('Unable to secure password', 500);
  }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await argon2.verify(this.password, candidatePassword);
  } catch (error) {
    logger.error(`Password comparison failed: ${error.message}`);
    throw new AppError('Password verification failed', 500);
  }
};

userSchema.index({ fullName: 'text', email: 'text' });

export const User = mongoose.model('User', userSchema);
