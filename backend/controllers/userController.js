// Models
const multer = require('multer');
const User = require('./../models/userModel');

const fs = require('fs');
const FormData = require('form-data');
const aiClient = require('./../utils/aiClient');


// Utils
const filterObject = require('./../utils/filterObj');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const Email = require('./../utils/email');
const apiFeatures = require('./../utils/apiFeatures');

// Modules
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/cvs');
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split('/')[1];
        cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
    },
});

const multerFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new AppError('Not a PDF! Please upload only PDF files.', 400), false);
    }
};

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
});

exports.uploadUserCV = upload.single('cv');

exports.getMe = catchAsync(async (req, res, next) => {
    const user = await User.findById({ _id: req.user._id });

    return res.status(200).json({
        status: 'success',
        data: { user },
    });
});

exports.updateMe = catchAsync(async (req, res, next) => {
    let filteredObj = filterObject(req.body, 'name', 'email', 'phone');

    if (req.user.role === 'freelancer' && req.body.freelancerProfile) {
        filteredObj.freelancerProfile = filterObject(
            req.body.freelancerProfile,
            'title',
            'bio',
            'skills',
            'portfolioLinks',
            'githubLink',
            'hourlyRate',
        );
    }

    if (req.user.role === 'client' && req.body.clientProfile) {
        filteredObj.clientProfile = filterObject(
            req.body.clientProfile,
            'companyName',
            'industry',
            'description',
            'website',
        );
    }

    if (req.file) {
        if (!filteredObj.freelancerProfile) {
            filteredObj.freelancerProfile = {};
        }
        filteredObj.freelancerProfile.cv = req.file.filename;
    }

    // const user = await User.findOneAndUpdate({ _id: req.user._id }, filteredObj, {
    //     runValidators: true,
    //     returnDocument: 'after',
    // });

    // return res.status(200).json({
    //     status: 'success',
    //     data: { user },
    // });

    const user = await User.findOneAndUpdate({ _id: req.user._id }, filteredObj, {
    runValidators: true,
    returnDocument: 'after',
});

let aiAnalysis = null;
let aiAnalysisError = null;

if (user.role === 'freelancer') {
    const hasCV = !!req.file;
    const hasGithub = !!user.freelancerProfile?.githubLink;
    const hasPortfolioLinks =
        Array.isArray(user.freelancerProfile?.portfolioLinks) &&
        user.freelancerProfile.portfolioLinks.length > 0;
    const hasBio = !!user.freelancerProfile?.bio;

    if (hasCV || hasGithub || hasPortfolioLinks || hasBio) {
        try {
            const form = new FormData();

            form.append('freelancer_id', user._id.toString());

            const portfolioText = [
                user.freelancerProfile?.title,
                user.freelancerProfile?.bio,
                Array.isArray(user.freelancerProfile?.skills)
                    ? user.freelancerProfile.skills.join(', ')
                    : '',
            ]
                .filter(Boolean)
                .join('\n');

            if (portfolioText) {
                form.append('portfolio_text', portfolioText);
            }

            if (user.freelancerProfile?.githubLink) {
                form.append('github_url', user.freelancerProfile.githubLink);
            }

            if (
                Array.isArray(user.freelancerProfile?.portfolioLinks) &&
                user.freelancerProfile.portfolioLinks.length > 0
            ) {
                form.append(
                    'portfolio_url',
                    user.freelancerProfile.portfolioLinks[0],
                );
            }

            if (req.file) {
                form.append('file', fs.createReadStream(req.file.path), {
                    filename: req.file.filename,
                    contentType: req.file.mimetype,
                });
            }

            const aiResponse = await aiClient.post('/analyze-portfolio', form, {
                headers: form.getHeaders(),
            });

            aiAnalysis = aiResponse.data;
        } catch (err) {
            aiAnalysisError =
                err.response?.data?.detail ||
                err.response?.data?.message ||
                err.message;
        }
    }
}

return res.status(200).json({
    status: 'success',
    data: {
        user,
        aiAnalysis,
        aiAnalysisError,
    },
});
});

exports.deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user._id, { active: false });

    res.status(204).json({
        status: 'success',
        data: null,
    });
});

exports.updateMyPassword = catchAsync(async (req, res, next) => {
    const user = await User.findOne({ _id: req.user._id }).select('+password');

    if (!user) {
        return next(new AppError('User not found', 404));
    }

    const { currentPassword, password, passwordConfirm } = req.body;

    if (!currentPassword || !password || !passwordConfirm)
        return next(
            new AppError('Must enter current password , new password and password confirm', 400),
        );

    if (!(await user.doPasswordsMatch(currentPassword, user.password)))
        return next(new AppError('Incorrect current password, Try again!', 401)); // 401 -> authentication issue

    if (password !== passwordConfirm)
        return next(new AppError('Password and Password confirm MUST match', 400));

    user.password = password;
    user.passwordConfirm = passwordConfirm;
    await user.save();

    return res.status(200).json({
        status: 'success',
        message: 'Password changed successfully',
        data: null,
    });
});

exports.getAllFreelancers = catchAsync(async (req, res, next) => {
    const filter = { role: 'freelancer' };
    let queryObj = { ...req.query };

    if (queryObj.skills) {
        queryObj['freelancerProfile.skills'] = queryObj.skills;
        delete queryObj.skills;
    }
    if (queryObj.title) {
        queryObj['freelancerProfile.title'] = queryObj.title;
        delete queryObj.title;
    }
    if (queryObj.experienceLevel) {
        queryObj['freelancerProfile.experienceLevel'] = queryObj.experienceLevel;
        delete queryObj.experienceLevel;
    }
    if (queryObj.rating) {
        queryObj['freelancerProfile.rating'] = queryObj.rating;
        delete queryObj.rating;
    }
    if (queryObj.hourlyRate) {
        queryObj['freelancerProfile.hourlyRate'] = queryObj.hourlyRate;
        delete queryObj.hourlyRate;
    }
    const features = new apiFeatures(User.find(filter), queryObj)
        .filter()
        .sort()
        .limitFields()
        .paginate();

    const freelancers = await features.query.select(
        '-passwordChangedAt -__v -otp -otpExpires -resetPasswordToken -passwordResetExpires',
    );

    res.status(200).json({
        status: 'success',
        results: freelancers.length,
        data: { freelancers },
    });
});

exports.getFreelancer = catchAsync(async (req, res, next) => {
    const freelancer = await User.findOne({
        _id: req.params.id,
        role: 'freelancer',
    }).select('-passwordChangedAt -__v -otp -otpExpires -resetPasswordToken -passwordResetExpires');

    if (!freelancer) {
        return next(new AppError('No freelancer found with that ID', 404));
    }
    res.status(200).json({
        status: 'success',
        data: { freelancer },
    });
});
