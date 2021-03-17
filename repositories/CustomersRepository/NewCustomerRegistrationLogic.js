'use strict'
const mainDb = require('../MainDb');
const SCISDbConfig = require('../../config/SCISDbConfig');

const Cryptr = require('../../config/encrypt.decrypt.service')

var constants = require('../../config/Constants');
const mailTransporter = require('../../config/mail-config')

const MessageFormat = require('messageformat');
const mf = new MessageFormat('en');



//Get Customer Seq Value
exports.Get_Customer_Registration_Seq_Value = () => {

    return new Promise((resolve, reject) => {
        let query = `SELECT NEXT VALUE FOR REGISTER_ID_SEQ  as seqNo`
        mainDb.GetQueryData(query, (error, data) => {
            if (error) {
                return reject(`${error}, ${query}`)
            }


            let sequenceNo = data[0].seqNo;
            seqNo = sequenceNo;


            return resolve(sequenceNo)
        })
    })

}
//Get Customer address Reg Seq Value
var seqNo = "";
exports.Get_Customer_Registration_Address_Seq_Value = () => {

    return new Promise((resolve, reject) => {
        let query = `SELECT NEXT VALUE FOR ADDRESS_ID_SEQ  as seqNo`
        mainDb.GetQueryData(query, (error, data) => {
            if (error) {
                return reject(`${error}, ${query}`)
            }
            let sequenceNo = data[0].seqNo;
            return resolve(sequenceNo)
        })
    })
}
//Get Customer address Reg Seq Value
var seqNo = "";
exports.Get_Customer_Registration_Contact_Seq_Value = () => {
    return new Promise((resolve, reject) => {
        let query = `SELECT NEXT VALUE FOR CONTACT_ID_SEQ  as seqNo`
        mainDb.GetQueryData(query, (error, data) => {
            if (error) {
                return reject(`${error}, ${query}`)
            }
            let sequenceNo = data[0].seqNo;
            return resolve(sequenceNo)
        })
    })
}

//Inser New Customer Registration

