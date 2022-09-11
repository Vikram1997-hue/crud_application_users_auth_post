const express = require('express');
const postController = require('../controllers/postController');

const router = express.Router();

/**
 * @swagger
 * /post/post:
 *   post:
 *    description: Creation of a new post (and writing the corresponding data into DB)
 *    parameters:
 *      - in: body
 *        name: post_details
 *        description: The details of the post to be created
 *        schema:
 *          type: object
 *          required:
 *            - user_id
 *            - post_title
 *          properties:
 *            user_id:
 *              type: string
 *            post_title:
 *              type: string
 *            image:
 *              type: string
 *      - in: header
 *        name: Authorization
 *        description: JWT token for current logged-in session
 *        required: Authorization
 *    responses:
 *      '500':
 *        description: Internal Server Error (generic error used for all cases)
 */
router.post('/post', postController.createPost);

module.exports = router;
