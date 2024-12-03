const nodemailer = require("nodemailer");

const nodeMailerHandler = {
    sendMail: (to, subject, htmlContent) => {
        const transporter = nodemailer.createTransport({
            host: process.env.NODEMAILER_HOST,
            port: Number(process.env.NODEMAILER_PORT),
            secure: false,
            auth: {
                user: process.env.NODEMAILER_AUTH_USERNAME,
                pass: process.env.NODEMAILER_AUTH_PASSWROD,
            },
        });

        const options = {
            from: process.env.NODEMAILER_AUTH_USERNAME,
            to: to,
            subject: subject,
            html: htmlContent,
        };

        return transporter.sendMail(options, (error, info) => {
            if (error) {
                console.log(error)
                return false;
            } else {
                return true;
            }
        });
    },
};

module.exports = nodeMailerHandler;
