import Joi from 'joi';
import {
  getDashboardStats,
  getAllUsersService,
  getUserByIdService,
  createUserService,
  updateUserService,
  deleteUserService,
} from './admin.service.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';
import { AppError } from '../../utils/AppError.js';

const createUserSchema = Joi.object({
  fullName: Joi.string().min(2).max(60).required(),
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(8).regex(/[A-Z]/).regex(/[0-9]/).regex(/[!@#$%^&*]/).required(),
  role: Joi.string().valid('user', 'admin').default('user'),
});

const updateUserSchema = Joi.object({
  fullName: Joi.string().min(2).max(60),
  email: Joi.string().email().lowercase(),
  role: Joi.string().valid('user', 'admin'),
}).min(1).messages({ 'object.min': 'At least one field must be updated' });

const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).max(1000).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  search: Joi.string().max(100).allow('').default(''),
  role: Joi.string().valid('user', 'admin').allow('').default(''),
});

export const getStats = asyncHandler(async (req, res) => {
  const stats = await getDashboardStats();

  res.status(200).json({
    success: true,
    data: stats,
  });
});

export const getAllUsers = asyncHandler(async (req, res) => {
  const { error, value } = paginationSchema.validate(req.query, { stripUnknown: true });
  if (error) throw new AppError(error.details[0].message, 400);

  const result = await getAllUsersService(value);

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
  const { error, value } = createUserSchema.validate(req.body, { abortEarly: false, stripUnknown: true });
  if (error) throw new AppError(error.details.map((d) => d.message).join(', '), 400);

  const user = await createUserService(value);

  res.status(201).json({
    success: true,
    message: 'User created successfully',
    data: user,
  });
});

export const updateUser = asyncHandler(async (req, res) => {
  const { error, value } = updateUserSchema.validate(req.body, { abortEarly: false, stripUnknown: true });
  if (error) throw new AppError(error.details.map((d) => d.message).join(', '), 400);

  const user = await updateUserService(req.params.id, value, req.user);

  res.status(200).json({
    success: true,
    message: 'User updated successfully',
    data: user,
  });
});

export const deleteUser = asyncHandler(async (req, res) => {
  const result = await deleteUserService(req.params.id, req.user);

  res.status(200).json({
    success: true,
    message: 'User deleted successfully',
    data: result,
  });
});
