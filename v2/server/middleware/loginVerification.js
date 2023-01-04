const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../keys.js')
const mongoose = require('mongoose')
const User = mongoose.model("User")


const loginVerification = (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "OPTIONS, GET, POST, PUT, PATCH, DELETE"
    );
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }
	const { authorization } = req.headers
    if (!authorization) return res.status(401).json({error:"User needs to be logged in"})
    const token = authorization.replace("Bearer ", "")
    jwt.verify(token, JWT_SECRET, (err, payload) => {
        if (err) return res.status(401).json({error:"User needs to be logged in"})
        const { _id } = payload
        User.findById(_id).then((userData) => {
            req.user = userData
            return next()
        })
    })
}

module.exports = loginVerification