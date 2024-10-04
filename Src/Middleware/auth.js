require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../Models/users");

const auth = async (req, res, next) => {
    try {

        // Extract token from authorization header Bearer<token>
        const token = req.header("Authorization").replace("Bearer ", "");
        if (!token) {
            return res.status(401).send({ message: "No token provided" });
        }

        const decoded = jwt.verify(token, process.env.SECRET);

        const user = await User.getById(decoded.email);
        if (!user) throw new Error();

        // attach user and token to req as it will be needed to use later
        req.user = user;
        req.token = token;
        next();

    } catch (error) {
        res.status(401).send({
            message: "Unauthorized Status Code",
        });
    }
};

module.exports = auth;