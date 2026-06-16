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
    )
    .get(authController.protect, milestoneController.getProjectMilestones);

router.patch(
    '/:milestoneId/submit',
    authController.protect,
    authController.restrictTo('freelancer'),
    milestoneController.submitMilestone,
);

router.patch(
    '/:milestoneId/approve',
    authController.protect,
    authController.restrictTo('client'),
    milestoneController.approveMilestone,
);

module.exports = router;
