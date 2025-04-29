const Order = require('../models/Order');
const Product = require('../models/Product');

// POST /api/orders
exports.create = async (req, res, next) => {
  try {
    const { products } = req.body;
    
    // Validar que haya productos
    if (!products?.length) {
      return res.status(400).json({ message: 'Products required' });
    }
    
    // Buscar productos en la base de datos
    const dbProducts = await Product.find({ _id: { $in: products } });
    
    // Calcular total
    const total = dbProducts.reduce((acc, p) => acc + p.price, 0);
    
    // Crear orden
    const order = await Order.create({
      userId: req.user._id, 
      products, 
      total,
    });
    
    res.status(201).json(order);
  } catch (err) { 
    next(err); 
  }
};

// GET /api/orders
exports.list = async (req, res, next) => {
  try {
    // Buscar órdenes del usuario autenticado
    const orders = await Order.find({ userId: req.user._id })
      .populate('products');
      
    res.json(orders);
  } catch (err) { 
    next(err); 
  }
};

// GET /api/orders/:id
exports.get = async (req, res, next) => {
  try {
    // Buscar orden por ID y asegurar que pertenece al usuario
    const order = await Order
      .findOne({ _id: req.params.id, userId: req.user._id })
      .populate('products');
      
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json(order);
  } catch (err) { 
    next(err); 
  }
};