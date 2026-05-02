// Models
const Project = require('./../models/projectModel');

// utils
const filterObject = require('./../utils/filterObj');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const Email = require('./../utils/email');
const apiFeatures = require('./../utils/apiFeatures');

// Modules

exports.createProject = catchAsync(async (req, res, next) => {
    let filteredObj = filterObject(
        req.body,
        'title',
        'description',
        'category',
        'skillsRequired',
        'budget',
        'deadline',
        'status',
    );
    filteredObj.client = req.user._id;

    const project = await Project.create(filteredObj);

    return res.status(201).json({
        status: 'success',
        project,
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

    if (!projects) return next(new AppError('No Projects found', 404));

    return res.status(200).json({
        status: 'success',
        length: projects.length,
        data: projects,
    });
});

exports.getProject = catchAsync(async (req, res, next) => {
    console.log(req.params.projectId);
    const project = await Project.findOne({ _id: req.params.projectId });

    if (!project) return next(new AppError(`Project doesn't exist`, 404));

    return res.status(200).json({
        status: 'success',
        data: project,
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
        'status',
    );

    const updatedProject = await Project.findByIdAndUpdate(req.params.projectId, filteredObj, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({
        status: 'success',
        project: updatedProject,
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
