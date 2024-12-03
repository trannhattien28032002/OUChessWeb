
const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema({
    whiteId: {
        type: String,
        ref: "user",
    },
    blackId: {
        type: String,
        ref: "user",
    },
    matchName: {
        type: String
    },
    state: {
        type: Number
    },
    mode: {
        type: String
    },
    moves: {
        type: Array
    }
}, { timestamps: true });

module.exports = mongoose.model("match", matchSchema);