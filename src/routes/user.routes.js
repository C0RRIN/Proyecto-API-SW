const express         = require('express');
const { body, param } = require('express-validator');
const userController  = require('../controllers/user.controller');
const validate        = require('../middlewares/validation.middleware');
const verifyToken     = require('../middlewares/auth.middleware');

const router = express.Router();

// ─── Endpoint 7: Listar todos los usuarios ────────────────────
// GET  /api/users
router.get(
  '/',
  verifyToken,
  userController.getAllUsers
);

// ─── Endpoint 8: Obtener usuario por ID ───────────────────
// GET  /api/users/:id
router.get(
  '/:id',
  verifyToken,
  param('id').isInt().withMessage('ID debe ser numérico'),
  validate,
  userController.getUserById
);

// ─── Endpoint 9: Actualizar usuario ───────────────────────
// PUT  /api/users/:id
router.put(
  '/:id',
  verifyToken,
  [
    param('id').isInt().withMessage('ID debe ser numérico'),
    body('firstName').optional().notEmpty().withMessage('Nombre obligatorio'),
    body('lastName').optional().notEmpty().withMessage('Apellido obligatorio'),
    body('email').optional().isEmail().withMessage('Email inválido').normalizeEmail(),
  ],
  validate,
  userController.updateUser
);

// ─── Endpoint 10: Eliminar usuario ────────────────────────
// DELETE /api/users/:id
router.delete(
  '/:id',
  verifyToken,
  param('id').isInt().withMessage('ID debe ser numérico'),
  validate,
  userController.deleteUser
);

module.exports = router;
