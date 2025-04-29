const jwt = require('jsonwebtoken');

/**
 * Genera un token JWT para el usuario
 * @param {Object} user - Usuario para el que se genera el token
 * @returns {String} Token JWT
 */
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user._id, 
      role: user.role 
    },
    process.env.JWT_SECRET || 'tu_secreto_jwt_seguro',
    { 
      expiresIn: '30d' 
    }
  );
};

module.exports = generateToken;