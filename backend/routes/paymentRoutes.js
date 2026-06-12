const express = require('express');

const router = express.Router();

const authController = require('../controllers/authController');
const paymentController = require('../controllers/paymentController');

router.use(authController.protect);

router.post(
    '/milestones/:milestoneId/fund',
    authController.restrictTo('client'),
    paymentController.fundMilestone,
);

router.post(
    '/milestones/:milestoneId/release',
    authController.restrictTo('client'),
    paymentController.releaseMilestonePayment,
);

module.exports = router;
