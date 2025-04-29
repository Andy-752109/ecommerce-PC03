// controllers/product.controller.js
const Product = require('../models/Product');

// GET /api/products
exports.list = async (_req, res, next) => {
  try { 
    const products = await Product.find();
    res.json(products); 
  }
  catch (err) { 
    next(err); 
  }
};

// GET /api/products/:id
exports.get = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (err) { 
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid product ID format' });
    }
    next(err); 
  }
};

// POST /api/products – admin
exports.create = async (req, res, next) => {
  try { 
    const product = await Product.create(req.body);
    res.status(201).json(product); 
  }
  catch (err) { 
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    next(err); 
  }
};

// PUT /api/products/:id – admin
exports.update = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (err) { 
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid product ID format' });
    }
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    next(err); 
  }
};

// DELETE /api/products/:id – admin
exports.remove = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Using deleteOne instead of remove() which is deprecated
    await Product.deleteOne({ _id: req.params.id });
    res.json({ message: 'Product deleted' });
  } catch (err) { 
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid product ID format' });
    }
    next(err); 
  }
};