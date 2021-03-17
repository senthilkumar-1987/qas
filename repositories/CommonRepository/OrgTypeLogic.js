const mainDb = require('../MainDb');

//Load All Org Type
exports.Load_All_Org_Type_Details = () => {
    return new Promise((resolve, reject) => {
        let query = `Select orgCode As VALUE, orgname As LABEL from tbl_org_type`
        mainDb.GetQueryData(query,(error, data) => {
            if(error){
                return reject(`${error}, ${query}`)
            }
            return resolve(data)
        })
    })
}
