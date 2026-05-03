const Proposal = require('./../models/proposalModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.createProposal = catchAsync(async (req, res, next) => {
    const projectId = req.params.projectId;
    const freelancerId = req.user.id;

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

exports.getProjectProposal = catchAsync(async (req, res, next) => {
    const proposals = await Proposal.find({ project: req.params.projectId });

    res.status(200).json({
        status: 'success',
        results: proposals.length,
        data: { proposals },
    });
});

exports.acceptProposal = catchAsync(async (req, res, next) => {
    const proposal = await Proposal.findByIdAndUpdate(
        req.params.id,
        { status: 'accepted' },
        { returnDocument: 'after', runValidators: true },
    );

    if (!proposal) {
        return next(new AppError('No proposal found with that ID', 404));
    }
    res.status(200).json({
        status: 'success',
        data: { proposal },
    });
});

exports.rejectProposal = catchAsync(async (req, res, next) => {
    const proposal = await Proposal.findByIdAndUpdate(
        req.params.id,
        { status: 'rejected' },
        { returnDocument: 'after', runValidators: true },
    );

    if (!proposal) return next(new AppError('No proposal found', 404));
    res.status(200).json({ status: 'success', data: { proposal } });
});
