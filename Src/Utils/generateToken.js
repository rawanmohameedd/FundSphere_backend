const jwt = require("jsonwebtoken")
require('dotenv').config()

function generateToken(user) {
    const token = jwt.sign({
        email:user.email 
    }, process.env.SECRET , {
        expiresIn:'2d'
    })
    user.token = token
}

module.exports = generateToken