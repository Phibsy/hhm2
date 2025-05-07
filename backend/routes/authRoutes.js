const express = require('express');
const {
  register,
  login,
  getMe,
  logout
} = require('../controllers/authController');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/register', protect, authorize('admin'), register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.get('/logout', logout);

module.exports = router;
