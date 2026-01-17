// src/routes/csrf.route.js
import express from 'express';

const router = express.Router();

router.get('/csrf', (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

export default router;
