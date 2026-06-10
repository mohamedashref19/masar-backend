// utils
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

// Modules
const hpp = require('hpp');
const express = require('express');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

// Routers
const userRouter = require(`./routes/userRoutes`);
const proposalRouter = require(`./routes/proposalRoutes`);
const projectRouter = require(`./routes/projectRoutes`);
const reviewRouter = require('./routes/reviewRoutes');
const chatRouter = require('./routes/chatRoutes');
const paymentRouter = require('./routes/paymentRoutes');
const stripeConnectRouter = require('./routes/stripeConnectRoutes');
const aiRouter = require('./routes/aiRoutes');
const notificationRouter = require('./routes/notificationRoutes');



// Controllers
const paymentController = require('./controllers/paymentController');

const app = express();

//Security Middlewares
app.use(helmet());
app.use(
    cors({
        // لازم نحدد رابط الفرونت إند بتاعك بالظبط
        origin: 'http://localhost:5173',

        // السطر ده هو اللي هيحل مشكلة الـ Credential
        credentials: true,

        methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    }),
);


// Rate limiting
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

//Dev Logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}


app.post(
  '/api/v1/webhooks/stripe',
  express.raw({ type: 'application/json' }),
  paymentController.stripeWebhook
);

//  Body Parser
app.use(express.json({ limit: '10kb' }));

app.use(hpp());

// cookie parser
app.use(cookieParser(process.env.JWT_COOKIE_SECRET));

// sanitizes input
app.use(mongoSanitize());

//  Routes

app.use('/api/v1/ai', aiRouter);
app.use(`/api/v1/users`, userRouter);
app.use('/api/v1/proposals', proposalRouter);
app.use(`/api/v1/projects`, projectRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/chat', chatRouter);
app.use('/api/v1/payments', paymentRouter);
app.use('/api/v1/notifications', notificationRouter);
app.use('/api/v1/stripe-connect', stripeConnectRouter);

// Undefined Routes
app.all(/(.*)/, (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global Error Handler
app.use(globalErrorHandler);

module.exports = app;
