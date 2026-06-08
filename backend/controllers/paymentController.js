const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
// const stripe = require('stripe')('sk_test_dummy_key_123');

const Milestone = require('../models/milestoneModel');
const Payment = require('../models/paymentModel');

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const User = require('../models/userModel');
const Email = require('../utils/email');

exports.fundMilestone = catchAsync(async (req, res, next) => {
    const milestone = await Milestone.findById(req.params.milestoneId);

    if (!milestone) {
        return next(new AppError('No milestone found with that ID', 404));
    }

    if (milestone.client._id.toString() !== req.user._id.toString()) {
        return next(new AppError('You are not authorized to fund this milestone', 403));
    }

    if (milestone.status !== 'pending_funding') {
        return next(new AppError('This milestone cannot be funded', 400));
    }

    const existingPayment = await Payment.findOne({
        milestone: milestone._id,
        status: { $in: ['pending', 'paid', 'released'] },
    });

    if (existingPayment) {
        return next(new AppError('This milestone already has a payment', 400));
    }

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        customer_email: req.user.email,
        success_url: `${process.env.CLIENT_URL}/payment-success`,
        cancel_url: `${process.env.CLIENT_URL}/payment-cancel`,

        line_items: [
            {
                price_data: {
                    currency: 'usd',
                    unit_amount: Math.round(milestone.amount * 100),
                    product_data: {
                        name: milestone.title,
                        description: milestone.description || 'Milestone payment',
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

    res.status(200).json({
        status: 'success',
        data: {
            checkoutUrl: session.url,
        },
    });
});

exports.stripeWebhook = async (req, res) => {
    const signature = req.headers['stripe-signature'];

    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET,
        );
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // ✅ SUCCESS CASE
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;

        const payment = await Payment.findOne({
            stripeSessionId: session.id,
        });

        if (payment && payment.status !== 'paid') {
            payment.status = 'paid';
            payment.stripePaymentIntentId = session.payment_intent;
            payment.paidAt = Date.now();
            await payment.save();

            const milestone = await Milestone.findById(payment.milestone);

            if (milestone && milestone.status === 'pending_funding') {
                milestone.status = 'funded';
                milestone.fundedAt = Date.now();
                await milestone.save();
                try {
                    const freelancer = await User.findById(payment.freelancer);

                    if (freelancer && freelancer.email) {
                        const url = `${req.protocol}://${req.get('host')}/projects/${payment.project}`;

                        await new Email(freelancer, url).sendMilestoneFunded(
                            payment.amount,
                            milestone.title,
                        );
                    }
                } catch (error) {
                    console.error('❌ Failed to send Webhook Funding Email:', error);
                }
            }
        }
    }

    // failure case
    if (event.type === 'payment_intent.payment_failed') {
        const paymentIntent = event.data.object;

        await Payment.findOneAndUpdate(
            { stripePaymentIntentId: paymentIntent.id },
            { status: 'failed' },
        );
    }

    res.status(200).json({ received: true });
};

exports.releaseMilestonePayment = catchAsync(async (req, res, next) => {
    const milestone = await Milestone.findById(req.params.milestoneId);

    if (!milestone) {
        return next(new AppError('No milestone found with that ID', 404));
    }

    if (milestone.client._id.toString() !== req.user._id.toString()) {
        return next(new AppError('You are not authorized to release this payment', 403));
    }

    if (milestone.status !== 'approved') {
        return next(new AppError('Only approved milestones can be released', 400));
    }

    const payment = await Payment.findOne({
        milestone: milestone._id,
        status: 'paid',
    });

    if (!payment) {
        return next(new AppError('No paid payment found for this milestone', 404));
    }

    const freelancer = await User.findById(milestone.freelancer._id).select(
        '+stripeAccountId stripeOnboardingComplete name email',
    );

    if (!freelancer || !freelancer.stripeAccountId || !freelancer.stripeOnboardingComplete) {
        return next(new AppError('Freelancer has not completed Stripe onboarding', 400));
    }

    const platformFee = Math.round(payment.amount * 0.1 * 100);
    const transferAmount = Math.round(payment.amount * 100) - platformFee;

    const transfer = await stripe.transfers.create({
        amount: transferAmount,
        currency: payment.currency,
        destination: freelancer.stripeAccountId,
        metadata: {
            milestoneId: milestone._id.toString(),
            paymentId: payment._id.toString(),
        },
    });

    milestone.status = 'released';
    milestone.releasedAt = Date.now();
    await milestone.save();

    payment.status = 'released';
    payment.releasedAt = Date.now();
    payment.stripeTransferId = transfer.id;
    payment.platformFee = platformFee / 100;
    await payment.save();

    try {
        const url = `${req.protocol}://${req.get('host')}/wallet`;

        await new Email(freelancer, url).sendPaymentReleased(payment.amount, milestone.title);
    } catch (error) {
        console.error('❌ Failed to send Payment Released Email:', error);
    }

    res.status(200).json({
        status: 'success',
        message: 'Payment released to freelancer successfully',
        data: {
            milestone,
            payment,
        },
    });
});
