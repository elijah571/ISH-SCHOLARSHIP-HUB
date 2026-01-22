import express from 'express';
import { upload } from '../../middleware/upload.js';

import { VerifyUser } from '../../middleware/auth.middleware.js';
import { isAthourize } from '../../middleware/role.middleware.js';
import {
  createInternshipController,
  deleteInternshipController,
  getInternshipsController,
  updateInternshipController,
} from './internship.controller.js';
import { getBlogByIdController } from '../blog/blog.controller.js';

const router = express.Router();

//create
router.post(
  '/create',
  upload.single('image'),
  VerifyUser,
  isAuthorize('admin'),
  createInternshipController
);

router.get('/', getInternshipsController);
router.get('/:id', getInternshipByIdController);

router.patch(
  '/:id',
  upload.single('image'),
  VerifyUser,
  isAuthorize('admin'),
  updateInternshipController
);

router.delete(
  '/:id',
  VerifyUser,
  isAuthorize('admin'),
  deleteInternshipController
);

export default router;
