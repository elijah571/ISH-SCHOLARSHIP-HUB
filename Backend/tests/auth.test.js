import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';

process.env.JWT_ACCESS_SECRET ??= 'test-access-secret-aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
process.env.JWT_REFRESH_SECRET ??= 'test-refresh-secret-aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
process.env.JWT_EMAIL_VERIFY_SECRET ??= 'test-email-secret-aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
process.env.NODE_ENV = 'test';

const { app } = await import('../src/app.js');

describe('Auth validation', () => {
  describe('POST /api/auth/register — input validation', () => {
    it('rejects missing fields (no DB needed)', async () => {
      // Validation fires before DB access so no DB connection needed
      const res = await request(app)
        .post('/api/auth/register')
        .send({ email: 'test@example.com' });
      assert.ok(res.status >= 400, `expected 4xx, got ${res.status}`);
    });

    it('rejects weak password', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ fullName: 'Test User', email: 'test@example.com', password: 'weakpass' });
      assert.ok(res.status >= 400, `expected 4xx, got ${res.status}`);
    });
  });
});
