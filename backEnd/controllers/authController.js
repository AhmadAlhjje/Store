const jwt = require('jsonwebtoken');
const db = require('../models'); 
const bcrypt = require('bcrypt');
const User = db.User; 

const SECRET_KEY = 'supersecret';

// مجرب
exports.signup = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    // تشفير كلمة المرور باستخدام bcrypt
    const hashedPassword = await bcrypt.hash(password, 10); // 10 هو عدد الجولات للتشفير
    const user = await User.create({
      name,
      email,
      password: hashedPassword, 
      role,
    });
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error details:', error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      res.status(400).json({ error: 'Email already exists' });
    } else {
      res.status(500).json({ error: 'Database error' });
    }
  }
};

// مجرب
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    // إنشاء رمز JWT
    const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token, role: user.role });
  } catch (error) {
    console.error('Error details:', error); 
    res.status(500).json({ error: 'Database error' });
  }
};