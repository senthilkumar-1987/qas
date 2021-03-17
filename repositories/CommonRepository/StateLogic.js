const mainDb = require('../MainDb');
const sql = require('mssql')

// SELECT queries
exports.Load_All_States = () => {
    return new Promise((resolve, reject) => {
        let query = 'SELECT * FROM tbl_state'
        mainDb.GetQueryData(query, (error, data) => {
            if (error) {
                return reject(`${error}, ${query}`)
            }
            return resolve(data)
        })
    })
}

exports.Load_States_ByCountyId = (StateId) => {
    return new Promise((resolve, reject) => {
        // let query = `SELECT StateId as VALUE, StateName as LABEL FROM tbl_state WHERE CountryId = ${StateId} ORDER BY StateName`
        let query=`SELECT StateId as VALUE, StateName as LABEL FROM tbl_state WHERE CountryId = ${StateId} ORDER BY  CASE WHEN StateName LIKE '%N/A%' THEN 1 ELSE 2 END ,StateName ASC `
        mainDb.GetQueryData(query, (error, data) => {
            if (error) {
                return reject(`${error}, ${query}`)
            }
            return resolve(data)
        })
    })
}


exports.getstateNameById = (StateId) => {
    return new Promise((resolve, reject) => {
        // console.log("StateId" + StateId);
        let query = `SELECT StateName FROM tbl_state WHERE StateId = ${StateId} ORDER BY StateName`
        mainDb.GetQueryData(query, (error, data) => {
            if (error) {
                return reject(`${error}, ${query}`)
            }
            return resolve(data)
        })
    })
}
