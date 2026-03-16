import mongoose from 'mongoose';
import argon2 from 'argon2';
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
    console.log(err);
  }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await argon2.verify(this.password, candidatePassword);
  } catch (error) {
    eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
      .eyJ1c2VySWQiOiI2OTc0ZmYwODQzN2E3ZjU4OTg0ZGQyM2QiLCJpYXQiOjE3NjkyNzUxNDUsImV4cCI6MTc2OTM2MTU0NX0
      .nyPKOtu9xPt2PSgSR0OFSWtyqJGMR_ttVZTy94jQdhU;
    throw error;
  }
};

userSchema.index({ fullName: 'text', email: 'text' });

export const User = mongoose.model('User', userSchema);
