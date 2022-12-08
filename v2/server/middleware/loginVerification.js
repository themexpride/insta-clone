const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../keys.js')
const mongoose = require('mongoose')
const user = mongoose.model("User")


const loginVerification = (req, res, next) => {
    const { authorization } = req.headers
    if (!authorization) return res.status(401).json({error:"User needs to be logged in"})
    const token = authorization.replace("Bearer ", "")
    jwt.verify(token, JWT_SECRET, (err, payload) => {
        if (err) return res.status(401).json({error:"User needs to be logged in"})
        const { _id } = payload
        user.findById(_id).then((userData) => {
            req.user = userData
            return next()
        })
    })
}

module.exports = loginVerification
