const bcrypt = require('bcrypt');


function isPassword(password) {
    //check password is 8 chrachters minmumm , has at least one number, capital letter, small letter
    let regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;  

    if (password.match(regex))
        return true;

    else
        return false;
}

function isEmail(emailAdress) {
    //check that email ahs a valid format
    let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (emailAdress.match(regex))
        return true;

    else
        return false;
}

//standard error messagae with HTTP status code
function generateErrorMessage(statusCode, message) {
    return {
        statusCode,
        message
    }
}


function ecncryptPassword(password) {
    
    //generate random data for password hashing
    const salt = bcrypt.genSaltSync(10);

    //encrypted password with the generated salt
    const hash = bcrypt.hashSync(password, salt);
    return hash
}

module.exports = {
    isPassword,
    isEmail,
    generateErrorMessage,
    ecncryptPassword
}