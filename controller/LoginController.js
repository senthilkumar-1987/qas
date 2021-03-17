
let loginRepository = require('../repositories/LoginRepository');
let constants = require('../config/Constants')
let encryptDecryptService = require('../repositories/CommonRepository/EncryptDecryptLogic')
let jwt = require('jsonwebtoken');
const Cryptr = require('../config/encrypt.decrypt.service')
const logger = require('../logger')
const inputPattern = require('../inputPattern')
const responseDto = require('../config/ResponseDto')
const cpaStatusController = require('../controller/Customers/CpaStatusActionController');
let securityConfig = require('../config/SecurityConfig')

let login = async (req, res) => {
    let responseObj = {};
    let userData = null;
    try {

        let reqUsername = req.body.userName;
        let password = req.body.passWord;
        logger.info("USerName " + reqUsername + "\nPassword " + password + "\n")
        var passWord = Cryptr.encryptText(password);

        // logger.info("Enctept Password " + passWord + "\n")
        let result = inputPattern.loginIdMailValidation(reqUsername);
        console.log("Email Result:" + result);
        logger.info("This Is Email --> " + result + "")

        if (result) {
            userData = await loginRepository.login(reqUsername).catch((e) => {
                responseObj.auth = false;
                responseObj.accessToken = null;
                responseObj.status = constants.STATUS_FAIL;
                responseObj.message = 'UserName or Passowrd is Invalid!';
                console.log("\n" + e + "\n");
                res.json(new responseDto(constants.STATUS_FAIL, responseObj, ''));
            });
            logger.info("userData TBL_SIRIM_USER \n" + JSON.stringify(userData))
            if (userData != null && userData[0].status === 'Active') {
                // logger.info("userData TBL_SIRIM_USER \n" + JSON.stringify(userData))
                var decryptPassword = userData[0].password;
                var passWord = Cryptr.encryptText(password);
                console.log("passWordissss \n" + decryptPassword)
                console.log("Password is ==> : \n  " + Cryptr.decryptedText(userData[0].password))
                let passwordIsValid = compareTwoStrings(decryptPassword, passWord);

                if (!passwordIsValid) {
                    responseObj.auth = false;
                    responseObj.accessToken = null;
                    responseObj.reason = 'UserName or Passowrd is Invalid!';
                    responseObj.message = 'UserName or Passowrd is Invalid!';
                    // return res.json(responseObj); //Kathir
                    return res.json(new responseDto(constants.STATUS_FAIL, responseObj, ''))
                } else {
                    var token = jwt.sign({ id: userData[0].register_id, roleId: userData[0].role_id, email: userData[0].email, username: userData[0].username, contactPerson: userData[0].contact_person_name, firstLogin: userData[0].first_login.trim(), custId: userData[0].cust_code, companyName: userData[0].company_name }, securityConfig.secret, {
                        expiresIn: '1h'//1h Refer https://www.npmjs.com/package/jsonwebtoken
                    });
                    responseObj.auth = true;
                    responseObj.id = userData[0].register_id
                    responseObj.accessToken = token;
                    if (userData[0].first_login.trim() === 'Y') {
                        var temppass = Cryptr.decryptedText(userData[0].password);
                        responseObj.temp = temppass
                    }
                    let commonObj = [];
                    let roleSet = new Set();
                    let obj = { 'role': userData[0].role_id };
                    commonObj.push(obj);
                    responseObj.roleId = commonObj;

                    // responseObj.roleId = userData[0].role_id;
                    responseObj.companyName = userData[0].company_name;
                    responseObj.firstLogin = userData[0].first_login.trim();
                    responseObj.email = userData[0].email;
                    responseObj.custId = userData[0].cust_code;
                    responseObj.contactPerson = userData[0].contact_person_name;
                    responseObj.username = userData[0].username;
                    //return res.json(responseObj); //Kathir
                    let audit = { action: 'Login', screen: 'Login' }
                    cpaStatusController.audit_log_loginUser(responseObj, audit).then((responce) => {
                        console.log(responce)
                    })
                    return res.json(new responseDto(constants.STATUS_SUCCESS, '', responseObj))
                    //   res.status(200).send({ auth: true, accessToken: token });
                }
            } else {
                if (userData != null && userData[0].status === 'InActive') {
                    responseObj.auth = false;
                    responseObj.accessToken = null;
                    responseObj.message = 'UserName has been InActive. Please Contact Administrator'
                    responseObj.status = constants.STATUS_FAIL
                    // return res.json(responseObj); //Kathir
                    return res.json(new responseDto(constants.STATUS_FAIL, responseObj, ''))
                } else {
                    responseObj.auth = false;
                    responseObj.accessToken = null;
                    responseObj.message = 'UserName or Passowrd is Invalid!'
                    responseObj.status = constants.STATUS_FAIL
                    // return res.json(responseObj); //Kathir
                    return res.json(new responseDto(constants.STATUS_FAIL, responseObj, ''))

                }

            }

        } else {

            let responseObj = await loginRepository.btnLogin_Click(req, res, reqUsername);
            if (responseObj && responseObj.status == constants.STATUS_FAIL) {
                return res.json(new responseDto(constants.STATUS_FAIL, responseObj, ''))
            }
            else {
                let audit = { action: 'Login', screen: 'Login' }
                cpaStatusController.audit_log_loginUser(responseObj, audit).then((responce) => {
                    console.log(responce)
                })
                return res.json(new responseDto(constants.STATUS_SUCCESS, '', responseObj))
            }


            /* 

            userData = await loginRepository.loginDetails(reqUsername).catch((e) => {
                responseObj.status = constants.STATUS_FAIL;
                responseObj.message = e;
                console.log("\ne\n" + e + "\n\n");
                res.json(new responseDto(constants.STATUS_FAIL, e, ''));
            });

            if (userData != null) {
                logger.info("userData TBL_USER \n" + JSON.stringify(userData))
                var decryptPassword = userData[0].LoginGUID;
                var passWord = Cryptr.encryptText(password);
                let passwordIsValid = compareTwoStrings(decryptPassword, passWord);

                // if (!passwordIsValid) {
                if (false) {
                    responseObj.auth = false;
                    responseObj.accessToken = null;
                    responseObj.reason = 'UserName or Passowrd is Invalid!';
                    responseObj.messages = 'UserName or Passowrd is Invalid!';
                    return res.json(new responseDto(constants.STATUS_SUCCESS, responseObj, responseObj))
                } else {
                    let userRoleDetails = await loginRepository.loginUserRoleDetails(userData[0].UserId);
                    logger.info("userRoleDetails \n" + JSON.stringify(userRoleDetails))
                    logger.info("userData \n" + JSON.stringify(userData[0]))
                    logger.info(userData[0].first_login != "undefined" ? "if" : "else")

                    var token = jwt.sign({
                        id: userData[0].UserId, roleId: userRoleDetails[0].RecId, email: userData[0].EmailAddr,
                        username: userData[0].UserName, contactPerson: userData[0].FullName, firstLogin: userData[0].first_login != "undefined" ? "Nil" : userData[0].first_login.trim(), custId: 'Nil'
                    }, securityConfig.secret, {
                        expiresIn: '1h' //1h Refer https://www.npmjs.com/package/jsonwebtoken
                    });


                    responseObj.auth = true;
                    responseObj.id = userData[0].UserId
                    responseObj.accessToken = token;

                    if (userData[0].first_login != "undefined" ? "" : userData[0].first_login.trim() === 'Y') {
                        var temppass = Cryptr.decryptedText(userData[0].password);
                        responseObj.temp = temppass
                    }
                    responseObj.roleId = userRoleDetails[0].Role;
                    responseObj.role = userRoleDetails[0].Role;
                    responseObj.firstLogin = userData[0].first_login != "undefined" ? "Nil" : userData[0].first_login.trim()
                    responseObj.email = userData[0].EmailAddr;
                    responseObj.custId = 'Nil';
                    responseObj.contactPerson = userData[0].FullName;
                    responseObj.userName = userData[0].UserName;
                    return res.json(new responseDto(constants.STATUS_SUCCESS, '', responseObj))
                }
            } else {
                responseObj.message = 'User Not Found.'
                responseObj.status = constants.STATUS_FAIL
                return res.json(new responseDto(constants.STATUS_FAIL, responseObj, ''))
            } */
        }


    } catch (error) {
        console.log("\ncatch errors\n" + error + "\n\n")
        responseObj.auth = false;
        responseObj.accessToken = null;
        responseObj.message = 'User not found.'
        responseObj.status = constants.STATUS_FAIL
        // return res.json(responseObj); //Kathir
        res.json(new responseDto(constants.STATUS_FAIL, responseObj, ''))
    }
}

function compareTwoStrings(inputValueOne, inputValueTwo) {
    if (inputValueOne == inputValueTwo) {
        return true;
    } else {
        return false;
    }
}

module.exports = {
    login
}