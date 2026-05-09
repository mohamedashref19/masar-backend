const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Models
const Milestone = require('../models/milestoneModel');
const Payment = require('../models/paymentModel');

// Utils
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');


exports.stripeWebhook = async (req, res) => {
  const signature = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    const payment = await Payment.findOne({
      stripeSessionId: session.id,
    });

    if (!payment) {
      return res.status(404).json({
        status: 'fail',
        message: 'Payment not found',
      });
    }

    if (payment.status === 'paid') {
      return res.status(200).json({ received: true });
    }

    payment.status = 'paid';
    payment.stripePaymentIntentId = session.payment_intent;
    payment.paidAt = Date.now();
    await payment.save();

    const milestone = await Milestone.findById(payment.milestone);

    if (milestone) {
      milestone.status = 'funded';
      milestone.fundedAt = Date.now();
      await milestone.save();
    }
  }

  return res.status(200).json({ received: true });
};

exports.fundMilestone = catchAsync(async (req, res, next) => {
    const milestone = await Milestone.findById(req.params.milestoneId);

    // 1) Check milestone exists
    if (!milestone) {
        return next(new AppError('No milestone found with that ID', 404));
    }

    // 2) Check user is the client
    if (milestone.client.toString() !== req.user._id.toString()) {
        return next(new AppError('You are not authorized to fund this milestone', 403));
    }

    // 3) Check status
    if (milestone.status !== 'pending_funding') {
        return next(new AppError('This milestone cannot be funded', 400));
    }

    // 4) Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        success_url: `${process.env.CLIENT_URL}/success`,
        cancel_url: `${process.env.CLIENT_URL}/cancel`,
        customer_email: req.user.email,

        line_items: [
            {
                price_data: {
                    currency: 'usd',
                    unit_amount: milestone.amount * 100, // cents
                    product_data: {
                        name: milestone.title,
                        description: milestone.description,
                    },
                },
                quantity: 1,
            },
        ],

        metadata: {
            milestoneId: milestone._id.toString(),
            clientId: req.user._id.toString(),
        },
    });

    // 5) Create Payment document
    await Payment.create({
        milestone: milestone._id,
        project: milestone.project,
        client: milestone.client,
        freelancer: milestone.freelancer,
        amount: milestone.amount,
        currency: 'usd',
        stripeSessionId: session.id,
        status: 'pending',
    });

    // 6) Send checkout URL
    return res.status(200).json({
        status: 'success',
        checkoutUrl: session.url,
    });
});