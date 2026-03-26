import {
  getDashboardStats,
  getAllUsersService,
  getUserByIdService,
  createUserService,
  updateUserService,
  deleteUserService,
} from './admin.service.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';

export const getStats = asyncHandler(async (req, res) => {
  const stats = await getDashboardStats();

  res.status(200).json({
    success: true,
    data: stats,
  });
});

export const getAllUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search = '', role = '' } = req.query;

  const result = await getAllUsersService({
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
    search,
    role,
  });

  res.status(200).json({
    success: true,
    data: result.users,
    pagination: result.pagination,
  });
});

export const getUserById = asyncHandler(async (req, res) => {
  const user = await getUserByIdService(req.params.id);

  res.status(200).json({
    success: true,
    data: user,
  });
});

export const createUser = asyncHandler(async (req, res) => {
  const { fullName, email, password, role } = req.body;

  const user = await createUserService({ fullName, email, password, role });

  res.status(201).json({
    success: true,
    message: 'User created successfully',
    data: user,
  });
});

export const updateUser = asyncHandler(async (req, res) => {
  const user = await updateUserService(req.params.id, req.body);

  res.status(200).json({
    success: true,
    message: 'User updated successfully',
    data: user,
  });
});

export const deleteUser = asyncHandler(async (req, res) => {
  const result = await deleteUserService(req.params.id, req.user.id);

  res.status(200).json({
    success: true,
    message: 'User deleted successfully',
    data: result,
  });
});
