const authService = require('../services/auth.service');

const register = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  try {
    const result = await authService.register(firstName, lastName, email, password);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await authService.login(email, password);
    res.json(result);
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};

const User = require('../models/user.model');

const getMe = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id','firstName','lastName','email']
    });
    res.json(user);
  } catch (err) {
    next(err);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findByPk(req.user.id);
    if (!await user.comparePassword(oldPassword)) {
      return res.status(400).json({ message: 'Contraseña actual incorrecta' });
    }
    user.password = newPassword;
    await user.save();
    res.json({ message: 'Contraseña actualizada' });
  } catch (err) {
    next(err);
  }
};


module.exports = { register, login, getMe, changePassword };

