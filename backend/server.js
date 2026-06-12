const mongoose = require('mongoose');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
dotenv.config({ path: './config.env' });

const app = require('./app');

const DB = process.env.DATABASE.replace('<db_username>', process.env.DATABASE_USERNAME).replace(
    '<db_password>',
    process.env.DATABASE_PASSWORD,
);

mongoose.set('strictQuery', false);
mongoose
    .connect(DB, { family: 4 })
    .then(() => console.log('DB connection successful!'))
    .catch((err) => console.log('DB connection FAILED!!', err));

const server = http.createServer(app);

// Socket.io
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});

// ─── Chat Socket Logic
const chatSocket = require('./sockets/chatSocket');
chatSocket(io);

const port = process.env.PORT || 3000;

server.listen(port, () => {
    console.log(`App running on port ${port}... 🚀`);
});
