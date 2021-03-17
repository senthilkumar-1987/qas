const mainDb = require('../../MainDb');


exports.Load_VoucherDetails_Details_ByVoucherNo = (voucherNo, userData) => {

    return new Promise((resolve, reject) => {
        let query = `
        SELECT  * FROM tbl_sirim_vouchers WHERE voucher_no=${voucherNo}   AND expiry_date>=GETDATE() And (cust_Code='${userData.custId}' OR cust_Code is null OR cust_Code='')`
        console.log(query)
        mainDb.GetQueryData(query, (error, data) => {
            if (error) {
                return reject(`${error}, ${query}`)
            }

            console.log(data);
            return resolve(data)
        })
    })
}