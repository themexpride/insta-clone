const fs = require('fs');

fs.access('./config/dev.js', (err) => {
    err ? (module.exports = require('./config/prod.js')) : (module.exports = require('./config/dev.js'));
});