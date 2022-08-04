const express = require('express')
const router = express.Router()

const userController = require("../controllers/userController")




router.post("/post", userController.createUser) //CREATE

router.get("/get", userController.getUser) //READ

router.put("/put", userController.updateUser)//UPDATE

router.delete("/delete", userController.deleteUser)//DELETE

module.exports = router



