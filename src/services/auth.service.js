// src/services/auth.service.js
const User = require('../models/user.model');
const generateToken = require('../utils/generateToken');

const register = async (firstName, lastName, email, password) => {
  const existing = await User.findOne({ where: { email } });
  if (existing) throw new Error('Usuario ya existe');

  const user = await User.create({ firstName, lastName, email, password });
  const token = generateToken(user.id);
  return { token };
};

const login = async (email, password) => {
  const user = await User.findOne({ where: { email } });
  if (!user || !(await user.comparePassword(password))) {
    throw new Error('Credenciales inválidas');
  }
  const token = generateToken(user.id);
  return { token };
};

module.exports = { register, login };
