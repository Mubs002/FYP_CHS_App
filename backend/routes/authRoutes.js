const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);

// i added these routes for the settings page
router.get('/user/:id', authController.getUser);
router.put('/user/:id/profile', authController.updateProfile);
router.put('/user/:id/password', authController.updatePassword);

module.exports = router;