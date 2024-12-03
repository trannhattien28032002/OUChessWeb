const userService = require('../services/userService');
const httpHandler = require('../helpers/httpHandler');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const jwtHandler = require('../helpers/jwt');
const mailHandler = require('../helpers/nodemailer');
const user = require('../models/user');
const { error } = require('console');
const { userConnected } = require('../configs/SocketRoot');
// const commentInfoService = require("../services/commentInfoService");

const authController = {
    signUp: async (req, res) => {
        try {
            const newUser = await userService.addUser(req.body.information);
            httpHandler.Created(res, newUser, 'Tạo tài khoản thành công');
        } catch (error) {
            console.log(error.message);
            httpHandler.Servererror(res, error.message, 'Đã có lỗi xảy ra!');
        }
    },
    signIn: async (req, res) => {
        try {
            const curUser = await userService.getUser(req.body.username);
            if (!curUser) {
                httpHandler.Fail(res, {}, 'Tài khoản không đúng');
                return;
            } else {
                const validPassword = await bcrypt.compare(req.body.password, curUser.password);
                if (!validPassword) {
                    httpHandler.Fail(res, {}, 'Mật khẩu không đúng');
                    return;
                } else {
                    if (curUser.deletedAt) {
                        httpHandler.Fail(res, {}, 'Tài khoản của bạn đã bị cấm');
                        return;
                    } else {
                        const isConnected = userConnected[curUser._id];

                        if(isConnected){
                            httpHandler.Fail(res, {}, "Tài khoản đang được đăng nhập");
                            return;
                        }

                        const token = jwtHandler.createToken(curUser);
                        const refreshToken = jwtHandler.createToken(curUser);
                        httpHandler.Success(res, { token, refreshToken }, 'Đăng nhập thành công');
                    }
                }
            }
        } catch (error) {
            httpHandler.Servererror(res, error.message, 'Có lỗi đã xảy ra');
        }
    },
    sendVerify: async (req, res) => {
        try {
            const verifyCode = crypto.randomBytes(3).toString('hex');
            const verifyToken = jwt.sign(
                {
                    email: req.body.emailVerify,
                    verifyCode: verifyCode,
                },
                process.env.JWT_SECRETKEY,
                {
                    expiresIn: '1m',
                },
            );

            const response = await mailHandler.sendMail(
                req.body.emailVerify,
                'Xác nhận tài khoản OUCHESS',
                `<h3>Mã xác nhận tải khoản của bạn là: ${verifyCode}</h3>`,
            );
            httpHandler.Success(res, { verifyToken }, 'Đã gửi mã xác nhận thành công');
        } catch (error) {
            httpHandler.Servererror(res, error.message, 'Đã có lỗi xảy ra!');
        }
    },
    checkExists: async (req, res) => {
        try {
            const { username, email, phone } = req.body;
            let countUsername, countEmail, countPhone;
            countUsername = countEmail = countPhone = 0;
            const errors = {};

            if (username) {
                countUsername = await userService.countField('username', username);
                if (countUsername > 0)
                    errors.username = {
                        type: 'unique',
                        message: 'Tài khoản đã có người sử dụng',
                    };
            }

            if (email) {
                countEmail = await userService.countField('email', email);
                if (countEmail > 0)
                    errors.email = {
                        type: 'unique',
                        message: 'Email đã có người sử dụng',
                    };
            }

            if (phone) {
                countPhone = await userService.countField('phone', phone);
                if (countPhone > 0)
                    errors.phone = {
                        type: 'unique',
                        message: 'Số điện thoại đã có người sử dụng',
                    };
            }

            httpHandler.Success(res, { errors }, 'Hoàn tất');
        } catch (error) {
            console.log(error);
            httpHandler.Servererror(res, error, 'Đã có lỗi đã xảy ra');
        }
    },
    resetPassword: async (req, res) => {
        try {
            const auth = await userService.getUser(req.body.emailReset);
            if (!auth) httpHandler.Fail(res, {}, 'Người dùng không tồn tại');
            else {
                const state = await userService.changePassword(req.body.emailReset, req.body.newPassword);
                console.log(2);
                if (state.modifiedCount > 0) {
                    httpHandler.Success(res, {}, 'Cập nhật mật khẩu thành công');
                } else {
                    httpHandler.Fail(res, {}, 'Cập nhật mật khẩu không thành công');
                }
            }
        } catch (error) {
            httpHandler.Servererror(res, {}, 'Đã có lỗi xảy ra');
        }
    },
    isExistEmail: async (req, res) => {
        try {
            const { email } = req.body;
            const isExist = await userService.isExistEmail(email);
            if (isExist !== null) {
                const curUser = await userService.getUser(email);
                const token = jwtHandler.createToken(curUser);
                const refreshToken = jwtHandler.createToken(curUser);
                httpHandler.Success(res, { token, refreshToken }, 'Đăng nhập thành công');
            } else {
                httpHandler.Fail(res, {}, 'Email chưa tồn tại');
            }
        } catch (error) {
            console.log(error);
            httpHandler.Servererror(res, {}, 'Đã có lỗi xảy ra');
        }
    },
};

module.exports = authController;
