// const twilio = require('twilio');
require('dotenv').config();
const client = require('twilio')(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);

const sendText = (userPhoneNo, msg) => {
    client.messages.create({
        body: msg,
        to: userPhoneNo,
        from: '+19496941578',
     }).then(() => console.log('OTP sent to phone number.'))
       .catch((error) => console.log(error));
};

module.exports = sendText;
