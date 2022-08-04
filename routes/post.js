const express = require('express')
const router = express.Router();

const postController = require("../controllers/postController")



router.post("/post", postController.createPost) //CREATE

router.get("/get", postController.getPost) //READ

router.put("/put", postController.updatePost) //UPDATE

router.delete("/delete", postController.deletePost) //DELETE




module.exports = router

