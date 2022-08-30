const express = require('express')
const app = express()
require('dotenv').config()
const userRouter = require("./routes/userRoute")
const authRouter = require("./routes/authRoute")
const postRouter = require("./routes/postRoute")
const indexForModels = require("./models/index")
const sequelize = require('./util/database')
app.use(express.json())




sequelize.sync({alter: true}).then(result => {
    console.log("All is well!")
}).catch(err => {
    console.error("Error in sequelize.sync() attempt:", err)
})




app.get("/", (req, res) => {
    res.send("How's it going, buddy?")
})

app.use("/users", userRouter)
app.use("/auth", authRouter)
app.use("/post", postRouter)




app.listen(process.env.SERVER_PORT || 3000, (err) => {
    if(err) {
        console.error("Error in server launch:", err)
    }
})