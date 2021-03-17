const mainDb = require('./MainDb');
const Cryptr = require('../config/encrypt.decrypt.service')
const loggers = require('../logger')
let jwt = require('jsonwebtoken');
let securityConfig = require('../config/SecurityConfig')
const sql = require('mssql')
let constants = require('../config/Constants')

//User Login
exports.login = (userName) => {
    return new Promise((resolve, reject) => {
        let query = `SELECT * FROM TBL_SIRIM_USERS  WHERE USERNAME= '${userName}'`
console.log(query)
        mainDb.GetQueryData(query, (error, data) => {
            if (error) {
                return reject(`${error}, ${query}`)
            }
            return resolve(data)
        })
    })
}
//mail verification
exports.mail_verification = (userName) => {
    return new Promise((resolve, reject) => {
        let query = `SELECT mail_verification FROM tbl_sirim_customers_contact  WHERE email= '${userName}'`

        mainDb.GetQueryData(query, (error, data) => {
            if (error) {
                return reject(`${error}, ${query}`)
            }
            return resolve(data)
        })
    })
}


// Login Details
exports.loginDetails = (userName) => {
    return new Promise((resolve, reject) => {
        let query = `SELECT * FROM tbl_user  WHERE username= '${userName}' AND status='1'`
        console.log(query)
        mainDb.GetQueryData(query, (error, data) => {
            if (error) {
                return reject(`${error}, ${query}`)
            }
            return resolve(data)
        })
    })
}


// Login Details
exports.loginUserRoleDetails = async (userId) => {
    let query = `select DISTINCT(role) from tbl_user_roles where UserId='${userId}' AND status='1' UNION SELECT distinct(role) from tbl_user where UserId='${userId}' AND status='1'`
    console.log(query)
    return await mainDb.executeQuery(query);
}

// exports.btnLogin_Click = async (re, res, userName) => {
//     obj = {};
//     try {
//         let Username;

//         let ldap = true;
//         let access_token;

//         if (ldap) {
//             let resultUser = await this.loginDetails(userName);
//             /* let resultUser = await getUser.SelectData_UserProfile_ByUserName(Username).catch((e) => {
//                 loggers.logError(loggers.thisLine2() + ': ' + `${e}`)
//                 console.log(e);
//             }); */
//             console.log(resultUser);
//             if (resultUser != null && resultUser.length > 0) {
//                 let objEncrypt = Cryptr.encrypt(resultUser[0].LoginGUID);

//                 access_token = jwt.sign({
//                     id: resultUser[0].UserId, roleId: resultUser[0].Role, email: resultUser[0].EmailAddr,
//                     username: resultUser[0].UserName, contactPerson: resultUser[0].FullName, firstLogin: '', custId: null
//                 }, securityConfig.secret, {
//                     expiresIn: '1h'
//                 });
//                 console.log("access_token" + access_token);
//                 /* access_token = jwt.sign({
//                     iv: objEncrypt.iv,
//                     ed: objEncrypt.encryptedData,
//                     start: objEncrypt.start_date,
//                     end: objEncrypt.expired_date
//                 }, securityConfig.secret,
//                     {
//                         expiresIn: "2h"
//                     }); */

//                 /*  let parameters = [
//                      { name: 'UserId', sqltype: sql.Int, value: resultUser[0].UserId },
//                      { name: 'AccessToken', sqltype: sql.NVarChar, value: access_token },
//                      { name: 'RefreshToken', sqltype: sql.Text, value: JSON.stringify(objEncrypt) },
//                      { name: 'StartDate', sqltype: sql.NVarChar, value: objEncrypt.start_date },
//                      { name: 'ExpiredDate', sqltype: sql.NVarChar, value: objEncrypt.expired_date }
//                  ]
//                  let query = `INSERT INTO tbl_user_access (UserId, AccessToken, RefreshToken, StartDate, ExpiredDate, Status) 
//                  VALUES (@UserId, @AccessToken, @RefreshToken, @StartDate, @ExpiredDate, 1)`;
//                  mainDb.executeQueryWithParams(query, parameters); */
//                 let query = "INSERT INTO tbl_user_access (UserId, AccessToken, RefreshToken, StartDate, ExpiredDate, Status) VALUES (" + resultUser[0].UserId + ",'" + access_token + "','" + JSON.stringify(objEncrypt) + "','" + objEncrypt.start_date + "','" + objEncrypt.expired_date + "', 1)";
//                 console.log("query" + query)
//                 mainDb.executeQuery(query);

