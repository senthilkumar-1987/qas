const jwt = require('jsonwebtoken');
const securityConfig = require('../config/SecurityConfig');
const ArrayList = require('arraylist-tn');
const Cryptr = require('../config/encrypt.decrypt.service')
const loginRepo = require('../repositories/LoginRepository');
const removeSecurityList = new ArrayList();
const mainDb = require('../repositories/MainDb');
const inputPattern = require('../inputPattern')
var moment = require('moment');
verifyToken = (req, res, next) => {
    let token = req.headers['authorization'];
    let reqUrl = req.originalUrl;
    if (!removeSecurityList.contains(reqUrl)) {
        if (!token) {
            return res.status(403).send({
                auth: false, message: 'No token provided.'
            });
        }

        jwt.verify(token, securityConfig.secret, (err, decoded) => {
            if (err) {
                return res.status(500).send({
                    auth: false,
                    message: 'Fail to Authentication. Error -> ' + err
                });
            }
            req.userId = decoded.id;
            req.userData = decoded;
            let result = inputPattern.loginIdMailValidation(req.userId);

            if (result == false) {
                /*  console.log("internalUserJWTVerify"+result);
                 let bVal= this.internalUserJWTVerify(res,req.userId,token)
                 console.log("bVal"+bVal)
                 if(bVal==false)
                 {
                     return res.status(500).send({
                         auth: false,
                         message: 'Fail to Authentication. Error -> ' + err
                     });
                 } */
            }
            next();
        });
    } else {
        next();
    }
}

let decodeJWToken = (req, res, next) => {
    let token = req.headers['authorization'];
    let userData;
    try {
        userData = jwt.verify(token, securityConfig.secret);
        console.log("userData" + JSON.stringify(userData));
    } catch (e) {
        userData = 'Error';
        console.log(e);
    }
    req.userData = userData
    next();

    //  return userData;
}


const authJwt = {};
authJwt.verifyToken = verifyToken;
authJwt.decodeJWToken = decodeJWToken

exports.internalUserJWTVerify = function (res, UserName, token) {
    try {

        // let obj = loginRepo.loginDetails(UserName);
        let now = moment().format('YYYY-MM-DD HH:mm:ss'); // today datetime

        /* let parameters = [
            { name: 'AccessToken', sqltype: sql.NVarChar, value: token },
            { name: 'ExpiredDate', sqltype: sql.NVarChar, value: now }
        ] */

        let query = "SELECT AccessId, UserId, RefreshToken, ExpiredDate FROM tbl_user_access WHERE AccessToken='" + token + "' AND ExpiredDate > '" + now + "' AND Status=1";
        console.log(query);
        let results;
        results = this.getQuery(query);
        console.log(results);
        let userData;
        if (results != null && results.length > 0) {
            /* res.json({
                login_status: true,
                ...obj,
                token: token
            }); */
            return true;
        }
        else {
            /* return res.status(500).send({
                auth: false,
                message: 'Fail to Authentication. Error -> ' + err
            }); */
            console.log("inside false")
            return false;
        }
        console.log("inside false1")
    }
    catch (error) {
        return false;
    }
}
exports.getQuery = (query) => {
    return new Promise((resolve, reject) => {

        console.log(query)
        mainDb.GetQueryData(query, (error, data) => {
            if (error) {
                return reject(`${error}, ${query}`)
            }
            return resolve(data)
        })
    })
}

module.exports = authJwt;