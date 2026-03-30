// updated uploadsToCloudinary.js
import { v2 as cloudinary } from 'cloudinary';
import { AppError } from '../utils/AppError.js';
import { logger } from '../utils/logger.js';

const getCloudinaryConfig = () => ({
  cloud_name: process.env.CLOUDINARY_NAME || process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API || process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET || process.env.CLOUDINARY_API_SECRET,
});

const ensureCloudinaryConfigured = () => {
  const config = getCloudinaryConfig();

  if (!config.cloud_name || !config.api_key || !config.api_secret) {
    logger.error('Cloudinary configuration is incomplete. Check environment variables.');
    throw new Error('Cloudinary is not configured correctly');
  }

  cloudinary.config(config);
};

const uploadBuffer = (fileBuffer, folder) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'auto',
        timeout: 60000,
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }

        resolve({
          secure_url: result.secure_url,
          public_id: result.public_id,
        });
      }
    );

    stream.end(fileBuffer);
  });

export const uploadsToCloudinary = async (fileBuffer, folder = 'uploads') => {
  ensureCloudinaryConfigured();

  if (!fileBuffer) {
    throw new AppError('No file data received for upload', 400);
  }

  try {
    return await uploadBuffer(fileBuffer, folder);
  } catch (error) {
    const isTimeout = /timeout/i.test(error.message || '');

    if (isTimeout) {
      logger.warn('Cloudinary upload timed out. Retrying once.');

      try {
        return await uploadBuffer(fileBuffer, folder);
      } catch (retryError) {
        logger.error(`Cloudinary upload retry failed: ${retryError.message}`);
        throw new AppError(
          'Image upload timed out. Please try again with a smaller image or retry shortly.',
          504
        );
      }
    }

    logger.error(`Cloudinary upload error: ${error.message}`);
    throw new AppError('Image upload failed. Please try again.', 502);
  }
};

export const deleteFromCloudinary = async (publicId) => {
  try {
    ensureCloudinaryConfigured();
    const result = await cloudinary.uploader.destroy(publicId);
    logger.info(`Deleted from Cloudinary: ${publicId}`);
    return result;
  } catch (err) {
    logger.error('Cloudinary delete error:', err.message);
    throw err;
  }
};
