const express = require('express')
const mongoose = require('mongoose')

const app = express()
const PORT = 5000


const { MONGOURI } = require('./keys.js')
const mainMongo = async() => {
    await mongoose.connect(MONGOURI)
}
mainMongo()
    .catch((err) => {
        console.log(err)
    })
mongoose.connection.on('connected', () => {
    console.log("Connected to MongoDB")
})
mongoose.connection.on('error', (err) => {
    console.log("Error connecting to MongoDB", err)
})

require('./models/user.js')
require('./models/post.js')

app.use(express.json())
app.use(require('./routes/auth.js'))
app.use(require('./routes/posting.js'))

app.listen(PORT, () => {
    console.log("Server running on port", PORT)
})