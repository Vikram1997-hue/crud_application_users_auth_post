const express = require('express')
const router = express.Router()

const userController = require("../controllers/userController")




router.post("/post", userController.createUser) //CREATE

router.get("/get", userController.getUser) //READ

router.put("/put", userController.updateUser)//UPDATE

router.delete("/delete", userController.deleteUser)//DELETE


router.put("/login", userController.loginUser) //put cuz only partial modification

router.put("/logout", userController.logoutUser)

router.put("/reset-password", userController.resetPassword)

router.put("/forgot-password", userController.forgotPassword)

router.post("/register", userController.registration)


module.exports = router



