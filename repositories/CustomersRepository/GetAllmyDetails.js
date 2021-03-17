const mainDb = require('../MainDb');
var constants = require('../../config/Constants');

exports.getMyDatasByUserName = (data) => {
    //console.log(data)
    return new Promise((resolve, reject) => {
        let query = `select cust.company_name,cust.comp_roc_no as CompRoc ,cn.contact_person_name as name,cn.mobileno,cn.faxno,addr.address1,addr.address2,addr.address3,addr.post_code,addr.country_name,addr.state_name as stateName,addr.city_name as cityName,cn.emailaddr as email  from tbl_sirim_users users,tbl_sirim_customers cust,tbl_sirim_customers_contact cn,tbl_sirim_customers_address addr where users.username='${data}'
        and cust.register_id=users.register_id and cn.emailaddr=users.username  and addr.addr_id=cn.addr_id`
     //console.log(query)
        mainDb.GetQueryData(query,(error, data) => {
            if(error){
                return reject(`${error}, ${query}`)
            }
            //console.log(data)
            return resolve(data)
        })
    })
}

