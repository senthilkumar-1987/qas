const mainDb = require('../../MainDb');
const SCISRepo = require('../../../config/SCISDbConfig');
const sirimUtils = require('../../ReportsMgtRepo/SirimUtils');


// exports.Load_Payments_Reports = async (paymentDetails) => {

//     let query = `select Transaction_id,Transaction_amount,Transaction_date,Transaction_by,payment_status,payment_type,payment_mode from tbl_sirim_payment_history `;

//     if (paymentDetails.from && paymentDetails.to) {
//         let fromDate = paymentDetails.from + ' 00:00:00';
//         let toDate = paymentDetails.to + ' 23:59:59';
//         query += ` WHERE Transaction_date between '${fromDate}' AND '${toDate}' `
//     }
//     if (paymentDetails.companyname !== "") {
//         query += `  company_name LIKE '%${paymentDetails.companyname}%' `
//     }
//     if (paymentDetails.status && paymentDetails.status.length > 0) {
//         let status = await sirimUtils.convertArrayToQuteString(paymentDetails.status);
//         query += `WHERE  payment_status IN(${status})`
//     }

//     return await SCISRepo.executeQuery(query);

// }
exports.Load_Payments_Reports = async (paymentDetails) => {

    console.log("paymentDetails---->" + JSON.stringify(paymentDetails));

    // let query = `SELECT * FROM tbl_sirim_invoice_master t1 INNER JOIN tbl_sirim_payment_history t2 ON t1.Order_no = t2.Order_no INNER JOIN tbl_section t3 ON t3.RecId = t1.SecId `

    // if (paymentDetails.from && paymentDetails.from != '' && paymentDetails.to && paymentDetails.to != '') {
    //     let fromDate = paymentDetails.from + ' 00:00:00';
    //     let toDate = paymentDetails.to + ' 23:59:59';
    //     query += ` WHERE t2.Transaction_date between '${fromDate}' AND '${toDate}' `
    //     if (paymentDetails.companyname !== "") {
    //         query += ` AND t1.company_name LIKE '%${paymentDetails.companyname}%' `
    //     } else if (paymentDetails.status && paymentDetails.status.length > 0) {
    //         let status = await sirimUtils.convertArrayToQuteString(paymentDetails.status);
    //         query += ` AND t2.payment_status IN (${status})`
    //     } else if (paymentDetails.sectionCode!==undefined&&paymentDetails.sectionCode !== "") {
    //         query += ` AND t1.Sector_type_unitcode IN (${paymentDetails.sectionCode})`
    //     }
    // } else if (paymentDetails.companyname !== "") {
    //     query += ` WHERE t1.company_name LIKE '%${paymentDetails.companyname}%' `
    //     if (paymentDetails.status && paymentDetails.status.length > 0) {
    //         let status = await sirimUtils.convertArrayToQuteString(paymentDetails.status);
    //         query += ` AND t2.payment_status IN (${status})`
    //     } else if (paymentDetails.sectionCode !== "") {
    //         query += ` AND t1.Sector_type_unitcode IN (${paymentDetails.sectionCode})`
    //     }
    // } else if (paymentDetails.status && paymentDetails.status.length > 0) {
    //     let status = await sirimUtils.convertArrayToQuteString(paymentDetails.status);
    //     query += ` WHERE t2.payment_status IN(${status})`
    //     if (paymentDetails.sectionCode!==undefined&&
            
    //         paymentDetails.sectionCode !== "") {
    //         query += ` AND t1.Sector_type_unitcode IN (${paymentDetails.sectionCode})`
    //     }

    // } else if (paymentDetails.sectionCode&&paymentDetails.sectionCode!==undefined &&paymentDetails.sectionCode !== "") {
    //     query += ` WHERE t1.Sector_type_unitcode IN (${paymentDetails.sectionCode})`
    // }

    let query = ` select * from tbl_sirim_Invoice_Master tsim  `

    if (paymentDetails.from && paymentDetails.from != '' && paymentDetails.to && paymentDetails.to != '') {
        let fromDate = paymentDetails.from + ' 00:00:00';
        let toDate = paymentDetails.to + ' 23:59:59';
        query += ` WHERE Invoice_date between '${fromDate}' AND '${toDate}' `
    
        if (paymentDetails.companyname !== "") {
            query += ` AND Company_name LIKE '%${paymentDetails.companyname}%' `
        }else if(paymentDetails.status && paymentDetails.status.length > 0) {
            if(paymentDetails.status.includes("0")){
                paymentDetails.status.push(1)
                paymentDetails.status.push("''")
                paymentDetails.status.push('null')
            }

            console.log("status"+JSON.stringify(paymentDetails.status))
           // let status = await sirimUtils.convertArrayToQuteString(paymentDetails.status);
            query += ` AND Status IN (${paymentDetails.status})`
        }else if (paymentDetails.sectionCode!==undefined&&paymentDetails.sectionCode !== "") {
            query += ` AND Sector_type_unitcode IN (${paymentDetails.sectionCode})`
        }
  } else if (paymentDetails.companyname !== "") {
        query += ` WHERE Company_name LIKE '%${paymentDetails.companyname}%' `
        if (paymentDetails.status && paymentDetails.status.length > 0) {
            if(paymentDetails.status.includes("0")){
                paymentDetails.status.push("1")
                paymentDetails.status.push("''")
                paymentDetails.status.push('null')
            }
            console.log("status"+JSON.stringify(paymentDetails.status))
            //let status = await sirimUtils.convertArrayToQuteString(paymentDetails.status);
            query += ` AND Status IN (${paymentDetails.status})`
        }else if (paymentDetails.sectionCode !== "") {
            query += ` AND Sector_type_unitcode IN (${paymentDetails.sectionCode})`
        }
    } else if (paymentDetails.status && paymentDetails.status.length > 0) {
        if(paymentDetails.status.includes("0")){
        paymentDetails.status.push(1)
        paymentDetails.status.push("''")
        paymentDetails.status.push('null')
    }

    console.log("status"+JSON.stringify(paymentDetails.status))
      //  let status = await sirimUtils.convertArrayToQuteString(paymentDetails.status);
        query += ` WHERE Status IN(${paymentDetails.status})`

        if (paymentDetails.sectionCode!==undefined&&

            paymentDetails.sectionCode !== "") {
            query += ` AND Sector_type_unitcode IN (${paymentDetails.sectionCode})`
        }
    } else if (paymentDetails.sectionCode&&paymentDetails.sectionCode!==undefined &&paymentDetails.sectionCode !== "") {
        query += ` WHERE Sector_type_unitcode IN (${paymentDetails.sectionCode})`
    }

    // if(paymentDetails.status !== ''){

    //     query += ` WHERE Status !=0`

    // }

    console.log("qe===uery====" + query);
 let data =await SCISRepo.executeQuery(query)
    return data;
}

