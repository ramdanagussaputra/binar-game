const mongoose = require('mongoose');

const biodataSchema = new mongoose.Schema({
    firstName: {
        type: String,
        trim: true,
        required: [true, 'User biodata must have a first name'],
    },
    lastName: {
        type: String,
        trim: true,
        required: [true, 'User biodata must have a last name'],
    },
    age: {
        type: Number,
        required: [true, 'User biodata must have an age'],
    },
    born: {
        type: Date,
        required: [true, 'User biodata must have a born date'],
    },
    gender: {
        type: String,
        trim: true,
        required: [true, 'User biodata must have a gender'],
        enum: {
            values: ['male', 'female'],
            message: 'User biodata must male of female',
        },
    },
    address: {
        type: String,
        trim: true,
        required: [true, 'User biodata must have an address'],
    },
});

const Biodata = mongoose.model('Biodata', biodataSchema);

module.exports = Biodata;
