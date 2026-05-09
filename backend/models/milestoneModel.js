const mongoose = require('mongoose');

const milestoneSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.ObjectId,
      ref: 'Project',
      required: [true, 'Milestone must belong to a project'],
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

    title: {
      type: String,
      required: [true, 'Milestone must have a title'],
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    amount: {
      type: Number,
      required: [true, 'Milestone must have an amount'],
      min: [1, 'Amount must be greater than 0'],
    },

    status: {
      type: String,
      enum: [
        'pending_funding', // created but not paid
        'funded',          // client paid
        'submitted',       // freelancer submitted work
        'approved',        // client approved
        'released',        // money sent to freelancer
        'disputed',        // conflict
        'refunded',        // money returned to client
      ],
      default: 'pending_funding',
    },

    fundedAt: Date,
    submittedAt: Date,
    approvedAt: Date,
    releasedAt: Date,
  },
  { timestamps: true }
);


// 🔹 Populate references
milestoneSchema.pre(/^find/, function () {
  this.populate('client', 'name email')
      .populate('freelancer', 'name email');
});

module.exports = mongoose.model('Milestone', milestoneSchema);