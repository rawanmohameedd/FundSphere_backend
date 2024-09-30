const express = require ('express')
const userServices = require('../Services/users')
const auth = require('../Middleware/auth.js')
const Router = new express.Router()


Router.post("/signin", async(req,res)=>{
    const payload ={
        signed: req.body.signed,
        password: req.body.password
    }

    const result = await userServices.signIn(payload)

    if (result.value)
        return res.send(result.value)

    res.status(result.statusCode).send({
        message: result.message
    })
})

Router.post("/signup", async(req,res)=>{
    const payload = {
        email: req.body.email,
        username : req.body.username,
        password: req.body.password
    }

    const result = await userServices.signUp(payload)

    if(result.value)
        return res.send(result)

    res.status(result.statusCode).send({
        message: result.message
    })
})

module.exports = Router