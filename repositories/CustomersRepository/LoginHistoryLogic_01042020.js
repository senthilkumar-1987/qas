'use strict'
const mainDb = require('../MainDb');

exports.INSERT_LOGIN_HISTORY = (historyData, resultRegseq) => {

 let logHistory= this.CHECK_PREVIOUS_LOGIN_HISTORY(historyData);

if(logHistory.length>0){
    let query = `INSERT INTO TBL_CUSTOMER_LOGIN_HISTORY(REGISTER_ID,LOGIN_TIME,USER_NAME,CONTACT_PERSON,IS_LATEST)
    VALUES(${historyData.registerId},GETDATE(),'${historyData.userName}','${historyData.contactPerson}',1)`
     
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
else{
    let query = `
    UPDATE TBL_CUSTOMER_LOGIN_HISTORY SET IS_LATEST=0 WHERE user_name='${historyData.userName}'
    INSERT INTO TBL_CUSTOMER_LOGIN_HISTORY(REGISTER_ID,LOGIN_TIME,USER_NAME,CONTACT_PERSON,IS_LATEST)
    VALUES(${historyData.registerId},GETDATE(),'${historyData.userName}','${historyData.contactPerson}',1)`
      
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
    let query = `SELECT * FROM TBL_CUSTOMER_LOGIN_HISTORY WHERE user_name='${historyData.userName}' and is_latest=1 `
     
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
 
    let query = `SELECT top 1 LOGIN_TIME FROM TBL_CUSTOMER_LOGIN_HISTORY WHERE USER_NAME='${currentLogin.userName}' AND IS_LATEST=0 ORDER BY ID DESC `
     
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