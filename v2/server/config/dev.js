const { MONGOURI_HSH, JWT_SECRET_HSH, SENDINBLUE_HSH } = require('./encrypted')
const CryptoJS = require('crypto-js')

module.exports = {
	MONGOURI: CryptoJS.AES.decrypt(MONGOURI_HSH, 6).toString(CryptoJS.enc.Utf8),
    JWT_SECRET: CryptoJS.AES.decrypt(JWT_SECRET_HSH, 6).toString(CryptoJS.enc.Utf8),
    SENDINBLUE: CryptoJS.AES.decrypt(SENDINBLUE_HSH, 6).toString(CryptoJS.enc.Utf8),
}