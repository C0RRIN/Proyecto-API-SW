const express      = require('express');
const helmet       = require('helmet');
const rateLimit    = require('express-rate-limit');
const morgan       = require('morgan');
const fs           = require('fs');
const path         = require('path');
const cors         = require('cors');
const errorHandler = require('./middlewares/error.middleware');

const app = express();

// 1) Seguridad HTTP
// 1) Seguridad HTTP + CSP personalizado
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:"],
        // Aquí permitimos las conexiones XHR/fetch hacia el puerto 5000:
        connectSrc: ["'self'", "http://localhost:5000"]
      }
    }
  })
);
// 2) Rate limiting en /api
app.use('/api', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Demasiadas peticiones, inténtalo más tarde.' }
}));

// 3) Logs
const logDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);
const accessLogStream = fs.createWriteStream(
  path.join(logDir, 'access.log'),
  { flags: 'a' }
);
app.use(morgan('combined', { stream: accessLogStream }));
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// 4) CORS y JSON parser **ANTES** de cualquier ruta
const CORS_OPTIONS = {
  origin: 'http://localhost:3000',  // origen de tu frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true                // si usas cookies o auth headers
};
app.use(cors(CORS_OPTIONS));
app.use(express.json());

// 5) Archivos estáticos
app.use(express.static(path.join(__dirname, '../frontend')));

// 6) Montaje de rutas
app.use('/api/auth',  cors(CORS_OPTIONS), require('./routes/auth.routes'));
app.use('/api/users', cors(CORS_OPTIONS), require('./routes/user.routes'));

// 7) Handler global de errores
app.use(errorHandler);

module.exports = app;