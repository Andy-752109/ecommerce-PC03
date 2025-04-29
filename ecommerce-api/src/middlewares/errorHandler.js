/**
 * Middleware para manejar rutas no encontradas
 */
const notFound = (req, _res, next) => {
  const error = new Error(`Not Found – ${req.originalUrl}`);
  _res.status(404);
  next(error);
};

/**
 * Middleware para manejar errores
 */
const errorHandler = (err, _req, res, _next) => {
  // Si el código de estado ya está establecido, usarlo, si no, usar 500
  const code = res.statusCode === 200 ? 500 : res.statusCode;
  
  res.status(code).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '' : err.stack,
  });
};

module.exports = { notFound, errorHandler };