const userService = require("../services/userService");
const httpHandler = require("../helpers/httpHandler");
const bcrypt = require("bcrypt");

const adminController = {
    getListUser: async (req, res) => {
        try {
            const params = req.query;
            const list = await userService.getListUserFromAdmin(params);
            if (list) {
                httpHandler.Success(res, { list }, "Tìm kiếm thành công");
                return;
            } else {
                httpHandler.Fail(res, {}, "Tìm kiếm thất bại");
                return;
            }
        } catch (error) {
            console.log(error);
            httpHandler.Servererror(res, {}, "Đã có lỗi xảy ra");
        }
    },
    addUser: async (req, res) => {
        try {
            const { username, email, phone } = req.body;
            let countUsername, countEmail, countPhone;
            countUsername = countEmail = countPhone = 0;
            console.log(req.body.avatar)

            if (username) {
                countUsername = await userService.countField("username", username);
                if (countUsername > 0) {
                    httpHandler.Fail(res, {}, "Tài khoản đã tồn tại");
                    return;
                }
            }

            if (email) {
                countEmail = await userService.countField("email", email);
                if (countEmail > 0) {
                    httpHandler.Fail(res, {}, "Email đã có người sử dụng");
                    return;
                }
            }

            if (phone) {
                countPhone = await userService.countField("phone", phone);
                if (countPhone > 0) {
                    httpHandler.Fail(res, {}, "Số điện thoại đã có người sử dụng");
                    return;
                }
            }

            const newUser = await userService.addUser(req.body);
            if (newUser) {
                httpHandler.Created(res, { newUser }, "Thêm tài khoản thành công");
            } else {
                httpHandler.Fail(res, {}, "Thêm tài khoản thất bại");
            }
        } catch (error) {
            httpHandler.Servererror(res, {}, "Đã có lỗi xảy ra");
        }
    },
    updateUser: async (req, res) => {
        try {

            const { username } = req.body;

            const unChangedUser = await userService.getUser(username);

            if (!unChangedUser) {
                httpHandler.Fail(res, {}, "Người dùng không tồn tại");
                return;
            }

            const existEmail = await userService.getExistUser(username, req.body.email);
            if (existEmail) {
                httpHandler.Fail(res, {}, "Email đã có người sử dụng");
                return;
            }
            const existPhone = await userService.getExistUser(username, req.body.phone);
            if (existPhone) {
                httpHandler.Fail(res, {}, "Số điện thoại đã có người sử dụng");
                return;
            }

            console.log(req.body);
            const { friends, password, ...changed } = req.body;

            const updatedUser = await userService.updateUserFromAdmin(username, changed);
            if (updatedUser) {
                httpHandler.Success(res, { updatedUser }, "Cập nhật thành công");
                return;
            } else {
                httpHandler.Fail(res, {}, "Cập nhật thất bại");
                return;
            }
        } catch (error) {
            console.log(error);
            httpHandler.Servererror(res, {}, "Đã có lỗi xảy ra");
        }
    },
    deleteUser: async (req, res) => {
        try {

            const deletedUser = await userService.deleteUserFromAdmin(req.params.username);
            console.log(deletedUser);
            if (deletedUser) {
                httpHandler.Success(res, { deletedUser }, "Đã vô hiệu hoá tài khoản");
                return;
            } else {
                httpHandler.Fail(res, {}, "Vô hiệu hoá thất bại");
                return;
            }
        } catch (error) {
            console.log(error);
            httpHandler.Servererror(res, {}, "Đã có lỗi xảy ra");
        }
    },
};

module.exports = adminController;
