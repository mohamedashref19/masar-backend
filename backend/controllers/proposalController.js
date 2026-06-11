const Proposal = require('./../models/proposalModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const Email = require('./../utils/email');
const createNotification = require('./../utils/createNotification');
const User = require('./../models/userModel');

// Models
const Project = require('./../models/projectModel');



exports.createProposal = catchAsync(async (req, res, next) => {
    const projectId = req.params.projectId;
    const freelancerId = req.user.id;
    const project = await Project.findById(projectId);

    // checking if the project exist
    if (!project) return next(new AppError(`The project doesn't exist`, 404));

    if (project.client._id.toString() === req.user._id.toString())
        return next(new AppError('You cannot apply to your own project', 400));

    // checking if the project isn't open to take proposals anymore
    if (project.status !== 'open')
        return next(new AppError(`You can't add a proposal to this project anymore`, 400));

    // checking if the freelancer already applied to this project
    const existingProposal = await Proposal.findOne({
        project: projectId,
        freelancer: freelancerId,
    });

    if (existingProposal) {
        return next(new AppError('You have already applied to this project', 400));
    }

    const newProposal = await Proposal.create({
        project: projectId,
        freelancer: freelancerId,
        coverLetter: req.body.coverLetter,
        price: req.body.price,
        duration: req.body.duration,
    });

    await createNotification({
        recipient: project.client,
        sender: req.user._id,
        type: 'proposal_received',
        title: 'تم استلام عرض جديد',
        message: `لقد استلمت عرضًا جديدًا على مشروع "${project.title}".`,
        relatedProject: project._id,
        relatedProposal: newProposal._id,
    });

    res.status(201).json({
        status: 'success',
        data: { proposal: newProposal },
    });
});

exports.getProjectProposals = catchAsync(async (req, res, next) => {
    const clientId = req.user.id;
    const project = await Project.findById(req.params.projectId);

    if (!project) return next(new AppError('Project not found', 404));

    if (clientId.toString() !== project.client._id.toString())
        return next(new AppError(`You are not authorized to access this information`, 403));

    const proposals = await Proposal.find({ project: req.params.projectId });

    res.status(200).json({
        status: 'success',
        results: proposals.length,
        data: { proposals },
    });
});

exports.acceptProposal = catchAsync(async (req, res, next) => {
    // 1) Find the proposal and populate the project so we can check the client
    const proposal = await Proposal.findById(req.params.id).populate('project').populate({
        path: 'freelancer',
        select: 'name email',
    });

    if (!proposal) {
        return next(new AppError('No proposal found with that ID', 404));
    }

    if (!proposal.project)
        return next(new AppError('Project related to this proposal no longer exists', 404));

    // 2) Check if the user making the request is the client who owns the project
    if (proposal.project.client._id.toString() !== req.user._id.toString()) {
        return next(new AppError('You are not authorized to accept this proposal', 403));
    }

    // checking if proposal status is pending
    if (proposal.status !== 'pending')
        return next(new AppError('Only pending proposals can be accepted', 400));

    // 3) Check if the project is still open
    if (proposal.project.status !== 'open') {
        return next(new AppError('This project is no longer open', 400));
    }

    // 4) Change Proposal status
    proposal.status = 'accepted';
    await proposal.save();

    // 5) Change Project status and assign freelancer
    const project = await Project.findById(proposal.project._id);
    project.status = 'in-progress';
    //  project.assignedFreelancer = proposal.freelancer; // from the proposal
    project.assignedFreelancer = proposal.freelancer._id;
    await project.save();

    // 6) Reject ALL other proposals for this specific project
    await Proposal.updateMany(
        {
            project: project._id,
            _id: { $ne: proposal._id }, // exclude the accepted one
        },
        { status: 'rejected' },
    );

    await createNotification({
        recipient: proposal.freelancer,
        sender: req.user._id,
        type: 'proposal_accepted',
        title: 'تم قبول العرض',
        message: `تم قبول عرضك على مشروع "${project.title}".`,
        relatedProject: project._id,
        relatedProposal: proposal._id,
    });

    await createNotification({
        recipient: proposal.freelancer,
        sender: req.user._id,
        type: 'project_started',
        title: 'بدأ العمل على المشروع',
        message: `أصبح مشروع "${project.title}" قيد التنفيذ الآن.`,
        relatedProject: project._id,
    });

    //send Email
    try {
        const url = `${req.protocol}://${req.get('host')}/projects/${project._id}`;
        const freelancerData = await User.findById(proposal.freelancer._id);
        if (freelancerData && freelancerData.email) {
            await new Email(freelancerData, url).sendProposalAccepted(project.title);
        } else {
            console.error('❌ Freelancer email not found in database');
        }
    } catch (error) {
        console.error('❌ Failed to send Proposal Accepted Email:', error);
    }

    res.status(200).json({
        status: 'success',
        message: 'Proposal accepted successfully. Project is now in progress.',
        data: { proposal },
    });
});

exports.rejectProposal = catchAsync(async (req, res, next) => {
    const proposal = await Proposal.findById(req.params.id).populate('project');

    if (!proposal) {
        return next(new AppError('No proposal found', 404));
    }

    if (!proposal.project)
        return next(new AppError('Project related to this proposal no longer exists', 404));

    if (proposal.project.client._id.toString() !== req.user._id.toString()) {
        return next(new AppError('You are not authorized to reject this proposal', 403));
    }
    if (proposal.status !== 'pending') {
        return next(new AppError('You can only reject pending proposals', 400));
    }
    proposal.status = 'rejected';
    await proposal.save();

    await createNotification({
        recipient: proposal.freelancer,
        sender: req.user._id,
        type: 'proposal_rejected',
        title: 'تم رفض العرض',
        message: `تم رفض عرضك على مشروع "${proposal.project.title}".`,
        relatedProject: proposal.project,
        relatedProposal: proposal._id,
    });

    res.status(200).json({
        status: 'success',
        data: { proposal },
    });
});

exports.getMyProposals = catchAsync(async (req, res, next) => {
    const freelancerId = req.user._id;
    let proposals = await Proposal.find({ freelancer: freelancerId })
        .populate({
            path: 'project',
            select: 'title budget category status',
        })
        .populate({ path: 'freelancer', select: '_id' })
        .sort('-createdAt');
    proposals = proposals.filter((p) => p.project !== null);
    res.status(200).json({
        status: 'success',
        results: proposals.length,
        data: {
            proposals,
        },
    });
});
