const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

/**
 * @swagger
 * /users/get:
 *   get:
 *    description: A simple read operation to get all the rows currently in the DB
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.get('/get', userController.getUsers);

/**
 * @swagger
 * /users/post:
 *   post:
 *    description: Creation of a new user (and writing the corresponding data into DB)
 *    parameters:
 *      - in: body
 *        name: user
 *        description: The user to create + auto-creation of corresponding row in auth table
 *        schema:
 *          type: object
 *          required:
 *            - email
 *            - password
 *            - phone_number
 *          properties:
 *            name:
 *              type: string
 *            email:
 *              type: string
 *            password:
 *              type: string
 *            phone_number:
 *              type: string
 *    responses:
 *      '200':
 *        description: A successful response
 *      '400':
 *        description: One or more of the required req.body params are missing
 *      '409':
 *        description: This email is already registered! If you're trying to re-register
 *                     because you failed to enter OTP timely, please try again after 5 minutes
 *      '422':
 *        description: There is a problem with one or more of your inputs
 *      '500':
 *        description: Internal Server Error
 */
router.post('/post', userController.register);

/**
 * @swagger
 * /users/otpVerify:
 *   post:
 *    description: OTP verification upon sign-up. If you miss your 5 minute window to
 *                 enter your OTP, you must wait for an additional 5 minutes until you can retry
 *    parameters:
 *      - in: body
 *        name: otp
 *        description: The OTP received on registered email ID and phone number
 *        schema:
 *          type: object
 *          required:
 *            - otp
 *          properties:
 *            otp:
 *              type: string
 *      - in: header
 *        name: Authorization
 *        description: JWT token for OTP
 *        required: Authorization
 *    responses:
 *      '200':
 *        description: A successful response
 *      '400':
 *        description: One or more of the required req.body params are missing
 *      '401':
 *        description: Authentication-related error. Please look at the error object sent in
 *                     response for more details
 *      '422':
 *        description: There is a problem with one or more of your inputs
 *      '500':
 *        description: Internal Server Error
 */
router.post('/otpVerify', userController.otpVerification);

module.exports = router;
