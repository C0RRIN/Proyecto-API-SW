//middleware de validación (400 Bad Rquest)
//Revisa que los datos esten completos y sean validos
//petición post con datos incorrectos a api/auth/register
const { validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Envía el primer error que encuentre
    return res.status(400).json({ message: errors.array()[0].msg });
  }
  next();
};

module.exports = validate;
