let cpaStatusActionRepository = require('../../repositories/CustomersRepository/UpdateCPAStatus');
let newCustomerRegistrationLogic = require('../../repositories/CustomersRepository/NewCustomerRegistrationLogic')
let CRMIntegrationsLogic = require('./CRM_Integration')
let constants = require('./../../config/Constants')
let responseDto = require('../../config/ResponseDto')
let logger = require('../../logger')

// let cpaStatusActionByregisterId = async (req, res) => {
//     let obj = {};
//     try {

//         let customerData = req.body;
//         let userData = req.userData;
//         // var userData = req.userData
//         console.log("customerDatacustomerData \n" + JSON.stringify(customerData))
//         console.log("customerData.cpaStatus \n" + customerData.cpaStatus)
//         console.log("customerData.ActionType \n" + customerData.ActionType)
//         // console.log("userData userData userData userData\n" + JSON.stringify(userData));
//         let resultDatas = await cpaStatusActionRepository.Update_New_Customer_Registration(customerData).catch((e) => {
//             console.log(e);
//         });

//         if (customerData.ActionType === 'approve') {
//             if (customerData.cpaStatus === "Approve") {
//                 let mailConfirmDetails = await cpaStatusActionRepository.Generate_password(customerData, userData).catch((e) => {
//                     console.log(e);
//                 });
//                 let responce = await cpaStatusActionRepository.UpdateNewANdExistCustomer(customerData, customerData.ActionType)
//                 var searchrequestTime = new Date();
//                 let crmsearchResponse = await CRMIntegrationsLogic.serachCompany(customerData).then(async (searchResponse) => {

//                     let savesearchResponse = await cpaStatusActionRepository.INSERT_CRM_DETAILS(searchResponse)
//                     if (searchResponse.response === null) {
//                         CRMIntegrationsLogic.insertCompany(customerData).then(async (insertCompanyResponse) => {
//                             let savesearchResponse = await cpaStatusActionRepository.INSERT_CRM_DETAILS_INSERTCOMP(insertCompanyResponse)
//                             if (insertCompanyResponse.response.return.custcode != "") {
//                                 let resultCustomersdatas = await cpaStatusActionRepository.INSERT_CUSTOMERS_DETAILS(customerData, insertCompanyResponse.response.return.custcode);
//                                 let resultDatas = await cpaStatusActionRepository.UPDATE_CUSTOMER_CODE(customerData, insertCompanyResponse.response.return.custcode, insertCompanyResponse.response.return.crmid).catch((e) => {
//                                     console.log(e);
//                                 });
//                                 let resultusers = await cpaStatusActionRepository.UPDATE_CUSTOMER_USERS(customerData, insertCompanyResponse.response.return.custcode, insertCompanyResponse.response.return.crmid).catch((e) => {
//                                     console.log(e);
//                                 });
//                             }
//                         })
//                     }
//                 })
//             } else if (customerData.cpaStatus === 'Reject') {
//                 // let customerDetailsData = await cpaStatusActionRepository.customdetailsqueryData(customerData);
//                 // console.log("customerDetailsData-------->" + JSON.stringify(customerDetailsData));
//                 // let userListArray = [];
//                 // customerDetailsData.forEach(async element => {
//                 //     // let customerLoginDetails = await cpaStatusActionRepository.SAVE_USER_DETAILS_REJECT(element, customerData, userData);
//                 //     // console.log('element--> ' + customerDetailsData.length + " " + userListArray.length);
//                 //     // userListArray.push(customerLoginDetails);
//                 //     // if (customerDetailsData.length === userListArray.length) {
//                 //     var adminMail = customerData.adminemail;
//                 //     let responce = await cpaStatusActionRepository.MAIL_NOTIFICATION_FOR_CPA_CUSTOMER_STATUS_INFO(userListArray, adminMail, customerData, userData)
//                 //     console.log("Emaol Responce Approce \n" + JSON.stringify(res))
//                 //     // }
//                 // })

//                 let responce = await cpaStatusActionRepository.UpdateNewANdExistCustomer(customerData, customerData.ActionType)

//                 let resultCustomersdatas = await cpaStatusActionRepository.INSERT_CUSTOMERS_DETAILS_REJECT(customerData, '').then(async (responce) => {
//                     let mailConfirmDetails = await cpaStatusActionRepository.MAIL_NOTIFICATION_FOR_REJECTION(customerData, userData).catch((e) => {
//                         console.log(e);
//                     });
//                 });
//             }
//         } else if (customerData.ActionType === 'update') {



