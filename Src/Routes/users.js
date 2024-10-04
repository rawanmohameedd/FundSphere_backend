const express = require ('express')
const userServices = require('../Services/users')
const otp = require('../Utils/generateOTP')
const auth = require('../Middleware/auth.js')
const cloudinary = require('../Utils/cloudinary.js')
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

    console.log(payload)
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

Router.get("/getProfile", auth, async(req,res)=>{
    try{
        const { password, ...userWithoutPassword } = req.user;

        return res.send(userWithoutPassword);
        } catch(err){
        console.error("error fetching profile", err.message)
        return res.status(500).send({
            message: "Internal server error"
        })
    }
})

Router.post('/upload',auth, async (req, res) => {
    console.log('Uploaded files:', req.files);

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({ message: 'No file uploaded.' });
    }

    const uploadedFile = req.files.photo; 
    const email = req.user.email; 

    try {
        const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { resource_type: 'auto' },
                (error, result) => {
                    if (error) {
                        console.error('Error uploading to Cloudinary:', error);
                        return reject(error);
                    }
                    resolve(result);
                }
            );

            // End the stream with the file data
            stream.end(uploadedFile.data); 
        });

        const url = result.secure_url

        const user = await userServices.updateProfile({url , email})
        return res.send({ user });
    } catch (error) {
        console.error('Error in upload process:', error);
        return res.status(500).json({ message: 'Upload failed' });
    }
});

Router.delete('/deleteProfilePhoto', auth, async (req, res) => {
    try {
        const updatedUser = await userServices.deleteProfilePhoto(req.user.email);
        return res.status(200).json({ user: updatedUser });
    } catch (error) {
        console.error('Error deleting profile photo:', error);
        return res.status(500).json({ message: 'Failed to delete profile photo.' });
    }
});

module.exports = Router