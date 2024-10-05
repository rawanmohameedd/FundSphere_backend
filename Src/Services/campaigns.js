const campaignModels = require('../Models/campaigns')
const Utils = require('../Utils/checkAccountFields')

async function createCampagin ({user_id, title, description, goal_amount, start_date, end_date, category,url}){
    if (!user_id || !title || !description || !goal_amount ||!start_date || !end_date || !category || !url)
        return Utils.generateErrorMessage(400,"Missing Required Fields")

    const createdCampaign = await campaignModels.addCampaign({user_id, title, description, goal_amount, start_date, end_date, category,url})

    if (!createdCampaign)
        return Utils.generateErrorMessage(400,"An error has occured")

    return createdCampaign
}

async function updateCampagin (campaign_id,{ title, description, goal_amount, start_date, end_date, category,url}){
    const updateData = {};

    // handle each data field seperatly
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (goal_amount) updateData.goal_amount = goal_amount;
    if (start_date) updateData.start_date = new Date(start_date);
    if (end_date) updateData.end_date = new Date(end_date); 

    if (category) {
        const campCategory = await campaignModels.AddCategory(category); 
        updateData.category_id = campCategory.category_id;
    }

    if (url) updateData.campaign_photo = url;

    if (Object.keys(updateData).length === 0) {
        return Utils.generateErrorMessage(400, "No fields provided to update");
    }

    if (!campaign_id) {
        return Utils.generateErrorMessage(400, "Campaign ID is required to update the campaign");
    }

    const updatedCampaign = await campaignModels.updateCamaign(campaign_id, updateData)

    if (!updatedCampaign)
        return Utils.generateErrorMessage(400,"An error has occured")

    return updatedCampaign
}

async function  deleteCampign(campaign_id) {
    const campaign = await campaignModels.deleteCampign(campaign_id)

    if(!campaign)
        return Utils.generateErrorMessage(404,"Campaign not Found")

    return Utils.generateErrorMessage(200, "Campaign deleted successfully")
}

async function getCampaign (campaign_id){
    const campaign = await campaignModels.showCampaign(campaign_id)

    if (campaign)
        return campaign

    return Utils.generateErrorMessage(400,"An error has occured")

}

module.exports ={
    createCampagin,
    updateCampagin,
    deleteCampign,
    getCampaign,
}