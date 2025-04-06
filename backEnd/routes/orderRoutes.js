const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'supersecret';
// Middleware for authentication
function authMiddleware(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(403).send("Unauthorized - No token provided");
  }

  const tokenWithoutBearer = token.split(' ')[1];
  jwt.verify(tokenWithoutBearer, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).send("Unauthorized - Invalid token");
    }
    req.user = decoded;
    next();
  });
}

router.get('/:user_id', orderController.getOrders);
router.post('/', orderController.createOrder);
router.put('/:id', orderController.updateOrderStatus);
router.post('/confirmorder', orderController.confirmOrder);

module.exports = router;