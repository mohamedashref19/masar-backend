// Models
const Milestone = require('./../models/milestoneModel');
const Project = require('./../models/projectModel');

// Utils
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const apiFeatures = require('./../utils/apiFeatures');
const createNotification = require('../utils/createNotification');

exports.createMilestone = catchAsync(async (req, res, next) => {
    const project = await Project.findById(req.params.projectId);

    if (!project) return next(new AppError('No project found with that id', 404));

    // checking if client has authority
    if (project.client._id.toString() !== req.user._id.toString())
        return next(new AppError(`You don't have authority to perform this action`, 403));

    if (project.status !== 'in-progress')
        return next(
            new AppError('You can only create a milestone when a project is in progress', 400),
        );

    if (!project.assignedFreelancer)
        return next(new AppError('A project must have an assigned freelancer', 400));

    const milestone = await Milestone.create({
        project: project._id,
        client: req.user._id,
        freelancer: project.assignedFreelancer,
        title: req.body.title,
        description: req.body.description,
        amount: req.body.amount,
    });

    await createNotification({
        recipient: project.assignedFreelancer,
        sender: req.user._id,
        type: 'milestone_created',
        title: 'تم إنشاء مرحلة جديدة',
        message: `تم إنشاء مرحلة جديدة بعنوان "${milestone.title}".`,
        relatedProject: project._id,
        relatedMilestone: milestone._id,
    });

    return res.status(201).json({
        status: 'success',
        data: { milestone },
    });
});

exports.getProjectMilestones = catchAsync(async (req, res, next) => {
    const project = await Project.findById(req.params.projectId);

    if (!project) return next(new AppError('No project found with that id', 404));

    if (
        project.client._id.toString() !== req.user._id.toString() &&
        (!project.assignedFreelancer ||
            project.assignedFreelancer._id.toString() !== req.user._id.toString())
    )
        return next(new AppError('You are not authorized', 403));

    const milestones = await Milestone.find({ project: project._id });
    console.log('MilestonesBackend:', milestones); // 🔍 لوج للتأكد من البيانات

    if (milestones.length == 0) {
        return res.status(200).json({
            status: 'success',
            results: milestones.length,
            data: { milestones },
        });
    }

    return res.status(200).json({
        status: 'success',
        results: milestones.length,
        data: { milestones },
    });
});

exports.submitMilestone = catchAsync(async (req, res, next) => {
    const milestone = await Milestone.findById(req.params.milestoneId);

    if (!milestone) {
        return next(new AppError('No milestone found with that ID', 404));
    }

    if (milestone.freelancer._id.toString() !== req.user._id.toString()) {
        return next(new AppError('You are not authorized to submit this milestone', 403));
    }

    if (milestone.status !== 'funded') {
        return next(new AppError('Only funded milestones can be submitted', 400));
    }

    milestone.status = 'submitted';
    milestone.submittedAt = Date.now();
    await milestone.save();

    await createNotification({
        recipient: milestone.client._id || milestone.client,
        sender: req.user._id,
        type: 'milestone_submitted',
        title: 'تم تسليم المرحلة',
        message: `تم تسليم المرحلة "${milestone.title}" للمراجعة.`,
        relatedProject: milestone.project,
        relatedMilestone: milestone._id,
    });

    res.status(200).json({
        status: 'success',
        data: { milestone },
    });
});

exports.approveMilestone = catchAsync(async (req, res, next) => {
    const milestone = await Milestone.findById(req.params.milestoneId);

    if (!milestone) {
        return next(new AppError('No milestone found with that ID', 404));
    }

    if (milestone.client._id.toString() !== req.user._id.toString()) {
        return next(new AppError('You are not authorized to approve this milestone', 403));
    }

    if (milestone.status !== 'submitted') {
        return next(new AppError('Only submitted milestones can be approved', 400));
    }

    milestone.status = 'approved';
    milestone.approvedAt = Date.now();
    await milestone.save();

    await createNotification({
        recipient: milestone.freelancer._id || milestone.freelancer,
        sender: req.user._id,
        type: 'milestone_approved',
        title: 'تمت الموافقة على المرحلة',
        message: `تمت الموافقة على المرحلة "${milestone.title}".`,
        relatedProject: milestone.project,
        relatedMilestone: milestone._id,
    });

    res.status(200).json({
        status: 'success',
        data: { milestone },
    });
});
