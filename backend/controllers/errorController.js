const AppError = require('../utils/appError');

const handleErrorCastDB = (err) => {
    const message = `Invalid ${err.path} : ${err.value}`;
    return new AppError(message, 400);
};

const handleDuplicateDB = (err) => {
    const field = Object.keys(err.keyValue)[0];
    const value = Object.values(err.keyValue)[0];
    const message = `${field} "${value}" already exists. Please use another value.`;
    return new AppError(message, 400);
};

const handleValidatorErrorDB = (err) => {
    const errors = Object.values(err.errors).map((el) => el.message);
    const message = `Invalid data. ${errors.join('. ')}`;
    return new AppError(message, 400);
};
const handleJWTError = () => new AppError('Invalid Token please login in', 401);
const handleExpiredError = () => new AppError('your Token it expired please log in again ', 401);

const sendErrDev = (err, req, res) => {
    //API
    if (req.originalUrl.startsWith('/api')) {
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
            stack: err.stack,
            error: err,
        });
    }
    //Render website
    console.error('ERROR 💥', err);
    return res.status(err.statusCode).render('error', {
        title: 'Some went Wrong',
        msg: err.message,
    });
};

const sendErrProd = (err, req, res) => {
    // API errors
    if (req.originalUrl.startsWith('/api')) {
        if (err.isOperational) {
            return res.status(err.statusCode).json({
                status: err.status,
                message: err.message,
                data: null,
            });
        }

        console.error('ERROR 💥', err);

        return res.status(500).json({
            status: 'error',
            message: 'Something went wrong',
            data: null,
        });
    }

    // Rendered website errors
    if (err.isOperational) {
        return res.status(err.statusCode).render('error', {
            title: 'Something went wrong',
            msg: err.message,
        });
    }

    console.error('ERROR 💥', err);

    return res.status(500).render('error', {
        title: 'Something went wrong',
        msg: 'Something went wrong',
    });
};

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    const env = process.env.NODE_ENV.trim();
    if (env === 'development') {
        sendErrDev(err, req, res);
    } else if (env === 'production') {
        let error = {
            ...err,
            name: err.name ?? 'Error',
            message: err.message ?? 'Something went wrong!',
            code: err.code ?? 500,
            errmsg: err.errmsg ?? err.message ?? '',
        };

        if (error.name === 'CastError') error = handleErrorCastDB(error);
        if (error.code === 11000) error = handleDuplicateDB(error);
        if (error.name === 'ValidationError') error = handleValidatorErrorDB(error);
        if (error.name === 'JsonWebTokenError') error = handleJWTError();
        if (error.name === 'TokenExpiredError') error = handleExpiredError();

        sendErrProd(error, req, res);
    }
};
