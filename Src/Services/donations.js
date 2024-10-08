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

module.exports={
    makeDonation
}
