const mainDb = require('../MainDb');
var generator = require('generate-password');
const Cryptr = require('../../config/encrypt.decrypt.service')

var constants = require('../../config/Constants');
const mailTransporter = require('../../config/mail-config')

const MessageFormat = require('messageformat');
const mf = new MessageFormat('en');


exports.Update_Reset_Password = (data) => {
    var userName=data.userName;
  
   var userName = userName.replace(/["']/g, "");
   var password = Cryptr.encryptText(data.logincredentials.newPassword);
    let query = `update  TBL_SIRIM_USERS SET first_login='N', modified_date=GETDATE(),modified_by='${data.userName}', password = '${password}', secret_question= '${data.secretQuestion}',secret_answer='${data.logincredentials.secretAnswer}' where username='${userName}'`


    return new Promise((resolve, reject) => {
        mainDb.InsertUpdateDeleteData(query, (error, data) => {
            if (error) {
                console.log("error" + error)
                return reject(`${error}, ${query}`)
            }
        
            return resolve(data);
        })
    });

}