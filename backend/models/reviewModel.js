const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.ObjectId,
      ref: 'Project',
      required: true,
      unique: true,
    },

    client: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },

    freelancer: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    comment: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

reviewSchema.pre(/^find/, function (next) {
  this.populate('client', 'name').populate('freelancer', 'name');

  next();
});

module.exports = mongoose.model('Review', reviewSchema);