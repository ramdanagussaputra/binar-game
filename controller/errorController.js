const AppError = require('../utils/appError');

const sendErrorDev = (err, res) => {
    const statusCode = err.statusCode || 500;
    const status = err.status || 'error';

    res.status(statusCode).json({
        err,
        status,
        message: err.message,
        stack: err.stack,
    });
};

const sendErrorProd = (err, res) => {
    const statusCode = err.statusCode || 500;
    const status = err.status || 'error';

    if (err.isOperational) {
        return res.status(statusCode).json({
            status,
            message: err.message,
        });
    }

    res.status(500).json({
        status: 'error',
        message: 'Something went wrong 🤯',
    });
};

const handleCastErrorDB = (err) => new AppError(`Invalid ${err.path}: ${err.value}`, 404);

const handleDuplicateErrorDB = (err) =>
    new AppError(`Duplicate value of ${err.keyValue.name}. Please try another name`, 400);

const handleValidationErrorDB = (err) => {
    const message = Object.values(err.errors)
        .map((errObj) => errObj.message)
        .join('. ');

    return new AppError(`Invalid input: ${message}`, 400);
};

const handleJWTError = () => new AppError('Invalid token, please login again', 401);

const handleJWTExpiresError = () =>
    new AppError('Token expires, please login again', 401);

module.exports = (err, req, res, next) => {
    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    }

    if (process.env.NODE_ENV === 'production') {
        let error = { ...err };

        if (err.name === 'CastError') error = handleCastErrorDB(error);
        if (err.code === 11000) error = handleDuplicateErrorDB(error);
        if (err.name === 'ValidationError') error = handleValidationErrorDB(error);
        if (err.name === 'JsonWebTokenError') error = handleJWTError();
        if (err.name === 'TokenExpiredError') error = handleJWTExpiresError();

        sendErrorProd(error, res);
    }
};