//             if (customerData.regType.trim() === "E") {
//                 if (customerData.cpaStatus === 'Approve') {
//                     let mailConfirmDetails = await cpaStatusActionRepository.Generate_password(customerData, userData)
//                 } else if (customerData.cpaStatus === 'Reject') {
//                     let mailConfirmDetails = await cpaStatusActionRepository.Generate_password_Reject(customerData, userData)
//                 }
//             } else {
//                 let responce = await cpaStatusActionRepository.UpdateNewANdExistCustomer(customerData, customerData.ActionType)
//                 // let resultCustomersdatas = await cpaStatusActionRepository.INSERT_CUSTOMERS_DETAILS(customerData, '').then(async (responce) => { });
//             }


//         }
//         res.json(obj);
//         // return (new responseDto(constants.STATUS_SUCCESS, '', obj));


//         // console.log("customerData.cpaStatus \n" + customerData.cpaStatus)
//         // if (customerData.cpaStatus === "Approve" || customerData.cpaStatus === 'Reject') {
//         //     if (customerData.ActionType === 'approve') {
//         //         let mailConfirmDetails = await cpaStatusActionRepository.Generate_password(customerData, userData).catch((e) => {
//         //             console.log(e);
//         //         });


//         //         var searchrequestTime = new Date();
//         //         let crmsearchResponse = await CRMIntegrationsLogic.serachCompany(customerData).then(async (searchResponse) => {

//         //             let savesearchResponse = await cpaStatusActionRepository.INSERT_CRM_DETAILS(searchResponse)

//         //             // console.log("SEARCH RESPONSE"+JSON.stringify(customerData));


//         //             if (searchResponse.response === null) {
//         //                 // console.log(customerData);

//         //                 //  console.log(JSON.stringify(resultCustomersdatas));
//         //                 //let  resultcustomeraddress=cpaStatusActionRepository.INSERT_CUSTOMERS_DETAILS_ADDRESS(customerData,resultCustomersdatas)
//         //                 CRMIntegrationsLogic.insertCompany(customerData).then(async (insertCompanyResponse) => {

//         //                     let savesearchResponse = await cpaStatusActionRepository.INSERT_CRM_DETAILS_INSERTCOMP(insertCompanyResponse)

//         //                     if (insertCompanyResponse.response.return.custcode != "") {
//         //                         let resultCustomersdatas = await cpaStatusActionRepository.INSERT_CUSTOMERS_DETAILS(customerData, insertCompanyResponse.response.return.custcode);
//         //                         let resultDatas = await cpaStatusActionRepository.UPDATE_CUSTOMER_CODE(customerData, insertCompanyResponse.response.return.custcode, insertCompanyResponse.response.return.crmid).catch((e) => {
//         //                             console.log(e);
//         //                         });
//         //                         let resultusers = await cpaStatusActionRepository.UPDATE_CUSTOMER_USERS(customerData, insertCompanyResponse.response.return.custcode, insertCompanyResponse.response.return.crmid).catch((e) => {
//         //                             console.log(e);
//         //                         });
//         //                     }


//         //                 })
//         //             }
//         //         })
//         //     } else {

//         //     }

//         // }
//         // else if (customerData.cpaStatus === "generate") {
//         //     //  console.log("log")
//         //     let mailConfirmDetails = await cpaStatusActionRepository.Generate_password(customerData, userData)
//         // }
//         // /*   if(customerData.cpaStatus==="Approve"){

//         //      //search Request
//         //     //  let responseresultcompany=await CRMIntegrationsLogic.serachCompany(customerData);

//         //                  //  console.log(responseresultcompany);
//         //       }
//         //       */

//         // else {
//         //     // console.log(customerData.cpaStatus)
//         //     let mailConfirmDetails = await cpaStatusActionRepository.MAIL_NOTIFICATION_FOR_REJECTION(customerData, userData).catch((e) => {
//         //         console.log(e);
//         //     });
//         //     console.log("mailConfirmDetails \n" + JSON.stringify(mailConfirmDetails))
//         // }


//         // var action = "CPASTATUS";
//         // var userName = "ADMMIN"
//         // let logEntry = await newCustomerRegistrationLogic.logAudit(customerData.registerId, userName, action).catch((e) => {

//         // });

//     }
//     catch (err) {
//         console.log(err);
//         res.json({ error: err });
//         // return (new responseDto(constants.STATUS_FAIL, err, ''));
//     }
// }

