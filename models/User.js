const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    win: {
        type: Number,
        required: true,
        default: 0
    },
    loss: {
        type: Number,
        required: true,
        default: 0
    },
    tie: {
        type: Number,
        required: true,
        default: 0
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        required: true,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema);