const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Post = mongoose.model("Post");
const User = mongoose.model("User");
const loginVerification = require("../middleware/loginVerification.js");
const Fuse = require('fuse.js')

router.get("/user/:name", loginVerification, async (req, res) => {
  try {
    const user = await User.findOne({ name: req.params.name }).select(
      "-password"
    );
    if (!user) {
      return res.status(422).json({ error: "User not found" });
    }
    const posts = await Post.find({ postedBy: user._id }).populate(
      "postedBy",
      "_id name"
    );
    res.json({ user, posts });
  } catch (err) {
    console.log(err);
    return res.status(422).json({ error: err });
  }
  return;
});

router.put("/follow", loginVerification, async (req, res) => {
  try {
    const followedUser = await User.findByIdAndUpdate(
      req.body.followId,
      {
        $push: { followers: req.user.name },
      },
      { new: true }
    ).select("-password");
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $push: { following: req.body.name },
      },
      { new: true }
    ).select("-password");
    if (!user || !followedUser) {
      return res.status(422).json({ error: "User not found" });
    }
    return res.json({ user, followedUser });
  } catch (err) {
    return res.status(422).json({ error: err });
  }
});

router.put("/unfollow", loginVerification, async (req, res) => {
  try {
    const unfollowedUser = await User.findByIdAndUpdate(
      req.body.unfollowId,
      {
        $pull: { followers: req.user.name },
      },
      { new: true }
    ).select("-password");
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $pull: { following: req.body.name },
      },
      { new: true }
    ).select("-password");
    if (!user || !unfollowedUser) {
      return res.status(422).json({ error: "User not found" });
    }
    return res.json({ user, unfollowedUser });
  } catch (err) {
    return res.status(422).json({ error: err });
  }
});

router.put("/update-profile", loginVerification, async (req, res) => {
  try {
    if (req.body.bio.length > 60) {
      return res.status(422).json({error:"Please limit characters"})
    }
    if (req.body.profilePic && req.body.bio) {
      const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        {
          $set: { profilePic: req.body.profilePic, bio: req.body.bio },
        },
        { new: true }
      ).select("-password");
      if (!updatedUser) {
        return res.status(422).json({ error: "User not found" });
      }
      return res.json(updatedUser);
    } else if (req.body.profilePic && !req.body.bio) {
      const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        {
          $set: { profilePic: req.body.profilePic },
        },
        { new: true }
      ).select("-password");
      if (!updatedUser) {
        return res.status(422).json({ error: "User not found" });
      }
      return res.json(updatedUser);
    } else if (!req.body.profilePic && req.body.bio) {
      const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        {
          $set: { bio: req.body.bio },
        },
        { new: true }
      ).select("-password");
      if (!updatedUser) {
        return res.status(422).json({ error: "User not found" });
      }
      return res.json(updatedUser);
    }
  } catch (err) {
    return res.status(422).json({ error: err });
  }
});

router.post('/search-users', loginVerification, (req, res) => {
    if(req.body.query.length > 25) {
      return res.status(422).json({error:"Please limit the charcter length"})
    }
    User.find().select("-password -email").then((data) => {
      const userNames = data.map((user) => {return user.name})
      const options = {
        includeScore: true,
      }
      const fuse = new Fuse(userNames, options)
      const result = fuse.search(req.body.query)
      const resultNames = result.map((res) => {return res.item})
      const finalUsers = data.filter((user) => resultNames.includes(user.name))
      res.json(finalUsers)
      return
    })
    .catch((err) => {
      res.status(422).json({error:err})
      return
    })
})

module.exports = router;
