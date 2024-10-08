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

module.exports = {
    makeDonation
}