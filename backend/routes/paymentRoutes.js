const express = require('express');

const router = express.Router();

const authController = require('../controllers/authController');
const paymentController = require('../controllers/paymentController');



router.post(
  '/milestones/:milestoneId/fund',
  authController.protect,
  authController.restrictTo('client'),
  paymentController.fundMilestone
);

module.exports = router;