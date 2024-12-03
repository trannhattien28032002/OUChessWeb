const user = require("../models/user");
const jwt = require("jsonwebtoken");

const jwtHandler = {
    createToken: (curUser) => {
        const token = jwt.sign(
            {
                _id: curUser._id,
                username: curUser.username,
                email: curUser.email,
                role: curUser.role
            },
            process.env.JWT_SECRETKEY,
            {
                expiresIn: "7d"
            }
        );
        return token;
    }
}

module.exports = jwtHandler;