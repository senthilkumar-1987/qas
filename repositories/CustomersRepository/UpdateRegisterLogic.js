const mainDb = require('../MainDb');
const sql = require('mssql')


exports.Load_Reg_Details = (registerId) => {
    return new Promise((resolve, reject) => {
        let query = `
  SELECT  * from tbl_sirim_customers cust,tbl_sirim_customers_address addr,tbl_sirim_customers_contact cn,tbl_org_type org where cust.register_id=${registerId} and
  addr.register_id=cust.register_id 
  and cn.addr_id=addr.addr_id and cust.org_type=org.OrgCode`
        console.log(query);
        mainDb.GetQueryData(query, (error, data) => {
            if (error) {
                return reject(`${error}, ${query}`)
            }

            return resolve(data)
        })
    })
}
