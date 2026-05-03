const express = require('express');
const router = express.Router();

// controllers
const authController = require('./../controllers/authController');
const userController = require('./../controllers/userController');

// Auth

router.post('/signup', authController.signup);
router.post('/verifyOTP', authController.verifyOTP);
router.post('/resendOTP', authController.resendOTP);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

// // User

router.get('/me', authController.protect, userController.getMe);
router.patch('/updateMe', authController.protect, userController.updateMe);
router.delete('/deleteMe', authController.protect, userController.deleteMe);
router.patch('/updateMyPassword', authController.protect, userController.updateMyPassword);

module.exports = router;
