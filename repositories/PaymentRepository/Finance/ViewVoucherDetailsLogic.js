const mainDb = require('../../MainDb');
const scisDbConfig = require('../../../config/SCISDbConfig');
var paymentConstants = require('../../../config/PaymentConstants');
const MessageFormat = require('messageformat');
const mf = new MessageFormat('en');
var fs = require('fs');
const { constants } = require('buffer');
const sirimUtils = require('../../ReportsMgtRepo/SirimUtils');


exports.LOAD_INVOICE_DETAILS = async (status) => { //dashboard
    //console.log(status)
    return new Promise((resolve, reject) => {

        // var query = `select  invoice_no AS InvoiceNo ,sum(Sub_total_rm) AS InvoiceAmt,payment_mode,currency,company_name,User_name,payment_type,payment_date,Reference_no,order_no from tbl_sirim_invoice_master 
        // where status='${status}' group by Invoice_No ,payment_mode,currency,company_name,User_name,payment_type,payment_date,Reference_no,order_no`;

        // var query = `select  master.invoice_no AS InvoiceNo ,sum(master.Sub_total_rm) AS InvoiceAmt,master.payment_mode,master.currency,master.company_name,master.User_name,master.payment_type,master.payment_date,master.Reference_no,master.order_no 
        // from tbl_sirim_invoice_master master, tbl_sirim_payment_history history
        // where status='${status}' AND master.Order_no= history.Order_no AND history.payment_status='pending'  
        // group by master.Invoice_No ,master.payment_mode,master.currency,master.company_name,master.User_name,
        // master.payment_type,master.payment_date,master.Reference_no,master.order_no`


        // var query = `SELECT a.*,b.Invoice_no,b.Receipt_no,b.Remarks,b.Company_name AS comp_name,b.Currency AS currency,b.Bad_debt_status,(
        //     SELECT SUM(bd.Sub_total)
        //     FROM tbl_sirim_invoice_master bd
        //     WHERE bd.Order_no=a.Order_no) AS sumof_subtotal
        //     FROM 
        //      (
        //     SELECT *
        //     FROM tbl_sirim_payment_history
        //     WHERE payment_status='${status}') a
        //     LEFT JOIN (
        //     SELECT Order_no,Invoice_no,Receipt_no,Remarks,Company_name ,Currency ,Bad_debt_status
        //     FROM tbl_sirim_invoice_master GROUP BY Order_no,Invoice_no,Receipt_no,Remarks,Company_name ,Currency ,Bad_debt_status HAVING COUNT(*) > 1) b ON a.Order_no= b.Order_no`

        // var query = `SELECT DISTINCT a.*,b.*,cd.*,(
        //     SELECT SUM(bd.Sub_total)
        //     FROM tbl_sirim_invoice_master bd
        //     WHERE bd.Order_no=a.Order_no) AS sumof_subtotal,

        //     (
        //     SELECT SUM(bd.voucher_amt)
        //     FROM tbl_sirim_customer_vouchers bd
        //     WHERE bd.Transaction_id=a.Transaction_id) AS voucher_amount

        //      FROM
        //     (
        //     SELECT *

        //     FROM tbl_sirim_payment_history
        //     WHERE payment_status='${status}' ) a
        //      JOIN (
        //     SELECT stuff( (select ', ' + cast(Invoice_no as varchar(max)) from tbl_sirim_invoice_master t  where t.Order_no=bd.Order_no for xml path ('')), 1, 1, '' ) AS inv_mas_Invoice_no,Order_no AS inv_mas_order_no,CAST(bd.Invoice_date AS DATE) AS Invoice_date,receipt_no,Currency,MasterInvoiceNo,Remarks
        //     FROM tbl_sirim_invoice_master bd group BY bd.Invoice_no,bd.Order_no,bd.MasterInvoiceNo,receipt_no,Currency,bd.Remarks,
        //     CAST(bd.Invoice_date AS DATE)) b ON  a.Order_no= b.inv_mas_order_no

        //     LEFT JOIN (
        //     SELECT  stuff( (select ', ' + CAST(voucher_no as varchar(max)) from tbl_sirim_customer_vouchers t  where t.transaction_id=cv.Transaction_id for xml path ('')), 1, 1, '' ) AS voucher_no,transaction_id
        //     FROM tbl_sirim_customer_vouchers cv GROUP BY cv.voucher_no,transaction_id) cd  ON  cd.transaction_id=a.Transaction_id`
        var query = `SELECT DISTINCT a.*,b.*,cd.*,(
            SELECT SUM(bd.Sub_total)
            FROM tbl_sirim_invoice_master bd
            WHERE bd.Order_no=a.Order_no) AS sumof_subtotal,
            (
            SELECT SUM(bd.voucher_amt)
            FROM tbl_sirim_customer_vouchers bd
            WHERE bd.Transaction_id=a.Transaction_id) AS voucher_amount
            FROM
            (
            SELECT *
            
            FROM tbl_sirim_payment_history
            WHERE payment_status='${status}' ) a
            JOIN (
            SELECT  stuff( (select ', ' + cast(Invoice_no as varchar(max)) from tbl_sirim_invoice_master t  where t.Order_no=bd.Order_no  for xml path ('')), 1, 1, '' ) AS inv_mas_Invoice_no,
            stuff( (select ', ' + cast(receipt_no as varchar(max)) from tbl_sirim_invoice_master t  where t.Order_no=bd.Order_no  for xml path ('')), 1, 1, '' ) AS receipt_no,
            stuff( (select ', ' + cast(MasterInvoiceNo as varchar(max)) from tbl_sirim_invoice_master t  where t.Order_no=bd.Order_no   for xml path ('')), 1, 1, '' ) AS Master_invoice_no,
            
            Order_no AS inv_mas_order_no,Currency
            FROM tbl_sirim_invoice_master bd 
            group BY bd.Invoice_no,bd.Order_no,bd.Currency,bd.MasterInvoiceNo,bd.receipt_no) b ON  a.Order_no= b.inv_mas_order_no
            LEFT JOIN (
            SELECT  stuff( (select ', ' + CAST(voucher_no as varchar(max)) from tbl_sirim_customer_vouchers t  where t.transaction_id=cv.Transaction_id for xml path ('')), 1, 1, '' ) AS voucher_no,transaction_id
            FROM tbl_sirim_customer_vouchers cv GROUP BY cv.voucher_no,transaction_id) cd  ON  cd.transaction_id=a.Transaction_id
            
            `;

        console.log("LOAD_INVOICE_DETAILS \n" + query)

        mainDb.GetQueryData(query, (error, data) => {
            if (error) {
                return reject(`${error}, ${query}`)
            }
            //console.log(data);
            return resolve(data)
        })

    });
}


