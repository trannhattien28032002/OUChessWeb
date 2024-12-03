const friend = require("../models/friend");

const friendRepository = {
    addFriend: async (friend) => {
        const newFriend = await friend.save();
        return newFriend.populate([
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
        ]);
    },
    updateFriend: async (requester, recipient, params) => {
        console.log(params);
        const updated = await friend
            .findOneAndUpdate(
                { requester: requester, recipient: recipient },
                {
                    $set: params,
                },
                { new: true },
            )
            .populate([
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
            ]);
        return updated;
    },
    removeFriend: async (requester, recipient) => {
        const removed = await friend.findOneAndRemove({ requester: requester, recipient: recipient });
        return removed.populate([
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
        ]);
    },
};

module.exports = friendRepository;
