// models/User.js
const mongoose = require('mongoose');

// modules
const bcrypt = require('bcrypt');

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
      minlength: [8 , 'Password must be longer than 7 characters'],
      select: false
    },

    passwordConfirm: {
        type: String,
        required: true,
        validate: {
            validator(val){
                return val === this.password;
            },

            message: "Passwords MUST match"
        }
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

    passwordChangedAt: {
        type: Date,
    }

  },

  { timestamps: true },
);


userSchema.methods.doPasswordsMatch = async function (plainPassword , hashedPassword){
    return await bcrypt.compare(plainPassword , hashedPassword);
}

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  return false;
};

// document middleware to hash password before saving it , to not save passwordConfirm
userSchema.pre('save' , async function(){
    // if he has modified anything other than password , we don't wanna hash it again
    if(!this.isModified("password")) return;

    // other than than feel free to hash it (new user , modified password)
    this.password = await bcrypt.hash(this.password , 12);
    this.passwordConfirm = undefined;
})






module.exports = mongoose.model('User', userSchema);