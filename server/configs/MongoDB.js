const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

const MongoDB = {
    connectoDb: async () => {
        await mongoose
            .connect(process.env.MONGODB_URI)
            .then(() => {
                console.log("Connected with Database");
            })
            .catch((error) => {
                console.log("Error: \n", error);
            });
    },
};

module.exports = MongoDB;
