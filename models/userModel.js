// models/User.js
const mongoose = require('mongoose');

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
    fullName: {
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
    },

    password: {
      type: String,
      required: true,
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
  },

  { timestamps: true },
);






module.exports = mongoose.model('User', userSchema);