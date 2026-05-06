// Modules
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const validator = require('validator');

const freelancerProfileSchema = new mongoose.Schema(
    {
        title: String,

        bio: String,

        skills: [String],

        experienceLevel: {
            type: String,
            enum: ['beginner', 'intermediate', 'expert'],
            default: 'beginner',
        },

        portfolioLinks: [String],

        githubLink: String,

        hourlyRate: Number,

        rating: {
            type: Number,
            default: 0,
        },
    },

    { _id: false },
);

const clientProfileSchema = new mongoose.Schema(
    {
        companyName: String,

        industry: String,

        description: String,

        website: String,
    },

    { _id: false },
);

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            validate: [validator.isEmail, 'Please provide a valid email'],
        },

        password: {
            type: String,
            required: true,
            minlength: [8, 'Password must be longer than 7 characters'],
            select: false,
        },

        passwordConfirm: {
            type: String,
            required: true,
            validate: {
                validator(val) {
                    return val === this.password;
                },

                message: 'Passwords MUST match',
            },
        },

        role: {
            type: String,
            enum: ['client', 'freelancer', 'admin'],
            required: true,
        },

        phone: String,

        profileImage: String,

        freelancerProfile: freelancerProfileSchema,

        clientProfile: clientProfileSchema,

        isVerified: {
            type: Boolean,
            default: false,
        },
        otp: {
            type: String,
            select: false,
        },
        otpExpires: {
            type: Date,
            select: false,
        },
        passwordChangedAt: {
            type: Date,
        },

        resetPasswordToken: {
            type: String,
            select: false
        },

        passwordResetExpires: {
            type: Date,
            select: false
        },

        active: {
            type: Boolean,
            default: true,
            select: false,
        },
    },

    { timestamps: true },
);

userSchema.methods.doPasswordsMatch = async function (plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);

        return JWTTimestamp < changedTimestamp;
    }

    return false;
};

userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetExpires = Date.now() + 10 * 1000 * 60; // Expires in 10 minutes

    return resetToken;
};

// document middleware to hash password before saving it , to not save passwordConfirm
userSchema.pre('save', async function () {
    // if he has modified anything other than password , we don't wanna hash it again
    if (!this.isModified('password')) return;

    // other than than feel free to hash it (new user , modified password)
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
});

// setting the time of last changed password
userSchema.pre('save', function () {
    if (!this.isModified('password') || this.isNew) return;

    this.passwordChangedAt = Date.now() - 1000;
});

// don't select users who have been soft deleted
userSchema.pre(/^find/, async function () {
    this.find({ active: { $ne: false } });
});

module.exports = mongoose.model('User', userSchema);