exports.getrejectedPayments = async (status) => {
    return new Promise((resolve, reject) => {
        // var query = `SELECT a.*,b.Invoice_no,b.Remarks,b.Receipt_no,b.Company_name as comp_name,b.Currency as currency,c.voucher_no
        // FROM 
        // (SELECT * from tbl_sirim_payment_history  WHERE payment_status NOT IN(${status})) a
        // LEFT JOIN (SELECT * from tbl_sirim_invoice_master  ) b
        // ON a.Order_no= b.Order_no
        // Left JOIN (select * from tbl_sirim_customer_vouchers) c
        // ON c.transaction_id = a.Transaction_id`
        // var query = `SELECT DISTINCT  a.*,b.*,cd.*,(
        //     SELECT SUM(bd.Sub_total)
        //     FROM tbl_sirim_invoice_master bd
        //     WHERE bd.Order_no=a.Order_no) AS sumof_subtotal,

        //     (
        //     SELECT SUM(bd.voucher_amt)
        //     FROM tbl_sirim_customer_vouchers bd
        //     WHERE bd.Transaction_id=a.Transaction_id) AS voucher_amount

        //      FROM 
        //     (
        //     SELECT *

        //     FROM tbl_sirim_payment_history
        //     WHERE payment_status NOT IN (${status} )) a
        //      JOIN (
        //     SELECT stuff( (select ', ' + cast(Invoice_no as varchar(max)) from tbl_sirim_invoice_master t  where t.Order_no=bd.Order_no for xml path ('')), 1, 1, '' ) AS inv_mas_Invoice_no,Order_no AS inv_mas_order_no,receipt_no,CAST(bd.Invoice_date AS DATE) AS Invoice_date,Currency,MasterInvoiceNo,Remarks
        //     FROM tbl_sirim_invoice_master bd group BY bd.Invoice_no,bd.Order_no,bd.MasterInvoiceNo,
        //     receipt_no,Currency,bd.Remarks,
        //     CAST(bd.Invoice_date AS DATE)) b ON  a.Order_no= b.inv_mas_order_no

        //     JOIN (
        //     SELECT  stuff( (select ', ' + CAST(voucher_no as varchar(max)) from tbl_sirim_customer_vouchers t  where t.transaction_id=cv.Transaction_id for xml path ('')), 1, 1, '' ) AS voucher_no,transaction_id
        //     FROM tbl_sirim_customer_vouchers cv GROUP BY cv.voucher_no,transaction_id) cd  ON  cd.transaction_id= a.Transaction_id`;

        var query = `SELECT DISTINCT a.*,b.*,cd.*,(
            SELECT SUM(bd.Sub_total)
            FROM tbl_sirim_invoice_master bd
            WHERE bd.Order_no=a.Order_no) AS sumof_subtotal,
            (
            SELECT SUM(bd.voucher_amt)
            FROM tbl_sirim_customer_vouchers bd
            WHERE bd.Transaction_id=a.Transaction_id) AS voucher_amount
            FROM
            (
            SELECT *
            
            FROM tbl_sirim_payment_history
            WHERE payment_status NOT IN (${status} )) a
            JOIN (
            SELECT  stuff( (select ', ' + cast(Invoice_no as varchar(max)) from tbl_sirim_invoice_master t  where t.Order_no=bd.Order_no  for xml path ('')), 1, 1, '' ) AS inv_mas_Invoice_no,
            stuff( (select ', ' + cast(receipt_no as varchar(max)) from tbl_sirim_invoice_master t  where t.Order_no=bd.Order_no  for xml path ('')), 1, 1, '' ) AS receipt_no,
            stuff( (select ', ' + cast(MasterInvoiceNo as varchar(max)) from tbl_sirim_invoice_master t  where t.Order_no=bd.Order_no   for xml path ('')), 1, 1, '' ) AS Master_invoice_no,
            
            Order_no AS inv_mas_order_no,Currency
            FROM tbl_sirim_invoice_master bd 
            group BY bd.Invoice_no,bd.Order_no,bd.Currency,bd.MasterInvoiceNo,bd.receipt_no) b ON  a.Order_no= b.inv_mas_order_no
            LEFT JOIN (
            SELECT  stuff( (select ', ' + CAST(voucher_no as varchar(max)) from tbl_sirim_customer_vouchers t  where t.transaction_id=cv.Transaction_id for xml path ('')), 1, 1, '' ) AS voucher_no,transaction_id
            FROM tbl_sirim_customer_vouchers cv GROUP BY cv.voucher_no,transaction_id) cd  ON  cd.transaction_id=a.Transaction_id`

        console.log("getrejectedPayments \n" + query)
        mainDb.GetQueryData(query, (error, data) => {
            if (error) {
                return reject(`${error}, ${query}`)
            }
            //console.log(data);
            return resolve(data)
        })

    });
}

