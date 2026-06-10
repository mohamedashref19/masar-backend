const Notification = require('../models/notificationModel');

const createNotification = async ({
  recipient,
  sender,
  type,
  title,
  message,
  relatedProject,
  relatedMilestone,
  relatedProposal,
}) => {
  return await Notification.create({
    recipient,
    sender,
    type,
    title,
    message,
    relatedProject,
    relatedMilestone,
    relatedProposal,
  });
};

module.exports = createNotification;