const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: [true, "Tài khoản đã tồn tại"]
    },
    password: {
        type: String,
        required: true,
    },
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    dateOfBirth: {
        type: Date
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    phone: {
        type: Number,
        require: true,
        unique: true
    },
    nation: {
        type: String
    },
    avatar: {
        type: String
    },
    elo: {
        type: Number,
        default: 500
    },
    role: {
        type: String,
        default: "PLAYER"
    },
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "friend"
    }],
    deletedAt: {
        type: Date
    }
}, {timestamps: true});

module.exports = mongoose.model("user", userSchema);