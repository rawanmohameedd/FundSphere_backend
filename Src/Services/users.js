const userModels = require("../Models/users")
const accountutils = require('../Utils/checkAccountFields')
const generateToken = require('../Utils/generateToken')

async function signIn({signed, password}) {
    if (!signed, !password) 
        return accountutils.generateErrorMessage(400, "Missing required fields")

    const user = await userModels.signIn({signed,password})

    console.log(user)

    if (!user)
        return accountutils.generateErrorMessage(404, "Authentication Failed: Email/Username or password not correct")

    const token = generateToken(user)

    return {value: user, token}
}

async function signUp ({email,username,password}){
    if (!username, !email, !password)
        return accountutils.generateErrorMessage(400,"Missing Required Fields")

    if (!accountutils.isEmail(email))
        return accountutils.generateErrorMessage(400,"Invalid Email Format")

    // if(!accountutils.isPassword(password))
    //     return accountutils.generateErrorMessage(400,"Password must be 8 charachters minmumm and contain at least one digit, small letter, capital letter")

    const ecncryptPassword = accountutils.ecncryptPassword(password)

    const user = await userModels.signUp({email,username,ecncryptPassword})
    console.log(user)

    if(!user)
        return accountutils.generateErrorMessage(500, "An error has occured")

    const token = generateToken(user)

    return {value:user,token}
}

async function updateProfile ({url, email}){
    if (!email || !url)
        return accountutils.generateErrorMessage(400,"Email orUrl is missing")

    const profile = await userModels.updateProfilePhoto({url, email})

    if(!profile)
        return accountutils.generateErrorMessage(500,"Can't update this user profile photo")

    return profile
}

async function deleteProfilePhoto(email){
    const deleted = await userModels.deleteProfilePhoto(email)

    if(!deleted)
        return accountutils.generateErrorMessage(500,"Can't detlete this user profile photo")

    return deleted
}

module.exports ={
    signIn,
    signUp,
    updateProfile,
    deleteProfilePhoto
}