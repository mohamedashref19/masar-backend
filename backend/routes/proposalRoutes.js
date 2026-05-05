const express = require('express');
const proposalController = require('./../controllers/proposalController');
const authController = require('./../controllers/authController');

// mergeParams: true is VITAL here to get the :projectId from the parent router
const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router
    .route('/')
    .post(authController.restrictTo('freelancer'), proposalController.createProposal)
    .get(authController.restrictTo('client'), proposalController.getProjectProposals);

router.patch('/:id/accept', authController.restrictTo('client'), proposalController.acceptProposal);
router.patch('/:id/reject', authController.restrictTo('client'), proposalController.rejectProposal);

module.exports = router;