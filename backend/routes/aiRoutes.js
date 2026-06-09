const express = require('express');
const multer = require('multer');

const authController = require('../controllers/authController');
const aiController = require('../controllers/aiController');

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.use(authController.protect);

router.post(
  '/analyze-portfolio',
  authController.restrictTo('freelancer'),
  upload.single('file'),
  aiController.analyzePortfolio
);

module.exports = router;