const Conversation = require('../models/conversationModel');
const Message = require('../models/messageModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const createNotification = require('../utils/createNotification');


//Bring all the conversations of the user who is logged in
exports.getMyConversations = catchAsync(async (req, res, next) => {
    const userId = req.user._id;

    const conversations = await Conversation.find({
        $or: [{ client: userId }, { freelancer: userId }],
    })
        .populate('project', 'title')
        .populate('client', 'name')
        .populate('freelancer', 'name')
        .populate('lastMessage', 'content createdAt')
        .sort('-lastMessageAt');

    res.status(200).json({
        status: 'success',
        results: conversations.length,
        data: { conversations },
    });
});

exports.getOrCreateConversation = catchAsync(async (req, res, next) => {
    const { projectId, freelancerId } = req.body;
    const clientId = req.user._id;
    let conversation = await Conversation.findOne({
        project: projectId,
        client: clientId,
        freelancer: freelancerId,
    });

    if (!conversation) {
        conversation = await Conversation.create({
            project: projectId,
            client: clientId,
            freelancer: freelancerId,
        });
    }
    res.status(200).json({
        status: 'success',
        data: { conversation },
    });
});

//Get all the messages in a specific conversation and mark them as Seen

exports.getMessages = catchAsync(async (req, res, next) => {
    const { conversationId } = req.params;
    const userId = req.user._id;
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) return next(new AppError('Conversation not found', 404));
    const isMember =
        conversation.client.toString() === userId.toString() ||
        conversation.freelancer.toString() === userId.toString();
    if (!isMember) return next(new AppError('You are not part of this conversation', 403));

    const messages = await Message.find({ conversation: conversationId })
        .populate('sender', 'name')
        .sort('createdAt');

    //mark messages as read
    await Message.updateMany(
        { conversation: conversationId, sender: { $ne: userId }, isRead: false },
        { isRead: true },
    );

    res.status(200).json({
        status: 'success',
        results: messages.length,
        data: { messages },
    });
});

exports.sendMessage = catchAsync(async (req, res, next) => {
    const { conversationId } = req.params;
    const { content } = req.body;
    const userId = req.user._id;
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) return next(new AppError('Conversation not found', 404));

    const isMember =
        conversation.client.toString() === userId.toString() ||
        conversation.freelancer.toString() === userId.toString();

    if (!isMember) return next(new AppError('You are not part of this conversation', 403));

    const newMessage = await Message.create({
        conversation: conversationId,
        sender: userId,
        content,
    });

    conversation.lastMessage = newMessage._id;
    conversation.lastMessageAt = Date.now();
    await conversation.save();

    const receiverId = conversation.client.toString() === userId.toString() ? conversation.freelancer : conversation.client;

    await createNotification({
        recipient: receiverId,
        sender: userId,
        type: 'message_received',
        title: 'New message',
        message: 'You received a new message.',
    });

    res.status(201).json({
        status: 'success',
        data: { message: newMessage },
    });
});
