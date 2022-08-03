const express = require('express')
const app = express()
const userRouter = require('./routes/users')
const authRouter = require('./routes/auth')
const postRouter = require('./routes/post')


app.get("/", (req, res) => { //add api as a global route
    res.send("Heyooo")
})

//CRUD revision
app.use('/users', userRouter)
app.use('/auth', authRouter)
app.use('/post', postRouter)


app.listen(3002, err => {
    if(err)
        console.error("Something went wrong:", err)
})