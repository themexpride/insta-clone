const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5000;

const { MONGOURI } = require("./keys.js");
const mainMongo = async () => {
  await mongoose.connect(MONGOURI,  {useNewUrlParser: true});
};
mainMongo().catch((err) => {
  console.log(err);
});
mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});
mongoose.connection.on("error", (err) => {
  console.log("Error connecting to MongoDB", err);
});

require("./models/user.js");
require("./models/post.js");

app.use(express.json());
app.use(cors());
app.use(require("./routes/auth.js"));
app.use(require("./routes/posting.js"));
app.use(require("./routes/user.js"));

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
