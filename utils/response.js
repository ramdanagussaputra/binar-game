exports.sendRes = (res, data) => {
    res.status(200).json({
        status: 'success',
        data: {
            data,
        },
    });
};

exports.sendResResult = (res, data) => {
    res.status(200).json({
        status: 'success',
        result: data.length,
        data: {
            data,
        },
    });
};
