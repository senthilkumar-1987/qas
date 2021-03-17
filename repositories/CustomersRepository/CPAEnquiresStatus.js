const mainDb = require('../MainDb');
const sql = require('mssql')



exports.UPDATE_ENQUIRY_RAISING = (enquiryId,checkboxRespond,remarks) => {

    let query = `UPDATE tbl_sirim_customers_enquiry
    SET msg_status = '${checkboxRespond}' ,remarks='${remarks}' where enquiry_id='${enquiryId}'
        `

    return new Promise((resolve, reject) => {
        mainDb.InsertUpdateDeleteData(query, (error, data) => {
            if (error) {
                return reject(`${error}, ${query}`)
            }

            return resolve(data);
        })
    }); 

}