const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { JWT_SECRET, SENDINBLUE } = require('../keys.js')
const nodemailer = require('nodemailer')
const sendinblueTransport = require('nodemailer-sendinblue-transport')
const loginVerification = require('../middleware/loginVerification.js')
const User = mongoose.model("User")


const transporter = nodemailer.createTransport(
    new sendinblueTransport({ apiKey: SENDINBLUE})
)

router.get('/protected', loginVerification, (req, res) => {
    return res.send("Hello User")
})

router.post('/signup', (req, res) => {
    const {name, email, password, bio, profilePic} = req.body
    if (!name || !email || !password) {
        res.status(422).json({error: "Please add all the fields!"})
        return
    }
    if (name.length > 25 || email.length > 45 || password.length > 30 || bio.length > 60) {
        res.status(422).json({error:"Please limit the amount of characters in the input fields."})
        return
    }
    User.findOne({email})
    .then((savedUser) => {
        if(savedUser) {
            res.status(422).json({error:"User already exists"})
            return
        }
        User.findOne({name})
            .then((savedUser) => {
                if(savedUser) return res.status(422).json({error:"User already exists"})
                bcrypt.hash(password, 12)
                .then((hshPwd) => {
                    const user = new User({
                        name: name,
                        email: email,
                        password: hshPwd,
                        bio: bio,
                        profilePic: profilePic,
                    })
                    user.save()
                        .then((user) => {
                            transporter.sendMail({
                                to: user.email,
                                from: "no-reply@insta-clone.net",
                                subject: "Account Created with Insta-Clone",
                                html:"<h1>Welcome to Insta-Clone!</h1><p>This message was generated to notify you about your account creation with our service.</p>"
                            })
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
    if (!email || !password) { 
        res.status(422).json({error:"Missing email or password"})
        return
    }
    if (email.length > 45 || password.length > 30) {
        res.status(422).json({error:"Please limit the amount of characters in the input fields."})
        return
    }
    User.findOne({email})
        .then((savedUser) => {
            if (!savedUser) {
                res.status(422).json({error:"User credentials are incorrect"})
                return
            }
            bcrypt.compare(password, savedUser.password)
                .then((match) => {
                    if (match) {
                        const token = jwt.sign({_id:savedUser._id}, JWT_SECRET)
                        const {_id, name, email, bio, followers, following, profilePic} = savedUser
                        res.json({token, user:{_id, name, email, bio, followers, following, profilePic}}) 
                    }
                    else {
                        res.status(422).json({error:"User credentials are inccorect"})
                    }
                })
                .catch((err) => {
                    console.log(err)
                })
        })
    return
})

router.post('/reset-password', (req, res) => {
    const { email } = req.body
    if (!email) { 
        res.status(422).json({error:"Missing information"})
        return
    }
    if (email.length > 45) {
        res.status(422).json({error:"Please limit the amount of characters in the input fields."})
        return
    }
    crypto.randomBytes(32, (err, buffer) => {
        if (err){
            console.log(err)
        }
        const token = buffer.toString("hex")
        User.findOne({ email: req.body.email }).then((user) => {
          if (!user) {
            return res.status(422).json({ error: "Useer doesn't exist" });
          }
          user.resetToken = token;
          user.expireToken = Date.now() + 3600000;
          user.save().then((result) => {
            transporter.sendMail({
              to: user.email,
              from: "no-reply@insta-clone.net",
              subject: "Password Reset with Insta-Clone",
              html:`
                <p>You requested for password reset</p>
                <h5>Click this <a href="http://localhost:3000/newpassword/${token}">link</a> to reset password.</h5>
                `
            })
            res.json({ message: "Check your email for further assistance." });
          })
        })
    })
})

router.post('/new-password', (req, res) => {
    const { password: newPassword, token: sentToken } = req.body
    if (!newPassword || !sentToken) { 
        res.status(422).json({error:"Missing information"})
        return
    }
    if (newPassword.length > 30) {
        res.status(422).json({error:"Please limit the amount of characters in the input fields."})
        return
    }
    User.findOne({ resetToken:sentToken, expireToken:{$gt:Date.now()} })
    .then( (user) => {
        if (!user) {
            return res.status(422).json({ error:"Try again later" })
        }
        bcrypt.hash(newPassword, 12)
        .then((hashedPassword) => {
            user.password = hashedPassword
            user.resetToken = undefined
            user.expireToken = undefined
            user.save()
            .then((savedUser) => {
                res.json({ message:"Password updated successfully!" })
            })
        })
    })
    .catch((err) => {
        console.log(err)
    })
})

module.exports = router