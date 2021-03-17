const mainDb = require('../MainDb');

//Load All Company Type
exports.LOAD_ALL_SCHEMES = () => {
    return new Promise((resolve, reject) => {
        let query = `Select * from tbl_scheme_type where Status='A'`
        mainDb.GetQueryData(query,(error, data) => {
            if(error){
                return reject(`${error}, ${query}`)
            }
            return resolve(data)
        })
    })
}
