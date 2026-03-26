import express from 'express';
import { upload } from '../../middleware/upload.js';

import { VerifyUser } from '../../middleware/auth.middleware.js';
import { isAuthorized } from '../../middleware/role.middleware.js';
import {
  createBlogController,
  getBlogByIdController,
  getBlogsController,
  updateBlogController,
  deleteBlogController,
} from './blog.controller.js';

const router = express.Router();

//create
router.post(
  '/create',
  upload.single('image'),
  VerifyUser,
  isAuthorized('admin'),
  createBlogController
);

router.get('/', getBlogsController);
router.get('/:id', getBlogByIdController);
router.patch('/:id', upload.single('image'), updateBlogController);
router.delete('/:id', deleteBlogController);

export default router;
