let encryptDecryptLogic = require('../../repositories/CommonRepository/EncryptDecryptLogic');

let getEncryptData= async (req,res) => {
    var encryptedText=encryptDecryptLogic.encryptText('stq12345');

    
    res.json(encryptedText);
}

module.exports={
    getEncryptData
}