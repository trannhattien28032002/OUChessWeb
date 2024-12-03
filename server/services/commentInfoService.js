const commentInfo = require("../models/commentInfo");
const commentInfoRepository = require("../repositories/commentInfoRepository");

const commentInfoService = {
    getComments: async (params) => {
        return await commentInfoRepository.getComments(params);
    },
    addComment: async (comment) => {
        const newComment = await commentInfo(comment);
        return await commentInfoRepository.addComment(newComment);
    },
};

const commentInfoSocket = (socket, io, callback = (error) => { }) => {
    socket.on("newComment", async (comment) => {
        try {
            const newComment = await commentInfoService.addComment(comment);
            if (newComment) io.emit("newComment", comment);
            else callback("Đã có lỗi xảy ra");
        } catch (error) {
            callback("Đã có lỗi xảy ra");
        }
    });
};

module.exports = { commentInfoService, commentInfoSocket };
