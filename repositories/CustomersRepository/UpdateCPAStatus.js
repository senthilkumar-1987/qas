const mainDb = require('../MainDb');
var generator = require('generate-password');
const Cryptr = require('../../config/encrypt.decrypt.service')

var constants = require('../../config/Constants');
var logger = require('../../logger');
const mailTransporter = require('../../config/mail-config')

const MessageFormat = require('messageformat');
const mf = new MessageFormat('en');
let newCustomerRegistrationLogic = require('../../repositories/CustomersRepository/NewCustomerRegistrationLogic')

exports.UPDATE_CUSTOMER_CODE = (customerData, custId, crmid) => {
    // logger.info("userData UPDATE_CUSTOMER_CODE\n " + JSON.stringify(userData))

    let query = `update TBL_SIRIM_CUSTOMERS SET cust_code=${custId},crmid='${crmid}',modified_Date='${customerData.date}',push_crm_status='Success' where register_id=${customerData.registerId}`
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
exports.UPDATE_CUSTOMER_USERS = (customerData, custId, crmid) => {

    let query = `update TBL_SIRIM_users SET cust_code=${custId} where register_id=${customerData.registerId}`
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
//Hari
// exports.Update_New_Customer_Registration = (customerData, resultRegseq) => {

//     cpaStatus = customerData.cpaStatus;
//     if (customerData.cpaStatus === 'generate') {
//         cpaStatus = 'Approve';
//     }

//     // let query = `update  TBL_SIRIM_CUSTOMERS SET company_name = '${customerData.companyName}', cpa_status= '${cpaStatus}', modified_By='${customerData.createdBy}',modified_Date='${customerData.date}',remarks='${customerData.comments}' where register_id=${customerData.registerId}
//     // update  TBL_SIRIM_CUSTOMERS_ADDRESS SET address1 = '${customerData.address1}', address2= '${customerData.address2}',post_code='${customerData.postCode}',division='${customerData.division}', 
//     //  where register_id=${customerData.registerId}`

//     let query = `update  TBL_SIRIM_CUSTOMERS SET company_name = '${customerData.companyName}', cpa_status= '${cpaStatus}', modified_By='${customerData.modifiedByName}',modified_Date=GETDATE(),remarks='${customerData.comments}' where register_Id='${customerData.registerId}';
//     update  TBL_SIRIM_CUSTOMERS_ADDRESS SET address1 = '${customerData.address1}', address2= '${customerData.address2}',post_code='${customerData.postCode}',division='${customerData.division}' where register_id='${customerData.registerId}'`

//     console.log(query)
//     return new Promise((resolve, reject) => {
//         mainDb.InsertUpdateDeleteData(query, (error, data) => {
//             if (error) {
//                 console.log("error" + error)
//                 return reject(`${error}, ${query}`)
//             }

//             return resolve(data);
//         })
//     });

// }

exports.Update_New_Customer_Registration = async (customerData, resultRegseq) => {

    let cpaStatus = customerData.cpaStatus;
    // if (customerData.cpaStatus === 'generate') {
    //     cpaStatus = 'Approve';
    // }

    // let query = `update  TBL_SIRIM_CUSTOMERS SET company_name = '${customerData.companyName}', cpa_status= '${cpaStatus}', modified_By='${customerData.createdBy}',modified_Date='${customerData.date}',remarks='${customerData.comments}' where register_id=${customerData.registerId}
    // update  TBL_SIRIM_CUSTOMERS_ADDRESS SET address1 = '${customerData.address1}', address2= '${customerData.address2}',post_code='${customerData.postCode}',division='${customerData.division}',
    //  where register_id=${customerData.registerId}`

    let query = `update  TBL_SIRIM_CUSTOMERS SET company_name = '${customerData.companyName}', cpa_status= '${cpaStatus}', modified_By='${customerData.modifiedByName}',modified_Date=GETDATE(),remarks='${customerData.comments}' where register_Id='${customerData.registerId}';
     update  TBL_SIRIM_CUSTOMERS_ADDRESS SET address1 = '${customerData.address1}', address2= '${customerData.address2}',address3='${customerData.address3}',post_code='${customerData.postCode}',division='${customerData.division}' where register_id='${customerData.registerId}'`

    //let query = `update  TBL_SIRIM_CUSTOMERS SET company_name = '${customerData.companyName}', cust_code='${customerData.custCode}', cpa_status= '${cpaStatus}', modified_By='${customerData.modifiedByName}',modified_Date=GETDATE(),remarks='${customerData.comments}' where register_Id='${customerData.registerId}';
    //update  TBL_SIRIM_CUSTOMERS_ADDRESS SET address1 = '${customerData.address1}', address2 = '${customerData.address2}', address3 = '${customerData.address3}', post_code = '${customerData.postCode}', division = '${customerData.division}' where register_id = '${customerData.registerId}'`


    for (let index = 0; index < customerData.registerDetails.length; index++) {
        const element = customerData.registerDetails[index];
        let updateContactPersonQuery = `update  tbl_sirim_customers_contact SET contact_person_name = '${element.contact_person_name}', faxno = '${element.faxno}', mobileno = '${element.mobileno}', designation = '${element.designation}' where Id = ${element.Id} `;
        await mainDb.executeQuery(updateContactPersonQuery);
        console.log("updateContactPersonQuery" + (updateContactPersonQuery))
    }

    return new Promise((resolve, reject) => {
        mainDb.InsertUpdateDeleteData(query, (error, data) => {
            if (error) {
                console.log("error" + error)
                return reject(`${error}, ${query} `)
            }

            return resolve(data);
        })
    });

}



exports.Generate_password = async (customerData, userData) => {
    var adminMail = customerData.adminemail;
    var customerLoginDetails = '';
    var status = customerData.email;

    // let customdetailsquery = `
    // select cust.register_id,cust.comp_roc_no, cn.emailaddr,cn.contact_person_name,cn.mail_verification, cust.company_name,cn.mobileno,cn.faxno,cust.remarks from tbl_sirim_customers cust,tbl_sirim_customers_contact cn,tbl_sirim_customers_address addr  where cust.register_id=${customerData.registerId} and addr.register_id=cust.register_id and cn.addr_id=addr.addr_id`
    // console.log(customdetailsquery);
    console.log("customerDetailsData-------->\n" + JSON.stringify(customerData));
    let customerDetailsData = await this.customdetailsqueryData(customerData);
    console.log("customerDetailsData-------->\n" + JSON.stringify(customerDetailsData));
    let userListArray = [];
    //   console.log('customerDetailsData--> '+customerDetailsData.length);
    customerDetailsData.forEach(async element => {
        console.log('element------>\n ' + JSON.stringify(element));
        let customerLoginDetails = await this.SAVE_USER_DETAILS(element, customerData, userData);

        userListArray.push(customerLoginDetails);
        if (customerDetailsData.length === userListArray.length) {
            let responce = await this.MAIL_NOTIFICATION_FOR_CPA_CUSTOMER_STATUS_INFO(userListArray, adminMail, customerData, userData)
            // console.log("Emaol Responce Approce \n" + JSON.stringify(res))

        }
    })

}

exports.Generate_password_Reject = async (customerData, userData) => {
    var adminMail = customerData.adminemail;
    var customerLoginDetails = '';
    var status = customerData.email;
    let customerDetailsData = await this.customdetailsqueryData(customerData);
    console.log("customerDetailsData-------->" + JSON.stringify(customerDetailsData));
    let userListArray = [];
    customerDetailsData.forEach(async element => {
        let customerLoginDetails = await this.SAVE_USER_DETAILS_REJECT_EXIST(element, customerData, userData);
        userListArray.push(customerLoginDetails);
    })
    let mailConfirmDetails = await this.MAIL_NOTIFICATION_FOR_REJECTION(customerData, userData).catch((e) => {
        console.log(e);
    });

}
exports.SAVE_USER_DETAILS = async (datas, customerData, userData) => {

    logger.info("SAVE_USER_DETAILS --> " + JSON.stringify(datas));

    var autoGeneratePassword = generator.generate({
        length: 10,
        numbers: true
    });
    var password = Cryptr.encryptText(autoGeneratePassword);
    let query = `
    INSERT INTO tbl_sirim_users(REGISTER_ID,cust_code,contact_person_name,username,password,status,first_login,
    created_date,created_by,modified_date,modified_by,role_id,secret_question,secret_answer,email,company_name,mobile_no,fax_no,remarks)
    VALUES(${datas.register_id},'${datas.cust_code}','${datas.contact_person_name}','${datas.emailaddr}','${password}','Active',
    'Y',GETDATE(),'${userData.username}',GETDATE(),'${userData.username}','1','','','${datas.emailaddr}','${datas.company_name}','${datas.mobileno}','${datas.faxno}','${datas.remarks}')`

    let responseData = await mainDb.InsertandReturnID(query);

    let mailUserLogData = await this.MAIL_NOTIFICATION_FOR_CUSTOMER_LOGIN_INFO(datas.emailaddr, customerData, userData)

    return mailUserLogData;
}


exports.SAVE_USER_DETAILS_REJECT_EXIST = async (datas, customerData, userData) => {

    logger.info("SAVE_USER_DETAILS --> " + JSON.stringify(datas));

    var autoGeneratePassword = generator.generate({
        length: 10,
        numbers: true
    });
    var password = Cryptr.encryptText(autoGeneratePassword);
    let query = `
    INSERT INTO tbl_sirim_users(REGISTER_ID,cust_code,contact_person_name,username,password,status,first_login,
    created_date,created_by,modified_date,modified_by,role_id,secret_question,secret_answer,email,company_name,mobile_no,fax_no,remarks)
    VALUES(${datas.register_id},'${datas.custCode}','${datas.contact_person_name}','${datas.emailaddr}','${password}','InActive',
    'Y',GETDATE(),'${userData.username}',GETDATE(),'${userData.username}','1','','','${datas.emailaddr}','${datas.company_name}','${datas.mobileno}','${datas.faxno}','${datas.remarks}')`

    let responseData = await mainDb.executeUpdateQuery(query);

    // console.log("responseData");
    // let mailUserLogData = await this.MAIL_NOTIFICATION_FOR_CUSTOMER_LOGIN_INFO(datas.emailaddr, customerData, userData)

    return responseData;
}

exports.SAVE_USER_DETAILS_REJECT = async (datas, customerData, userData) => {

    logger.info("SAVE_USER_DETAILS --> " + JSON.stringify(datas));

    var autoGeneratePassword = generator.generate({
        length: 10,
        numbers: true
    });
    var password = Cryptr.encryptText(autoGeneratePassword);
    let query = `
    INSERT INTO tbl_sirim_users(REGISTER_ID,cust_code,contact_person_name,username,password,status,first_login,
    created_date,created_by,modified_date,modified_by,role_id,secret_question,secret_answer,email,company_name,mobile_no,fax_no,remarks)
    VALUES(${datas.register_id},'${datas.cust_code}','${datas.contact_person_name}','${datas.emailaddr}','${password}','InActive',
    'Y',GETDATE(),'${userData.username}',GETDATE(),'${userData.username}','1','','','${datas.emailaddr}','${datas.company_name}','${datas.mobileno}','${datas.faxno}','${datas.remarks}')`
    console.log("responseData" + query);

    let responseData = await mainDb.InsertandReturnID(query);

    // let mailUserLogData = await this.MAIL_NOTIFICATION_FOR_CUSTOMER_LOGIN_INFO(datas.emailaddr, customerData, userData)

    return mailUserLogData;
}

exports.INSERT_CRM_DETAILS = async (searchCompResponse) => {

    logger.info("INSERT_CRM_DETAILS searchCompResponse \n" + JSON.stringify(searchCompResponse))
    let request = JSON.stringify(searchCompResponse.request);
    let response = JSON.stringify(searchCompResponse.response)
    let status = '';//JSON.stringify(searchCompResponse.response);

    let query = `
    INSERT INTO tbl_sirim_intg_req_res(service_type,webService_url,request_xml,response_xml,status,request_datetime,response_datetime)
                VALUES('${searchCompResponse.serviceType}','${searchCompResponse.serviceUrl}','${request}','${response}','${status}',${searchCompResponse.requestTime},${searchCompResponse.responseTime})`

    let responseData = await mainDb.InsertandReturnID(query);

}

exports.INSERT_CUSTOMERS_DETAILS = async (customerData, custId) => {

    let cpaStatus = 0
    if (customerData.cpaStatus = 'Approve') {
        cpaStatus = 1
    } else if (customerData.cpaStatus = 'Reject') {
        cpaStatus = 0
    } else {
        cpaStatus = 0
    }
    // console.log(customerData.cpaStatus + " Statusss cpaStatus " + status)
    let resultcustId = await this.InsertCustomerDetails(customerData, custId, cpaStatus);
    let resultaddrId = await this.INSERT_CUSTOMERS_DETAILS_ADDRESS(customerData, resultcustId, cpaStatus);
    if (resultaddrId != null) {
        let resultaddressId = await this.GetAddressId(resultcustId);
        customerData.registerDetails.forEach(async (element) => {
            let resultContactId = await this.SaveCustomerContact(element, resultaddressId.addrId, resultcustId, cpaStatus);
        });
    }
}



exports.INSERT_CUSTOMERS_DETAILS_REJECT = async (customerData, custId) => {

    let cpaStatus = 0
    // if (customerData.cpaStatus = 'Approve') {
    //     cpaStatus = 1
    // } else if (customerData.cpaStatus = 'Reject') {
    //     cpaStatus = 0
    // } else {
    //     cpaStatus = 0
    // }
    console.log(customerData.cpaStatus + " Statusss cpaStatus " + cpaStatus)
    let resultcustId = await this.InsertCustomerDetails(customerData, custId, cpaStatus);
    let resultaddrId = await this.INSERT_CUSTOMERS_DETAILS_ADDRESS(customerData, resultcustId, cpaStatus);
    if (resultaddrId != null) {
        let resultaddressId = await this.GetAddressId(resultcustId);
        customerData.registerDetails.forEach(async (element) => {
            let resultContactId = await this.SaveCustomerContact(element, resultaddressId.addrId, resultcustId, cpaStatus);
        });
    }
}


exports.SaveCustomerContact = async (customerData, addressId, custId, status) => {
    logger.info("customerData SaveCustomerContact\n" + JSON.stringify(customerData));
    // logger.info("addressId \n" + JSON.stringify(addressId));
    logger.info("custId \n" + JSON.stringify(custId));

    let query = `INSERT INTO tbl_contact(ContactName,OfficeNo,OfficeExtNo,MobileNo,FaxNo,EmailAddr,Department,Designation,Remark,Status,CustId,AddrId,ModifiedBy,ModifiedDate,CreatedBy,CreatedDate) VALUES('${customerData.contact_person_name}','${customerData.mobileno}','${customerData.officeextno}','','${customerData.faxno}','${customerData.emailaddr}','${customerData.department}','${customerData.designation}',null,${status},'${custId.CustId}','${addressId}',null,null,1,getdate())`
    logger.info("query \n" + query);
    let data = await mainDb.Insert_Return_id(query);

    return data;
}

exports.GetAddressId = async (custId) => {
    //console.log("custId"+custId)

    let query = `select addrId from tbl_address where custId='${custId.CustId}' `
    return new Promise((resolve, reject) => {
        mainDb.GetQueryData(query, (error, data) => {
            if (error) {
                return reject(`${error}, ${query}`)
            }
            // console.log(data);
            return resolve(data[0])
        })
    })
}

exports.InsertCustomerDetails = async (customerData, custId, status) => {
    console.log("InsertCustomerDetails tbl_customer\n" + JSON.stringify(customerData));
    logger.info("custId \n" + JSON.stringify(custId));
    let query = `INSERT INTO tbl_customer(CustCode,CompName,CompRoc,Type,CompSize,OrgType,ParentId,BadDebt,Status,CreatedBy,CreatedDate,ModifiedBy,ModifiedDate,ParCompName,ParCompRoc,Apptype,AgentDate,AgencyId,GSTId)
    OUTPUT INSERTED.CustId
  VALUES('${custId}','${customerData.registerDetails[0].company_name}','${customerData.registerDetails[0].comp_roc_no}','${customerData.registerDetails[0].company_type.trim()}',0,'${customerData.registerDetails[0].OrgCode}',0,0,${status},1,getdate(),null,null,null,null,'SCIS',null,null,null)`
    logger.info("query\n" + query)
    let data = await mainDb.Insert_Return_id(query);
    return data;


}

exports.INSERT_CUSTOMERS_DETAILS_ADDRESS = async (customerData, custId, status) => {
    // logger.info("\n\ncust  Id\n \n" + JSON.stringify(custId));
    let query = `INSERT INTO tbl_address(Address1,Address2,Address3,PostCode,City,StateCode,CountryCode,Division,Type,CustId,Status,ModifiedBy,ModifiedDate,CRMAddrId)
      
       VALUES('${customerData.registerDetails[0].address1}','${customerData.registerDetails[0].address2}','${customerData.registerDetails[0].address3}','${customerData.postCode}','${customerData.registerDetails[0].city_id}','${customerData.registerDetails[0].state_id}','${customerData.registerDetails[0].country_id}','${customerData.registerDetails[0].division}',1,'${custId.CustId}',${status},null,null,null)`

    // logger.info(query)
    let data = await mainDb.InsertandReturnID(query);
    return "Success"
}


exports.INSERT_CRM_DETAILS_INSERTCOMP = async (insertCompanyResponse) => {
    // logger.info("insertssCompanyResponse.response.return " + JSON.stringify(insertCompanyResponse.response.return))
    let status = insertCompanyResponse.response.return;
    let request = JSON.stringify(insertCompanyResponse.request);
    let response = JSON.stringify(insertCompanyResponse.response)
    let msg = JSON.stringify(insertCompanyResponse.response.return.msg);
    let query = `
    INSERT INTO tbl_sirim_intg_req_res(service_type,webService_url,request_xml,response_xml,status,request_datetime,response_datetime)
    VALUES('${insertCompanyResponse.serviceType}','${insertCompanyResponse.serviceUrl}','${request}','${response}','${msg}','${insertCompanyResponse.requestTime}','${insertCompanyResponse.responseTime}')`

    let responseData = await mainDb.InsertandReturnID(query);

}

exports.MAIL_NOTIFICATION_FOR_REJECTION = async (customerData, userData) => {

    var comments = customerData.comments;
    var userList = customerData.registerDetails;
    var adminMail = customerData.adminemail;
    let adminDetails = await this.getAdminDetails("CPA");

    console.log("userList \n" + JSON.stringify(userList))
    userList.forEach(async element => {
        this.MAIL_NOTIFICATION_FOR_CUSTOMER_REJECT_STATUS_INFO(element, comments, adminDetails[0].EmailAddr, userData);
    })

    this.MAIL_NOTIFICATION_FOR_CPA_REJECT_STATUS_INFO(customerData, comments, adminMail, adminDetails[0].EmailAddr, userData);

}

exports.MAIL_NOTIFICATION_FOR_CPA_REJECT_STATUS_INFO = async (customerData, comments, adminMail, CCEmail, userData) => {
    console.log("Admin customerData " + JSON.stringify(customerData))
    var companyName = customerData.companyName;
    let adminName = userData.email;

    var mailTextContent = mf.compile(constants.MAIL_NOTIFICATION_CUSTOM_REJECT_INFO);
    // console.log("Admin mailTextContent \n" + mailTextContent)
    mailTextContent = mailTextContent({
        contactName: companyName, Reason: comments, CPANAME: userData.contactPerson, CPAMAIL: userData.email

    })

    var mailOptions = {
        from: 'escistest@sirim.my',
        to: adminMail,
        cc: CCEmail,
        subject: 'eSCIS Customer Portal: Registration is Rejected (' + companyName + ')',
        html: mailTextContent
    };
    mailTransporter.sendMail(mailOptions, (error, info) => {
        // console.log(mailOptions);
        if (error) {
            return error
        }
        return resolve(info);

    })

}

exports.MAIL_NOTIFICATION_FOR_CUSTOMER_REJECT_STATUS_INFO = async (userList, comments, CCEmail, userData) => {

    // console.log("userList Element \n" + JSON.stringify(userList))
    var reqmail = userList.emailaddr;
    let CompanyName = userList.company_name
    var contactname = userList.contact_person_name;

    var mailTextContent = mf.compile(constants.MAIL_NOTIFICATION_CUSTOM_REJECT_INFO);
    console.log("Customer mailTextContent \n" + mailTextContent)
    mailTextContent = mailTextContent({
        contactName: CompanyName, Reason: comments, CPANAME: userData.contactPerson, CPAMAIL: userData.email

    })

    var mailOptions = {
        from: constants.From_Mail,
        to: reqmail,
        cc: CCEmail,
        subject: 'eSCIS Customer Portal: Registration is Rejected (' + CompanyName + ')',
        html: mailTextContent
    };
    mailTransporter.sendMail(mailOptions, (error, info) => {
        // console.log(mailOptions);
        if (error) {
            return error
        }
        return resolve(info);
    })
}


exports.MAIL_NOTIFICATION_FOR_CUSTOMER_LOGIN_INFO = async (email, customerData, userData) => {
    var array = [];
    let query = `select * from tbl_sirim_users where username='${email}'`
    let responseData = await mainDb.excuteSelectQuery(query);
    let adminDetails = await this.getAdminDetails("CPA");
    // let mailResponse = await sendMailToCustomer(responseData, adminDetails[0].email);
    let mailResponse = await sendMailToCustomer(responseData, adminDetails[0].EmailAddr, customerData, userData);

    return mailResponse;

}


exports.MAIL_NOTIFICATION_FOR_CPA_CUSTOMER_STATUS_INFO = (userList, adminMail, customerData, userData) => {
    // console.log(userList);
    var contactNames = []
    var userNames = [];
    var passwords = [];
    //  console.log("users" + JSON.stringify(userList))
    userList.forEach(element => {
        contactNames.push(element.name)
        userNames.push(element.userName)
        passwords.push(element.password)
    });
    var mailTextContent = mf.compile(constants.MAIL_NOTIFICATION_CPA_CUSTOM_APPR_INFO);
    mailTextContent = mailTextContent({
        contactNames: contactNames, userNames: userNames, passwords: passwords, CPANAME: userData.contactPerson, CPAMAIL: userData.email

    })

    var mailOptions = {
        from: 'escistest@sirim.my',
        to: customerData.adminMail,
        subject: 'eSCIS Customer Portal: Registration is Approved Login Credentials',
        html: mailTextContent
    };
    mailTransporter.sendMail(mailOptions, (error, info) => {
        // console.log(mailOptions);
        if (error) {
            return error
        }
        return resolve(info);



    })

}


exports.customdetailsqueryData = async (customerData) => {
    // console.log('customdetailsqueryData--> '+JSON.stringify(customerData));
    let customdetailsquery = `
    select cust.register_id,cust.cust_code,cust.comp_roc_no,cn.designation,cn.emailaddr,cn.contact_person_name,cn.mail_verification,cust.company_name,cn.mobileno,cn.faxno,cust.remarks from tbl_sirim_customers cust,tbl_sirim_customers_contact cn,tbl_sirim_customers_address addr  where cust.register_id=${customerData.registerId} and addr.register_id=cust.register_id and cn.addr_id=addr.addr_id`

    let responseData = await mainDb.excuteSelectQuery(customdetailsquery);
    return responseData;
}

async function sendMailToCustomer(data, adminMail, customerData, userData) {
    var reqEmail = data[0].username;

    var contactName1 = data[0].contact_person_name;
    var userName1 = data[0].username;
    var decryptPassword1 = Cryptr.decryptedText(data[0].password);
    var password1 = decryptPassword1

    let loginData = {
        userName: userName1,
        password: password1,
        name: contactName1
    }
    // , CPANAME: userData.contactPerson, CPAMAIL: userData.email

    var mailTextContent = mf.compile(constants.MAIL_NOTIFICATION_CUSTOM_APPR_INFO);
    mailTextContent = mailTextContent({
        contactName1: contactName1, userName1: userName1, password1: password1, CPANAME: userData.contactPerson, CPAMAIL: userData.email
    })
    var mailOptions = {
        from: 'escistest@sirim.my',
        to: reqEmail,
        cc: adminMail,
        subject: 'eSCIS Customer Portal: Registration is Approved ',
        html: mailTextContent
    };
    let mailInfo = await sendMailFunction(mailOptions);

    return loginData;
}

async function sendMailFunction(mailOptions) {
    mailTransporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return error
        }
        return resolve(info);

    })
}


