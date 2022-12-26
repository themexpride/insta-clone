if (process.env.NODE_ENV == "production") {
    console.log("Production")
    module.exports = require('./config/prod.js');
}
else {
    console.log("Not Production")
    module.exports = require('./config/dev.js')
}