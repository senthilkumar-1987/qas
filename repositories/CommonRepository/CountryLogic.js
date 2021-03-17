const mainDb = require('../MainDb');
const sql = require('mssql')

//Load All Country
exports.Load_All_Country = () => {
    return new Promise((resolve, reject) => {
        let query = 'SELECT COUNTRYID AS VALUE, COUNTRYNAME AS LABEL  FROM TBL_COUNTRY ORDER BY CountryName'
        console.log(query)
        mainDb.GetQueryData(query, (error, data) => {
            if (error) {
                return reject(`${error}, ${query}`)
            }
            return resolve(data)
        })
    })
}

exports.GetCountryNameByCountryId = (CountryId) => {
    return new Promise((resolve, reject) => {
        let query = `SELECT CountryName  FROM TBL_COUNTRY WHERE CountryId ='${CountryId}' AND STATUS = 1 `
        console.log(query)
        mainDb.GetQueryData(query, (error, data) => {
            if (error) {
                return reject(`${error}, ${query}`)
            }
            return resolve(data)
        })
    })
}