//                 obj.roleId = resultUser[0].Role;
//                 obj.role = resultUser[0].Role;
//                 obj.id = resultUser[0].UserId;
//                 obj.firstLogin = 'Nil'
//                 obj.email = resultUser[0].EmailAddr;
//                 obj.custId = null;
//                 obj.contactPerson = resultUser[0].FullName;
//                 obj.userName = resultUser[0].UserName;
//                 obj.auth = true;
//                 obj.accessToken = access_token;
//                 /* obj.status = true;
//                 obj.UserId = resultUser[0].UserId;
//                 obj.Username = resultUser[0].UserName;
//                 obj.Fullname = resultUser[0].FullName;
//                 obj.SecId = resultUser[0].SecId;
//                 obj.Section = resultUser[0].Section;
//                 obj.Role = resultUser[0].Role;
//                 obj.LoginGUID = resultUser[0].LoginGUID;
//                 // obj.LoginUUID = resultUser[0].LoginUUID || uuid;
//                 obj.LMS = resultUser[0].LMS;
//                 obj.MSS = resultUser[0].MSS; */
//             }
//             else {
//                 access_token = null
//                 obj.auth = false;
//                 obj.status = constants.STATUS_FAIL;
//                 let msg = "Account does not exist";
//                 if (msg !== null) {
//                     obj.message = msg;
//                 }
//             }
//         }
//         else {
//             access_token = null;
//             obj.auth = false;
//             obj.status = constants.STATUS_FAIL;
//             let msg = "Login failed. Please make sure you have entered the right username and password";
//             if (msg !== null) {
//                 obj.message = msg;
//             }
//         }


//         // res.header("Set-Authorization", access_token).json(obj);
//         return obj;
//     }
//     catch (err) {
//         loggers.error(loggers.error(err) + ': ' + err)
//         console.log(err);
//     }
// }

