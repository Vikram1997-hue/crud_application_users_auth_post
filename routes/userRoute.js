const express = require('express')
const router = express.Router()
const userController = require("../controllers/userController")

router.get("/getUsers", userController.getUsers)

router.post("/insertionOriginalScope", userController.insertionOriginalScope)

module.exports = router