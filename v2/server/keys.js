if (process.env.NODE_ENV === "production") {
    module.exports = require('./config/prod.js');
}
else if ('./config/dev.js'){
    module.exports = require('./config/dev.js')
}
else {
    module.exports = require('./config/prod.js');
}