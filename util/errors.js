const HTTP_STATUS = require('http-status');

const myErrorGenerator = (statusCode) => {
    // console.log(HTTP_STATUS[statusCode], "YAA\n", HTTP_STATUS[`${statusCode}_MESSAGE`]);
    const myError = new Error();
    myError.error = true;
    myError.name = HTTP_STATUS[statusCode];
    myError.httpStatusCode = statusCode;
    if(statusCode === 400) {
        myError.message = 'One or more required inputs are missing';
    } else if(statusCode === 422) {
        myError.message = 'There is a problem with one or more of your inputs';
    } else if(statusCode === 409) {
        myError.message = 'This email is already registered!';
    } else if(statusCode === 500) {
        myError.message = HTTP_STATUS[`${statusCode}_MESSAGE`];
    }
    return myError;
};

module.exports = myErrorGenerator;
