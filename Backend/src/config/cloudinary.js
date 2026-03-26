// updated uploadsToCloudinary.js
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';
import dotenv from 'dotenv';
import { logger } from '../utils/logger.js';
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API,
  api_secret: process.env.CLOUDINARY_SECRET,
});

export const uploadsToCloudinary = (fileBuffer, folder = 'uploads') => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'auto',
        timeout: 60000, // 🔥 important
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          return reject(error);
        }

        resolve({
          secure_url: result.secure_url,
          public_id: result.public_id,
        });
      }
    );

    stream.end(fileBuffer); // ✅ FIX (more reliable than pipe)
  });
};

export const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    logger.info(`Deleted from Cloudinary: ${publicId}`);
    return result;
  } catch (err) {
    logger.error('Cloudinary delete error:', err.message);
    throw err;
  }
};
