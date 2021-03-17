/* const crypto = require('crypto');

// var algorithm = 'aes256'; // or any other algorithm supported by OpenSSL
//var key

module.exports.encryptText=function(text) {
    //var cipher = crypto.createCipher(algorithm, key);  
   // var encrypted = cipher.update(text, 'utf8', 'hex') + cipher.final('hex');
   var hash = crypto.createHmac('sha1', key).update(text).digest('hex');

   var keyBytes = new Buffer(key).toString('utf8');
   var textBytes = new Buffer(text).toString('utf8');

// console.log(buff.toString('utf8'));

   let _key64 = (new Buffer(key, 'utf8')).toString('binary');
   let _text64 = (new Buffer(text, 'utf8')).toString('binary');
   console.log("B64 KEY: "+crypto.createHmac('sha1', keyBytes).update(textBytes, "base64").digest('base64'));
   
   let _keyBin = (new Buffer(key, 'utf8'));
   console.log("BIN KEY: "+crypto.createHmac('sha1', _key64).update(_text64, "binary").digest().toString('base64'));

   var hmacsignature = crypto.createHmac('sha1', Buffer.from(key, 'utf8'))
.update(text)
.digest()
.toString('base64');
console.log("BIN KEY: "+hmacsignature);

    return hash;
}

module.exports.decryptedText=function(text) {
    var decipher = crypto.createDecipher(algorithm, key);
    var decrypted = decipher.update(text, 'hex', 'utf8') + decipher.final('utf8');
    return decrypted;
}
 */
const crypto = require('crypto');

var algorithm = 'aes256'; // or any other algorithm supported by OpenSSL
var key = 'FAS@123';

module.exports.encryptText=function(text) {
    var cipher = crypto.createCipher(algorithm, key);  
    var encrypted = cipher.update(text, 'utf8', 'base64') + cipher.final('base64');
    return encrypted;
}


module.exports.decryptedText=function(text) {
    var decipher = crypto.createDecipher(algorithm, key);
    var decrypted = decipher.update(text, 'base64', 'utf8') + decipher.final('utf8');
    return decrypted;
}



