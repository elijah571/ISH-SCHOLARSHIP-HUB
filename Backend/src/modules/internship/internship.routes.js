import express from 'express';
import { upload } from '../../middleware/upload.js';

import { VerifyUser } from '../../middleware/auth.middleware.js';
import {
  createInternshipController,
  deleteInternshipController,
  getInternshipsController,
  updateInternshipController,
  getInternshipByIdController, // ✅ ADD THIS
} from './internship.controller.js';
import { isAthourize } from '../../middleware/role.middleware.js';

const router = express.Router();

//create
router.post(
  '/create',
  upload.single('image'),
  VerifyUser,
  isAthourize('admin'),
  createInternshipController
);

router.get('/', getInternshipsController);
router.get('/:id', getInternshipByIdController);

router.patch(
  '/:id',
  upload.single('image'),
  VerifyUser,
  isAthourize('admin'),
  updateInternshipController
);

router.delete('/:id', VerifyUser, isAthourize('admin'), deleteInternshipController);

export default router;
