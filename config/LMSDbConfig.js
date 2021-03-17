const sql = require("mssql");
const logger = require('../logger');

const LMSDbConfig = {
    user: 'sa',
    password: 'abcd1234!',
    // server: 'escisdev.sirim.my', 
    server: '172.16.111.15',
    database: 'SIRIM_LMS',
    connectionTimeout: 1200000,
    requestTimeout: 1200000,
};

const db = new sql.ConnectionPool(LMSDbConfig).connect();


exports.executeQuery = async (query) => {
    // logger.info("LMS Report Query :: " + query)

    return new Promise((resolve, reject) => {

        db.then(pool => {
            return pool.query(query)
        }).then(result => {
            data = result.recordset;
            return resolve(data)
        }).catch(err => {
            return reject(err)
        })

    })

}
