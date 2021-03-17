const mainDb = require('../../MainDb');

const MessageFormat = require('messageformat');
const mf = new MessageFormat('en');
var fs = require('fs');
const sirimUtils = require('../../ReportsMgtRepo/SirimUtils');


exports.UpdateBadDeptStatus = async (invoiceNo, status, userData) => {
    // console.log(userData.username)
    let data = await sirimUtils.convertArrayToQuteString(invoiceNo.split(","))

    let query;
    if (status === '10') {
        query = ` UPDATE TBL_SIRIM_INVOICE_MASTER SET bad_debt_status=${status},status=6,Remarks='To be Cancel Invoice And Receipt in SIRIM', Modified_by='${userData.username}',Modified_date=GETDATE() WHERE Invoice_no IN(${data})`
    } else {
        query = ` UPDATE TBL_SIRIM_INVOICE_MASTER SET bad_debt_status=${status},Modified_by='${userData.username}',Modified_date=GETDATE() WHERE Invoice_no IN(${data})`
    }

    console.log(query);
    return new Promise((resolve, reject) => {
        mainDb.InsertUpdateDeleteData(query, (error, data) => {
            if (error) {
                return reject(`${error}, ${query}`)
            }

            return resolve(data)
        })
    })

}
exports.UpdateBadDeptStatusByHead = async (invoiceNo, status, userData) => {

    let data = await sirimUtils.convertArrayToQuteString(invoiceNo.split(","))

    let query;
    // if (status === '9') {
    query = ` UPDATE TBL_SIRIM_INVOICE_MASTER SET bad_debt_status=10,status=6,Remarks='To be Cancel Invoice And Receipt in SIRIM', Modified_by='${userData.username}',Modified_date=GETDATE() WHERE Invoice_no IN(${data})`
    // } else {
    //     query = ` UPDATE TBL_SIRIM_INVOICE_MASTER SET bad_debt_status=${status},Modified_by='${userData.username}',Modified_date=GETDATE() WHERE Invoice_no='${invoiceNo}'`
    // }

    console.log(query);
    return new Promise((resolve, reject) => {
        mainDb.InsertUpdateDeleteData(query, (error, data) => {
            if (error) {
                return reject(`${error}, ${query}`)
            }

            return resolve(data)
        })
    })

}