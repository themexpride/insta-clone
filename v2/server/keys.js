if (process.env.DEV_ENV === 11) {
    module.exports = require('./config/prod.js')
}
else {
    module.exports = require('./config/dev.js')
}