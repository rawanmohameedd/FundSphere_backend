const express = require('express')
const auth = require('../Middleware/auth')
const cloudinary = require('../Utils/cloudinary')
const Router = new express.Router()

const camaignServices = require('../Services/campaigns')


Router.post('/createCampaign', auth, async (req, res) => {
    try {
        const { title, description, goal_amount, start_date, end_date, category } = req.body;
        const user_id = req.user.user_id;
        const url = await cloudinary.uploadPhoto(req.files.photo);

        const campaign = await camaignServices.createCampagin({
            user_id,
            title,
            description,
            goal_amount,
            start_date,
            end_date,
            category,
            url
        });

        res.send({ campaign });
    } catch (error) {
        console.error('Error in upload process:', error);
        res.status(500).json({ message: 'Upload failed' });
    }
});

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

Router.get('/getCampains',async(req,res)=>{
    try{
        const campains = await camaignServices.getCampains()
        console.log(campains)
        return res.status(200).json(campains);
    }catch(err){
        console.error('Error getting all campains',err.message)
        return res.status(500).json({ message: 'Internal server error' });
    }
})

Router.get('/getCategories',async(req,res)=>{
    try{
        const categories = await camaignServices.getCategories()
        console.log(categories)
        return res.status(200).json(categories);
    }catch(err){
        console.error('Error getting all categories',err.message)
        return res.status(500).json({ message: 'Internal server error' });
    }
})

Router.get('/getCampainsbyCat/:category_id',async(req,res)=>{
    try{
        const category_id = parseInt(req.params.category_id,10)
        const campaigns = await camaignServices.getCampaignsByCat(category_id)

        console.log(campaigns)
        return res.status(200).json(campaigns);
    }catch(err){
        console.error('Error getting campaigns',err.message)
        return res.status(500).json({ message: 'Internal server error' });
    }
})

Router.get('/getCampainsbyUser',auth,async(req,res)=>{
    try{
        const user_id = parseInt(req.user.user_id)
        const campaigns = await camaignServices.getCampaignsByUser(user_id)

        console.log(campaigns)
        return res.status(200).json(campaigns);
    }catch(err){
        console.error('Error getting campaigns',err.message)
        return res.status(500).json({ message: 'Internal server error' });
    }
})

Router.get('/searchCamp/:searched', async(req,res)=>{
    try{
    const search_term = req.params.searched
    const campaigns = await camaignServices.searchCampaigns(search_term)

    console.log(campaigns)
    res.status(200).json(campaigns)
    } catch(err){
        console.error('Error getting campaigns',err.message)
        return res.status(500).json({ message: 'Internal server error' });
    }

})

Router.get('/searchCat/:searched', async(req,res)=>{
    try{
    const search_term = req.params.searched
    const categories = await camaignServices.searchCategories(search_term)

    console.log(search_term,categories)
    res.status(200).json(categories)
    } catch(err){
        console.error('Error getting categories',err.message)
        return res.status(500).json({ message: 'Internal server error' });
    }
})

module.exports = Router