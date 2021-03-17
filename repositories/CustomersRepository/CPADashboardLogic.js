const mainDb = require('../MainDb');


exports.Load_Registration_Details= (status) => {
    return new Promise((resolve, reject) => {
        let query = `select * from tbl_sirim_customers where cpa_status='${status}' `
        mainDb.GetQueryData(query,(error, data) => {
            if(error){
                return reject(`${error}, ${query}`)
            }

            return resolve(data)
        })
    })
}
