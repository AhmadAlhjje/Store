const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
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

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

module.exports = router;