exports.getOrderNoDistinctInvoiceMaster = async (status) => {
    //console.log(status)
    // return new Promise(async (resolve, reject) => {

    var query = `SELECT DISTINCT ORDER_NO  FROM TBL_SIRIM_INVOICE_MASTER WHERE STATUS = '${status}'`;
    console.log(query)
    return await mainDb.executeQuery(query);
    // });
}


exports.getPendingPaymentData = async (status) => {
    //console.log(status)
    // return new Promise(async (resolve, reject) => {

    var query = `SELECT * FROM tbl_sirim_payment_history hi WHERE hi.payment_status='${status}' `;

    console.log(query)

    return await mainDb.executeQuery(query);

    // });
}



exports.GET_VOUCHER_DETAILS_BY_INVOICENO = async (invoiceId) => {

    let query = `select * from tbl_sirim_customer_vouchers where invoice_no='${invoiceId}'`
    return new Promise((resolve, reject) => {
        mainDb.GetQueryData(query, (error, data) => {
            if (error) {
                return reject(`${error}, ${query}`)
            }
            //console.log(data);
            return resolve(data)
        })
    })
    // return responseData;
}



exports.getVoucherDetails = async (transaction_id) => {

    let query = `select * from tbl_sirim_customer_vouchers where transaction_id='${transaction_id}'`
    return new Promise((resolve, reject) => {
        mainDb.GetQueryData(query, (error, data) => {
            if (error) {
                return reject(`${error}, ${query}`)
            }
            //console.log(data);
            return resolve(data)
        })
    })
    // return responseData;`
}


