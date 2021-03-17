const mainDb = require('../MainDb');
const sql = require('mssql')
var utils = require('../../repositories/ReportsMgtRepo/SirimUtils')

exports.LOAD_PENDING_ENQ_DETAILS = (enquiryDetails, userData) => {
    // console.log(JSON.stringify(enquiryDetails));
    let query = `SELECT * from tbl_sirim_customers_msg where msg_status='open' AND is_latest=1 AND user_name='${userData.username}' `;


    if (enquiryDetails.fileNo) {
        query += ` AND file_no ='${enquiryDetails.fileNo}'`
    }

    if (enquiryDetails.licenseNo) {
        query += ` AND license_no ='${enquiryDetails.licenseNo}'`
    }

    if (enquiryDetails.from && enquiryDetails.to) {
        let fromDate = enquiryDetails.from + ' 00:00:00';
        let toDate = enquiryDetails.to + ' 23:59:59';
        query += ` AND requested_date between '${fromDate}' AND '${toDate}'`
    }

    query += ` order by id desc`
    console.log("query message \n==> " + query);
    return new Promise((resolve, reject) => {
        mainDb.GetQueryData(query, (error, data) => {
            if (error) {
                return reject(`${error}, ${query}`)
            }
            //  console.log(data);
            return resolve(data)
        })
    })
}

exports.getMessageSearch = (enquiryDetails, userData) => {
    // console.log(JSON.stringify(enquiryDetails));
    let query = `SELECT * from tbl_sirim_customers_msg where msg_status='open' AND is_latest=1 `;


    if (enquiryDetails.fileNo) {
        query += ` AND file_no ='${enquiryDetails.fileNo}'`
    }

    if (enquiryDetails.licenseNo) {
        query += ` AND license_no ='${enquiryDetails.licenseNo}'`
    }

    if (enquiryDetails.from && enquiryDetails.to) {
        let fromDate = enquiryDetails.from + ' 00:00:00';
        let toDate = enquiryDetails.to + ' 23:59:59';
        query += ` AND requested_date between '${fromDate}' AND '${toDate}'`
    }

    query += ` order by id desc`
    console.log("query message \n==> " + query);
    return new Promise((resolve, reject) => {
        mainDb.GetQueryData(query, (error, data) => {
            if (error) {
                return reject(`${error}, ${query}`)
            }
            //  console.log(data);
            return resolve(data)
        })
    })
}

exports.LOAD_MY_ENQ_DETAILS = (enquiryDetails) => {

    let query = `SELECT   * from tbl_sirim_customers_msg where
requested_by ='${enquiryDetails.userName}' AND msg_status='open' AND is_latest=1  `;


    if (enquiryDetails.fileNo) {
        query += ` AND file_no ='${enquiryDetails.fileNo}'`
    }

    if (enquiryDetails.licenseNo) {
        query += ` AND license_no ='${enquiryDetails.licenseNo}'`
    }



    if (enquiryDetails.from && enquiryDetails.to) {
        let fromDate = enquiryDetails.from + ' 00:00:00';
        let toDate = enquiryDetails.to + ' 23:59:59';
        query += ` AND requested_date between '${fromDate}' AND '${toDate}'`
    }

    query += "order by message_id ASC";

    return new Promise((resolve, reject) => {
        mainDb.GetQueryData(query, (error, data) => {
            //console.log('data--> '+JSON.stringify(data));
            if (error) {
                return reject(`${error}, ${query}`)
            }

            return resolve(data)
        })
    })
}
exports.getMessageOnEmptySearch = async (FileNo) => {

    let FileNodata = await utils.convertArrayToQuteString(FileNo)

    let query = `SELECT * from tbl_sirim_customers_msg where msg_status='open' AND is_latest=1
     AND file_no In (${FileNodata})`

    console.log(query)
    return new Promise((resolve, reject) => {
        mainDb.GetQueryData(query, (error, data) => {
            if (error) {
                return reject(`${error}, ${query}`)
            }
            //  console.log(data);
            return resolve(data)
        })
    })
}