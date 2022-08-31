const express = require('express')
const app = express()
require('dotenv').config()
const userRouter = require("./routes/userRoute")
const authRouter = require("./routes/authRoute")
const postRouter = require("./routes/postRoute")
const indexForModels = require("./models/index")
const sequelize = require('./util/database');
const swaggerJsDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express');
app.use(express.json())


const port = process.env.SERVER_PORT || 3000;





app.use("/users", userRouter)
app.use("/auth", authRouter)
app.use("/post", postRouter)





const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: 'CRUD API Assignment with Sequelize',
            descrption: 'Has 3 tables: users, auth, and post',
            version: '1.0.0',
            contact: {
                name: 'Vikramaditya Bhatnagar',
                email: 'vikramaditya@appventurez.com'
            },
            servers: ['http://localhost:'+port] //'http://localhost:'+port
        }
    },
    apis: ['./routes/userRoute.js', './routes/authRoute.js', 'crud_application_users_auth_post/routes/postRoute.js']
}


const swaggerDocs = swaggerJsDoc(swaggerOptions)
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs))

//syncing all our models with the actual tables in the database.
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




app.listen(port, (err) => {
    if(err) {
        console.error("Error in server launch:", err)
    }
})