const express = require('express')
const router = express.Router()
const userController = require("../controllers/userController")



/**
 * @swagger
 * /users/get:
 *   get:
 *    description: A simple read operation to get all the rows currently in the DB
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.get("/get", userController.getUsers)


/**
 * @swagger
 * /users/post:
 *   post:
 *    description: Creation of a new user (and writing the corresponding data into DB)
 *    parameters: 
 *      - in: body
 *        name: user
 *        description: The user to create
 *        schema:
 *          type: object
 *          required:
 *            - name
 *          properties:
 *            name:
 *              type: string
 *            email:
 *              type: string
 *            password:
 *              type: string
 *    responses:
 *      '200':
 *        description: A successful response
 *      '400':
 *        description: One or more of the required req.body objects are missing
 *      '500':
 *        description: Internal Server Error
 */
router.post("/post", userController.insertionOriginalScope)

module.exports = router