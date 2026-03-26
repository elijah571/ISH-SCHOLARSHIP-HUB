import express from 'express';
import {
  getStats,
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from './admin.controller.js';
import { isAthourize } from '../../middleware/role.middleware.js';

const router = express.Router();

router.use(isAthourize('admin'));

router.get('/stats', getStats);
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.post('/users', createUser);
router.patch('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

export default router;
