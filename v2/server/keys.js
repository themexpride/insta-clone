const dev = require('./config/dev.js')

if (!dev) {
    module.exports = require('./config/prod.js');
}
else {
    module.exports = require('./config/dev.js');
}