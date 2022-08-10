const express = require('express')
const router = express.Router();

const postController = require("../controllers/postController")



router.post("/post", postController.createPost) //CREATE

router.get("/get", postController.getPost) //READ

router.put("/put", postController.updatePost) //UPDATE

router.delete("/delete", postController.deletePost) //DELETE


router.get("/viewPosts", postController.viewPosts)

router.put("/post-status-change", postController.postStatusChange)

router.get("/post-with-status", postController.getPostWithStatusFilter) 


// router

module.exports = router

