const mainDb = require('../MainDb');

//Load All Company Type
exports.Load_All_Company_Type_Details = () => {
    return new Promise((resolve, reject) => {
        let query = `Select CompType As VALUE, Description As LABEL from tbl_comp_type`
        mainDb.GetQueryData(query,(error, data) => {
            if(error){
                return reject(`${error}, ${query}`)
            }
            return resolve(data)
        })
    })
}
