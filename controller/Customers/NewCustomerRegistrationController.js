let newCustomerRegistrationLogic = require('../../repositories/CustomersRepository/NewCustomerRegistrationLogic')
let constants = require('./../../config/Constants')
let responseDto = require('../../config/ResponseDto')


let saveCustomerDetails = async (req, res) => {
    let responseObj = {};
    try {

        let customerData = req.body
        let resultRegseq = await newCustomerRegistrationLogic.Get_Customer_Registration_Seq_Value().catch((e) => {
            responseObj.message = e
            return res.json(responseObj);

        });

        let resultRegDetails = await newCustomerRegistrationLogic.Insert_New_Customer_Registration(customerData, resultRegseq).catch((e) => {
            responseObj.message = e

            if (e) {
                responseObj.error = e
                return res.json(responseObj);
            }
            return res.json(responseObj);

        });
        let resultRegAddrseq = await newCustomerRegistrationLogic.Get_Customer_Registration_Address_Seq_Value().catch((e) => {
            responseObj.message = e

            if (e) {
                responseObj.error = e
                return res.json(responseObj);
            }
            return res.json(responseObj);


        });

        console.log("saveCustomerDetails")
        let resultAddressDetails = await newCustomerRegistrationLogic.Insert_New_Customer_Address(customerData, resultRegDetails, resultRegAddrseq).catch((e) => {
            responseObj.message = e
            if (e) {
                responseObj.error = e
                return res.json(responseObj);
            }
            return res.json(responseObj);
        });
        let resultRegContseq = await newCustomerRegistrationLogic.Get_Customer_Registration_Contact_Seq_Value().catch((e) => {
            responseObj.message = e
            if (e) {
                responseObj.error = e
                return res.json(responseObj);
            }
            return res.json(responseObj);

        });
        // var action = "Register"
        // let logEntry = await newCustomerRegistrationLogic.logAudit(resultRegseq, customerData.companyName, action).catch((e) => {

        //     responseObj.message = e
        //     if (e) {
        //         responseObj.error = e
        //         return res.json(responseObj);
        //     }
        //     return res.json("logEntry");
        // });
        let resultContactDetails1 = await newCustomerRegistrationLogic.Insert_New_Customer_Contact1(customerData, resultRegAddrseq, resultRegContseq).catch((e) => {

            responseObj.message = e
            if (e) {
                responseObj.error = e
                return res.json(responseObj);
            }
            return res.json(responseObj);
        });
        var email2 = customerData.email2;
        if (email2 != '') {
            let resultContactDetails2 = await newCustomerRegistrationLogic.Insert_New_Customer_Contact2(customerData, resultContactDetails1, resultRegContseq).catch((e) => {

                responseObj.message = e
                if (e) {
                    responseObj.error = e
                    return res.json(responseObj);
                }
                return res.json(responseObj);
            });
        }

        let adminDetails = await this.getAdminDetails('CPA');
        /* let adminDetails = await newCustomerRegistrationLogic.getAdminDetails('CPA').catch((e) => {
            responseObj.message = e
            if (e) {
                responseObj.error = e)
                return res.json(responseObj);
            }
            return res.json(responseObj);
        });
        console.log("adminDetails" + JSON.stringify(adminDetails))
        if (adminDetails == 'null' || adminDetails == null) {
            adminDetails = await newCustomerRegistrationLogic.getAdminDetails_Role('CPA').catch((e) => {
                responseObj.message = e
                if (e) {
                    responseObj.error = e
                    return res.json(responseObj);
                }
                return res.json(responseObj);
            });
        } */
        console.log("adminDetails" + JSON.stringify(adminDetails))
        let resultmailinfo = await newCustomerRegistrationLogic.MAIL_NOTIFICATION_FOR_CPA_CUSTOMER_INFO(customerData, adminDetails).catch((e) => {


            responseObj.message = e
            if (e) {
                responseObj.error = e
                return res.json(responseObj);
            }
            return res.json(responseObj);
        });

        return res.json("sucess");
    }

    catch (e) {
        // console.log("asjkdk")
        console.log(e);
        return res.json({ "error": e, 'error_message': 'failed' });
    }

}

let checkDuplicateEmail = async (req, res) => {

    try {
        let emailIds = req.body
        let falseValue = false;
        let email1 = emailIds.email1;
        console.log(emailIds.email1)
        // let email2 = emailIds.email2;
        let responceObject = await newCustomerRegistrationLogic.checkDuplicateEmailID(email1);
        if (responceObject != null) {
            return res.json("Faild");
        } else {
            return res.json("Sucess");
        }
    } catch (error) {
        console.log(error)
        return res.json("Faild");
    }
}
let check_roc = async (req, res) => {

    try {
        let rocno = req.body.roc_no

        console.log(rocno)
        // let email2 = emailIds.email2;


        let responceObject = await newCustomerRegistrationLogic.checkRoc_no(rocno);

        if (responceObject !== null && responceObject.length > 0) {

            return res.json(new responseDto(constants.STATUS_FAIL, '', 'ROC No Already Exisit'))

        }
        else {

            return res.json(new responseDto(constants.STATUS_SUCCESS, '', ""))
        }

    } catch (error) {
        console.log(error)
        return res.json(new responseDto(constants.STATUS_FAIL, '', 'Something Went Wrong'))
    }


}


let getCustomerList = async (req, res) => {

    try {

        let responceObject = await newCustomerRegistrationLogic.getCustomerList();

        return res.json(new responseDto(constants.STATUS_SUCCESS, '', responceObject))

    } catch (error) {
        console.log(error)
        return res.json(new responseDto(constants.STATUS_FAIL, '', 'Something Went Wrong'))
    }

}


let getAddressDetailsByCustCode = async (req, res) => {

    try {

        let responceObject = await newCustomerRegistrationLogic.getAddressDetailsByCustCode(req);

        return res.json(new responseDto(constants.STATUS_SUCCESS, '', responceObject))

    } catch (error) {
        console.log(error)
        return res.json(new responseDto(constants.STATUS_FAIL, '', 'Something Went Wrong'))
    }

}
exports.getAdminDetails = async (Role) => {
    let query = `select * from tbl_user where Role='${Role}'`
    let responseData = await mainDb.excuteSelectQuery(query);
    if(responseData==null)
    {
        //let query = `select * from tbl_user where Role='${Role}'`
        query = `select * from tbl_user where UserId=(select UserId from tbl_user_roles where Role='${Role}' and Status=1 )`;
        responseData = await mainDb.excuteSelectQuery(query);
    }
    return responseData;
}
module.exports = {
    saveCustomerDetails, checkDuplicateEmail, check_roc, getCustomerList, getAddressDetailsByCustCode
}