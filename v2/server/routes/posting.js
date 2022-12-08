const { json } = require('express')
const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Post = mongoose.model("Post")
const User = mongoose.model("User")
const loginVerification = require('../middleware/loginVerification.js')


router.get('/post-feed', loginVerification, (req, res) => {
    Post.find()
        .populate("postedBy", "_id, name")
        .then((posts) => {
            return res.json({posts})
        })
        .catch((err) => {
            console.log(err)
            return
        })
    return
})

router.post('/create-post', loginVerification, (req, res) => {
    const { title, body } = req.body
    if (!title) return res.status(422).json({error: "Please add a title"})
    req.user.password = undefined
    req.user.__v = undefined
    const post = new Post({
        title,
        body,
        postedBy: req.user
    })
    post.save()
        .then((result) => {
            return res.json({post:result})
        })
        .catch((err) => {
            console.log(err)
            return
        })
    return
})

router.get('/u/@:name', loginVerification, (req, res) => {
    User.findOne({name: req.params.name})
        .then((user) => {
            if (!user) return res.status(422).json({error:"Accessing unknown page"})
            const id = user.id
            Post.find({postedBy: id})
                .populate("postedBy", "_id name")
                .then((posts) => {
                    return res.json({posts})
                })
                .catch((err) => {
                    console.log(err)
                    return
                })
        })
        .catch((err) => {
            console.log(err)
            return
        })
    return
})

module.exports = router