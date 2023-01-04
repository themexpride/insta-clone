if (process.env.VERCEL_ENV === "production") {
    module.exports = require('./config/prod.js')
}
else {
    module.exports = require('./config/dev.js')
}