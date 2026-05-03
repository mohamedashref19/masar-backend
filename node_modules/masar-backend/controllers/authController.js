// Models
const User = require('./../models/userModel');

// utils
const filterObject = require('./../utils/filterObj');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const Email = require('./../utils/email');

// Modules
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const signTokenAndSend = (user, res, statusCode) => {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });

    // 🔹 Cookie options
    const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly: true, // to prevent the front end from accessing or modifying the cookie
        secure: process.env.NODE_ENV === 'production', // https only in prod
    };

    // 🔹 send cookie
    res.cookie('jwt', token, cookieOptions);

    // remove password from output
    user.password = undefined;

    res.status(statusCode).json({
        status: 'success',
        token, // keep it for now (useful for testing)
        user,
    });
};

exports.protect = catchAsync(async (req, res, next) => {
    let token;

    // Checking to see if the token exists or not
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.get('Authorization').split(' ')[1];
    }
    // or cookie
    else if (req.cookies.jwt) {
        token = req.cookies.jwt;
    }

    // Checking to see if token got assigned or not
    if (!token) {
        return next(new AppError(`You don't have permission to perform this action`, 401)); // 401 -> not logged in , invalid token
    }

    // Checking invalid token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Checking expired token
    if (decoded.exp * 1000 < Date.now()) {
        return next(new AppError('Token Expired', 400)); // 400 -> Bad Request
    }

    const user = await User.findById(decoded.id);

    // checking if user doesn't exist or has deleted their account
    if (!user) {
        return next(new AppError(`No user found`, 404));
    }

    // Checking if user changed password after token has been issued
    if (user.changedPasswordAfter(decoded.iat)) {
        return next(new AppError('User recently changed password. Please log in again.', 401));
    }

    // attaching the user on the request
    req.user = user;
    next();
});

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        // roles = ['user' , 'admin'] for instance

        if (!roles.includes(req.user.role)) {
            return next(new AppError(`You don't have authority to perform this action`, 403));
        }

        // Otherwise you do have authority -> move on to the next middleware
        next();
    };
};

exports.signup = catchAsync(async (req, res, next) => {
    if (req.body.role === 'admin') {
        return next(new AppError('You cannot sign up as admin', 403));
    }

    // Base allowed fields
    const baseFields = ['name', 'email', 'password', 'passwordConfirm', 'phone', 'role'];
    let filteredObj = filterObject(req.body, ...baseFields);

    // 🔹 Handle freelancer profile
    if (req.body.role === 'freelancer') {
        if (!req.body.freelancerProfile) {
            return next(new AppError('Freelancer profile is required', 400));
        }
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

    // 🔹 Handle client profile
    if (req.body.role === 'client') {
        if (!req.body.clientProfile) {
            return next(new AppError('Client profile is required', 400));
        }
        filteredObj.clientProfile = filterObject(
            req.body.clientProfile,
            'companyName',
            'industry',
            'description',
            'website',
        );
    }

    // 🔹 Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    filteredObj.otp = otp;
    filteredObj.otpExpires = Date.now() + 10 * 60 * 1000;
    filteredObj.isVerified = false;

    // 🔹 Create User
    const newUser = await User.create(filteredObj);

    // 🔹 Send OTP Email
    try {
        await new Email(newUser, '').sendOTP(otp);

        res.status(200).json({
            status: 'success',
            message: 'تم إرسال رمز التحقق إلى بريدك الإلكتروني',
            email: newUser.email,
        });
    } catch (err) {
        newUser.otp = undefined;
        newUser.otpExpires = undefined;
        await newUser.save({ validateBeforeSave: false });

        return next(
            new AppError('حدث خطأ أثناء إرسال البريد الإلكتروني. حاول مرة أخرى لاحقاً!', 500),
        );
    }
});

exports.verifyOTP = catchAsync(async (req, res, next) => {
    const { email, otp } = req.body;

    const user = await User.findOne({
        email,
        otp,
        otpExpires: { $gt: Date.now() },
    });

    if (!user) {
        return next(new AppError('رمز التحقق غير صالح أو انتهت صلاحيته!', 400));
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;

    await user.save({ validateBeforeSave: false });

    const url = `${req.protocol}://${req.get('host')}/`;
    await new Email(user, url).sendWelcome();

    signTokenAndSend(user, res, 200);
});

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new AppError('Please provide email and password', 400));
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.doPasswordsMatch(password, user.password))) {
        return next(new AppError('Incorrect email or password', 401)); // 401 -> Unauthorized
    }
    if (!user.isVerified) {
        return res.status(403).json({
            status: 'fail',
            message: 'حسابك غير مفعل، يرجى إدخال كود التحقق.',
            actionRequired: 'VERIFY_OTP',
            email: user.email,
        });
    }

    // assign user a token to log him in and sending response
    signTokenAndSend(user, res, 200);
});

exports.resendOTP = catchAsync(async (req, res, next) => {
    const { email } = req.body;

    if (!email) {
        return next(new AppError('Please provide your email', 400));
    }

    const user = await User.findOne({ email });

    if (!user) {
        return next(new AppError('لا يوجد حساب بهذا البريد الإلكتروني', 404));
    }

    if (user.isVerified) {
        return next(new AppError('هذا الحساب مفعل بالفعل، يمكنك تسجيل الدخول', 400));
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000;

    await user.save({ validateBeforeSave: false });

    try {
        await new Email(user, '').sendOTP(otp);

        res.status(200).json({
            status: 'success',
            message: 'تم إرسال كود تحقق جديد إلى بريدك الإلكتروني',
        });
    } catch (err) {
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save({ validateBeforeSave: false });

        return next(
            new AppError('حدث خطأ أثناء إرسال البريد الإلكتروني. حاول مرة أخرى لاحقاً!', 500),
        );
    }
});
exports.logout = (req, res) => {
    res.cookie('jwt', 'loggedOut', {
        expires: new Date(Date.now() + 10 * 1000), // cookie expires after 10 seconds
        httpOnly: true,
    });

    res.status(200).json({
        status: 'success',
        message: 'Logged out successfully',
    });
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });

    // checking if user exists or not
    if (!user) return next(new AppError('No user with that email', 404)); // 404 -> Not Found

    const resetToken = await user.createPasswordResetToken();
    console.log(resetToken);

    // saves the hashed reset token on the user document
    await user.save({ validateBeforeSave: false });

    try {
        // sending the email to the user with the reset password token
        await new Email(user, resetToken).sendPasswordReset(); // *FIX LATER* should be url to reset password page or something like that

        return res.status(200).json({
            status: 'success',
            message: 'Please check your email for reset password token',
        });
    } catch (err) {
        user.resetPasswordToken = undefined;
        user.passwordResetExpires = undefined;

        await user.save({ validateBeforeSave: false });

        return next(new AppError('There was a problem sending the email. Try again later.', 500));
    }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
    const token = req.params.token;

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Finding the user by the token and checking if the user is correct and if it had expired
    const user = await User.findOne({
        resetPasswordToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
    });

    // Checking if user exists
    if (!user) return next(new AppError('Token is invalid or has expired', 404)); // 404 -> Not Found

    if (
        !req.body.password ||
        !req.body.passwordConfirm ||
        req.body.password !== req.body.passwordConfirm
    ) {
        return next(new AppError('Please enter matching password and passwordConfirm', 401));
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;

    user.resetPasswordToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save({ runValidators: true });

    // signing the user in
    return signTokenAndSend(user, res, 200);
});
