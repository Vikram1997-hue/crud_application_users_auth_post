const HTTP_STATUS = require('http-status');

const myErrorGenerator = (statusCode, specificProblem = false) => {
    // console.log(HTTP_STATUS[statusCode], "YAA\n", HTTP_STATUS[`${statusCode}_MESSAGE`]);
    const myError = new Error();
    myError.error = true;
    myError.name = HTTP_STATUS[statusCode];
    myError.httpStatusCode = statusCode;
    if(specificProblem) {
        myError.message = specificProblem;
        return myError;
    }
    if(statusCode === 400) {
        myError.message = 'One or more required inputs are missing';
    } else if(statusCode === 401) {
        myError.message = 'Please send an appropriate JWT as an Authorization Header';
    } else if(statusCode === 403) {
        myError.message = 'Incorrect password entered!';
    } else if(statusCode === 404) {
        myError.message = 'This email has not been registered!';
    } else if(statusCode === 405) {
        myError.message = 'You cannot login until you have verified your account with OTP';
    } else if(statusCode === 422) {
        myError.message = 'There is a problem with one or more of your inputs';
    } else if(statusCode === 409) {
        myError.message = 'This email or phone number is already registered! If you are trying to '
        + 're-register because you failed to enter OTP timely, please try again after 5 minutes';
    } else if(statusCode === 500) {
        myError.message = HTTP_STATUS[`${statusCode}_MESSAGE`];
    }
    return myError;
};

module.exports = myErrorGenerator;
