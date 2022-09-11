const nodemailer = require('nodemailer');
require('dotenv').config();

const sendMail = (userEmail, textContent) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SENDER_MAIL,
            pass: 'fwsokyakdroicdwc',
        },
    });
    const mailOptions = {
        from: process.env.SENDER_MAIL,
        to: userEmail,
        subject: 'OTP FOR VUKRIM\'S CRUD APPLICATION',
        text: textContent,
    };
    transporter.sendMail(mailOptions, (error) => {
        if (error) {
            console.log(error);
        }
    });
};

module.exports = sendMail;