exports.getUsersDetails = async (request) => {
    logger.info("getUsersDetails \n " + JSON.stringify(request))
    let query = `select * from tbl_sirim_users `

    if (request.userId && request.userId != '') {
        query += ` WHERE username like '%${request.userId}%' `;
    }
    if (request.CompanyName && request.CompanyName != '') {
        if (request.userId && request.userId != '') {
            query += ` AND company_name like '%${request.CompanyName}%'`;
        } else {
            query += ` WHERE company_name like '%${request.CompanyName}%'`;
        }
    }
    logger.info("getUsersDetails query\n " + query)
    let responseData = await mainDb.excuteSelectQuery(query);
    return responseData;
}


exports.updateUsersStatus = async (request, userData) => {
    logger.info("updateUsersStatus \n " + JSON.stringify(request))
    let query = `update tbl_sirim_users set status='${request.action}' ,modified_by='${userData.username}',modified_date=GETDATE() where id=${request.id} AND username='${request.username}'`
    logger.info("updateUsersStatus query\n " + query)
    let responseData = await mainDb.excuteSelectQuery(query);
    return responseData;
}

exports.getAdminDetails = async (Role) => {
    let query = `select * from tbl_user where Role='${Role}'`
    let responseData = await mainDb.excuteSelectQuery(query);
    if (responseData == null) {
        //let query = `select * from tbl_user where Role='${Role}'`
        query = `select * from tbl_user where UserId=(select UserId from tbl_user_roles where Role='${Role}' and Status=1 )`;
        responseData = await mainDb.excuteSelectQuery(query);
    }
    return responseData;
}


