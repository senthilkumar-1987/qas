const mainDb = require('../MainDb');


exports.Load_City_Details_ByState_Id = (StateId) => {
    console.log(StateId);
    return new Promise((resolve, reject) => {
        // let query = `SELECT RecId as VALUE,CityName as LABEL FROM tbl_city WHERE StateId = ${StateId}`
        let query =` SELECT RecId as VALUE,CityName as LABEL FROM tbl_city WHERE StateId = ${StateId} ORDER BY  CASE WHEN CityName LIKE '%N/A%' THEN 1 ELSE 2 END ,CityName ASC`
        mainDb.GetQueryData(query, (error, data) => {
            if (error) {
                return reject(`${error}, ${query}`)
            }
            console.log(data);
            return resolve(data)
        })
    })
}




exports.getCityNameById = (CityId) => {
    console.log(CityId);
    return new Promise((resolve, reject) => {
        let query = `SELECT CityName FROM tbl_city WHERE RecId = ${CityId}`
        mainDb.GetQueryData(query, (error, data) => {
            if (error) {
                return reject(`${error}, ${query}`)
            }
            console.log(data);
            return resolve(data)
        })
    })
}
