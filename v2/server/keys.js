if (process.env.NODE_DEVV === 11) {
    module.exports = require('./config/prod.js')
}
else {
    module.exports = require('./config/dev.js')
}