require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()

const userRouter = require("./Routes/users")

app.use(cors())
app.use(express.json())

app.use(userRouter)

app.listen(process.env.PORT|3000 , ()=> {
    console.log(`Server is running on port: ${process.env.PORT }`)
})
