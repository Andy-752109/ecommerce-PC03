// controllers/user.controller.js
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// POST /api/users  – registro
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // Verificar si el email ya existe
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Validar y asignar rol
    const userRole = role && ['admin', 'client'].includes(role.toLowerCase()) 
      ? role.toLowerCase() 
      : 'client';

    console.log('Creating user with role:', userRole);

    // Crear usuario con rol explícito
    const user = await User.create({ 
      name, 
      email, 
      password,
      role: userRole
    });

    // Generar token y responder
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user),
    });
  } catch (err) {
     next(err);
  }
};

// POST /api/users/login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    console.log('User logging in with role:', user.role);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user),
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/users  – admin
exports.getUsers = async (_req, res, next) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    next(err);
  }
};

// GET /api/users/:id
exports.getUserById = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ message: 'Forbidden: You do not have permission to access this profile' });
    }

    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    if (err.kind === 'ObjectId') {
        return res.status(400).json({ message: 'Invalid user ID format' });
    }
    next(err);
  }
};

// PUT /api/users/:id
exports.updateUser = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ message: 'Forbidden: You do not have permission to update this profile' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    const { name, email, password } = req.body;
    if (name) user.name = name;
    if (email && email !== user.email) {
        const emailExists = await User.findOne({ email: email });
        if (emailExists && emailExists._id.toString() !== req.params.id) {
             return res.status(400).json({ message: 'Email already exists' });
        }
        user.email = email;
    }
    if (password) user.password = password;

    if (req.user.role === 'admin' && req.body.role && ['admin', 'client'].includes(req.body.role)) {
      user.role = req.body.role.toLowerCase();
    }

    const updatedUser = await user.save();

    res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role
     });

  } catch (err) {
      if (err.kind === 'ObjectId') {
        return res.status(400).json({ message: 'Invalid user ID format' });
      }
      if (err.name === 'ValidationError') {
         return res.status(400).json({ message: err.message });
      }
      next(err);
  }
};

// DELETE /api/users/:id
exports.removeUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    // Using deleteOne instead of remove() which is deprecated
    await User.deleteOne({ _id: req.params.id });
    
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    if (err.kind === 'ObjectId') {
        return res.status(400).json({ message: 'Invalid user ID format' });
    }
    next(err);
  }
};