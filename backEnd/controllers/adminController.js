const db = require('../models'); 
const Product = db.Product; 

// مجرب
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
};

// مجرب
exports.addProduct = async (req, res) => {
  const { name, price, category, image } = req.body;

  try {
    const product = await Product.create({ name, price, category, image });
    res.status(201).json({ message: 'Product added successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
};

// مجرب
exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, price, category, image } = req.body;

  try {
    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    await product.update({ name, price, category, image });
    res.json({ message: 'Product updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
};

// مجرب
exports.deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    await product.destroy();
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
};