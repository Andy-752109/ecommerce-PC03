// server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');
const path = require('path');

// Cargar variables de entorno
dotenv.config();

// Middlewares
const { notFound, errorHandler } = require('./middlewares/errorHandler');

// Rutas
const userRoutes = require('./routes/user.routes');
const productRoutes = require('./routes/product.routes');
const orderRoutes = require('./routes/order.routes');

// Conectar a MongoDB
mongoose.connect(process.env.DB_URI)
  .then(() => console.log('MongoDB conectado'))
  .catch(err => console.error('Error al conectar MongoDB:', err));

// Configuración Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API E-commerce',
      version: '1.0.0',
      description: 'API REST para sistema de e-commerce con autenticación JWT',
    },
    servers: [
      {
        url: '/api',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  // Referencia directa a los archivos de rutas
  apis: [
    path.join(__dirname, './routes/user.routes.js'),
    path.join(__dirname, './routes/product.routes.js'),
    path.join(__dirname, './routes/order.routes.js')
  ],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

// Inicializar Express
const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Rutas de API
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Documentación Swagger
app.use('/', swaggerUi.serve);
app.get('/', swaggerUi.setup(swaggerDocs));

// Manejo de errores
app.use(notFound);
app.use(errorHandler);

// Iniciar servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log('Servidor ejecutándose en puerto ${PORT}');
});

module.exports = app;