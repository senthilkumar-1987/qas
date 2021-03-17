'use strict'
const mainDb = require('../MainDb');

exports.Get_All_Secret_Questions = () => {
    return new Promise((resolve, reject) => {
        let query = `SELECT question AS VALUE,question AS LABEL FROM TBL_SIRIM_SECRETQUESTION WHERE STATUS='ACTIVE'`
        mainDb.GetQueryData(query, (error, data) => {
            if (error) {
                return reject(`${error}, ${query}`)
            }
            return resolve(data)
        })
    })
}
