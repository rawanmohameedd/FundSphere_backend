const express =require('express')
const auth = require('../Middleware/auth')
const donationServices = require('../Services/donations')
const Router = new express.Router()

Router.post('/makeDonation',auth,async(req,res)=>{
    try{
        const user_id = parseInt(req.user.user_id,10)
        const {campaign_id, amount} = req.body
        const result = await donationServices.makeDonation({user_id,campaign_id,amount})
        res.send(result)
    }catch(err){
        console.error(err.message)
        res.status(500).json('Interal Server Error')
    }
})
module.exports = Router