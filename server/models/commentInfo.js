const mongoose = require("mongoose");

const commentInfoSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            required: true,
        },
        receiver: {
            type: String,
            required: true,
            ref: "user",
        },
        sender: {
            type: String,
            required: true,
            ref: "user",
        },
    },
    { timestamps: true },
);

module.exports = mongoose.model("commentInfo", commentInfoSchema);