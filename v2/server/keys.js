fs.access('./config/dev.js', constants.F_OK, (err) => {
    err ? module.exports = require('./config/prod.js') : module.exports = require('./config/dev.js');
});