// middlewares/role.js

/**
 * Middleware para restringir acceso basado en roles de usuario
 * @param {...String} roles - Roles permitidos para acceder a la ruta
 * @returns {Function} Middleware
 */
const allowRoles = (...roles) => (req, res, next) => {
  // Verificación de seguridad - asegurarse de que req.user existe
  if (!req.user || !req.user.role) {
    console.error('Error en middleware de roles: Usuario o rol no definido', req.user);
    return res.status(403).json({ message: 'Forbidden: user role information missing' });
  }

  // Normalizar roles para comparación insensible a mayúsculas/minúsculas
  const userRole = req.user.role.toLowerCase();
  const allowedRoles = roles.map(role => role.toLowerCase());
  
  console.log('Debug - Role Check:', {
    userRole,
    allowedRoles,
    isAllowed: allowedRoles.includes(userRole)
  });

  // Verificar si el rol está permitido
  if (!allowedRoles.includes(userRole)) {
    return res.status(403).json({ message: 'Forbidden: insufficient role' });
  }
  
  // Si el rol está permitido, continuar
  next();
};

module.exports = allowRoles;