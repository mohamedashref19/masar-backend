module.exports = (io) => {
    io.on('connection', (socket) => {
        //1. Join Room
        socket.on('joinRoom', (conversationId) => {
            socket.join(conversationId);
        });

        // ─── 2. Send Message (Broadcasting Only)
        // the socket is simply a "postman" "ساعى بريد" receiving the message that has already been stored in the API and distributing it.
        socket.on('sendMessage', (messageData) => {
            // messageData is the complete message that was returned from the POST request
            socket.to(messageData.conversation).emit('newMessage', messageData);
        });

        // 3. Typing Indicator
        socket.on('typing', ({ conversationId, userId }) => {
            socket.to(conversationId).emit('userTyping', { userId });
        });

        socket.on('stopTyping', ({ conversationId, userId }) => {
            socket.to(conversationId).emit('userStoppedTyping', { userId });
        });

        // ─── 4. Mark as Read (Broadcasting Only)
        // When the user opens the chat (and makes a GET request that results in isRead: true)
        //FrontEnd will send this event so the other person can see the Seen badge immediately.
        socket.on('markRead', ({ conversationId, userId }) => {
            socket.to(conversationId).emit('messagesRead', { conversationId, userId });
        });

        // ─── 5. Leave Room
        socket.on('leaveRoom', (conversationId) => {
            socket.leave(conversationId);
        });

        // ─── 6. Disconnect
        socket.on('disconnect', () => {
            console.log(`❌ User disconnected: ${socket.id}`);
        });
    });
};