exports.UPDATE_STATUS_FINANCE = async (orderNo, status, paymentStatus, ReceiptNo, rejectedRemark) => {
    // var query = `UPDATE TBL_SIRIM_INVOICE_Master SET status='${status}',payment_status='${paymentStatus}',Receipt_no='${ReceiptNo}' WHERE Order_no='${orderNo}' `;
    console.log("inside Update states1234" + rejectedRemark);
    let query = '';
    let resObj = {};
    if (rejectedRemark && rejectedRemark !== '') {

        // query = `UPDATE TBL_SIRIM_INVOICE_Master SET status='${status}',payment_status='${paymentStatus}',Remarks='${rejectedRemark}' WHERE Order_no='${orderNo}' `;
        query = `UPDATE TBL_SIRIM_INVOICE_Master SET status='${status}',payment_status='${paymentStatus}' WHERE Order_no='${orderNo}' `;

    } else {
        query = `UPDATE TBL_SIRIM_INVOICE_Master SET status='${status}',payment_status='${paymentStatus}' WHERE Order_no='${orderNo}' `;
    }
    // console.log("UPDATE_STATUS_FINANCE123\n" + query);
    // return new Promise((resolve, reject) => {
    //     mainDb.InsertUpdateDeleteData(query, (error, data) => {
    //         if (error) {
    //             return reject(`${error}, ${query}`)
    //         }
    //         return resolve(data)
    //     })

    // });


    console.log("query1 ===>" + query);

    resObj.updateInvMst = await scisDbConfig.executeQuery(query);


    if (status == 5) {

        query = `update tbl_sirim_payment_history set  Rejected_Remark='${rejectedRemark}' where Order_no='${orderNo}'`

        console.log("query2 ===>" + query);


        resObj.updateInvMstDetails = await scisDbConfig.executeQuery(query);

    }

    return resObj;

}


exports.Update_payment_Repo = async (OrderNo, status) => {
    console.log("Update_payment_Repo\n " + status)
    let query;
    if (status == 5 || status == 4) {
        query = `update tbl_sirim_payment_history set  payment_status='Failure' where Order_no='${OrderNo}'`
        // let responseData = await mainDb.InsertandReturnID(updatepaymenthistory);
        //  console.log(responseData)
    }
    else {
        query = `update tbl_sirim_payment_history set  payment_status='Success' where Order_no='${OrderNo}'`
        // let responseData = await mainDb.InsertUpdateDeleteData(updatepaymenthistory);

    }
    console.log("Update_payment_Repo\n" + query);

    return new Promise((resolve, reject) => {
        mainDb.InsertUpdateDeleteData(query, (error, data) => {
            if (error) {
                return reject(`${error}, ${query}`)
            }
            return resolve(data)
        })

    });

}


