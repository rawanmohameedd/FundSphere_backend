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

    generateToken(user)

    return {value: user}
}

async function signUp ({email,username,password}){
    if (!username, !email, !password)
        return accountutils.generateErrorMessage(400,"Missing Required Fields")

    if (!accountutils.isEmail(email))
        return accountutils.generateErrorMessage(400,"Invalid Email Format")

    if(!accountutils.isPassword(password))
        return accountutils.generateErrorMessage(400,"Password must be 8 charachters minmumm and contain at least one digit, small letter, capital letter")

    const ecncryptPassword = accountutils.ecncryptPassword(password)

    const user = await userModels.signUp({email,username,ecncryptPassword})
    console.log(user)

    if(!user)
        return accountutils.generateErrorMessage(500, "An error has occured")

    generateToken(user)

    return {value:user}
}

module.exports ={
    signIn,
    signUp
}