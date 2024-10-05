const express = require('express')
const auth = require('../Middleware/auth')
const cloudinary = require('../Utils/cloudinary')
const Router = new express.Router()

const camaignServices = require('../Services/campaigns')

Router.post('/createCampaign', auth, async (req, res) => {

    //get user_id from user token
    const user_id = req.user.user_id

    const uploadedFile = req.files.photo;

    try {
        // upload campagin photo to the cloud, if success create the camaign
        const url = await cloudinary.uploadPhoto(uploadedFile)

        // create the campaign
        const payload = {
            user_id,
            title: req.body.title,
            description: req.body.description,
            goal_amount: req.body.goal_amount,
            start_date: req.body.start_date,
            end_date:req.body.end_date,
            category: req.body.category,
            url
        }

        console.log(payload)
        const camaign = await camaignServices.createCampagin(payload)
        return res.send({ camaign });
    } catch (error) {
        console.error('Error in upload process:', error);
        return res.status(500).json({ message: 'Upload failed' });
    }

})

Router.put('/editCampaign/:campaign_id',auth, async(req,res)=>{
    const campaign_id = parseInt(req.params.campaign_id,10)

    const uploadedFile = req.files?.photo

    let url
    if (uploadedFile)
        url = await cloudinary.uploadPhoto(uploadedFile)

    const payload = {
        title: req.body?.title,
        description: req.body?.description,
        goal_amount: req.body?.goal_amount,
        start_date: req.body?.start_date,
        end_date: req.body?.end_date,
        category: req.body?.category,
        url
    };
    try{
    const result = await camaignServices.updateCampagin(campaign_id, payload)
    if(result)
        return res.status(200).json({ result });

    return res.status(404).json({ message: 'Campaign not found' }); 
    }catch(err){
        console.error(err.message)
        return res.status(500).json({ message: 'Internl server error' });
    }
})

Router.delete('/deleteCampaign/:campaign_id', async(req,res)=>{
    const campaign_id = parseInt(req.params.campaign_id,10);

    try {
        const result = await camaignServices.deleteCampign(campaign_id);
console.log(result)

        return res.status(200).json({result });
    } catch (err) {
        console.error('Error deleting campaign:', err.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
})

Router.get('/getCampaign/:campaign_id',async(req,res)=>{
    const campaign_id = parseInt(req.params.campaign_id,10);

    try {
        const result = await camaignServices.getCampaign(campaign_id);
        console.log(result)

        return res.status(200).json({result });
    } catch (err) {
        console.error('Error getting this campaign:', err.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
})

module.exports = Router