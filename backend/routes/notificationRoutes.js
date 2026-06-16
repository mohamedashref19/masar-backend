const express = require('express');

const authController = require('../controllers/authController');
const notificationController = require('../controllers/notificationController');

const router = express.Router();

router.use(authController.protect);

router.get('/', notificationController.getMyNotifications);
router.get('/unread-count', notificationController.getUnreadCount);
router.patch('/mark-all-read', notificationController.markAllAsRead);
router.patch('/:notificationId/read', notificationController.markNotificationAsRead);
router.delete('/:notificationId', notificationController.deleteNotification);

module.exports = router;
