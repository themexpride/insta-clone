const CryptoJS = require('crypto-js')

module.exports = {
    MONGOURI_HSH: CryptoJS.AES.encrypt('mongodb+srv://themexpride:$$$Imtex831$$$@cluster0.6xbea.mongodb.net/?retryWrites=true&w=majority', "one").toString(),
    JWT_SECRET_HSH: CryptoJS.AES.encrypt('62820d87ce9287c3444297b4a206ed89b206544cb997ff98990c948ea0d3eb', "one").toString(),
    SENDINBLUE_HSH: CryptoJS.AES.encrypt('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', "one").toString()
}