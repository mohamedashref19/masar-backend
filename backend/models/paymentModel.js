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
      required: true,
      min: [1, 'Amount must be greater than 0'],
    },

    currency: {
      type: String,
      default: 'usd',
    },

    stripeSessionId: String,
    stripePaymentIntentId: String,

    status: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'released', 'refunded'],
      default: 'pending',
    },

    stripeTransferId: String,

    platformFee: {
      type: Number,
      default: 0,
    },

    paidAt: Date,
    releasedAt: Date,
  },
  { timestamps: true }
);

paymentSchema.index({ stripeSessionId: 1 });
paymentSchema.index({ milestone: 1 });

module.exports = mongoose.model('Payment', paymentSchema);