'use strict'
const mainDb = require('../MainDb');

const Cryptr = require('../../config/encrypt.decrypt.service')

var constants = require('../../config/Constants');
const mailTransporter = require('../../config/mail-config')

const MessageFormat = require('messageformat');
const mf = new MessageFormat('en');


exports.Insert_New_Customer_Address = (customerData, registerId, addressId) => {

    console.log("customerData 15\n" + JSON.stringify(customerData))
    let query = `INSERT INTO TBL_SIRIM_CUSTOMERS_ADDRESS(REGISTER_ID,addr_id,address1,address2,address3,post_code,country_id,country_name,country_code,state_id,state_name,state_code,city_id,city_name,city_code,address_type,division,addr_type,status)
    VALUES(${registerId},${addressId},'${customerData.address1}','${customerData.address2}','${customerData.address3}','${customerData.postcode}',${customerData.CountryCode},'${customerData.countryname}','${customerData.CountryCode}',${customerData.StateCode},'${customerData.statename}','${customerData.StateCode}',${customerData.City},'${customerData.cityname}','${customerData.City}','','${customerData.division === undefined ? customerData.Division : customerData.division}',1,'Active')`
    console.log(query)
    return new Promise((resolve, reject) => {
        mainDb.InsertUpdateDeleteData(query, (error, data) => {
            if (error) {
                return reject(`${error}, ${query}`)
            }
            return resolve(addressId);
        })
    });
}


exports.Insert_New_Customer_Contact = (customerData, addressId, contactId) => {

    console.log('console.logcustomerDatacustomerData\n' + JSON.stringify(customerData))
    let query = `INSERT INTO tbl_sirim_customers_contact(contact_id,addr_id,contact_person_name,mobileno,emailaddr,faxno,mail_verification,officeno,officeextno,department,designation,remarks,status)
    VALUES(${contactId},${addressId},'${customerData.contactname}','${customerData.MobileNo}','${customerData.EmailAddr}','${customerData.FaxNo}','N','','','','${customerData.designation === undefined ? customerData.Designation : customerData.designation}','','Active')`
    console.log(query)

    try {

        let Emailsend = this.MAIL_CONFIRMATION_TEXT(customerData.EmailAddr, customerData.contactname);
        console.log(JSON.stringify(Emailsend))
    }
    catch (err) {
        console.log(err);

    }
    return new Promise((resolve, reject) => {
        mainDb.InsertUpdateDeleteData(query, (error, data) => {
            if (error) {
                return reject(`${error}, ${query}`)
            }
            return resolve(data);
        })
    });

}


exports.Insert_New_Customer_Registration = (customerData, resultRegseq) => {
    console.log("customerData company Name " + JSON.stringify(customerData))

    let query = `INSERT INTO TBL_SIRIM_CUSTOMERS(REGISTER_ID,COMPANY_NAME,COMPANY_TYPE,ORG_TYPE,COMP_ROC_NO,CUST_CODE,reg_Type,STATUS,CREATED_DATE,CREATED_BY,modified_Date,modified_By,PUSH_CRM_STATUS,PARENT_ID,BAD_DEBT,PAR_COMP_NAME,PAR_COMP_ROC,APP_TYPE,AGENT_DATE,AGENCY_ID,GST_ID,CPA_STATUS,crmid,org_name,comp_type_name)
    VALUES(${resultRegseq},'${customerData.companyName}','${customerData.compType}','${customerData.orgType}','${customerData.rocNo}','${customerData.custCode}','${customerData.regType}','Active','${customerData.createdDate}','${customerData.createdBy}','','','Pending','${customerData.parentId}','${customerData.badDebt}','${customerData.parCompName}','${customerData.parCompRoc}','${customerData.appType}','','${customerData.agencyId}','${customerData.gstId}','${customerData.cpaStatus}','','${customerData.orgTypes}','${customerData.companyType}')`
    console.timeLog(query)
    return new Promise((resolve, reject) => {
        mainDb.InsertUpdateDeleteData(query, (error, data) => {
            if (error) {
                console.log("error" + error)
                return reject(`${error}, ${query}`)
            }
            return resolve(resultRegseq);
        })
    });


}
exports.MAIL_CONFIRMATION_TEXT = (reqEmail, userName) => {

    var reqEmail = reqEmail;
    var userName = userName;
    var enctyptData = Cryptr.encryptText(reqEmail);
    var mailConfirmationUrl = mf.compile(constants.SERVICE_URL_ROOT_BACKEND + constants.MAIL_CONFIRMATION_URL);
    mailConfirmationUrl = mailConfirmationUrl({ encryptedData: enctyptData });

    var mailTextContent = mf.compile(constants.MAIL_CONFIRMATION_TEXT);
    mailTextContent = mailTextContent({ USER_NAME: userName, MAIL_LINK: mailConfirmationUrl })

    var mailOptions = {
        from: 'escistest@sirim.my',
        to: reqEmail,
        subject: 'eSCIS Customer Portal: Registration Form Submission ',
        html: mailTextContent
    };

    return new Promise((resolve, reject) => {
        mailTransporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return reject(`${error}, ${error}`)
            }
            return resolve(info);

        })

    })

};
