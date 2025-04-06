const db = require('../models'); 
const Product = db.Product; 
const Cart = db.Cart; 

// مجرب
exports.getCart = async (req, res) => {
  const { user_id } = req.params;

  try {
    const cartItems = await Cart.findAll({
      where: { user_id },
      include: [{ model: Product, as: 'product' }]
    });
    res.json(cartItems);
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
};

// مجرب
exports.addToCart = async (req, res) => {
  const { user_id, product_id, quantity } = req.body;
  try {
    // البحث عن المنتج في قاعدة البيانات
    const product = await Product.findByPk(product_id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    // التحقق مما إذا كانت الكمية المطلوبة متوفرة
    if (product.quantity < quantity) {
      return res.status(400).json({ error: 'Not enough stock available' });
    }
    // إضافة المنتج إلى السلة
    await Cart.create({ user_id, product_id, quantity });
    // إرجاع رسالة نجاح
    res.status(201).json({
      message: 'Product added to cart successfully',
      remainingStock: product.quantity,
    });
  } catch (error) {
    console.error(error); // لتسجيل الخطأ في السجلات
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
};

// مجرب
exports.updateCart = async (req, res) => {
  const { cartId, userId } = req.params; // استقبال cartId و userId من البارامترات
  const { quantity } = req.body; // استقبال الكمية من الجسم
  try {
    const cartItem = await Cart.findOne({
      where: {
        id: cartId,
        user_id: userId, // التحقق من أن العنصر يخص المستخدم
      },
    });
    // إذا لم يتم العثور على العنصر في العربة
    if (!cartItem) {
      return res.status(404).json({ error: 'Cart item not found or does not belong to the user' });
    }
    // الحصول على بيانات المنتج المرتبط بالعربة
    const product = await Product.findByPk(cartItem.product_id);
    // التحقق مما إذا كانت الكمية المطلوبة أكبر من الكمية المتاحة
    if (quantity > product.quantity) {
      return res.status(400).json({ error: 'Requested quantity exceeds available stock' });
    }
    // تحديث الكمية في عربة التسوق
    await cartItem.update({ quantity });
    res.json({ message: 'Cart item updated successfully', cartItem });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database error' });
  }
};


// مجرب
exports.deleteFromCart = async (req, res) => {
  const { cartId, userId } = req.params; // استقبال cartId و userId من البارامترات
  try {
    // البحث عن العنصر في العربة باستخدام cartId و userId
    const cartItem = await Cart.findOne({
      where: {
        id: cartId,
        user_id: userId, // التحقق من أن العنصر يخص المستخدم
      },
    });
    // إذا لم يتم العثور على العنصر أو لا يخص المستخدم
    if (!cartItem) {
      return res.status(404).json({ error: 'Cart item not found or does not belong to the user' });
    }
    // حذف العنصر من العربة
    await cartItem.destroy();
    // إرجاع رسالة نجاح
    res.json({ message: 'Cart item deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database error' });
  }
};