let cpaStatusActionByregisterId = async (req, res) => {
    let obj = {};
    try {

        let customerData = req.body;
        let userData = req.userData;
        // var userData = req.userData
        console.log("customerDatacustomerData \n" + JSON.stringify(customerData))
        console.log("customerData.cpaStatus \n" + customerData.cpaStatus)
        console.log("customerData.ActionType \n" + customerData.ActionType)


        if (customerData.ActionType === 'approve') {
            if (customerData.cpaStatus === "Approve") {
                let crmsearchResponse = await CRMIntegrationsLogic.serachCompany(customerData).then(async (searchResponse) => {
                    console.log("CRM Search Company responce\n" + JSON.stringify(searchResponse))
                    // if (searchResponse.response !== null) {

                    // } else {
                    //     return res.json(new responseDto(constants.STATUS_FAIL, '', ''))
                    // }
                    let savesearchResponse = await cpaStatusActionRepository.INSERT_CRM_DETAILS(searchResponse).catch((e) => {
                        console.log(e);
                    });

                    CRMIntegrationsLogic.insertCompany(customerData).then(async (insertCompanyResponse) => {

                        console.log("insertcompanyresinsertCompanyResponse\n" + JSON.stringify(insertCompanyResponse))

                        let custcode = insertCompanyResponse.response.return.custcode

                        console.log("custcode>>" + custcode)
                        let savesearchResponse = await cpaStatusActionRepository.INSERT_CRM_DETAILS_INSERTCOMP(insertCompanyResponse).catch((e) => {
                            console.log(e);
                        });

                        if (custcode !== "" && custcode !== undefined && custcode !== null) {
                            console.log("custocode>>2>" + insertCompanyResponse.response.return.custcode)
                            let resultData = await cpaStatusActionRepository.Update_New_Customer_Registration(customerData).catch((e) => {
                                console.log(e);
                            });
                            let mailConfirmDetails = await cpaStatusActionRepository.Generate_password(customerData, userData).catch((e) => {
                                console.log(e);
                            });
                            let responce = await cpaStatusActionRepository.UpdateNewANdExistCustomer(customerData, customerData.ActionType).catch((e) => {
                                console.log(e);
                            });
                            var searchrequestTime = new Date();





                            let resultCustomersdatas = await cpaStatusActionRepository.INSERT_CUSTOMERS_DETAILS(customerData, insertCompanyResponse.response.return.custcode).catch((e) => {
                                console.log(e);
                            });
                            let resultDatas = await cpaStatusActionRepository.UPDATE_CUSTOMER_CODE(customerData, insertCompanyResponse.response.return.custcode, insertCompanyResponse.response.return.crmid).catch((e) => {
                                console.log(e);
                            });
                            let resultusers = await cpaStatusActionRepository.UPDATE_CUSTOMER_USERS(customerData, insertCompanyResponse.response.return.custcode, insertCompanyResponse.response.return.crmid).catch((e) => {
                                console.log(e);
                            });
                            return res.json(new responseDto(constants.STATUS_SUCCESS, '', obj))
                        } else {
                            console.log("custocode>>1>" + insertCompanyResponse.response.return.custcode)
                            console.log("error")
                            return res.json(new responseDto(constants.STATUS_FAIL, '', ''))
                        }
                    }).catch((e) => {
                        console.log(e);
                    });

                }).catch((e) => {
                    console.log(e);
                });
            } else if (customerData.cpaStatus === 'Reject') {
                // let customerDetailsData = await cpaStatusActionRepository.customdetailsqueryData(customerData);
                // console.log("customerDetailsData-------->" + JSON.stringify(customerDetailsData));
                // let userListArray = [];
                // customerDetailsData.forEach(async element => {
                //     // let customerLoginDetails = await cpaStatusActionRepository.SAVE_USER_DETAILS_REJECT(element, customerData, userData);
                //     // console.log('element--> ' + customerDetailsData.length + " " + userListArray.length);
                //     // userListArray.push(customerLoginDetails);
                //     // if (customerDetailsData.length === userListArray.length) {
                //     var adminMail = customerData.adminemail;
                //     let responce = await cpaStatusActionRepository.MAIL_NOTIFICATION_FOR_CPA_CUSTOMER_STATUS_INFO(userListArray, adminMail, customerData, userData)
                //     console.log("Emaol Responce Approce \n" + JSON.stringify(res))
                //     // }
                // })
                let resultDatas = await cpaStatusActionRepository.Update_New_Customer_Registration(customerData).catch((e) => {
                    console.log(e);
                });

                let responce = await cpaStatusActionRepository.UpdateNewANdExistCustomer(customerData, customerData.ActionType).catch((e) => {
                    console.log(e);
                });

                let resultCustomersdatas = await cpaStatusActionRepository.INSERT_CUSTOMERS_DETAILS_REJECT(customerData, '').then(async (responce) => {
                    let mailConfirmDetails = await cpaStatusActionRepository.MAIL_NOTIFICATION_FOR_REJECTION(customerData, userData).catch((e) => {
                        console.log(e);
                    });
                });

                // return res.json(obj)
                return res.json(new responseDto(constants.STATUS_SUCCESS, '', obj))
            }
        } else if (customerData.ActionType === 'submitbtn') {

            console.log(customerData.ActionType);
            console.log(customerData.cpaStatus);

            let resultDatas = await cpaStatusActionRepository.Update_New_Customer_Registration(customerData).catch((e) => {
                console.log(e);
            });
            if (customerData.regType.trim() === "E") {
                if (customerData.cpaStatus === 'Approve') {
                    let mailConfirmDetails = await cpaStatusActionRepository.Generate_password(customerData, userData)
                } else if (customerData.cpaStatus === 'Reject') {
                    let mailConfirmDetails = await cpaStatusActionRepository.Generate_password_Reject(customerData, userData)
                }

            }


            // else {
            //     // let resultDatas = await cpaStatusActionRepository.Update_New_Customer_Registration(customerData).catch((e) => {
            //     //     console.log(e);
            //     // });

            //     let responce = await cpaStatusActionRepository.UpdateNewANdExistCustomer(customerData, customerData.ActionType)
            //     // let resultCustomersdatas = await cpaStatusActionRepository.INSERT_CUSTOMERS_DETAILS(customerData, '').then(async (responce) => { });
            // }

            return res.json(new responseDto(constants.STATUS_SUCCESS, '', obj))
        } else if (customerData.ActionType === 'update') {



            console.log("else if updatebtn>>" + JSON.stringify(customerData))

            console.log("else if customerData.ActionType>>" + customerData.ActionType)


            let resultDatas = await cpaStatusActionRepository.Update_New_Customer_Registration_For_Updatebtn(customerData).catch((e) => {
                console.log(e);
            });

            let responce = await cpaStatusActionRepository.UpdateNewANdExistCustomer_For_updatebtn(customerData).catch((e) => {
                console.log(e);
            });

            return res.json(new responseDto(constants.STATUS_SUCCESS, '', obj))
        }


    }
    catch (err) {
        console.log(err);
        // return res.json({ error: err });
        return res.json(new responseDto(constants.STATUS_FAIL, err, ''))
        //  return new responseDto(constants.STATUS_FAIL, error, err)


    }
}