exports.UpdateNewANdExistCustomer = async (customerData, actionType) => {

    console.log(customerData.cpaStatus + " " + actionType)
    let cpaStatus = customerData.cpaStatus;
    if (customerData.cpaStatus === 'generate') {
        cpaStatus = 'Approve';
    }
    let exeQuery = ''
    if (actionType === 'update') {
        exeQuery = `update  TBL_SIRIM_CUSTOMERS SET company_name = '${customerData.companyName}', cpa_status= 'PENDING', modified_By='${customerData.modifiedByName}',modified_Date=GETDATE(),remarks='${customerData.comments}' where register_Id='${customerData.registerId}';
        update  TBL_SIRIM_CUSTOMERS_ADDRESS SET address1 = '${customerData.address1}', address2= '${customerData.address2}',address3='${customerData.address3}',post_code='${customerData.postCode}',division='${customerData.division}' where register_id='${customerData.registerId}'`
    } else {
        exeQuery = `update  TBL_SIRIM_CUSTOMERS SET company_name = '${customerData.companyName}', cpa_status= '${customerData.cpaStatus}', modified_By='${customerData.modifiedByName}',modified_Date=GETDATE(),remarks='${customerData.comments}' where register_Id='${customerData.registerId}';
        update  TBL_SIRIM_CUSTOMERS_ADDRESS SET address1 = '${customerData.address1}', address2= '${customerData.address2}',address3='${customerData.address3}',post_code='${customerData.postCode}',division='${customerData.division}' where register_id='${customerData.registerId}'`
    }
    console.log('exeQuery\n' + exeQuery)
    await mainDb.executeUpdateQuery(exeQuery);

    for (let index = 0; index < customerData.registerDetails.length; index++) {
        const element = customerData.registerDetails[index];
        let updateContactPersonQuery = `update  tbl_sirim_customers_contact SET contact_person_name = '${element.contact_person_name}', faxno= '${element.faxno}',mobileno='${element.mobileno}',designation='${element.designation}' where Id=${element.contact_id}`;
        await mainDb.executeUpdateQuery(updateContactPersonQuery);
        console.log("updateContactPersonQuery" + (updateContactPersonQuery))
    }
}

