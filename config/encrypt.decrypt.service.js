const crypto = require('crypto');
var moment = require('moment');
var algorithm = 'aes256'; // or any other algorithm supported by OpenSSL
var key = 'FAS@123';

module.exports.encryptText=function(text) {
    var cipher = crypto.createCipher(algorithm, key);  
    var encrypted = cipher.update(text, 'utf8', 'hex') + cipher.final('hex');
    return encrypted;
}

module.exports.decryptedText=function(text) {
    var decipher = crypto.createDecipher(algorithm, key);
    var decrypted = decipher.update(text, 'hex', 'utf8') + decipher.final('utf8');
    return decrypted;
}

module.exports.encrypt=function(text) {
    const algorithm = 'aes-256-cbc';
    const key ='strateqgroupsdnbhdstrateq1234567'; // crypto.randomBytes(32)
    const iv = crypto.randomBytes(16);

    let start_date = moment().format('YYYY-MM-DD HH:mm:ss');
    let expired_date = moment().add(8, 'h').format('YYYY-MM-DD HH:mm:ss');

    let cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex'), start_date, expired_date };
}
module.exports.decrypt=function(text) {
    const algorithm = 'aes-256-cbc';
    const key = 'strateqgroupsdnbhdstrateq1234567'; // crypto.randomBytes(32)

    let iv = Buffer.from(text.iv, 'hex');
    let encryptedText = Buffer.from(text.ed, 'hex');
    let decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}