const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.createConnectAccount = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id).select('+stripeAccountId');

  if (!user) return next(new AppError('User not found', 404));

  if (!user.stripeAccountId) {
    const account = await stripe.accounts.create({
      type: 'express',
      email: user.email,
      capabilities: {
        transfers: { requested: true },
      },
    });

    user.stripeAccountId = account.id;
    await user.save({ validateBeforeSave: false });
  }

  const account = await stripe.accounts.retrieve(user.stripeAccountId);

  user.stripeOnboardingComplete =
    account.charges_enabled && account.payouts_enabled;

  await user.save({ validateBeforeSave: false });

  const accountLink = await stripe.accountLinks.create({
    account: user.stripeAccountId,
    refresh_url: `${process.env.CLIENT_URL}/stripe/refresh`,
    return_url: `${process.env.CLIENT_URL}/stripe/return`,
    type: 'account_onboarding',
  });

  res.status(200).json({
    status: 'success',
    data: {
      onboardingUrl: accountLink.url,
      onboardingComplete: user.stripeOnboardingComplete,
    },
  });
});