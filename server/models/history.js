const mongoose = require("mongoose");

const historySchema = new mongoose.Schema({
    matchId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "match",
    },
    playerId: {
        type: Schema.Types.ObjectId,
        ref: "user",
    },
    historyMoves: {
        type: Array
    },
}, { timestamps: true });

module.exports = mongoose.model("history", historySchema);