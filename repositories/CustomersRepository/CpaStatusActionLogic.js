const mainDb = require('../MainDb');

//Load All Cities
exports.Load_City_Details_ByState_Id = (StateId) => {
    return new Promise((resolve, reject) => {
        let query = `SELECT RecId as VALUE,CityName as LABEL FROM tbl_city WHERE  = ${StateId}`
        mainDb.GetQueryData(query,(error, data) => {
            if(error){
                return reject(`${error}, ${query}`)
            }
            return resolve(data)
        })
    })
}

