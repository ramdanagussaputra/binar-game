const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
    win: {
        type: Number,
        required: [true, 'User game history must include a win data'],
    },
    lose: {
        type: Number,
        required: [true, 'User game history must include a lose data'],
    },
    draw: {
        type: Number,
        required: [true, 'User game history must include a draw data'],
    },
    date: {
        type: Date,
        required: [true, 'User game history must have a date'],
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
    },
});

const History = mongoose.model('History', historySchema);

module.exports = History;
