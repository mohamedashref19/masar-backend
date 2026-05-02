const express = require('express');

const router = express.Router();

const authController = require('./../controllers/authController');
const projectController = require('./../controllers/projectController');

router
    .route('/')
    .post(
        authController.protect,
        authController.restrictTo('client'),
        projectController.createProject,
    )
    .get(projectController.getAllProjects);


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
