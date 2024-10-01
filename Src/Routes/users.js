const express = require ('express')
const userServices = require('../Services/users')
const otp = require('../Utils/generateOTP')
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

Router.post('/send-otp', async (req, res) => {
    const email = req.body.email;

    try {
        const send = await otp.sendOTP(email);
        if (send) {
            return res.status(200).send('OTP sent');
        } else {
            return res.status(500).send('Error sending OTP');
        }
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).send('Internal server error');
    }
});

// Verify OTP route
Router.post('/verify-otp', async (req, res) => {
    const payload = {
        email: req.body.email,
        otp: req.body.otp
    };

    try {
        const verify = await otp.verifyOTP(payload);
        if (verify.success) {
            return res.status(200).send('OTP verified successfully');
        } else {
            return res.status(400).send(verify.message || 'OTP verification failed');
        }
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).send('Internal server error');
    }
});

module.exports = Router