const mainDb = require('../MainDb');
const sql = require('mssql')


exports.Load_Pending_Reg_Details = () => {

    var status = "PENDING";
    var mailStatus = 'N';
    let query = `SELECT cust.register_id,cust.company_name,cust.comp_roc_no from  tbl_sirim_customers cust where cpa_status='PENDING' `
    return new Promise((resolve, reject) => {
        mainDb.GetQueryData(query, (error, data) => {
            if (error) {
                return reject(`${error}, ${query}`)
            }

            return resolve(data)
        })
    })
}

