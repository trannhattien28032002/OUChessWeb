const user = require("../models/user");
const bcrypt = require("bcrypt");

const userReposity = {
    getUserByID: async (_id) => {
        try {
            const User = await user.findOne({
                _id: _id,
            });
            return User;
        } catch (error) {
            console.log(error);
            return null;
        }
    },
    getUser: async (params) => {
        try {
            let searchParams = [{ username: params }, { email: params }];
            if (!isNaN(params)) {
                searchParams.push({ phone: params });
            }

            const User = await user
                .findOne({
                    $or: searchParams,
                })
                .populate({
                    path: "friends",
                    populate: [
                        {
                            path: "requester",
                            model: "user",
                            select: "_id username avatar",
                        },
                        {
                            path: "recipient",
                            model: "user",
                            select: "_id username avatar",
                        },
                    ],
                });
            return User;
        } catch (error) {
            console.log(error);
            return null;
        }
    },
    getUsers: async (params) => {
        try {
            let searchParams = {};
            console.log(params);
            const email = params.email || null;
            if (email !== null && email !== "") {
                searchParams.email = email;
            }
            const username = params.username || null;
            if (username !== null && username !== "") {
                searchParams.username = { $regex: username, $options: "i" };
            }
            const phone = params.phone || null;
            if (phone !== null && phone !== "") {
                searchParams.phone = phone;
            }

            const list = await user
                .find(searchParams, "_id username firstName lastName avatar elo nation dateOfBirth createdAt")
                .exec();

            return list;
        } catch (error) {
            console.log(error);
            return null;
        }
    },
    getExistUser: async (username, params) => {
        try {
            let searchParams = [{ email: params }];
            if (!isNaN(params)) {
                searchParams.push({ phone: params });
            }

            const User = await user
                .findOne({
                    username: { $ne: username },
                    $or: searchParams,
                })
                .populate("friends");
            return User;
        } catch (error) {
            console.log(error);
            return null;
        }
    },
    addUser: async (User) => {
        const newUser = await User.save();
        return newUser;
    },
    updateUser: async (username, changed) => {
        try {
            const state = await user.updateOne(
                {
                    $or: [{ username: username }, { email: username }],
                },
                {
                    $set: changed,
                },
            );
            return state;
        } catch (error) {
            return null;
        }
    },
    deleteUser: async (username) => { },
    countUsser: async (field, data) => {
        const count = await user.countDocuments({ [field]: data });
        return count;
    },
    updateFriend: async (_id, friendId) => {
        const updated = await user.findOneAndUpdate(
            {
                _id: _id,
            },
            {
                $push: { friends: friendId },
            },
            {
                new: true,
            },
        );
        return updated;
    },
    removeFriend: async (_id, friendId) => {
        const after = await user.findOneAndUpdate(
            {
                _id: _id,
            },
            {
                $pull: { friends: friendId },
            },
            {
                new: true,
            },
        );
        return after;
    },
    getListUserByUsername: async (kw) => {
        const list = await user.find(
            { username: { $regex: kw, $options: "i" } },
            "_id firstName lastName username elo nation avatar",
        );

        return list;
    },
    getListUserFromAdmin: async (params) => {
        const list = await user
            .find({ username: { $regex: params.username, $options: "i" } })
            .sort({ role: 1, createdAt: -1 });

        return list;
    },
    updateUserFromAdmin: async (username, changed) => {
        const after = await user.findOneAndUpdate({ username: username }, { $set: changed }, { new: true });
        return after;
    },
    deleteUserFromAdmin: async (username) => {
        return await user.findOneAndUpdate({ username: username }, { $set: { deletedAt: Date.now() } }, { new: true });
    },
    isExistEmail: async (email) => {
        try {
            const User = await user.findOne({
                email: email,
            });
            return User;
        } catch (error) {
            return null;
        }
    }
};

module.exports = userReposity;
