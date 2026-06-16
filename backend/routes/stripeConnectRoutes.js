const express = require('express');

const router = express.Router();

const authController = require('../controllers/authController');
const stripeConnectController = require('../controllers/stripeConnectController');

router.use(authController.protect);

router.post(
    '/onboard',
    authController.restrictTo('freelancer'),
    stripeConnectController.createConnectAccount,
);

module.exports = router;
