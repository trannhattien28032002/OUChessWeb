const commentInfo = require("../models/commentInfo");

const commentInfoRepository = {
    getComments: async (params) => {
        try {
            let searchParams = {};
            const receiver = params.receiver;
            if (receiver !== null && receiver !== "") {
                searchParams.receiver = receiver;
            }
            const comments = await commentInfo.find(searchParams).populate("sender", "_id username avatar");
            return comments;
        } catch (error) {
            return null;
        }
    },
    addComment: async (Comment) => {
        try {
            console.log(Comment);
            const newComment = await Comment.save();
            return newComment;
        } catch (error) {
            console.log(error);
            return null;
        }
    },
    updateComment: async (commentId, changed) => { },
    deleteComment: async (commentId) => { },
};

module.exports = commentInfoRepository;