let getUserDetails = async (req, res) => {

    let request = req.body;
    try {

        let users = await cpaStatusActionRepository.getUsersDetails(request).catch((e) => {
            console.log(e);
        });

        return res.json(new responseDto(constants.STATUS_SUCCESS, '', users));


    } catch (error) {
        logger.info("ERROR" + error)
        return res.json(new responseDto(constants.STATUS_FAIL, error, ''));
    }


}

let updateUserStatus = async (req, res) => {

    let request = req.body;
    let userData = req.userData;
    try {

        let users = await cpaStatusActionRepository.updateUsersStatus(request, userData).catch((e) => {
            console.log(e);
        });

        return res.json(new responseDto(constants.STATUS_SUCCESS, '', users));


    } catch (error) {
        logger.info("ERROR" + error)
        return res.json(new responseDto(constants.STATUS_FAIL, error, ''));
    }


}

let audit_log = async (req, res) => {
    let request = req.body;
    let userData = req.userData;
    try {
        let users = await newCustomerRegistrationLogic.logAudit(req).catch((e) => {
            console.log(e);
        });
        return res.json(new responseDto(constants.STATUS_SUCCESS, '', users));
    } catch (error) {
        logger.info("ERROR" + error)
        return res.json(new responseDto(constants.STATUS_FAIL, error, ''));
    }
}
let audit_log_loginUser = async (userData, req) => {
    try {
        let users = await newCustomerRegistrationLogic.LoginTimelogAudit(userData, req).catch((e) => {
            console.log(e);
        });
        return (new responseDto(constants.STATUS_SUCCESS, '', users));
    } catch (error) {
        logger.info("ERROR" + error)
        return (new responseDto(constants.STATUS_FAIL, error, ''));
    }
}
module.exports = {
    cpaStatusActionByregisterId, getUserDetails, updateUserStatus, audit_log, audit_log_loginUser
}