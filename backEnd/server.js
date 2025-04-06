const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const bodyParser = require('body-parser');
const path = require('path');



const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const db = require('./models');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/AdminRoutes');


// Initialize Database and Associations
sequelize.sync({ force: false }).then(() => {
  console.log('Database synchronized.');
}).catch(err => {
  console.error('Error syncing database:', err);
});

// Routes
app.use('/auth', authRoutes); // Authentication Routes
app.use('/products', productRoutes); // Product Routes
app.use('/cart', cartRoutes); // Cart Routes
app.use('/orders', orderRoutes); // Order Routes
app.use('/admin', adminRoutes); // Admin Routes

// Start Server
const PORT = process.env.PORT || 5000;
db.sequelize.sync({alter: false}).then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
});