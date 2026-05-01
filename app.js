const express        = require("express");
const cors           = require("cors");
const helmet         = require("helmet");
const morgan         = require("morgan");
const mongoSanitize  = require("express-mongo-sanitize");
const hpp            = require("hpp");
const rateLimit      = require("express-rate-limit");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");

// Routes imports


const app = express();

//Security Middlewares 
app.use(helmet());
app.use(cors());
app.use(mongoSanitize());
app.use(hpp());      

// Rate limiting
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000, 
  message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/api", limiter);

//Dev Logging 
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//  Body Parser 
app.use(express.json({ limit: "10kb" }));

//  Routes 


// Undefined Routes 
app.all(/(.*)/, (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global Error Handler 
app.use(globalErrorHandler);

module.exports = app;