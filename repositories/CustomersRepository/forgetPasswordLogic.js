const mainDb = require('../MainDb');
var constants = require('../../config/Constants');
const Cryptr = require('../../config/encrypt.decrypt.service')
var generator = require('generate-password');
const MessageFormat = require('messageformat');
const mf = new MessageFormat('en');
const mailTransporter = require('../../config/mail-config')
let newCustomerRegistrationLogic = require('../../repositories/CustomersRepository/NewCustomerRegistrationLogic')
exports.USER_VALIDATION = (data) => {
    // console.log(data)
    return new Promise((resolve, reject) => {
        let query = `SELECT  * from  tbl_sirim_users where userName='${data}' `
        //   console.log(query)
        mainDb.GetQueryData(query, (error, data) => {
            if (error) {
                return reject(`${error}, ${query}`)
            }
            //console.log(data)
            return resolve(data)
        })
    })
}

// exports.Generate_password = async (Email) => {
//     var autoGeneratePassword = generator.generate({
//         length: 10,
//         numbers: true
//     });
//     var password = Cryptr.encryptText(autoGeneratePassword);
//     let query = `UPDATE tbl_sirim_users
//     SET password = '${password}',modified_date=getdate(),modified_by='admin' where  username='${Email}'`

//     //console.log(query);
//     let responseData = await mainDb.InsertandReturnID(query);
//     //console.log("responseData");
//     let adminDetails = await newCustomerRegistrationLogic.getAdminDetails("Admin");

//     let mailUserLogData = await this.MAIL_NOTIFICATION_FOR_CPA_CUSTOMER_STATUS_INFO(Email, autoGeneratePassword, adminDetails[0].email)

//     return mailUserLogData;
// }



// exports.MAIL_NOTIFICATION_FOR_CPA_CUSTOMER_STATUS_INFO = (Email, password, adminEmail) => {
//     // console.log(userList);
//     var contactNames = "Customer"
//     var Email = Email
//     var password = password
//     var mailTextContent = mf.compile(constants.MAIL_NOTIFICATION_FORGET_PASSWORD);
//     mailTextContent = mailTextContent({
//         contactName1: contactNames, userName1: Email, passwords: password,
//     })

//     var mailOptions = {
//         from: 'karthik.c@accordinnovations.com',
//         to: Email,
//         cc: adminEmail,
//         subject: 'eSCIS Customer Portal:   Login Credentials',
//         html: mailTextContent
//     };
//     mailTransporter.sendMail(mailOptions, (error, info) => {
//         // console.log(mailOptions);
//         if (error) {
//             return error
//         }
//         return resolve(info);



//     })

// }

exports.Generate_password = async (Email) => {
    var autoGeneratePassword = generator.generate({ length: 10, numbers: true });
    var password = Cryptr.encryptText(autoGeneratePassword);
    let query = `UPDATE tbl_sirim_users
    SET password = '${password}',modified_date=getdate(),modified_by='admin' where  username='${Email}'`
    console.log(query);
    let responseData = await mainDb.InsertandReturnID(query);
    let customerdata = await newCustomerRegistrationLogic.getCustomerdata(Email)
    let adminDetails = await newCustomerRegistrationLogic.getAdminDetails("Admin");
    let CPADetails = await newCustomerRegistrationLogic.getAdminDetails("CPA");
    let mailUserLogData = await this.MAIL_NOTIFICATION_FOR_CPA_CUSTOMER_STATUS_INFO(customerdata, autoGeneratePassword, adminDetails, CPADetails)
    console.log("(mailUserLogData\n" + JSON.stringify(mailUserLogData))
    return mailUserLogData;
}



exports.MAIL_NOTIFICATION_FOR_CPA_CUSTOMER_STATUS_INFO = (customerdata, password, adminDetails, CPADetails) => {
    // console.log(userList);
    var customerdata = customerdata
    var Email = customerdata[0].email
    var password = password
    console.log(Email)
    console.log(CPADetails[0].EmailAddr)
    var mailTextContent = mf.compile(constants.MAIL_NOTIFICATION_FORGET_PASSWORD);
    mailTextContent = mailTextContent({
        contactName1: customerdata[0].contact_person_name, userName1: customerdata[0].username, passwords: password, CPANAME: CPADetails[0].FullName, CPAMAIL: CPADetails[0].EmailAddr
    })

    var mailOptions = {
        from: 'escistest@sirim.my', //'karthik.c@accordinnovations.com',
        to: Email,
       // cc: 'karthik.c@accordinnovations.com',//CPADetails[0].EmailAddr,
        subject: 'eSCIS Customer Portal:  Reset Password',
        html: mailTextContent
    };
    mailTransporter.sendMail(mailOptions, (error, info) => {
        console.log("info\n" + JSON.stringify(info));
        console.log("mailOptions\n" + JSON.stringify(mailOptions))
        if (error) {
            return error
        }
        return resolve(info);



    })

}