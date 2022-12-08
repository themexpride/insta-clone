const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../keys.js')
const loginVerification = require('../middleware/loginVerification.js')
const User = mongoose.model("User")


router.get('/protected', loginVerification, (req, res) => {
    return res.send("Hello User")
})

router.post('/signup', (req, res) => {
    const {name, email, password} = req.body
    if (!name || !email || !password) return res.status(422).json({error: "Please add all the fields!"})
	  User.findOne({email})
		.then((savedUser) => {
			if(savedUser) return res.status(422).json({error:"User already exists"})
            User.findOne({name})
                .then((savedUser) => {
                    if(savedUser) return res.status(422).json({error:"User already exists"})
                    bcrypt.hash(password, 12)
                    .then((hshPwd) => {
                        const user = new User({
                            name: name,
                            email: email,
                            password: hshPwd
                        })
                        user.save()
                            .then((user) => {
                                res.json({message:"Saved successfully"})
                            })
                            .catch((err) => {
                                console.log(err)
                            })
                    })
                })
		})
		.catch((err) => {
			console.log(err)
		})
    return
})

router.post('/signin', (req, res) => {
    const { email, password } = req.body
    if (!email || !password) return res.status(422).json({error:"Missing email or password"})
    User.findOne({email})
        .then((savedUser) => {
            if (!savedUser) return res.status(422).json({error:"User credentials are incorrect"})
            bcrypt.compare(password, savedUser.password)
                .then((match) => {
                    if (match) {
                        const token = jwt.sign({_id:savedUser._id}, JWT_SECRET)
                        return res.json({token}) 
                    }
                    return res.status(422).json({error:"User credentials are inccorect"})
                })
                .catch((err) => {
                    console.log(err)
                })
        })
    return
})

module.exports = router