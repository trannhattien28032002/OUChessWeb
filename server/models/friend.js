const mongoose = require("mongoose");

const friendShipSchema = new mongoose.Schema(
    {
        requester: {
            type: String,
            required: true,
            ref: "user",
        },
        recipient: {
            type: String,
            required: true,
            ref: "user",
        },
        status: {
            type: Number,
            enum: [0, 1, 2],
        },
    },
    { timestamps: true },
);

module.exports = mongoose.model("friend", friendShipSchema);
