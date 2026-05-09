const express = require('express');

const router = express.Router({ mergeParams: true });

const authController = require('./../controllers/authController');
const milestoneController = require('./../controllers/milestoneController');

router
    .route('/')
    .post(
        authController.protect,
        authController.restrictTo('client'),
        milestoneController.createMilestone,
    ).get(
        authController.protect,
        milestoneController.getProjectMilestones,
    );





module.exports = router;