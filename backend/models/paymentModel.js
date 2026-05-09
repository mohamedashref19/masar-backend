const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    milestone: {
      type: mongoose.Schema.ObjectId,
      ref: 'Milestone',
      required: [true, 'Payment must belong to a milestone'],
    },

    project: {
      type: mongoose.Schema.ObjectId,
      ref: 'Project',
      required: true,
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

    amount: {
      type: Number,
      required: [true, 'Payment must have an amount'],
      min: [1, 'Amount must be greater than 0'],
    },

    currency: {
      type: String,
      default: 'usd',
    },

    stripeSessionId: {
      type: String,
    },

    stripePaymentIntentId: {
      type: String,
    },

    status: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },

    paidAt: Date,
  },
  { timestamps: true }
);




paymentSchema.pre(/^find/, function () {
  this.populate('client', 'name email')
      .populate('freelancer', 'name email');
});

module.exports = mongoose.model('Payment', paymentSchema);