exports.InvoiceMasterdetails = (orderNo) => {

    let query = `SELECT * FROM TBL_SIRIM_INVOICE_Master WHERE ORDER_NO='${orderNo}'`
    return new Promise((resolve, reject) => {

        console.log("InvoiceMasterdetails ==> " + query)

        // console.log(query)

        mainDb.GetQueryData(query, (error, data) => {
            if (error) {
                return reject(`${error}, ${query}`)

            }
            //console.log(query)

            return resolve(data)
        })
    })
}


exports.ReceiptDetailsInsert = async (ReceiptNo, invoiceData, userData) => {
    let query = `INSERT INTO tbl_sirim_reciept_details (receipt_no,invoice_no,receipt_amount,receipt_status,receipt_to,created_date,created_by)
     VALUES ('${ReceiptNo}','','${invoiceData.Sub_total_rm}',1,'${invoiceData.Customer_name}',GETDATE(),'${userData.contactPerson}')`
    console.log("ReceiptDetailsSave\n" + query)
    return new Promise((resolve, reject) => {
        mainDb.InsertUpdateDeleteData(query, (error, data) => {
            if (error) {
                return reject(`${error},${query}`)
            }
            // console.log("ReceiptDetailsSave data\n" + JSON.stringify(data))
            return resolve(data)
        })
    })
}

exports.ReceiptDetailsSave = async (ReceiptNo, orderNo, receiptPDFDetails, filePath, fileName) => {
    // let query = `INSERT INTO tbl_sirim_reciept_details (receipt_no,invoice_no,order_no,receipt_amount,receipt_status,receipt_to,created_date,created_by,file_path,file_name)
    // VALUES ('${ReceiptNo}','','${orderNo}','${receiptPDFDetails.Sub_total_rm}',1,'${receiptPDFDetails.Customer_name}',GETDATE(),'${receiptPDFDetails.Created_by}','${filePath}','${fileName}')  `

    let data = ''
    if (ReceiptNo != '') {
        data = await sirimUtils.convertArrayToQuteString(ReceiptNo.split(","))
    }

    let query = `Update tbl_sirim_reciept_details set order_no='${orderNo}',receipt_status=1,modified_date=GETDATE(),modified_by='${receiptPDFDetails.Created_by}',file_path='${filePath}',file_name='${fileName}' WHERE receipt_no IN (${data})`
    console.log("ReceiptDetailsSave\n" + query)

    return new Promise((resolve, reject) => {
        mainDb.InsertUpdateDeleteData(query, (error, data) => {
            if (error) {
                return reject(`${error},${query}`)
            }
            // console.log("ReceiptDetailsSave data\n" + JSON.stringify(data))
            return resolve(data)
        })
    })
}


exports.UpdateInvoiceMaster = async (ReceiptNo, orderNo) => {


    let query = `update tbl_sirim_Invoice_Master set Receipt_no = '${ReceiptNo}' where Order_no ='${orderNo}'`

    console.log("UpdateInvoiceMaster\n" + query)

    return await mainDb.executeUpdateQuery(query);
    // mainDb.GetQueryData(query, (error, data) => {
    //     if (error) {
    //         return reject(`${error},${query}`)
    //     }
    //     return resolve(data)
    // })


}


exports.getTransectionDetails = async (TransactionNo) => {
    //console.log(status)
    // return new Promise(async (resolve, reject) => {

    var query = `SELECT * FROM tbl_sirim_payment_history hi WHERE hi.transaction_id='${TransactionNo}' `;

    console.log("getTransectionDetails\n" + query)

    return await mainDb.executeQuery(query);

    // });
}
