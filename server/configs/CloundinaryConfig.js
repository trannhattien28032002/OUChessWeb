const httpHandler = require("../helpers/httpHandler");

const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: "de0pt2lzw",
    api_key: "269448242686499",
    api_secret: "36ckrJAaSBk2wrWeU3kU9ICwTOM",
});

const cloudinaryConfig = {
    uploadToCloud: async (req, res, next) => {
        try {
            console.log(req.file);
            if (req.file) {
                const result = await cloudinary.uploader.upload(req.file.path);
                req.body.avatar = result.secure_url;
                console.log(req.body.avatar);
            }
            next();
        } catch (error) {
            httpHandler.Servererror(res, {}, "Đã có lỗi xảy ra" + error);
        }
    },
};

module.exports = cloudinaryConfig;
