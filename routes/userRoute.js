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
 *        description: This email is already registered!
 *      '422':
 *        description: There is a problem with one or more of your inputs
 *      '500':
 *        description: Internal Server Error
 */
router.post('/post', userController.register);

router.post('/login', userController.login);

module.exports = router;
