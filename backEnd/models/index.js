const Sequelize = require('sequelize');
const sequelize = require('../config/database');

// إنشاء كائن db لتنظيم النماذج والعلاقات
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// استيراد النماذج
db.User = require('./User')(sequelize, Sequelize); // المستخدمون العاديون
db.Product = require('./Product')(sequelize, Sequelize); // المنتجات
db.Cart = require('./Cart')(sequelize, Sequelize); // السلة
db.Order = require('./Order')(sequelize, Sequelize); // الطلبات
db.OrderDetail = require('./OrderDetail')(sequelize, Sequelize); // تفاصيل الطلب

// تعريف العلاقات بين الجداول

// العلاقة بين المستخدمين والسلة (كل مستخدم يمكنه إضافة عدة عناصر إلى السلة)
db.User.hasMany(db.Cart, { foreignKey: 'user_id', onDelete: 'CASCADE' });
db.Cart.belongsTo(db.User, { foreignKey: 'user_id' });

// العلاقة بين المنتجات والسلة (كل منتج يمكن أن يظهر في السلة عدة مرات)
db.Cart.belongsTo(db.Product, { foreignKey: 'product_id', as: 'product' });

// العلاقة بين المستخدمين والطلبات (كل مستخدم يمكنه تقديم عدة طلبات)
db.User.hasMany(db.Order, { foreignKey: 'user_id', onDelete: 'CASCADE' });
db.Order.belongsTo(db.User, { foreignKey: 'user_id' });

// العلاقة بين الطلبات وتفاصيل الطلب (كل طلب يمكن أن يحتوي على عدة تفاصيل)
db.Order.hasMany(db.OrderDetail, { foreignKey: 'order_id', as: 'details', onDelete: 'CASCADE' });
db.OrderDetail.belongsTo(db.Order, { foreignKey: 'order_id' });

// العلاقة بين المنتجات وتفاصيل الطلب (كل تفصيل طلب مرتبط بمنتج واحد)
db.OrderDetail.belongsTo(db.Product, { foreignKey: 'product_id', as: 'product' });

// تصدير الكائن db
module.exports = db;