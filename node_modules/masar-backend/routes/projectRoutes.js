const express = require('express');

const router = express.Router();

const authController = require('./../controllers/authController');
const projectController = require('./../controllers/projectController');
const proposalRouter = require('./proposalRoutes');

router
    .route('/')
    .post(
        authController.protect,
        authController.restrictTo('client'),
        projectController.createProject,
    )
    .get(projectController.getAllProjects);
router.use('/:projectId/proposals', proposalRouter);
router
    .route('/:projectId')
    .get(projectController.getProject)
    .patch(
        authController.protect,
        authController.restrictTo('client'),
        projectController.updateProject,
    )
    .delete(
        authController.protect,
        authController.restrictTo('client'),
        projectController.deleteProject,
    );

module.exports = router;
