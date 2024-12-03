const db = require("mongoose");
const friend = require("../models/friend");
const friendRepository = require("../repositories/friendRepository");
const userService = require("./userService");

const friendService = {
    addFriend: async (requester, recipient, status) => {
        const newFriend = new friend({
            requester: requester,
            recipient: recipient,
            status: status,
        });
        return await friendRepository.addFriend(newFriend);
    },
    updateStatusFriend: async (requester, recipient, status) => {
        return await friendRepository.updateFriend(requester, recipient, { status: status });
    },
    removeFriend: async (requester, recipient) => {
        return await friendRepository.removeFriend(requester, recipient);
    },
};

const friendSocket = (socket, io, online) => {
    socket.on("addFriend", async (requester, recipient, callback = (success) => { }) => {
        console.log(requester, recipient);
        const session = await db.startSession();
        await session.startTransaction();

        try {
            const f1 = await friendService.addFriend(requester, recipient, 0);
            const f2 = await friendService.addFriend(recipient, requester, 1);

            await userService.addFriend(requester, f1._id);
            await userService.addFriend(recipient, f2._id);
            callback(true);
            const socketId = online[recipient];
            console.log(f2);
            if (socketId) {
                io.to(socketId).emit("addRequest", f2);
            }
            await session.commitTransaction();
        } catch (error) {
            console.log(error);
            callback(false);
            await session.abortTransaction();
        } finally {
            session.endSession();
        }
    });

    socket.on("acceptFriend", async (friend) => {
        const session = await db.startSession();
        await session.startTransaction();

        try {
            const userA = await friendService.updateStatusFriend(friend.requester._id, friend.recipient._id, 2);
            const userB = await friendService.updateStatusFriend(friend.recipient._id, friend.requester._id, 2);

            const recipient = friend.recipient._id;
            const socketId = online[recipient];
            if (socketId) {
                io.to(socketId).emit("acceptedRequest", userB);
            }

            socket.emit("removeRequest", userA);

            await session.commitTransaction();
        } catch (error) {
            console.log(error);
            await session.abortTransaction();
            socket.emit("error_msg", "Đã có lỗi xảy ra");
        } finally {
            session.endSession();
        }
    });

    socket.on("rejectFriend", async (friend) => {
        const session = await db.startSession();
        await session.startTransaction();

        try {
            const f1 = await friendService.removeFriend(friend.requester._id, friend.recipient._id);
            const f2 = await friendService.removeFriend(friend.recipient._id, friend.requester._id);

            await userService.removeFriend(friend.requester._id, f1._id);
            await userService.removeFriend(friend.recipient._id, f2._id);

            console.log(f1);
            socket.emit("removeRequest", f1);
            await session.commitTransaction();
        } catch (error) {
            console.log(error);
            socket.emit("error_msg", "Đã có lỗi xảy ra");
        } finally {
            session.endSession();
        }
    });
};

module.exports = { friendService, friendSocket };
