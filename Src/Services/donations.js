const donationModels = require('../Models/donations')
const utils = require('../Utils/checkAccountFields')

async function makeDonation ({user_id, campaign_id, amount}){
    if (!user_id || !campaign_id || !amount)
        return utils.generateErrorMessage(400, "Missing Required fields")

    const donate = await donationModels.makeDonation({user_id, campaign_id, amount})
    if(donate)
        return donate
    return utils.generateErrorMessage(400, "An error occured during making a donation")
}

async function  showUserDonations (user_id){
    const donations = await donationModels.getDonations_byUsers(user_id)

    if(donations)
        return donations

    return utils.generateErrorMessage(400, "An error occured during getting donations")

}

async function  showCampaignDonations (campaign_id){
    const donations = await donationModels.getDonations_byCampaigns(campaign_id)

    if(donations)
        return donations

    return utils.generateErrorMessage(400, "An error occured during getting donations")

}

module.exports={
    makeDonation,
    showUserDonations,
    showCampaignDonations
}
