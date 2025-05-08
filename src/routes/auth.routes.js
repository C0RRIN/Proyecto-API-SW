// src/routes/auth.routes.js
const express       = require('express');
const { body }      = require('express-validator');
const authController= require('../controllers/auth.controller');
const validate      = require('../middlewares/validation.middleware');
const verifyToken   = require('../middlewares/auth.middleware');

const router = express.Router();

// ─── Endpoint 1: Registro de usuario ─────────────────────
// POST /api/auth/register
router.post(
  '/register',
  [
    body('firstName').notEmpty().withMessage('Nombre obligatorio'),
    body('lastName') .notEmpty().withMessage('Apellido obligatorio'),
    body('email')    .isEmail().withMessage('Email inválido').normalizeEmail(),
    body('password') .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
  ],
  validate,
  authController.register
);

// ─── Endpoint 2: Login de usuario ────────────────────────
// POST /api/auth/login
router.post(
  '/login',
  [
    body('email')   .isEmail().withMessage('Email inválido').normalizeEmail(),
    body('password').notEmpty().withMessage('Contraseña obligatoria')
  ],
  validate,
  authController.login
);

// ─── Resto de rutas protegidas… ─────────────────────────
// GET /api/auth/protected, /me, /password, etc.

module.exports = router;