exports.Summary_of_Payments = async (paymentDetails) => {

    console.log("paymentDetails" + JSON.stringify(paymentDetails));

    let processedInvoices = await this.Processed_Invoices(paymentDetails);
    let unprocessedInvoices = await this.Processeing_Invoices(paymentDetails);
    // console.log(processedInvoices);
    // console.log(unprocessedInvoices);
    let responseObj = {};
    responseObj.processedInvoices = processedInvoices;
    responseObj.unprocessedInvoices = unprocessedInvoices;
    //console.log(responseObj)
    return responseObj;
}

exports.SummaryofPayments = async (request) => {
    console.log(JSON.stringify(request.companyname))
    let query = `select hi.company_name,SUM(hi.Transaction_amount) AS amount from tbl_sirim_payment_history  hi `

    if (request.from && request.to) {
        let fromDatetime = request.from + " 00:00:00"
        let toDatetime = request.to + " 23:59:59"
        query += " where hi.Transaction_date between '" + fromDatetime + "' AND '" + toDatetime + "'"
    }
    if (request.companyname && request.companyname != '') {

        if (request.from && request.to && request.from != null && request.from != '' && request.to != null && request.to != '') {
            query += " AND hi.company_name like ('%" + request.companyname + "%')"
        } else {
            query += " WHERE hi.company_name like ('%" + request.companyname + "%')"
        }
    }

    query += ` Group by hi.company_name`;


    console.log("query \n\n" + query)

    return new Promise((resolve, reject) => {
        mainDb.GetQueryData(query, (error, data) => {
            if (error) {
                return reject(`${error}, ${query}`)
            }

            return resolve(data)
        })
    })
    //console.log(responseObj)
    // return responseObj;
}

exports.Processed_Invoices = (paymentDetails) => {
    // console.log(JSON.stringify(paymentDetails));
    let query = `select CASE WHEN STATUS=3 THEN 'PAID' ELSE 'PROCESSING' END AS STATUS,
    user_name,
    COUNT(*) as processed_count,SUM(total_amount_rm) as total_amount
    from
    tbl_sirim_invoice_master WHERE STATUS IN(3) `;

    if (paymentDetails.from && paymentDetails.to) {
        let fromDate = paymentDetails.from + ' 00:00:00';
        let toDate = paymentDetails.to + ' 23:59:59';
        query += ` AND  invoice_date between '${fromDate}' AND '${toDate}' `
    }
    if (paymentDetails.companyname !== "") {

        let companyname = paymentDetails.companyname;
        query += ` AND company_name LIKE '%${companyname}%' `
    }
    query += "GROUP by user_name,STATUS,total_amount_rm order by user_name;"


    console.log(query);

    return new Promise((resolve, reject) => {
        mainDb.GetQueryData(query, (error, data) => {
            if (error) {
                return reject(`${error}, ${query}`)
            }

            return resolve(data)
        })
    })
}

