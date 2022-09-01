function otpGenerator() {
    let otp = '';
    while(otp.length !== 6) {
        const num = Math.floor(10 * Math.random());
        otp += num.toString();
    }
    // console.log(otp);
    return otp;
}

module.exports = otpGenerator;
