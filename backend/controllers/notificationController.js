const Notification = require('../models/notificationModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getMyNotifications = catchAsync(async (req, res, next) => {
  const notifications = await Notification.find({ recipient: req.user._id })
    .sort('-createdAt')
    .populate('sender', 'name email role');

  res.status(200).json({
    status: 'success',
    results: notifications.length,
    data: { notifications },
  });
});

exports.getUnreadCount = catchAsync(async (req, res, next) => {
  const count = await Notification.countDocuments({
    recipient: req.user._id,
    isRead: false,
  });

  res.status(200).json({
    status: 'success',
    data: { unreadCount: count },
  });
});

exports.markNotificationAsRead = catchAsync(async (req, res, next) => {
  const notification = await Notification.findOne({
    _id: req.params.notificationId,
    recipient: req.user._id,
  });

  if (!notification) {
    return next(new AppError('Notification not found', 404));
  }

  notification.isRead = true;
  notification.readAt = Date.now();
  await notification.save();

  res.status(200).json({
    status: 'success',
    data: { notification },
  });
});

exports.markAllAsRead = catchAsync(async (req, res, next) => {
  await Notification.updateMany(
    {
      recipient: req.user._id,
      isRead: false,
    },
    {
      isRead: true,
      readAt: Date.now(),
    }
  );

  res.status(200).json({
    status: 'success',
    message: 'All notifications marked as read',
  });
});

exports.deleteNotification = catchAsync(async (req, res, next) => {
  const notification = await Notification.findOneAndDelete({
    _id: req.params.notificationId,
    recipient: req.user._id,
  });

  if (!notification) {
    return next(new AppError('Notification not found', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});