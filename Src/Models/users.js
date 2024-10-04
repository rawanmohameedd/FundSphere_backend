const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt')
const { ecncryptPassword } = require('../Utils/checkAccountFields')
const prisma = new PrismaClient

async function signIn({ signed, password }) {
    try {
        //find user by email or username

        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: signed.toLowerCase().trim() },
                    { username: signed.toLowerCase().trim() }
                ]
            }
        })

        //if user is found and password matches
        if (user && bcrypt.compareSync(password, user.password)) {

            //exclude user without password and return it
            const { password, ...userWithoutPassword } = user
            return userWithoutPassword
        }

        return null
    } catch (err) {
        console.error('Error accoured during sign in process', err.message)
        return null
    }
}

async function signUp({ username, email, ecncryptPassword }) {
    try {
        const user = await prisma.user.create({
            data: {
                email: email.toLowerCase().trim(),
                username: username.toLowerCase().trim(),
                password: ecncryptPassword,
            },
            select: {
                user_id: true,
                email: true,
                username: true,
            },
        });

        return user;
    } catch (err) {
        console.error('Error during sign-up:', err.message);

        // Check for Prisma-specific duplicate key errors
        if (err.meta && err.meta.target.includes('email') || err.meta.target.includes('username')) {
            return { error: 'User already exists' };
        }

        return null;
    }
}

async function getById(email) {
    try {
        const user = await prisma.user.findUnique({
            where: {email: email}
        })

        if (user)
            return user

        return null
    } catch (err) {
        console.error(err.message)
        return null
    }
}

async function updateProfilePhoto({url, email}){
    try{
        const updatedUser = await prisma.user.update({
            where: { email:email }, 
            data: { profile_photo: url }, 
            select: {
                user_id: true,
                username: true,
                email: true,
                profile_photo: true, 
            },
        });

        if (updatedUser)
            return updatedUser

        return null
    }catch(err){
        console.error(err.mesaage)
        return null
    }
}

async function deleteProfilePhoto(email) {
    try {
        const updatedUser = await prisma.user.update({
            where: { email: email }, 
            data: { profile_photo: null }, 
            select: {
                user_id: true,
                username: true,
                email: true,
                profile_photo: true
            },
        });

        if (updatedUser) {
            return updatedUser;
        }

        return null;
    } catch (error) {
        console.error('Error deleting profile photo:', error.message);
        return null;
    }
}

module.exports = {
    signIn,
    signUp,
    getById,
    updateProfilePhoto,
    deleteProfilePhoto
}