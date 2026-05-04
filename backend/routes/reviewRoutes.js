const express = require('express');

const router = express.Router();

const authController = require('../controllers/authController');
const reviewController = require('../controllers/reviewController');

router.post(
  '/',
  authController.protect,
  authController.restrictTo('client'),
  reviewController.createReview
);

router.get(
  '/freelancer/:freelancerId',
  reviewController.getFreelancerReviews
);

module.exports = router;