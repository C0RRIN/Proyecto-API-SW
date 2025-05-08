//middleware de autenticación (401 / 403)
//sin token es 401
//con token invalido es 403
//con token valido es 200
//petición get a api/auth/protected
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  // Formato esperado: Bearer <token>
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Token inválido' });
    }

    req.user = decoded;
    next();
  });
};

module.exports = verifyToken;
