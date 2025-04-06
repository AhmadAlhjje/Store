const db = require('../models'); 
const Order = db.Order; 
const OrderDetail = db.OrderDetail; 
const Product = db.Product; 
const Cart = db.Cart; 

// مجرب
exports.getOrders = async (req, res) => {
  const { user_id } = req.params;

  try {
    const orders = await Order.findAll({
      where: { user_id },
      include: [{ model: OrderDetail, as: 'details', include: [{ model: Product, as: 'product' }] }]
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
};

// مجرب
exports.createOrder = async (req, res) => {
  const { user_id, products } = req.body;

  try {
    const order = await Order.create({ user_id });

    for (const item of products) {
      const product = await Product.findByPk(item.product_id);
      if (!product) return res.status(404).json({ error: `Product ${item.product_id} not found` });

      await OrderDetail.create({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: product.price
      });
    }

    res.status(201).json({ message: 'Order created successfully', orderId: order.id });
  } catch (error) {
    console.error('Error details:', error)
    res.status(500).json({ error: 'Database error' });
  }
};

// مجرب
exports.updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const order = await Order.findByPk(id);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    await order.update({ status });
    res.json({ message: 'Order status updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
};

// نقل المنتجات من cart الى order 
exports.confirmOrder = async (req, res) => {
  const { user_id } = req.body;
  try {
    // الخطوة 1: إنشاء طلب جديد في جدول `orders`
    const order = await Order.create({ user_id, status: 'pending', created_at: new Date() });
    // الخطوة 2: الحصول على المنتجات من جدول `cart` الخاص بالمستخدم
    const cartItems = await Cart.findAll({
      where: { user_id },
      include: [{ model: Product, as: 'product', attributes: ['price', 'quantity'] }]
    });
    if (cartItems.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }
    // الخطوة 3: تحقق من توفر الكمية المتاحة لكل منتج قبل إضافة المنتجات إلى جدول `order_details`
    for (const item of cartItems) {
      const product = await Product.findByPk(item.product_id);
      if (!product) {
        return res.status(404).json({ error: `Product ${item.product_id} not found` });
      }
      // التحقق من توفر الكمية المتاحة
      if (product.quantity < item.quantity) {
        return res.status(400).json({ error: `Insufficient quantity for product ${product.name}` });
      }
    }
    // الخطوة 4: إضافة المنتجات إلى جدول `order_details`
    const orderDetailsPromises = cartItems.map(async (item) => {
      const product = await Product.findByPk(item.product_id);
      await OrderDetail.create({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: product.price
      });
      // تحديث كمية المنتج في جدول `products`
      await Product.update(
        { quantity: product.quantity - item.quantity },
        { where: { id: product.id } }
      );
    });
    await Promise.all(orderDetailsPromises);
    // الخطوة 5: مسح المنتجات من جدول `cart`
    await Cart.destroy({ where: { user_id } });
    // إرجاع استجابة نجاح
    res.status(201).json({ message: 'Order confirmed successfully', orderId: order.id });
  } catch (error) {
    console.error('Error details:', error);
    res.status(500).json({ error: 'Database error' });
  }
};