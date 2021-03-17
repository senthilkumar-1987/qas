const mainDb = require('../../MainDb');
const moment = require('moment');
const MessageFormat = require('messageformat');
const mf = new MessageFormat('en');
var fs = require('fs');
const sirimUtils = require('../../ReportsMgtRepo/SirimUtils');


exports.get_bad_dept_invoices_curret_year = async (status) => {
    let currentYears = moment().year();
    console.log(currentYears)
    let fromdate = currentYears + '-01-01 00:00:00:000'
    let todate = currentYears + '-12-31 23:59:59:999'

    // let query = `
    // SELECT Invoice_no,sum(Sub_total_rm) totalAmount,sum(Sub_total) AS Sub_total,payment_mode,currency,company_name,User_name,Invoice_date,File_no
    //  from tbl_sirim_invoice_master WHERE Invoice_date  between 
    //  '${fromdate}' and '${todate}'
    //  and  bad_debt_status in (${status}) AND status in (1,3) 
    // group by Invoice_No ,payment_mode,currency,company_name,User_name,Invoice_date,File_no`
    let query = `SELECT
    (
    SELECT SUM(bd.Sub_total)
    FROM tbl_sirim_invoice_master bd
    WHERE bd.MasterInvoiceNo=master.MasterInvoiceNo) AS Sub_total,
    (
    SELECT SUM(bd.Sub_total_rm)
    FROM tbl_sirim_invoice_master bd
    WHERE bd.MasterInvoiceNo=master.MasterInvoiceNo) AS Sub_total_rm,
    stuff((
    SELECT ', ' + CAST(Invoice_no AS VARCHAR(MAX))
    FROM tbl_sirim_invoice_master t
    WHERE t.MasterInvoiceNo=master.MasterInvoiceNo FOR XML path ('')), 1, 1, '') AS Invoice_no,
    payment_mode,currency,company_name,User_name, CAST(Invoice_date AS DATE) AS Invoice_Date,stuff( (select ', ' + cast(File_no as varchar(max)) from tbl_sirim_invoice_master t where t.MasterInvoiceNo=master.MasterInvoiceNo for xml path ('')), 1, 1, '')AS File_no,MasterInvoiceNo,
    status FROM tbl_sirim_invoice_master MASTER
    WHERE MasterInvoiceNo!='' AND Invoice_date BETWEEN '${fromdate}' and '${todate}'
     AND bad_debt_status IN (${status}) AND STATUS IN (1,5)
    GROUP BY Invoice_No,payment_mode,currency,company_name,User_name, CAST(Invoice_date AS DATE) ,File_no,MasterInvoiceNo,status
    UNION
    SELECT Sub_total,Sub_total_rm,Invoice_no,
     payment_mode,currency,company_name,User_name, CAST(Invoice_date AS DATE) AS Invoice_Date,File_no,MasterInvoiceNo,status
    FROM
     tbl_sirim_invoice_master
    WHERE Invoice_date BETWEEN  '${fromdate}' and '${todate}' AND bad_debt_status IN (${status}) AND STATUS IN (1,5) AND (masterinvoiceno='' OR masterinvoiceno IS NULL)`;
    console.log(query)
    return new Promise((resolve, reject) => {
        mainDb.GetQueryData(query, (error, data) => {
            if (error) {
                return reject(`${error}, ${query}`)
            }

            return resolve(data)
        })
    })

}



// exports.getsingleInvoices = async (InvoiceNo) => {

//     let query = `
//   select * from tbl_sirim_invoice_master where Invoice_no='${InvoiceNo}'
//     `
//     console.log("getsingleInvoices \n" + query)
//     return new Promise((resolve, reject) => {
//         mainDb.GetQueryData(query, (error, data) => {
//             if (error) {
//                 return reject(`${error}, ${query}`)
//             }

//             return resolve(data)
//         })
//     })

// }

exports.getsingleInvoices = async (InvoiceNo) => {

    let data = await sirimUtils.convertArrayToQuteString(InvoiceNo.split(","))

    let query = `SELECT *,(SELECT CityName FROM tbl_city  WHERE RecId=a.City_id ) AS CityName,
    (SELECT StateName FROM tbl_state WHERE StateId=a.State_id ) AS StateName,
    (SELECT CountryName FROM tbl_country WHERE CountryId=a.Country_id ) AS CountryName from tbl_sirim_invoice_master AS a where Invoice_no in (${data})
    `
    console.log("getsingleInvoices \n" + query)
    return new Promise((resolve, reject) => {
        mainDb.GetQueryData(query, (error, data) => {
            if (error) {
                return reject(`${error}, ${query}`)
            }

            return resolve(data)
        })
    })

}


