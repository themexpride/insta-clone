const { MONGOURI_HSH, JWT_SECRET_HSH, SENDINBLUE_HSH } = require('./encrypted')
const CryptoJS = require('crypto-js')

module.exports = {
	MONGOURI: CryptoJS.RC4.decrypt("UzdwpqMhNy0erbAN6xmIjP4u3jwjYXKn752WRPfih7qqEh+c8BiWNZrl+34plIgljj4q2wKCAxw+7keEASzCfT3NAUNlK/lzPkHnVT31G6Uvd0OcAvLCoJwT6iXwhTE3", "one").toString(CryptoJS.enc.Utf8),
    JWT_SECRET: CryptoJS.RC4.decrypt("CGom8/whbTEOuv8F/AGf1693j3ZqJHn365WCVrbP0vetWBeZ9AiGcri/rjw8htRvhykswFnTWlcysU3QCyo=", "one").toString(CryptoJS.enc.Utf8),
    SENDINBLUE: CryptoJS.RC4.decrypt("RjN7uL8sNysM66AF/Q+egKgh2ic3JCn778XRVuWTifquUhSX8wqCJuy0pD1shYhvjSIslVnQUwIw5E2BD3HBMmKbRlpjYPpkYQD6Vw72NrNIUlDRH5mC1bA=", "one").toString(CryptoJS.enc.Utf8),
}