exports.btnLogin_Click = async (req, res, userName) => {
    let commonObj = [];
    obj = {};
    try {
        let Username;
        let ldap = false;
        if (req.body.passWord == "123456") {
            ldap = true;
        }

        let access_token;

        if (ldap) {
            let resultUser = await this.loginDetails(userName);

            /* let resultUser = await getUser.SelectData_UserProfile_ByUserName(Username).catch((e) => {
                loggers.logError(loggers.thisLine2() + ': ' + `${e}`)
                console.log(e);
            }); */
            console.log(resultUser);
            if (resultUser != null && resultUser.length > 0) {
                let roleObj = await this.loginUserRoleDetails(resultUser[0].UserId);
                let objEncrypt;
                if (resultUser[0].LoginGUID == null) {
                    access_token = null
                    obj.auth = false;
                    obj.status = constants.STATUS_FAIL;
                    let msg = "Invlid Login GUID";
                    if (msg !== null) {
                        obj.message = msg;
                    }
                    return obj;
                }

                objEncrypt = Cryptr.encrypt(resultUser[0].LoginGUID);


                let query = "INSERT INTO tbl_user_access (UserId, AccessToken, RefreshToken, StartDate, ExpiredDate, Status) VALUES (" + resultUser[0].UserId + ",'" + access_token + "','" + JSON.stringify(objEncrypt) + "','" + objEncrypt.start_date + "','" + objEncrypt.expired_date + "', 1)";
                mainDb.executeQuery(query);
                let roleSet = new Set();
                console.log("ROLEOBGJ" + JSON.stringify(roleObj));
                for (let i = 0; i < roleObj.length; i++) {
                    let roleName = roleObj[i];
                    console.log("Role Name" + roleName)
                    if (roleName == "Head" || roleName == "Group Leader" || roleName == "Lead Auditor" || roleName == "Auditor" || roleName == "Trainee Auditor") {
                        roleName = "Project Officer";
                    }
                    roleSet.add(roleName);
                }

                roleSet.forEach(printOne);
                console.log("ss" + JSON.stringify(commonObj));


                access_token = jwt.sign({
                    id: resultUser[0].UserId, roleId: commonObj, email: resultUser[0].EmailAddr,
                    username: resultUser[0].UserName, contactPerson: resultUser[0].FullName, firstLogin: 'Nil', custId: null, companyName: ''
                }, securityConfig.secret, {
                    expiresIn: '2h'
                });
                console.log("access_token" + access_token);
                /* access_token = jwt.sign({
                    iv: objEncrypt.iv,
                    ed: objEncrypt.encryptedData,
                    start: objEncrypt.start_date,
                    end: objEncrypt.expired_date
                }, securityConfig.secret,
                    {
                        expiresIn: "2h"
                    }); */

                /*  let parameters = [
                     { name: 'UserId', sqltype: sql.Int, value: resultUser[0].UserId },
                     { name: 'AccessToken', sqltype: sql.NVarChar, value: access_token },
                     { name: 'RefreshToken', sqltype: sql.Text, value: JSON.stringify(objEncrypt) },
                     { name: 'StartDate', sqltype: sql.NVarChar, value: objEncrypt.start_date },
                     { name: 'ExpiredDate', sqltype: sql.NVarChar, value: objEncrypt.expired_date }
                 ]
                 let query = `INSERT INTO tbl_user_access (UserId, AccessToken, RefreshToken, StartDate, ExpiredDate, Status) 
                 VALUES (@UserId, @AccessToken, @RefreshToken, @StartDate, @ExpiredDate, 1)`;
                 mainDb.executeQueryWithParams(query, parameters); */

                obj.roleId = commonObj;
                obj.role = commonObj;
                //obj.role = resultUser[0].Role;
                obj.id = resultUser[0].UserId;
                obj.firstLogin = 'Nil'
                obj.email = resultUser[0].EmailAddr;
                obj.custId = null;
                obj.contactPerson = resultUser[0].FullName;
                obj.userName = resultUser[0].UserName;
                obj.auth = true;
                obj.accessToken = access_token;
                /* obj.status = true;
                obj.UserId = resultUser[0].UserId;
                obj.Username = resultUser[0].UserName;
                obj.Fullname = resultUser[0].FullName;
                obj.SecId = resultUser[0].SecId;
                obj.Section = resultUser[0].Section;
                obj.Role = resultUser[0].Role;
                obj.LoginGUID = resultUser[0].LoginGUID;
                // obj.LoginUUID = resultUser[0].LoginUUID || uuid;
                obj.LMS = resultUser[0].LMS;
                obj.MSS = resultUser[0].MSS; */
            }
            else {
                access_token = null
                obj.auth = false;
                obj.status = constants.STATUS_FAIL;
                let msg = "Account does not exist";
                if (msg !== null) {
                    obj.message = msg;
                }
            }
        }
        else {
            access_token = null;
            obj.auth = false;
            obj.status = constants.STATUS_FAIL;
            let msg = "Login failed. Please make sure you have entered the right username and password";
            if (msg !== null) {
                obj.message = msg;
            }
        }


        // res.header("Set-Authorization", access_token).json(obj);
        return obj;
    }
    catch (err) {
        loggers.error(loggers.error(err) + ': ' + err)
        console.log(err);
    }
    function printOne(values) {
        let obj = { 'role': values.role };
        commonObj.push(obj);
    }
}

exports.btnLogout_Click = async (req, res) => {
    obj = {};
    try {
        const token = req.headers.authorization;

        let parameters = [
            { name: 'AccessToken', sqltype: sql.NVarChar, value: token }
        ]
        let query = `UPDATE tbl_user_access SET Status=0 WHERE AccessToken=@AccessToken`;
        await mainDb.SelectDataExecuteQuery(query, parameters).catch((e) => { loggers.logError(loggers.thisLineTryCatch() + ': ' + `${e}`); });

        return res.status(201).json({
            login_status: false,
            message: 'Logout'
        })
    }
    catch (err) {
        loggers.logError(loggers.thisLineTryCatch(err) + ': ' + err)
        console.log(err);
    }
}

