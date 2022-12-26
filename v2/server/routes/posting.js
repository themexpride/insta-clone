const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Post = mongoose.model("Post")
const User = mongoose.model("User")
const loginVerification = require('../middleware/loginVerification.js')


router.get('/post-feed', loginVerification, async (req, res) => {
    try {
        const posts = await Post.find().populate("postedBy", "_id name profilePic").sort('-createdAt')
        if (posts) {
            return res.json({posts})
        }
    }
    catch (err) {
        console.log(err)
        return
    }
})

router.get('/own-post-feed', loginVerification, async (req, res) => {
    try {
        const posts = await Post.find({postedBy:req.user._id}).populate("postedBy", "_id name profilePic").sort('-createdAt')
        if (!posts) {
            return res.status(422).json({error:"Posts not found"})
        }
        res.json(posts)
    } catch (err) {
        console.log(err)
        return res.status(422).json({error:err})
    }
})

router.get('/following-feed', loginVerification, async (req, res) => {
    try {
        const user = await User.find({name:{$in:req.user.following}}).select("-password")
        const post = await Post.find({postedBy:{$in:user}}).populate("postedBy", "_id name profilePic").sort('-createdAt')
        if (!post) {
            return res.status(422).json({error:"Posts not found"})
        }
        res.json(post)
    } catch (err) {
        console.log(err)
        return res.status(422).json({error:err})
    }
})

router.post('/create-post', loginVerification, (req, res) => {
    const { title, body, url } = req.body
    if (!title || !url) return res.status(422).json({error: "Please add a title or image"})
    if (title.length > 30 || body.length > 120) return res.status(422).json({error:"Please limit the amount of characters in the input fields."})
    req.user.password = undefined
    req.user.__v = undefined
    const post = new Post({
        title,
        body,
        photo: url,
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

router.put('/like-post', loginVerification, async (req, res) => {
    try {
        const { postId } = req.body
        const post = await Post.findById(postId)
        if (!post) {
            return res.status(422).json({error:"Post not found"})
        }
        await post.populate("postedBy", "_id name profilePic")
        let user_found = false
        post.likes.map((user) => {
            if (req.user._id.toString() === user.toString()){
                user_found = true
                return
            }
        })
        if (user_found) {
            return res.json(post)
        }
        const post2 = await Post.findByIdAndUpdate(postId, {
            $push:{likes:req.user._id},
            $pull:{dislikes:req.user._id}
        }, {new: true})
        await post2.populate("postedBy", "_id name")
        res.json(post2)
    }
    catch (err) {
        return res.status(422).json({error:err})
    }
    return
})

router.put('/unlike-post', loginVerification, async (req, res) => {
    try {
        const { postId } = req.body
        const post = await Post.findById(postId)
        await post.populate("postedBy", "_id name profilePic")
        if (!post) {
            return res.status(422).json({error:"Post not found"})
        }
        let user_found = false
        post.dislikes.map((user) => {
            if (req.user._id.toString() === user.toString()) {
                user_found = true
                return
            }
        })
        if (user_found) {
            return res.json(post)
        }
        const post2 = await Post.findByIdAndUpdate(postId, {
            $push:{dislikes:req.user._id},
            $pull:{likes:req.user._id}
        }, {new: true})
        .populate("postedBy", "_id name")
        res.json(post2)
    }
    catch (err) {
        return res.status(422).json({error:err})
    }
    return
})

router.put('/comment-post', loginVerification, async (req, res) => {
    try {
        if (req.body.text.length > 180) {
            return res.status(422).json({error:"Comment exceeds character limit."})
        }
        let comId = Math.floor((1+Math.random()) * 0x10000).toString(16).substring(1)
        comId = comId + "_" + req.body.postId
        const comment = {
            text: req.body.text,
            postedBy: req.user,
            commentId: comId
        }
        const post = await Post.findByIdAndUpdate(req.body.postId, {
            $push:{comments:comment}
        }, {new: true})
        await post.populate("comments.postedBy", "_id name profilePic")
        res.json(post)
    }
    catch (err) {
        return res.status(422).json({error:err})
    }
    return
})

router.get('/comment-feed/:postId', loginVerification, async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId)
        await post.populate("comments.postedBy", "_id name profilePic")
        if (!post) {
            return res.status(422).json({error:"Post not found"})
        }
        res.json(post)
    }
    catch (err) {
        return res.status(422).json({error:err})
    }
    return
})

router.put('/comment-delete', loginVerification, async (req, res) => {
    try {
        const post = await Post.findById(req.body.postId)
        await post.populate("comments.postedBy", "_id name profilePic")
        if (!post) {
            return res.status(422).json({error:"Comment not found"})
        }
        let user_found = false
        post.comments.map((comment) => {
            if (req.user._id.toString() === comment.postedBy._id.toString() && comment.commentId === req.body.commentId){
                user_found = true
                return
            }
        })
        if (user_found) {
            return res.json(post)
        }
        const post2 = await Post.findByIdAndUpdate(req.body.postId, {
            $pull:{comments: {commentId: req.body.commentId}}
        }, {new: true})
        res.json(post2)
    }
    catch (err) {
        return res.status(422).json({error:err})
    }
    return
})

router.delete('/delete-post/:postId', loginVerification, async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId)
        await post.populate("postedBy", "_id name")
        if (!post || post.postedBy._id.toString() !== req.user._id.toString()) {
            return res.status(422).json({error:"Post not found"})
        }
        await post.remove()
        res.json(post)
    }
    catch (err) {
        return res.status(422).json({error:err})
    }
    return
})

module.exports = router