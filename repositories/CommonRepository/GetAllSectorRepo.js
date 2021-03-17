const mainDb = require('../MainDb');

exports.LOAD_ALL_SECTOR = () => {
   
    return new Promise((resolve, reject) => {
        let query = `Select * from tbl_sector_type where Status=1`
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


exports.LOAD_ALL_INFORMATION = async () => {
   
    return new Promise((resolve, reject) => {
        let query = `Select * from tbl_sirim_requirement_information where Status=1`
        console.log(query)
        mainDb.GetQueryData(query,(error, data) => {
            if(error){
                return reject(`${error}, ${query}`)
            }
            console.log(data)
            return resolve(data)
        })
    })
}