const mainDb= require('../MainDb')

exports.LOAD_UPLOADED_FILE = (enquiryId)  => {
   
    return new Promise((resolve, reject) => {
        let query = `SELECT fileupload from tbl_sirim_customers_enquiry where 
        enquiry_Id='${enquiryId}'`

        console.log(query)
        mainDb.GetQueryData(query,(error, data) => {
            if(error){
                return reject(`${error}, ${query}`)
            }
           // console.log(data)
            return resolve(data)
        })
    })
}