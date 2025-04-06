const db = require('./models');

async function seedDatabase() {
  try {
    // التحقق من الاتصال بقاعدة البيانات
    await db.sequelize.authenticate();
    console.log('✅ الاتصال بقاعدة البيانات ناجح');

    // مسح البيانات السابقة (اختياري - إذا كنت تريد إدخال بيانات جديدة فقط)
    await db.sequelize.sync({ force: true }); // هذا يحذف الجداول ويعيد إنشائها!

    // ✅ إدخال بيانات المستخدمين (Users)
    const users = await db.User.bulkCreate([
      { name: 'John Doe', email: 'john.doe@example.com', password: 'hashed_password1', role: 'user' },
      { name: 'Jane Smith', email: 'jane.smith@example.com', password: 'hashed_password2', role: 'admin' }
    ]);
    console.log('✅ تم إدخال بيانات المستخدمين');

    // ✅ إدخال بيانات المنتجات (Products)
    const products = await db.Product.bulkCreate([
      { name: 'Product A', price: 100.50, category: 'Electronics', image: 'product_a.jpg' },
      { name: 'Product B', price: 200.75, category: 'Clothing', image: 'product_b.jpg' },
      { name: 'Product C', price: 50.00, category: 'Books', image: 'product_c.jpg' }
    ]);
    console.log('✅ تم إدخال بيانات المنتجات');

    // ✅ إدخال بيانات السلة (Cart)
    const cartItems = await db.Cart.bulkCreate([
      { user_id: users[0].id, product_id: products[0].id, quantity: 2 },
      { user_id: users[0].id, product_id: products[1].id, quantity: 1 },
      { user_id: users[1].id, product_id: products[2].id, quantity: 3 }
    ]);
    console.log('✅ تم إدخال بيانات السلة');

    // ✅ إدخال بيانات الطلبات (Orders)
    const orders = await db.Order.bulkCreate([
      { user_id: users[0].id, status: 'pending', created_at: new Date() },
      { user_id: users[1].id, status: 'shipped', created_at: new Date() }
    ]);
    console.log('✅ تم إدخال بيانات الطلبات');

    // ✅ إدخال بيانات تفاصيل الطلبات (Order Details)
    const orderDetails = await db.OrderDetail.bulkCreate([
      { order_id: orders[0].id, product_id: products[0].id, quantity: 1, price: products[0].price },
      { order_id: orders[0].id, product_id: products[1].id, quantity: 2, price: products[1].price },
      { order_id: orders[1].id, product_id: products[2].id, quantity: 3, price: products[2].price }
    ]);
    console.log('✅ تم إدخال بيانات تفاصيل الطلبات');

    console.log('🎉 تم إدخال جميع البيانات التجريبية بنجاح!');
  } catch (error) {
    console.error('❌ حدث خطأ أثناء إدخال البيانات:', error);
  } finally {
    await db.sequelize.close(); // إغلاق الاتصال بقاعدة البيانات بعد انتهاء الإدخال
  }
}

// تشغيل وظيفة إدخال البيانات
seedDatabase();