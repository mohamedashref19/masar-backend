const Proposal = require('./../models/proposalModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

// Models
const Project = require('./../models/projectModel');

exports.createProposal = catchAsync(async (req, res, next) => {
    const projectId = req.params.projectId;
    const freelancerId = req.user.id;
    const project = await Project.findById(projectId);

    // checking if the project exist
    if(!project)
        return next(new AppError(`The project doesn't exist` , 404));
    
    // checking if the project isn't open to take proposals anymore
    console.log(project.status)
    if( project.status !== 'open')
        return next(new AppError(`You can't add a proposal to this project anymore` , 400));
    

    const newProposal = await Proposal.create({
        project: projectId,
        freelancer: freelancerId,
        coverLetter: req.body.coverLetter,
        price: req.body.price,
        duration: req.body.duration,
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
        return next(new AppError(`You are not authorized to access this information` , 403));

    const proposals = await Proposal.find({ project: req.params.projectId });

    res.status(200).json({
        status: 'success',
        results: proposals.length,
        data: { proposals },
    });
});

exports.acceptProposal = catchAsync(async (req, res, next) => {
  const project = await Project.findById(req.params.projectId);

  if (!project) {
    return next(new AppError('Project not found', 404));
  }

  if (project.client._id.toString() !== req.user._id.toString()) {
    return next(new AppError('You are not authorized to accept this proposal', 403));
  }

  if (project.status !== 'open') {
    return next(new AppError('This project is no longer open', 400));
  }

  const proposal = await Proposal.findById(req.params.id);

  if (!proposal) {
    return next(new AppError('No proposal found with that ID', 404));
  }

  if (proposal.project._id.toString() !== req.params.projectId) {
    return next(new AppError('This proposal does not belong to this project', 400));
  }

  proposal.status = 'accepted';
  await proposal.save();

  project.status = 'in-progress';
  project.assignedFreelancer = proposal.freelancer;
  await project.save();

  await Proposal.updateMany(
    {
      project: req.params.projectId,
      _id: { $ne: req.params.id },
    },
    { status: 'rejected' }
  );

  res.status(200).json({
    status: 'success',
    data: { proposal },
  });
});

exports.rejectProposal = catchAsync(async (req, res, next) => {
  const project = await Project.findById(req.params.projectId);

  if (!project) {
    return next(new AppError('Project not found', 404));
  }

  if (project.client._id.toString() !== req.user._id.toString()) {
    return next(new AppError('You are not authorized to reject this proposal', 403));
  }

  const proposal = await Proposal.findById(req.params.id);

  if (!proposal) {
    return next(new AppError('No proposal found', 404));
  }

  if (proposal.project._id.toString() !== req.params.projectId) {
    return next(new AppError('This proposal does not belong to this project', 400));
  }

  proposal.status = 'rejected';
  await proposal.save();

  res.status(200).json({
    status: 'success',
    data: { proposal },
  });
});
