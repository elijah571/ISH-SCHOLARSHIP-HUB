import express from 'express';
import { upload } from '../../middleware/upload.js';
import {
  createScholarshipController,
  getScholarshipsController,
  getScholarshipByIdController,
  updateScholarshipController,
  deleteScholarshipController,
} from './scholarship.controller.js';
import { VerifyUser } from '../../middleware/auth.middleware.js';
import { isAthourize } from '../../middleware/role.middleware.js';

const router = express.Router();

//create
router.post(
  '/create',
  upload.single('image'),
  VerifyUser,
  isAthourize('admin'),
  createScholarshipController
);

router.get('/', getScholarshipsController);
router.get('/:id', getScholarshipByIdController);
router.patch('/:id', upload.single('image'), updateScholarshipController);
router.delete('/:id', deleteScholarshipController);

export default router;
