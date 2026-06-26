import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import Joi from 'joi';

// Replicated schemas (same as admin.controller.js) — unit tests for validation logic
const createUserSchema = Joi.object({
  fullName: Joi.string().min(2).max(60).required(),
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(8).regex(/[A-Z]/).regex(/[0-9]/).regex(/[!@#$%^&*]/).required(),
  role: Joi.string().valid('user', 'admin').default('user'),
});

const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).max(1000).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  search: Joi.string().max(100).allow('').default(''),
  role: Joi.string().valid('user', 'admin').allow('').default(''),
});

describe('Admin validation schemas', () => {
  describe('createUserSchema', () => {
    it('accepts valid user', () => {
      const { error } = createUserSchema.validate({
        fullName: 'Alice Smith',
        email: 'alice@example.com',
        password: 'Secure1@Pass',
      });
      assert.equal(error, undefined);
    });

    it('rejects missing email', () => {
      const { error } = createUserSchema.validate({ fullName: 'Alice', password: 'Secure1@Pass' });
      assert.ok(error);
    });

    it('rejects invalid role', () => {
      const { error } = createUserSchema.validate({
        fullName: 'Alice',
        email: 'alice@example.com',
        password: 'Secure1@Pass',
        role: 'superadmin',
      });
      assert.ok(error);
    });
  });

  describe('paginationSchema', () => {
    it('applies defaults', () => {
      const { value } = paginationSchema.validate({});
      assert.equal(value.page, 1);
      assert.equal(value.limit, 10);
    });

    it('rejects negative page', () => {
      const { error } = paginationSchema.validate({ page: -1 });
      assert.ok(error);
    });

    it('rejects limit > 100', () => {
      const { error } = paginationSchema.validate({ limit: 9999 });
      assert.ok(error);
    });
  });
});
