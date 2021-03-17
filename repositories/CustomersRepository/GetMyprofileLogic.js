const mainDb = require('../MainDb');
var constants = require('../../config/Constants');
const Cryptr = require('../../config/encrypt.decrypt.service')
exports.viewMyProfile = (data) => {
    // console.log(data)
    return new Promise((resolve, reject) => {
        let query = `SELECT  * from  tbl_sirim_users where userName='${data}'
      `
        //   console.log(query)
        mainDb.GetQueryData(query, (error, data) => {
            if (error) {
                return reject(`${error}, ${query}`)
            }
            // console.log(data)
            return resolve(data)
        })
    })
}




exports.Update_MY_DETAILS = (mydata) => {
    //console.log(mydata);
    var password = Cryptr.encryptText(mydata.password);
    // let query = ` update  tbl_sirim_users  SET password  = '${password}', contact_person_name='${mydata.name}' where username='${mydata.userName}'`
    let query = ` update  tbl_sirim_users  SET password  = '${password}', email='${mydata.email}', contact_person_name='${mydata.name}' where username='${mydata.userName}';`

    // if (mydata.contactNo) { 
    // let contactDetails= updateRegisterLogic.Load_Reg_Details("registed_id");
    // }


    return new Promise((resolve, reject) => {
        mainDb.InsertUpdateDeleteData(query, (error, data) => {
            if (error) {
                console.log("error" + error)
                return reject(`${error}, ${query}`)
            }
            // dsfvgsd
            return resolve(data);
        })
    });

}