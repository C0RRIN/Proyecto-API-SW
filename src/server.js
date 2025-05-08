const app = require('./app');
const { connectDB, sequelize } = require('./config/db');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await connectDB();
    await sequelize.sync({ alter: true });
    console.log('Base de datos conectada y sincronizada correctamente.');
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en puerto ${PORT}`);
    });
  } catch (err) {
    console.error('Error al iniciar el servidor:', err);
  }
})();
