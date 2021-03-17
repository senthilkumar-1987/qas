const mainDb = require('../MainDb');

exports.LOAD_ENQ_DETAILS = (enquiryDetails) => {

    let query = `
      SELECT * from tbl_sirim_customers_enquiry where scheme_id='${enquiryDetails.enquiryType}' and requested_date   < Dateadd(day,${enquiryDetails.limit},GETDATE()) `

    console.log(query)
    return new Promise((resolve, reject) => {
        mainDb.GetQueryData(query, (error, data) => {
            if (error) {
                return reject(`${error}, ${query}`)
            }
            console.log(data);
            return resolve(data)
        })
    })
}