exports.Update_New_Customer_Registration_For_Updatebtn = async (customerData, resultRegseq) => {

    // let cpaStatus = customerData.cpaStatus;


    console.log("customerData.companyName>>" + customerData.companyName)

    let query = `update  TBL_SIRIM_CUSTOMERS SET company_name = '${customerData.companyName}',modified_By='${customerData.modifiedByName}',modified_Date=GETDATE(),remarks='${customerData.comments}' where register_Id='${customerData.registerId}';
    update  TBL_SIRIM_CUSTOMERS_ADDRESS SET address1 = '${customerData.address1}', address2= '${customerData.address2}',address3='${customerData.address3}',post_code='${customerData.postCode}',division='${customerData.division}' where register_id='${customerData.registerId}'`

    console.log("Update_New_Customer_Registration>>" + query)


    for (let index = 0; index < customerData.registerDetails.length; index++) {
        const element = customerData.registerDetails[index];
        let updateContactPersonQuery = `update  tbl_sirim_customers_contact SET contact_person_name = '${element.contact_person_name}', faxno = '${element.faxno}', mobileno = '${element.mobileno}', designation = '${element.designation}' where Id = ${element.Id} `;
        await mainDb.executeQuery(updateContactPersonQuery);
        console.log("updateContactPersonQuery" + (updateContactPersonQuery))
    }

    return new Promise((resolve, reject) => {
        mainDb.InsertUpdateDeleteData(query, (error, data) => {
            if (error) {
                console.log("error" + error)
                return reject(`${error}, ${query} `)
            }

            return resolve(data);
        })
    });

}


