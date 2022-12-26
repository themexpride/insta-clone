const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  resetToken: String,
  expireToken: Date, 
  bio: {
    type: String,
  },
  followers: [{
    type: String,
  }],
  following: [{
    type: String,
  }],
  profilePic: {
    type: String,
    default: "https://res.cloudinary.com/dzmbosl0t/image/upload/v1668322289/tpv5lwkvi1ajqamhfyal.png"
  }
});

mongoose.model("User", userSchema);
