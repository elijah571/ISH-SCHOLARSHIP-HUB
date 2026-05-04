import express from 'express';
import { upload } from '../../middleware/upload.js';
import {
  createScholarshipController,
  getScholarshipsController,
  getCountriesController,
  getScholarshipByIdController,
  updateScholarshipController,
  deleteScholarshipController,
} from './scholarship.controller.js';
import { VerifyUser } from '../../middleware/auth.middleware.js';
import { isAuthorized } from '../../middleware/role.middleware.js';

const router = express.Router();

//create
router.post(
  '/create',
  upload.single('image'),
  VerifyUser,
  isAuthorized('admin'),
  createScholarshipController
);

router.get('/countries', getCountriesController);
router.get('/', getScholarshipsController);
router.get('/:id', getScholarshipByIdController);
router.patch(
  '/:id',
  upload.single('image'),
  VerifyUser,
  isAuthorized('admin'),
  updateScholarshipController
);
router.delete('/:id', VerifyUser, isAuthorized('admin'), deleteScholarshipController);

export default router;
