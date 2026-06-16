const express = require('express');
const router = express.Router();

// controllers
const authController = require('./../controllers/authController');
const userController = require('./../controllers/userController');

// Auth

router.post('/signup', authController.signup);
router.post('/verify-OTP', authController.verifyOTP);
router.post('/resend-OTP', authController.resendOTP);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.post('/forgot-password', authController.forgotPassword);
router.patch('/reset-password/:token', authController.resetPassword);

router.get('/freelancers', userController.getAllFreelancers);
router.get('/freelancers/:id', userController.getFreelancer);

// User

router.get('/me', authController.protect, userController.getMe);
router.patch(
    '/me',
    authController.protect,
    userController.uploadUserCV,
    userController.updateMe,
);
router.delete('/me', authController.protect, userController.deleteMe);
router.patch('/update-my-password', authController.protect, userController.updateMyPassword);

module.exports = router;