exports.UpdateNewANdExistCustomer_For_updatebtn = async (customerData) => {

    exeQuery = `update  TBL_SIRIM_CUSTOMERS SET company_name = '${customerData.companyName}', cpa_status= 'PENDING', modified_By='${customerData.modifiedByName}',modified_Date=GETDATE(),remarks='${customerData.comments}' where register_Id='${customerData.registerId}';
    update  TBL_SIRIM_CUSTOMERS_ADDRESS SET address1 = '${customerData.address1}', address2= '${customerData.address2}',address3='${customerData.address3}',post_code='${customerData.postCode}',division='${customerData.division}' where register_id='${customerData.registerId}'`

    console.log('exeQuery\n' + exeQuery)
    await mainDb.executeUpdateQuery(exeQuery);

    for (let index = 0; index < customerData.registerDetails.length; index++) {
        const element = customerData.registerDetails[index];
        let updateContactPersonQuery = `update  tbl_sirim_customers_contact SET contact_person_name = '${element.contact_person_name}', faxno= '${element.faxno}',mobileno='${element.mobileno}',designation='${element.designation}' where Id=${element.contact_id}`;
        await mainDb.executeUpdateQuery(updateContactPersonQuery);
        console.log("updateContactPersonQuery" + (updateContactPersonQuery))
    }
}