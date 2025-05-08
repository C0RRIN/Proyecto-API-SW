// src/controllers/user.controller.js
const User = require('../models/user.model');

// Obtener todos los usuarios (sin contraseñas)
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.findAll({ attributes: ['id', 'firstName', 'lastName', 'email'] });
    res.json(users);
  } catch (err) {
    next(err);
  }
};

// Obtener un usuario por su ID
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id, { attributes: ['id', 'firstName', 'lastName', 'email'] });
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(user);
  } catch (err) {
    next(err);
  }
};

// Actualizar un usuario existente
const updateUser = async (req, res, next) => {
    try {
      // Desestructura sobre un objeto vacío si req.body es undefined
      const { firstName, lastName, email, password } = req.body || {};
      const user = await User.findByPk(req.params.id);
      if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
  
      await user.update({ firstName, lastName, email, password });
      res.json({ message: 'Usuario actualizado' });
    } catch (err) {
      next(err);
    }
  };

// Eliminar un usuario por su ID
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    await user.destroy();
    res.json({ message: 'Usuario eliminado' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
};
