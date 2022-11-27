const axios = require('axios');
const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const response = require('../utils/response');
const Biodata = require('../model/biodataModel');
const User = require('../model/userModel');

const signJWT = (id) =>
    jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES,
    });

const verifyJWT = (token) => jwt.verify(token, process.env.JWT_SECRET);

const createSendJWT = (res, data) => {
    const token = signJWT(data._id);

    const cookiesOps = {
        expires: new Date(Date.now() + +process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
        httpOnly: true,
    };

    if (process.env.NODE_ENV === 'production') cookiesOps.secure = true;
    res.cookie('jwt', token, cookiesOps);

    data.password = undefined;

    res.status(200).json({
        status: 'success',
        token,
        data: {
            data,
        },
    });
};

exports.signup = catchAsync(async (req, res, next) => {
    const biodataClient = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        age: req.body.age,
        born: req.body.born,
        gender: req.body.gender,
        address: req.body.address,
    };

    const biodata = await Biodata.create(biodataClient);
    if (!biodata) throw new AppError('Invalid signup input', 400);

    console.log(biodata._id);

    const userClient = {
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        biodata: biodata._id,
    };

    const user = await User.create(userClient);
    if (!user) throw new AppError('Invalid signup input', 400);

    const fulluser = await User.findById(user._id).populate('biodata');

    response.sendRes(res, fulluser);
});

exports.login = catchAsync(async (req, res, next) => {
    // Check if password and username exist
    if (!req.body.username || !req.body.password)
        throw new AppError('Input your username and password');

    // Find user with username
    const user = await User.findOne({ username: req.body.username }).select('+password');

    // Check if password and username correct
    if (!user || !(await user.checkPassword(req.body.password, user.password)))
        throw new AppError('Wrong username or password', 404);

    console.log(user, user._id);
    createSendJWT(res, user);
});

exports.protect = catchAsync(async (req, res, next) => {
    // Check if token exist
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer'))
        throw new AppError('Token does not exist. Please login first!', 404);

    // Verify token
    const token = req.headers.authorization.split(' ');
    const decoded = verifyJWT(token[1], process.env.JWT_SECRET);

    // Check if user still exist
    const user = await User.findById(decoded.id);
    if (!user)
        throw new AppError('User belong to the token not exist. Please login again', 401);

    req.user = user;
    next();
});

exports.restrictTo =
    (...allowed) =>
    (req, res, next) => {
        if (!allowed.includes(req.user.role))
            throw new AppError('You have no access to this route', 403);

        next();
    };
