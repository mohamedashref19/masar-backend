const express = require('express');
const chatController = require('../controllers/chatController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);
//Conversations
router
    .route('/conversations')
    .get(chatController.getMyConversations)
    .post(authController.restrictTo('client'), chatController.getOrCreateConversation);

//Messages
router
    .route('/conversations/:conversationId/messages')
    .get(chatController.getMessages)
    .post(chatController.sendMessage);

module.exports = router;