exports.Insert_New_Customer_Registration = (customerData, resultRegseq) => {
    let query = `INSERT INTO TBL_SIRIM_CUSTOMERS(REGISTER_ID,COMPANY_NAME,COMPANY_TYPE,ORG_TYPE,COMP_ROC_NO,CUST_CODE,reg_Type,STATUS,CREATED_DATE,CREATED_BY,modified_Date,modified_By,PUSH_CRM_STATUS,PARENT_ID,BAD_DEBT,PAR_COMP_NAME,PAR_COMP_ROC,APP_TYPE,AGENT_DATE,AGENCY_ID,GST_ID,CPA_STATUS,remarks,org_name,comp_type_name)
    VALUES(${resultRegseq},'${customerData.companyName}','${customerData.compType}','${customerData.orgType}','${customerData.rocNo}','${customerData.custCode}','${customerData.regType}','Active','${customerData.createdDate}','${customerData.createdBy}',NULL,'${customerData.modifiedBy}','Pending','${customerData.parentId}','${customerData.badDebt}','${customerData.parCompName}','${customerData.parCompRoc}','${customerData.appType}','${customerData.agentDate}','${customerData.agencyId}','${customerData.gstId}','${customerData.cpaStatus}','${customerData.remarks}','${customerData.orgTypeName}','${customerData.comptypename}')`




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

//Insert New Customer Registration Address
exports.Insert_New_Customer_Address = (customerData, registerId, addressId) => {

    console.log("customerData 89\n" + JSON.stringify(customerData))
    let query = `INSERT INTO TBL_SIRIM_CUSTOMERS_ADDRESS(REGISTER_ID,addr_id,address1,address2,address3,post_code,country_id,country_name,country_code,state_id,state_name,state_code,city_id,city_name,city_code,address_type,division,addr_type,status)
    VALUES(${registerId},${addressId},'${customerData.address1}','${customerData.address2}','${customerData.address3}','${customerData.postCode}',${customerData.countryId},'${customerData.countryName}','${customerData.countryCode}',${customerData.stateId},'${customerData.stateName}','${customerData.stateCode}',${customerData.cityId},'${customerData.cityName}','${customerData.cityCode}','${customerData.addressType}','${customerData.division}',1,'Active')`

    return new Promise((resolve, reject) => {
        mainDb.InsertUpdateDeleteData(query, (error, data) => {
            if (error) {
                return reject(`${error}, ${query}`)
            }
            return resolve(addressId);
        })
    });
}
//Inser New Customer Registration contact1

exports.Insert_New_Customer_Contact1 = (customerData, addressId, contactId) => {


    let query = `INSERT INTO tbl_sirim_customers_contact(contact_id,addr_id,contact_person_name,mobileno,emailaddr,faxno,mail_verification,officeno,officeextno,department,designation,remarks,status)
    VALUES(${contactId},${addressId},'${customerData.contactPersonName1}','${customerData.contactNo1}','${customerData.email1}','${customerData.faxNo1}','N','${customerData.officeNo}','${customerData.officeextno}','${customerData.department}','${customerData.designation1}','${customerData.remarks}','Active')`

    try {

        let Emailsend = this.MAIL_CONFIRMATION_TEXT(customerData.email1, customerData.contactPersonName1);
    }
    catch (err) {
        console.log(err);

    }

    // this.MAIL_CONFIRMATION_TEXT(customerData.email1, customerData.contactPersonName1);
    return new Promise((resolve, reject) => {
        mainDb.InsertUpdateDeleteData(query, (error, data) => {
            if (error) {
                return reject(`${error}, ${query}`)
            }
            return resolve(addressId);
        })
    });
}
exports.Insert_New_Customer_Contact2 = (customerData, addressId, contactId) => {

    console.log("customerData  \n" + JSON.stringify(customerData))
    console.log("addressId  \n" + JSON.stringify(addressId))
    console.log("contactId  \n" + JSON.stringify(contactId))
    let query = `INSERT INTO tbl_sirim_customers_contact(contact_id,addr_id,contact_person_name,mobileno,emailaddr,faxno,mail_verification,officeno,officeextno,department,designation,remarks,status)
    VALUES(${contactId},${addressId},'${customerData.contactPersonName2}','${customerData.contactNo2}','${customerData.email2}','${customerData.faxNo2}','N','${customerData.officeNo}','${customerData.officeextno}','${customerData.department}','${customerData.designation2}','${customerData.remarks}','Active')`

    console.log(query)
    try {
        let Emailsend2 = this.MAIL_CONFIRMATION_TEXT(customerData.email2, customerData.contactPersonName2);
    }
    catch (err) {
        console.log(err);

    }
    // this.MAIL_CONFIRMATION_TEXT(customerData.email2, customerData.contactPersonName2);
    return new Promise((resolve, reject) => {
        mainDb.InsertUpdateDeleteData(query, (error, data) => {
            if (error) {
                return reject(`${error}, ${query}`)
            }
            return resolve(addressId);
        })
    });

}

exports.mailConfirmationValidation = (mailId) => {

    var mailInfo = "";
    let query = `SELECT  cont.mail_verification ,cust.register_id FROM TBL_SIRIM_CUSTOMERS_CONTACT cont,TBL_SIRIM_CUSTOMERS cust,TBL_SIRIM_CUSTOMERS_ADDRESS address WHERE cont.emailaddr='${mailId}' and cont.addr_id=address.addr_id AND address.register_id=cust.register_id`

    return new Promise((resolve, reject) => {
        mainDb.GetQueryData(query, (error, data) => {
            if (error) {
                return reject(`${error}, ${query}`)
            }

            var flag = data[0].mail_verification;

            var status = flag.replace(/\s/g, '');


            if (status == 'Y') {
                mailInfo = "Already Done";
            } else {
                this.mailConfirmation(mailId);
                mailInfo = "Regisiterd";
            }
            var mailInformation = {}

            mailInformation.mailStatus = mailInfo;
            mailInformation.registerId = data[0].register_id
            return resolve(mailInformation);
        })
    });

}

exports.logAudit = (req) => {
    let registerId = req.userData.id;
    let action_data = req.body.action;
    let screen_name = req.body.screen;
    let customer_name = req.userData.contactPerson
    let user_name = req.userData.username;
    let cust_id = req.userData.custId
    // let company_name =req.userData.
    let company_name = req.userData.companyName

    console.log("req>>>" + action_data + "" + screen_name)

    let query = `INSERT INTO TBL_SIRIM_CUSTOMER_AUDIT_LOG(ACTION_TYPE,REGISTER_ID,CREATED_BY,CREATED_DATE,screen_name,customer_name,user_name,cust_id,company_name)values(
        '${action_data}',${registerId},'${user_name}',GETDATE(),'${screen_name}','${customer_name}','${user_name}','${cust_id === null ? "" : cust_id}','${company_name}')`


    console.log(query)

    return new Promise((resolve, reject) => {
        mainDb.InsertUpdateDeleteData(query, (error, data) => {
            if (error) {
                return reject(`${error}, ${query}`)
            }

            return resolve(data);
        })
    });

}

exports.LoginTimelogAudit = (userData, req) => {

    console.log("userdata userdatauserdata\n " + JSON.stringify(userData))
    console.log("reqreqreqreq \n" + JSON.stringify(req))
    let registerId = userData.id;
    let action_data = req.action;
    let screen_name = req.screen;
    let customer_name = userData.contactPerson
    let user_name = userData.username === undefined ? '' : userData.username;
    let company_name = userData.companyName && userData.companyName !== undefined ? userData.companyName : "";
    let custid = userData.custId === undefined ? '' : userData.custId;
    console.log("req>>>" + action_data + "" + screen_name)

    let query = `INSERT INTO TBL_SIRIM_CUSTOMER_AUDIT_LOG(ACTION_TYPE,REGISTER_ID,CREATED_BY,CREATED_DATE,screen_name,customer_name,user_name,company_name,cust_id)values(
        '${action_data}',${registerId},'${user_name}',GETDATE(),'${screen_name}','${customer_name}','${user_name}','${company_name}','${custid}')`

    return new Promise((resolve, reject) => {
        mainDb.InsertUpdateDeleteData(query, (error, data) => {
            if (error) {
                return reject(`${error}, ${query}`)
            }

            return resolve(data);
        })
    });

}


exports.mailConfirmation = (mailId) => {

    let query = `update TBL_SIRIM_CUSTOMERS_CONTACT set mail_verification='Y' WHERE emailaddr='${mailId}'`

    return new Promise((resolve, reject) => {
        mainDb.InsertUpdateDeleteData(query, (error, data) => {
            if (error) {
                return reject(`${error}, ${query}`)
            }

            return resolve(data);
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



exports.MAIL_NOTIFICATION_FOR_CPA_CUSTOMER_INFO = (customerData, adminDetails) => {
    var companyName = customerData.companyName;
    var reqEmail = adminDetails[0].EmailAddr;
    //console.log("reqMail"+reqEmail);

    var userName = adminDetails.contact_person_name;

    var mailTextContent = mf.compile(constants.MAIL_NOTIFICATION_CUSTOM_INFO);
    mailTextContent = mailTextContent({ USER_NAME: userName, COMPANY_NAME: companyName })

    var mailOptions = {
        from: 'escistest@sirim.my',
        to: reqEmail,
        subject: 'eSCIS Customer Portal: New Customer Registration ',
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



exports.Get_UserDetails_ByUserId = (userId) => {
    return new Promise((resolve, reject) => {
        let query = `SELECT * FROM TBL_USERS WHERE ID=${userId}`
        mainDb.GetQueryData(query, (error, data) => {
            if (error) {
                return reject(`${error}, ${query}`)
            }
            return resolve(data)
        })
    })
}

exports.User_FirstLogin_ResetPassword = (data) => {
    let query = `UPDATE tbl_users SET `
    let count = 0

    if (data.newPassword !== undefined) {
        query += `password = '${data.NewPassword}'`
        count += 1
    }
    if (data.firstLogin !== undefined) {
        if (count > 0) { query += ',' }
        query += `first_login = '${data.firstLogin}'`
        count += 1
    }
    if (data.secretQuestion !== undefined) {
        if (count > 0) { query += ',' }
        query += `secret_question = '${data.secretQuestion}'`
        count += 1
    }
    if (data.secretAnswer !== undefined) {
        if (count > 0) { query += ',' }
        query += `secret_answer = '${data.secretAnswer}'`
        count += 1
    }

    query += ` WHERE id = ${data.id}`

    if (count > 0) {
        return new Promise((resolve, reject) => {
            mainDb.InsertUpdateDeleteData(query, (error, data) => {
                if (error) {
                    return reject(`${error}, ${query}`);
                }
                return resolve(data);
            });
        })
    }
}



exports.checkDuplicateEmailID = (email1) => {
    return new Promise((resolve, reject) => {
        // let query = `select * from tbl_sirim_customers_contact where emailaddr='${email1}'`
 
        let query=`select *  from tbl_sirim_customers cust  
        inner Join tbl_sirim_customers_address addr On  addr.register_id=cust.register_id
        inner join tbl_sirim_customers_contact cont on  cust.register_id = addr.register_id 
        where  addr.addr_id=cont.addr_id AND cust.cpa_status in ('Rejected') AND cont.emailAddr='${email1}'`

        console.log(query);
        mainDb.GetQueryData(query, (error, data) => {
            if (error) {
                return reject(`${error}, ${query}`)
            }
            return resolve(data)
        })
    })
}


// exports.getAdminDetails = async (Role) => {
//     return new Promise((resolve, reject) => {
//         // let query = `select * from tbl_user where Role='${Role}'`
//         let query = `Select * from tbl_user where Role = 'CPA'`
//         mainDb.GetQueryData(query, (error, data) => {
//             if (error) {
//                 return reject(`${error}, ${query}`)
//             }
//             return resolve(data)
//         })
//     })
// }

exports.getAdminDetails = async (Role) => {
    return new Promise((resolve, reject) => {
        // let query = select * from tbl_user where Role='${Role}'
        let query = `Select * from tbl_user where Role = '${Role}'`

        console.log(query)
        mainDb.GetQueryData(query, (error, data) => {
            if (error) {
                return reject(`${error}, ${query}`)
            }
            return resolve(data)
        })
    })
}


exports.getAdminDetails_Role = async (Role) => {
    return new Promise((resolve, reject) => {
        // let query = select * from tbl_user where Role='${Role}'
        query = `select * from tbl_user where UserId=(select UserId from tbl_user_roles where Role='${Role}' and Status=1 )`;

        console.log(query)
        mainDb.GetQueryData(query, (error, data) => {
            if (error) {
                return reject(`${error}, ${query}`)
            }
            return resolve(data)
        })
    })
}

exports.getCustomerdata = async (username) => {

    return new Promise((resolve, reject) => {

        let query = `Select * from tbl_sirim_users where username = '${username}'`

        console.log(query)

        mainDb.GetQueryData(query, (error, data) => {
            if (error) {
                return reject(`${error}, ${query}`)
            }
            return resolve(data)
        })
    })


}

exports.checkRoc_no = async (rocno) => {

    return new Promise((resolve, reject) => {

        let query = ` select * from  TBL_SIRIM_CUSTOMERS WHERE  comp_roc_no ='${rocno}'`

        console.log(query)

        mainDb.GetQueryData(query, (error, data) => {
            if (error) {
                return reject(`${error}, ${query}`)
            }
            return resolve(data)
        })
    })


}


exports.getCustomerList = async () => {

    let query = `SELECT DISTINCT CustCode,CustId,CompName from tbl_customer WHERE Status ='1' AND CustCode != ''`

    console.log(query)

    return await SCISDbConfig.executeQuery(query);

}

exports.getAddressDetailsByCustCode = async (req) => {

    let CustId = req.body.CustId;

    // let query = `SELECT *,(SELECT CountryName FROM tbl_country c WHERE c.CountryId=t.CountryCode) AS CountryName,(SELECT StateName FROM tbl_state s WHERE s.StateId=t.StateCode AND s.CountryId=t.CountryCode) AS StateName,(SELECT CityName FROM tbl_city ci WHERE ci.RecId=t.City AND ci.StateId=t.StateCode) AS CityName FROM tbl_address t WHERE CustId = '${CustId}'`

    let query = `SELECT *,(SELECT CountryName FROM tbl_country c WHERE c.CountryId=t.CountryCode) AS CountryName,(SELECT CountryId FROM tbl_country c where c.CountryId=t.CountryCode ) As CountryId,
    (SELECT StateName FROM tbl_state s WHERE s.StateId=t.StateCode AND s.CountryId=t.CountryCode) AS StateName,(SELECT StateId FROM tbl_state s WHERE s.StateId=t.StateCode AND s.CountryId=t.CountryCode) As StateId, 
    (SELECT CityName FROM tbl_city ci 
    WHERE ci.RecId=t.City AND ci.StateId=t.StateCode) AS CityName ,(SELECT RecId FROM tbl_city ci 
    WHERE ci.RecId=t.City AND ci.StateId=t.StateCode) As Cityid
    FROM tbl_address t WHERE CustId = '${CustId}'`


    console.log(query)

    return await SCISDbConfig.executeQuery(query);

}
