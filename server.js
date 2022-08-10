const express = require('express')
const app = express()
const userRouter = require('./routes/users')
const authRouter = require('./routes/auth')
const postRouter = require('./routes/post')
require('dotenv').config()
app.use(express.json())


app.get("/", (req, res) => { //add api as a global route
    res.send("Heyooo")
})


app.use('/users', userRouter)
app.use('/auth', authRouter)
app.use('/post', postRouter)


//check for DB connectivity first. NOTE DOWN OPTIMIZATIONS JESUS CHRIST

app.listen((process.env.SERVERPORT || 3000), err => {
    if(err)
        console.error("Something went wrong:", err)
})