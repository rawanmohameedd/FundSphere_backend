const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient

async function AddCategory(category) {
    try {
        /* using upsert to check if the category is already exists, 
        if not create it and return it in both cases*/
        const getCategory = await prisma.category.upsert({
            where: { name: category },
            update: {},
            create: { name: category },
            select: {
                category_id: true,
                name: true
            }
        })

        return getCategory
    } catch (err) {
        console.error(err.message)
    }
}

async function addCampaign({ user_id, title, description, goal_amount, start_date, end_date, category, url }) {
    try {
        const campCategory = await AddCategory(category)

        const campaign = await prisma.campaign.create({
            data: {
                user_id,
                title,
                description,
                campaign_photo: url,
                goal_amount,
                start_date: new Date(start_date),
                end_date: new Date(end_date),
                category_id: campCategory.category_id,
                created_at: new Date()
            }
        })
        if (campaign)
            return campaign
        return null
    } catch (err) {
        console.error("Error creating a campaign", err.message)
    }
}

async function updateCamaign(campaign_id, updateData) {
    try {
        const updatedCamaign = await prisma.campaign.update({
            where: { campaign_id },
            data: updateData
        })
        if (updatedCamaign)
            return updatedCamaign

        return null
    } catch (err) {
        console.error("Can't edit this campaign", err.message)
    }
}

async function deleteCampign(campaign_id) {
    try {
        const deletedCampign = await prisma.campaign.delete({
            where: { campaign_id: campaign_id }
        })
        if (deletedCampign)
            return deletedCampign

        return null
    } catch (err) {
        console.error(err.message)
        return null
    }
}

async function showCampaign(campaign_id) {
    try {
        const campaign = await prisma.campaign.findUnique({
            where: {
                campaign_id: campaign_id
            },
            select: {
                campaign_id: true,
                user_id: true,
                title: true,
                description: true,
                goal_amount: true,
                current_amount: true,
                start_date: true,
                end_date: true,
                created_at: true,
                campaign_photo: true,
                user: true,
                donations: true,
                category_id: true,
                category: true,
            }
        })
        if (campaign)
            return campaign

        return null
    } catch (err) {
        console.error(err.message)
        return null
    }
}

async function showCampaigns() {
    try {

    } catch (err) {
        console.error(err.message)
    }
}

async function showCategories() {
    try {

    } catch (err) {
        console.error(err.message)
    }
}

async function showCampaignsByCat() {
    try {

    } catch (err) {
        console.error(err.message)
    }
}

async function searchCamaigns() {
    try {

    } catch (err) {
        console.error(err.message)
    }
}

async function searchCategories() {
    try {

    } catch (err) {
        console.error(err.message)
    }
}

module.exports = {
    AddCategory,
    addCampaign,
    updateCamaign,
    deleteCampign,
    showCampaign,
    showCampaigns,
    showCategories,
    showCampaignsByCat,
    searchCamaigns,
    searchCategories
}