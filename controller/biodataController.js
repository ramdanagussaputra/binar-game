const Biodata = require('../model/biodataModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const response = require('../utils/response');

exports.getBiodatas = catchAsync(async (req, res) => {
    const biodatas = await Biodata.find();

    response.sendResResult(res, biodatas);
});

exports.getBiodata = catchAsync(async (req, res) => {
    const biodata = await Biodata.findById(req.params.id);

    response.sendRes(res, biodata);
});

exports.updateBiodata = catchAsync(async (req, res) => {
    const biodata = await Biodata.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    response.sendRes(res, biodata);
});
