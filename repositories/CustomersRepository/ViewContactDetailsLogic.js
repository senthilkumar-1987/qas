const mainDb = require('../MainDb');
const sql = require('mssql')


exports.Load_Contact_Details = (addressId) => {


      var status="PENDING";
    
        let query = `SELECT  * from tbl_sirim_customers_contact cn,tbl_sirim_customers_address addr,tbl_sirim_customers cust  where  cust.register_id=${addressId} and addr.register_id=${addressId} and cn.addr_id=addr.addr_id`
        return new Promise((resolve, reject) => {
        mainDb.GetQueryData(query,(error, data) => {
            if(error){
                return reject(`${error}, ${query}`)
            }
      
            return resolve(data)
        })
    })   
}
