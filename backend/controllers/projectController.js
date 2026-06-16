// Models
const Project = require('../models/projectModel');

// Utils
const filterObject = require('../utils/filterObj');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const apiFeatures = require('../utils/apiFeatures');
const aiClient = require('../utils/aiClient');
const createNotification = require('../utils/createNotification');

const normalizeSkills = (skills) => {
    if (!skills) return [];

    let normalizedSkills = skills;

    if (Array.isArray(normalizedSkills)) {
        normalizedSkills = normalizedSkills.flatMap((skill) => {
            if (typeof skill === 'string') {
                return skill.split(',');
            }
            return [skill];
        });
    } else if (typeof normalizedSkills === 'string') {
        normalizedSkills = normalizedSkills.split(',');
    } else {
        return [];
    }

    return normalizedSkills.map((skill) => String(skill).trim()).filter(Boolean);
};

// exports.createProject = catchAsync(async (req, res, next) => {
//     let filteredObj = filterObject(
//         req.body,
//         'title',
//         'description',
//         'category',
//         'skillsRequired',
//         'budget',
//         'deadline',
//         'complexity',
//         'required_skills',
//         'experience_required',
//     );

//     filteredObj.client = req.user._id;

//     const project = await Project.create(filteredObj);

//     let suggestedFreelancers = [];

//     try {
//         const matchResponse = await aiClient.post(
//             '/match-project',
//             {
//                 project_id: project._id.toString(),
//                 title: project.title,
//                 description: project.description,
//                 required_skills: project.required_skills || project.skillsRequired || [],
//                 experience_required: project.experience_required || 'Intermediate',
//             },
//             {
//                 params: { top_k: 5 },
//             },
//         );

//         if (matchResponse.data && matchResponse.data.recommended_freelancers) {
//             suggestedFreelancers = matchResponse.data.recommended_freelancers;
//         }
//     } catch (aiError) {
//         console.error('AI Matching Error:', aiError.response?.data || aiError.message);
//     }

//     return res.status(201).json({
//         status: 'success',
//         data: {
//             project,
//             suggestedFreelancers,
//         },
//     });
// });

exports.createProject = catchAsync(async (req, res, next) => {
    let filteredObj = filterObject(
        req.body,
        'title',
        'description',
        'category',
        'skillsRequired',
        'budget',
        'deadline',
        'complexity',
        'required_skills',
        'experience_required',
    );

    filteredObj.client = req.user._id;

    filteredObj.skillsRequired = normalizeSkills(
        filteredObj.skillsRequired || filteredObj.required_skills,
    );

    delete filteredObj.required_skills;

    const project = await Project.create(filteredObj);

    let suggestedFreelancers = [];
    let aiMatchingError = null;

    try {
        const requiredSkills = normalizeSkills(
            project.skillsRequired ||
                req.body.skillsRequired ||
                project.required_skills ||
                req.body.required_skills,
        );

        const matchPayload = {
            project_id: project._id.toString(),
            title: project.title,
            description: project.description,
            required_skills: requiredSkills,
            budget_range: project.budget ? String(project.budget) : '',
            complexity: project.complexity || 'Medium',
            experience_required:
                project.experience_required || req.body.experience_required || 'Intermediate',
        };

        console.log('AI match payload:', matchPayload);

        const matchResponse = await aiClient.post('/match-project', matchPayload, {
            params: { top_k: Number(req.query.top_k) || 20 },
        });

        console.dir(matchResponse.data, { depth: null });

        suggestedFreelancers =
            matchResponse.data?.ranked_freelancers ||
            matchResponse.data?.recommended_freelancers ||
            [];
    } catch (aiError) {
        aiMatchingError =
            aiError.response?.data?.detail || aiError.response?.data?.message || aiError.message;

        console.error('AI Matching Error:', aiMatchingError);
    }

    if (suggestedFreelancers.length > 0) {
        await Promise.all(
            suggestedFreelancers.map((freelancer) =>
                createNotification({
                    recipient: freelancer.freelancer_id,
                    type: 'system',
                    title: 'تم ترشيحك لمشروع جديد',
                    message: `تم ترشيحك بواسطة نظام الذكاء الاصطناعي للتقدم إلى مشروع "${project.title}". اطلع على المشروع وقدّم عرضك إذا كان مناسباً لك.`,
                    relatedProject: project._id,
                }),
            ),
        );
    }

    return res.status(201).json({
        status: 'success',
        data: {
            project,
            suggestedFreelancers,
            aiMatchingError,
        },
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

    await createNotification({
        recipient: project.assignedFreelancer,
        sender: req.user._id,
        type: 'project_completed',
        title: 'تم إكمال المشروع',
        message: `تم إكمال مشروع "${project.title}".`,
        relatedProject: project._id,
    });

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

    await createNotification({
        recipient: project.assignedFreelancer,
        sender: req.user._id,
        type: 'project_cancelled',
        title: 'تم إلغاء المشروع',
        message: `تم إلغاء مشروع "${project.title}".`,
        relatedProject: project._id,
    });

    res.status(200).json({
        status: 'success',
        data: { project },
    });
});
