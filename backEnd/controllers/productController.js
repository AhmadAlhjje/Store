const db = require('../models');  
const Product = db.Product; 

// مجرب
exports.getAllProducts = async (req, res) => {
  const { category } = req.query;

  try {
    const products = await Product.findAll({
      where: category ? { category } : {}
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
};

// مجرب
exports.getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
};