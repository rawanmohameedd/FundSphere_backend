const { PrismaClient,Decimal } = require('@prisma/client')
const prisma = new PrismaClient

async function increase_current(campaign_id, amount){
    try{
        const donation = await prisma.campaign.update({
            where: { campaign_id: campaign_id},
            data: { current_amount: { increment: amount } } ,           
            select:{
                campaign_id: true,
                current_amount: true
            }
        })
        if (donation)
            return donation
        return null
    }catch(error){
        console.error("can't increase current amount", error.message)
    }
}

async function makeDonation ({user_id, campaign_id, amount}){
    try{
        console.log(user_id, campaign_id,amount)

        const donation = await prisma.donation.create({
            data:{
                user_id,
                campaign_id,
                amount: new Decimal(amount)
            }
        })

        const campaign_current_amount = await increase_current(campaign_id, new Decimal(amount))

        if(donation && campaign_current_amount){
            return { donation, campaign_current_amount }
        }
        return null
    }catch(error){
        console.error("Can't make this donation", error.message)
        return null
    }
}

async function getDonations_byUsers (user_id){
    try{
        const donation = await prisma.donation.findMany({
            where: { user_id: user_id},
            select:{
                donation_id: true,
                user_id: true,
                campaign_id: true,
                amount: true,
                donation_date: true,
                campaign: true
            }
        })

        if(donation)
            return donation

        return null
    } catch(err){
        console.error("Error getting donations", err.message)
        return null
    }
}

async function getDonations_byCampaigns (campaign_id){
    try{
        const donation = await prisma.donation.findMany({
            where: {campaign_id: campaign_id},
            select:{
                donation_id: true,
                user_id: true,
                campaign_id: true,
                amount: true,
                donation_date: true,
                user: true,
                campaign: true
            }
        })

        if(donation)
            return donation

        return null
    } catch(err){
        console.error("Error getting donations", err.message)
        return null
    }
}

module.exports = {
    makeDonation,
    getDonations_byUsers,
    getDonations_byCampaigns
}