exports.Processeing_Invoices = (paymentDetails) => {
    console.log(JSON.stringify(paymentDetails));
    let query = `select CASE WHEN STATUS>3 THEN 'PROCESSING' END AS STATUS,
    user_name,
    COUNT(*) as processeing_count,SUM(total_amount_rm) as total_amount from
    tbl_sirim_invoice_master WHERE STATUS IN(2,4,5)
    `;

    if (paymentDetails.from && paymentDetails.to) {
        let fromDate = paymentDetails.from + ' 00:00:00';
        let toDate = paymentDetails.to + ' 23:59:59';
        query += `  AND invoice_date between '${fromDate}' AND '${toDate}' `
    }

    if (paymentDetails.companyname !== "") {

        let companyname = paymentDetails.companyname;
        query += ` AND company_name LIKE '%${companyname}%' `
    }
    query += " GROUP by user_name,STATUS,total_amount_rm order by user_name;"


    console.log(query);

    return new Promise((resolve, reject) => {
        mainDb.GetQueryData(query, (error, data) => {
            if (error) {
                return reject(`${error}, ${query}`)
            }

            return resolve(data)
        })
    })
}


exports.SummaryofPayments2 = (request) => {

    console.log("--");
    let query = `SELECT * FROM tbl_sirim_invoice_master t1
    INNER JOIN tbl_sirim_payment_history t2
    ON t1.Order_no = t2.Order_no`


    if (request.from && request.to) {
        let fromDatetime = request.from + " 00:00:00"
        let toDatetime = request.to + " 23:59:59"
        query += " where t2.Transaction_date between '" + fromDatetime + "' AND '" + toDatetime + "'"
    }
    if (request.companyname && request.companyname != '') {

        if (request.from && request.to && request.from != null && request.from != '' && request.to != null && request.to != '') {
            query += " AND t1.company_name like ('%" + request.companyname + "%')"
        } else {
            query += " WHERE t1.company_name like ('%" + request.companyname + "%')"
        }
    }

    // query += ` Group by t1.company_name`;


    console.log("query---- \n\n" + query)

    return new Promise((resolve, reject) => {
        mainDb.GetQueryData(query, (error, data) => {
            if (error) {
                return reject(`${error}, ${query}`)
            }

            return resolve(data)
            //    console.log(data)
        })
    })

}
exports.Load_Payments_Reports_Details = async (paymentDetails) => {

    console.log("paymentDetails---->" + JSON.stringify(paymentDetails));

    let query = `SELECT DISTINCT  a.*,b.*,(
        SELECT SUM(bd.Sub_total)
        FROM tbl_sirim_invoice_master bd
        WHERE bd.Order_no=a.Order_no) AS sumof_subtotal
         FROM 
        (
        SELECT *
        
        FROM tbl_sirim_payment_history 
         ) a
         JOIN (
        SELECT stuff( (select ', ' + cast(Invoice_no as varchar(max)) from tbl_sirim_invoice_master t 
        
        where t.Order_no=bd.Order_no for xml path ('')), 1, 1, '' ) AS inv_mas_Invoice_no,Order_no AS inv_mas_order_no,
        Currency,Sector_type_unitcode,Status
        FROM tbl_sirim_invoice_master bd 
        group BY bd.Invoice_no,bd.Order_no,bd.MasterInvoiceNo,bd.Currency,bd.Sector_type_unitcode,bd.Status) b ON  a.Order_no= b.inv_mas_order_no
        
        `


        if (paymentDetails.from && paymentDetails.from != '' && paymentDetails.to && paymentDetails.to != '') {
            let fromDate = paymentDetails.from + ' 00:00:00';
            let toDate = paymentDetails.to + ' 23:59:59';
            query += ` WHERE Invoice_date between '${fromDate}' AND '${toDate}' `
        }
        console.log("querynew===> \n\n" + query)

        return new Promise((resolve, reject) => {
            mainDb.GetQueryData(query, (error, data) => {
                if (error) {
                    return reject(`${error}, ${query}`)
                }
    
                return resolve(data)
                
            })
        })
}