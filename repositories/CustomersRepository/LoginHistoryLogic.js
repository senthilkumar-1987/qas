'use strict'
const mainDb = require('../MainDb');

exports.INSERT_LOGIN_HISTORY = (historyData, resultRegseq) => {

    let logHistory = this.CHECK_PREVIOUS_LOGIN_HISTORY(historyData);
    // console.log("logHistory ==> " + JSON.stringify(logHistory))
    if (logHistory.length > 0) {
        let query = `INSERT INTO TBL_SIRIM_CUSTOMER_LOGIN_HISTORY(REGISTER_ID,LOGIN_TIME,USER_NAME,CONTACT_PERSON,IS_LATEST)
    VALUES(${historyData.registerId},GETDATE(),'${historyData.userName}','${historyData.contactPerson}',1)`
        console.log("INSERT_LOGIN_HISTORY if \n" + query)
        return new Promise((resolve, reject) => {
            mainDb.InsertUpdateDeleteData(query, (error, data) => {
                if (error) {
                    console.log("error" + error)
                    return reject(`${error}, ${query}`)
                }
                return resolve(resultRegseq);
            })
        });
    } else {
        let query = `UPDATE TBL_SIRIM_CUSTOMER_LOGIN_HISTORY SET IS_LATEST=0 WHERE user_name='${historyData.userName}';
                     INSERT INTO TBL_SIRIM_CUSTOMER_LOGIN_HISTORY(REGISTER_ID,LOGIN_TIME,USER_NAME,CONTACT_PERSON,IS_LATEST) VALUES(${historyData.registerId},GETDATE(),'${historyData.userName}','${historyData.contactPerson}',1)`
        console.log("INSERT_LOGIN_HISTORY else \n" + query)
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

}



exports.CHECK_PREVIOUS_LOGIN_HISTORY = (historyData) => {
    let query = `SELECT * FROM TBL_SIRIM_CUSTOMER_LOGIN_HISTORY WHERE user_name='${historyData.userName}' and is_latest=1 `
    // console.log("CHECK_PREVIOUS_LOGIN_HISTORY ==>" + query)
    return new Promise((resolve, reject) => {
        mainDb.GetQueryData(query, (error, data) => {
            if (error) {
                console.log("error" + error)
                return reject(`${error}, ${query}`)
            }

            return resolve(data);
        })
    });

}


exports.GET_LAST_LOGIN_HISTORY = (currentLogin) => {

    // let query = `SELECT top 1 LOGIN_TIME FROM TBL_SIRIM_CUSTOMER_LOGIN_HISTORY WHERE USER_NAME='${currentLogin.userName}' AND IS_LATEST=0 ORDER BY ID DESC `
    let query = `SELECT FORMAT(LOGIN_TIME, 'dd/MM/yyyy HH:mm:ss') AS LOGIN_TIME  FROM TBL_SIRIM_CUSTOMER_LOGIN_HISTORY WHERE USER_NAME='${currentLogin.userName}' AND IS_LATEST=0 ORDER BY ID DESC  offset 0 rows fetch next 1 rows only`
    //    console.log("INSERT_LOGIN_HISTORY " + query)
    return new Promise((resolve, reject) => {
        mainDb.GetQueryData(query, (error, data) => {
            if (error) {
                console.log("error" + error)
                return reject(`${error}, ${query}`)
            }

            return resolve(data);
        })
    });

}