const axios = require('axios');
const User = require('../model/userModel');
const Biodata = require('../model/biodataModel');
const History = require('../model/historyModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const response = require('../utils/response');

exports.createUser = catchAsync(async (req, res, next) => {
    const biodataClient = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        age: req.body.age,
        born: req.body.born,
        gender: req.body.gender,
        address: req.body.address,
    };

    const biodata = await Biodata.create(biodataClient);
    if (!biodata) throw new AppError('Invalid biodata input', 400);

    console.log(biodata._id);

    const userClient = {
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        biodata: biodata._id,
    };

    const user = await User.create(userClient);
    if (!user) throw new AppError('Invalid user input', 400);

    const fulluser = await User.findById(user._id);
    console.log(fulluser);
    console.log(user._id);
    response.sendRes(res, fulluser);
});

exports.getUsers = catchAsync(async (req, res, next) => {
    const Users = await User.find();

    response.sendResResult(res, Users);
});

exports.getUser = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) throw new AppError('User not found', 404);

    response.sendRes(res, user);
});

exports.updateUser = catchAsync(async (req, res) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    if (!user) throw new AppError('User does not exist', 404);

    let userUpdated = user;
    if (req.body.password) {
        user.password = req.body.password;
        userUpdated = await user.save();
    }

    response.sendRes(res, userUpdated);
});

exports.deleteUser = catchAsync(async (req, res, next) => {
    const response = await axios.get(
        `http://localhost:7000/api/user-game/${req.params.id}`
    );

    // prettier-ignore
    const {biodata: { _id: biodataId }} = response.data.data.data;

    await History.deleteMany({ user: req.params.id });
    await Biodata.findByIdAndDelete(biodataId);
    await User.findByIdAndDelete(req.params.id);

    await res.status(204).json({
        status: 'success',
    });
});
