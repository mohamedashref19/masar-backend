// Models
const Project = require('./../models/projectModel');

// Utils
const filterObject = require('./../utils/filterObj');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const apiFeatures = require('./../utils/apiFeatures');

exports.createProject = catchAsync(async (req, res, next) => {
    let filteredObj = filterObject(
        req.body,
        'title',
        'description',
        'category',
        'skillsRequired',
        'budget',
        'deadline',
        'complexity', // <-- أضفنا ده
        'required_skills', // <-- أضفنا ده
        'experience_required', // <-- أضفنا ده
    );

    filteredObj.client = req.user._id;

    const project = await Project.create(filteredObj);

    return res.status(201).json({
        status: 'success',
        data: { project },
    });
});

exports.getAllProjects = catchAsync(async (req, res, next) => {
    const features = new apiFeatures(Project.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();

    // executing the query
    const projects = await features.query;

    if (projects == []) return next(new AppError('No Projects found', 404));

    return res.status(200).json({
        status: 'success',
        results: projects.length,
        data: { projects },
    });
});

exports.getProject = catchAsync(async (req, res, next) => {
    const project = await Project.findById({ _id: req.params.projectId });

    if (!project) return next(new AppError(`Project doesn't exist`, 404));

    return res.status(200).json({
        status: 'success',
        data: { project },
    });
});

// for the user to get all their projects
exports.getMyProjects = catchAsync(async (req, res, next) => {
    const projects = await Project.find({
        client: req.user._id,
    }).sort('-createdAt');

    res.status(200).json({
        status: 'success',
        results: projects.length,
        data: { projects },
    });
});

exports.updateProject = catchAsync(async (req, res, next) => {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
        return next(new AppError(`Project doesn't exist`, 404));
    }

    if (project.client._id.toString() !== req.user._id.toString()) {
        return next(new AppError('You are not authorized to update this project', 403));
    }

    const filteredObj = filterObject(
        req.body,
        'title',
        'description',
        'category',
        'skillsRequired',
        'budget',
        'deadline',
        //'status',
    );

    const updatedProject = await Project.findByIdAndUpdate(req.params.projectId, filteredObj, {
        returnDocument: 'after',
        runValidators: true,
    });

    res.status(200).json({
        status: 'success',
        data: { project: updatedProject },
    });
});

exports.deleteProject = catchAsync(async (req, res, next) => {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
        return next(new AppError(`Project doesn't exist`, 404));
    }

    if (project.client._id.toString() !== req.user._id.toString()) {
        return next(new AppError('You are not authorized to delete this project', 403));
    }

    await Project.findByIdAndDelete(req.params.projectId);

    res.status(204).json({
        status: 'success',
        data: null,
    });
});

exports.completeProject = catchAsync(async (req, res, next) => {
    const project = await Project.findById(req.params.projectId);

    if (!project) return next(new AppError('Project not found', 404));

    if (project.client._id.toString() !== req.user._id.toString())
        return next(new AppError('You are not allowed to complete this project', 403));

    if (project.status !== 'in-progress')
        return next(new AppError('Only in-progress projects can be completed', 400));

    if (!project.assignedFreelancer)
        return next(new AppError('Project has no assigned freelancer', 400));

    project.status = 'completed';
    project.completedAt = Date.now();

    await project.save();

    res.status(200).json({
        status: 'success',
        data: { project },
    });
});

exports.cancelProject = catchAsync(async (req, res, next) => {
    const project = await Project.findById(req.params.projectId);

    if (!project) return next(new AppError('Project not found', 404));

    if (project.client._id.toString() !== req.user._id.toString())
        return next(new AppError('You are not allowed to cancel this project', 403));

    if (project.status === 'completed' || project.status === 'cancelled')
        return next(new AppError('This project cannot be cancelled', 400));

    project.status = 'cancelled';

    await project.save();

    res.status(200).json({
        status: 'success',
        data: { project },
    });
});
