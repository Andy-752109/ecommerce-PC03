const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware para proteger rutas mediante autenticación JWT
 * Verifica el token en el header Authorization y añade el usuario al request
 */
const protect = async (req, res, next) => {
  try {
    // Verificar si hay token en el header
    const authHeader = req.headers.authorization;
    
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }
    
    // Extraer token
    const token = authHeader.split(' ')[1];
    
    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'tu_secreto_jwt_seguro');
    
    // Buscar al usuario por ID (sin incluir password)
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    
    // Añadir usuario al request
    req.user = user;
    next();
  } catch (error) {
    console.error('Error en verificación de token:', error);
    res.status(401).json({ message: 'Token invalid' });
  }
};

module.exports = protect;