const History = require('../model/historyModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const response = require('../utils/response');

exports.createHistory = catchAsync(async (req, res, next) => {
    req.body.user = req.params.userId;

    const history = await History.create(req.body);
    if (!history) throw new AppError('Invalid history input', 400);

    response.sendRes(res, history);
});

exports.getHistories = catchAsync(async (req, res, next) => {
    const filterUser = req.params.userId ? { user: req.params.userId } : {};
    const histories = await History.find(filterUser);

    response.sendResResult(res, histories);
});

exports.getHistory = catchAsync(async (req, res, next) => {
    const history = await History.find(req.params.id);
    if (!history) throw new AppError('history not found', 404);

    response.sendRes(res, history);
});

exports.updateHistory = catchAsync(async (req, res, next) => {
    const history = await History.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    if (!history) throw new AppError('history not found', 404);

    response.sendRes(res, history);
});
