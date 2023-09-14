const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
    winner: {
        type: String,
        required: true
    },
    loser: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    lobbyId: {
        type: String,
        required: true
    },
    ranked: {
        type: Boolean,
        required: true
    },
    board: {
        type: Array,
        required: true
    },
    tie: {
        type: Boolean,
        required: true
    }
});

module.exports = mongoose.model('Match', matchSchema, "match_history");