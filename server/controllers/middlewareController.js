const jwt = require("jsonwebtoken");
const httpHandler = require("../helpers/httpHandler");

const middlewareController = {
    verifyToken: async (req, res, next) => {
        const token = req.header("Authorization");
        if (!token) httpHandler.Unauthorized(res, { message: "Vui lòng đăng nhập" });
        else {
            const accessToken = token.split(" ")[1];
            jwt.verify(accessToken, process.env.JWT_SECRETKEY, (err, user) => {
                if (err) {
                    httpHandler.Servererror(res, {}, err.message);
                    // httpHandler.Forbidden(res, "Không được phép thực hiện hành động này");
                } else {
                    req.user = user;
                    next();
                }
            });
        }
    },
    verifyAdminToken: async (req, res, next) => {
        const token = req.header("Authorization");
        if (!token) httpHandler.Unauthorized(res, { message: "Vui lòng đăng nhập" });
        else {
            const accessToken = token.split(" ")[1];
            jwt.verify(accessToken, process.env.JWT_SECRETKEY, (err, user) => {
                if (err) {
                    console.log(err);
                    httpHandler.Servererror(res, {}, "Đã có lỗi xảy ra");
                } else {
                    if (user.role === "ADMIN") {
                        req.user = user;
                        next();
                    } else {
                        httpHandler.Forbidden(res, "Bạn không được phép thực hiện hành động này");
                    }
                }
            });
        }
    },
};

module.exports = middlewareController;
