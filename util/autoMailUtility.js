const nodemailer = require('nodemailer');

const sendMail = (userEmail, textContent) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'ranterdudewtd@gmail.com',
            pass: 'fwsokyakdroicdwc',
        },
    });
    const mailOptions = {
        from: 'ranterdudewtd@gmail.com',
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
