var dateFormat = require('dateformat');
const mainDb = require('../../MainDb');
const logger = require('../../../logger');
const paymentConstants = require('../../../config/PaymentConstants');
var moment = require('moment');
const sirimUtils = require('../../ReportsMgtRepo/SirimUtils');
// var time = require('time');

exports.Check_Voucher__ByUser_Verification = (voucherDetails) => {

    //logger.info("data"+JSON.stringify(voucherDetails))

    return new Promise((resolve, reject) => {
        let query = `
        SELECT  * FROM tbl_sirim_vouchers WHERE voucher_no=${voucherDetails.voucherNo} and voucher_amount=${voucherDetails.voucherAmount} and invoice_no=${1000} ;`
        mainDb.GetQueryData(query, (error, data) => {
            if (error) {
                return reject(`${error}, ${query}`)
            }
            return resolve(data)
        })
    })
}

exports.Get_Transaction_Seq_Value = () => {
    return new Promise((resolve, reject) => {
        let query = `EXEC TRLASTUSEDNO 'transid','','','' `
        mainDb.GetQueryData(query, (error, data) => {
            if (error) {
                return reject(`${error}, ${query}`)
            }
            //logger.info(data)
            let sequenceNo = data[0].seqNo;
            return resolve(sequenceNo)

        })

    })
}

exports.CUSTOMER_VOUCHER_DETAILS = async (voucherDetais, totalAmount, userName, loginUserName, transactionId) => {
    // logger.info(voucherDetais)

    // let invoiceData = await this.getdatas(voucherDetais.Quotation_no);
    //  let invoiceDatas = invoiceData[0];
    //logger.info(invoiceDatas)
    let query = `
   
    INSERT INTO TBL_SIRIM_CUSTOMER_VOUCHERS(transaction_id,invoice_amt,tbl_invoice_id,voucher_no,voucher_amt,vou_expiry_date,created_by,created_date,status)
   
    VALUES('${transactionId}','${totalAmount}',0,'${voucherDetais.voucherNo}','${voucherDetais.voucherAmount}','${voucherDetais.voucherExpiryDate}','${userName}',GETDATE(),'new')`

    logger.info(loginUserName);
    // let updateQuery = `UPDATE tbl_sirim_Invoice_Master SET  tbl_sirim_Invoice_Master.payment_mode='voucher' ,tbl_sirim_Invoice_Master.Status=2 ,invoice_No='${invoiceNo}'where Quotation_no='${voucherDetais.Quotation_no}'`
    let updateVoucherquery = ` UPDATE tbl_sirim_vouchers set status='used',used_date=getdate(),modified_date=getdate(),modified_by='${loginUserName}' where voucher_no='${voucherDetais.voucherNo}'`
    logger.info(updateVoucherquery)
    await mainDb.InsertandReturnID(query);

    // await mainDb.InsertUpdateDeleteData(updateVoucherquery)
    return new Promise((resolve, reject) => {
        mainDb.InsertUpdateDeleteData(updateVoucherquery, (error, data) => {
            if (error) {
                logger.info("error" + error)
                return reject(`${error}, ${query}`)
            }


            logger.info(data);
            return resolve(data);
        })
    });

    return updateVoucherquery;
}
exports.getdatas = (QuotationNo) => {
    return new Promise((resolve, reject) => {
        let query = `
        SELECT  * FROM tbl_sirim_Invoice_Master WHERE Quotation_no='${QuotationNo}'`
        mainDb.GetQueryData(query, (error, data) => {
            if (error) {
                return reject(`${error}, ${query}`)
            }


            return resolve(data)
        })
    })
}

exports.GET_INVOICE_DETAILS_BY_INVOICE_ID = (invoiceId) => {

    // logger.info("data"+JSON.stringify(voucherDetails))

    let query = `
   
    SELECT * FROM TBL_SIRIM_INVOICE_Master WHERE Quotation_no='${invoiceId}'`
    //logger.info(query)

    return new Promise((resolve, reject) => {
        mainDb.GetQueryData(query, (error, data) => {
            if (error) {
                return reject(`${error}, ${query}`)
            }
            //logger.info(data)
            return resolve(data)
        })
    })
}

exports.Get_Invoice_Seq_Value = () => {
    return new Promise((resolve, reject) => {
        let query = `EXEC INVLASTUSEDNO 'invoice'  `
        mainDb.GetQueryData(query, (error, data) => {
            if (error) {
                return reject(`${error}, ${query}`)
            }
            let sequenceNo = data[0].seqNo;
            return resolve(sequenceNo)
        })
    })
}

exports.update_invoice_tbl = async (transactionId, paymentMode, orderNo, paymentType, paymentDate, userData, remark) => {
    console.log("paymentDate ====> " + paymentDate)
    let newdates = dateFormat(paymentDate, 'yyyy-mm-dd');

    // let paymentdates = moment(paymentDate).format('YYYY-MM-DD');
    // console.log("paymentdates ====> " + paymentdates)
    let query = `UPDATE TBL_SIRIM_INVOICE_Master SET payment_mode='${paymentMode}',payment_type='${paymentType}',
    status=2, payment_date='${newdates}',sirim_txnNo='${transactionId}',Payment_status='pending',Modified_by='${userData.username}',Modified_date=GETDATE(),internal_Remark='${remark !== undefined ? remark : ""}'  where order_no='${orderNo}'`
    logger.info(query);
    let responseData = await mainDb.InsertandReturnID(query);

    return responseData;

}

exports.INSERT_IBG_IMAGE = async (IBGfileData, userName) => {

    let query = `INSERT INTO TBL_SIRIM_IBG_UPLOAD_FILES(UPLOADED_FILE,UPLOADED_BY,UPLOADED_DATE)
    OUTPUT INSERTED.ID
    VALUES(convert(VARBINARY(max),'${IBGfileData}'),'${userName}',CURRENT_TIMESTAMP)`

    let responseData = await mainDb.InsertandReturnID(query);
    logger.info("data" + JSON.stringify(responseData));
    return responseData.ID;
}





exports.INSERT_CHEQUE_IMAGE = async (ChequefileData, userName) => {

    let query = `INSERT INTO tbl_sirim_chq_upload_files(UPLOADED_FILE,UPLOADED_BY,UPLOADED_DATE)
    OUTPUT INSERTED.ID
    VALUES(convert(VARBINARY(max),'${ChequefileData}'),'${userName}',CURRENT_TIMESTAMP)`

    let responseData = await mainDb.InsertandReturnID(query);
    // logger.info(responseData);
    return responseData.ID;
}





exports.INSERT_JOMPAY_IMAGE = async (jompayfileData, userName) => {

    let query = `INSERT INTO Tbl_sirim_jompay_files(UPLOADED_FILE,UPLOADED_DATE,UPLOADED_BY)
    OUTPUT INSERTED.ID
    VALUES(convert(VARBINARY(max),'${jompayfileData}'),CURRENT_TIMESTAMP,'${userName}')`
    let responseData = await mainDb.InsertandReturnID(query);
    return responseData.ID;
}

exports.Save_Payment_Repository = async (createdBy, TransactionId, totalAmount, paymentType, orderNumber, PaymentMode, customerId, companyName) => {
    let query = `insert into tbl_sirim_payment_history( Transaction_id,Transaction_amount,Transaction_date,Transaction_by,payment_status,payment_type,Order_no,Payment_mode,customer_Id,company_name)VALUES('${TransactionId}',${totalAmount},GETDATE(),'${createdBy}','Pending','${paymentType}','${orderNumber}','${PaymentMode}','${customerId}','${companyName}')`
    let responseData = await mainDb.InsertandReturnID(query);
    logger.info(query);
    return responseData;

}

exports.updateExistingPaymentHistory = async (TxnNo) => {
    let query = `update tbl_sirim_payment_history set payment_status='Repayment' where Transaction_id in ('${TxnNo}')`
    let responseData = await mainDb.InsertandReturnID(query);
    logger.info(query);
    return responseData;

}

exports.UpdateByInvoiceNo = async (InvoiceNo, orderNo) => {
    let query = `update tbl_sirim_invoice_master set Order_no='${orderNo}' where Invoice_no='${InvoiceNo}'`
    console.log("UpdateByInvoiceNo ==> " + query)

    let responseData = await mainDb.InsertandReturnID(query);

    logger.info(query);
    return responseData;

}
exports.UpdateOrderNo = async (QuotationNo, orderNo) => {
    let query = `update tbl_sirim_invoice_master set Order_no='${orderNo}' where Quotation_no='${QuotationNo}'`
    console.log("UpdateOrderNo ==> " + query)

    let responseData = await mainDb.InsertandReturnID(query);

    logger.info(query);
    return responseData;

}


exports.UpdateOrderNowithMasterInvNo = async (QuotationNo, orderNo) => {

    let data = await sirimUtils.convertArrayToQuteString(QuotationNo.split(","))

    let query = `update tbl_sirim_invoice_master set Order_no='${orderNo}' where Quotation_no IN(${data})`

    console.log("UpdateOrderNo ==> " + query)

    let responseData = await mainDb.InsertandReturnID(query);

    logger.info(query);
    return responseData;

}

exports.INSERT_IBG_IMAGE_DETAILS = (uplodedId, transactionId, transactionAmount) => {

    //logger.info(resultinvoiceDetails)

    let query = `INSERT INTO tbl_sirim_ibg_details(INVOICE_NO,TBL_SIRIM_INV_ID,TRANSACTION_ID,TRANSACTION_AMT,IBG_UPLOAD_ID)
     VALUES('','','${transactionId}',${transactionAmount},${uplodedId})`
    logger.info(query)
    return new Promise((resolve, reject) => {
        mainDb.InsertUpdateDeleteData(query, (error, data) => {
            if (error) {
                logger.info("error" + error)
                return reject(`${error}, ${query}`)
            }


            logger.info(data);
            return resolve(data);
        })
    });
}



exports.INSERT_CHEQUE_IMAGE_DETAILS = (uplodedId, transactionid, transactionAmount) => {


    //logger.info(resultinvoiceDetails)
    let query = `INSERT INTO tbl_sirim_chq_details(INVOICE_NO,TBL_SIRIM_INV_ID,CHQUE_NO,TRANSACTION_ID,BANK_NAME,CHQ_AMT,TBL_SM_CHQ_UPLOAD_FILES_ID)
   VALUES('','','','${transactionid}','',${transactionAmount},${uplodedId})`
    //logger.info(query)
    return new Promise(async (resolve, reject) => {
        await mainDb.InsertUpdateDeleteData(query, (error, data) => {
            if (error) {
                logger.info("error" + error)
                return reject(`${error}, ${query}`)
            }

            return resolve(data);
        })
    });
}


exports.GET_CHEQUE_DETAILS = async (TransactionNo) => {
    let query = `select chqFiles.UPLOADED_FILE from tbl_sirim_chq_details chq,tbl_sirim_chq_upload_files chqFiles where chq.transaction_ID='${TransactionNo}' and chq.TBL_SM_CHQ_UPLOAD_FILES_ID=chqFiles.ID`
    let responseData = await mainDb.executeQuery(query);
    logger.info(query);
    return responseData;
}
exports.GET_JOMPAY_DETAILS = async (TRANSACTION_ID) => {
    let query = `select jompayFiles.UPLOADED_FILE from tbl_sirim_jompay_details jompay, Tbl_sirim_jompay_files jompayFiles where jompay.TRANSACTION_ID='${TRANSACTION_ID}' and jompay.IBG_UPLOAD_ID=jompayFiles.ID`
    let responseData = await mainDb.executeQuery(query);
    logger.info(query);
    return responseData;
}
exports.GET_VOUCHERDETAILS = async (orderNo) => {
    let query = `select * from tbl_sirim_customer_vouchers where Order_no='${orderNo}'`
    let responseData = await mainDb.excuteSelectQuery(query);
    logger.info(query);
    return responseData;
}

exports.GET_IBG_DETAILS = async (TransactionNo) => {
    let query = `select IBGFiles.UPLOADED_FILE from tbl_sirim_ibg_details IBG,tbl_sirim_ibg_upload_files IBGFiles where IBG.TRANSACTION_ID='${TransactionNo}' and IBG.IBG_UPLOAD_ID=IBGFiles.ID`
    let responseData = await mainDb.excuteSelectQuery(query);
    logger.info(query);
    return responseData;
}
/* exports.GET_JOMPAY_DETAILS =async (invoiceNo) =>{
    let query=`select IBGFiles.UPLOADED_FILE from tbl_sirim_ibg_details IBG,tbl_sirim_ibg_upload_files IBGFiles where IBG.INVOICE_NO='${invoiceNo}' and IBG.IBG_UPLOAD_ID=IBGFiles.ID`
    let responseData = await mainDb.excuteSelectQuery(query);
logger.info(query);
    return responseData;
} */

/* exports.GET_IBG_DETAILS =async (invoiceNo) =>{
    let query=`select chqFiles.UPLOADED_FILE from tbl_sirim_ibg_details ibg,tbl_sirim_ibg_upload_files ibgFiles where chq.INVOICE_NO='${invoiceNo}' and ibg.TBL_SM_CHQ_UPLOAD_FILES_ID=chqFiles.ID`
    let responseData = await mainDb.excuteSelectQuery(query);

    return responseData;
} */


exports.INSERT_JOMPAY_IMAGE_DETAILS = (uplodedId, transactionId, transactionAmount) => {

    let query = `INSERT INTO tbl_sirim_jompay_details(INVOICE_NO,TBL_SIRIM_INV_ID,TRANSACTION_ID,TRANSACTION_AMT,IBG_UPLOAD_ID)
    VALUES('','','${transactionId}',${transactionAmount},${uplodedId})`
    // logger.info(query)
    return new Promise((resolve, reject) => {
        mainDb.InsertUpdateDeleteData(query, (error, data) => {
            if (error) {
                logger.info("error" + error)
                return reject(`${error}, ${query}`)
            }

            return resolve(data);
        })
    });
}

exports.saveOnlinePaymentRequest = async (siteId, totalAmout, onlinePaymentResponce, paymentMode, paymentType, createdDate, createdBy, status, OrderNumber, Orderid) => {
    let query = `
    INSERT INTO tbl_sirim_onlinepayment_req_res(mp_siteid,mp_orderno,mp_orderid,mp_amount,mp_description,mp_backurl,mp_respcode,mp_respdesc,mp_txnid,mp_email,mp_sesskey,mp_paytype,payment_mode,created_date,created_by,transaction_status,invoiceNo)
    OUTPUT INSERTED.ID
    VALUES('${siteId}','${OrderNumber}','${Orderid}',
    '${totalAmout}',null,
    '${onlinePaymentResponce.mp_backurl}','${onlinePaymentResponce.mp_respcode}',
    '${onlinePaymentResponce.mp_respdesc}','${onlinePaymentResponce.mp_txnid}',
    '${onlinePaymentResponce.mp_email}','${onlinePaymentResponce.mp_sesskey}',
    '${onlinePaymentResponce.mp_paytype}','${paymentMode}','${createdDate}',
    '${createdBy}','${status}',null)`
    return new Promise((resolve, reject) => {
        mainDb.InsertandReturnId(query, (error, data) => {
            if (error) {
                logger.info("error id ==>  " + error);
                return reject(`${error}, ${query}`)
            }
            return resolve(data);
        })
    });
}

exports.getTotalAmount = async (invoiceNo) => {
    let query = `select sum(Sub_total_rm) AS TotalAmount from tbl_sirim_Invoice_Master where Invoice_no='${invoiceNo}' group by invoice_no`
    let responseData = await mainDb.excuteSelectQuery(query);
    // logger.info(query);
    return responseData;
}


exports.Get_OrderNo_Seq_Value = (parameter, invtype, sectioncode, receiptno) => {
    return new Promise((resolve, reject) => {
        let query = `EXEC ORDERNO '${parameter}','${invtype}','${sectioncode}','${receiptno}'`
        console.log("Get_OrderNo_Seq_Value \n" + query);
        mainDb.GetQueryData(query, (error, data) => {
            if (error) {
                return reject(`${error}, ${query}`)
            }
            let sequenceNo = data[0].seqNo;
            console.log(sequenceNo)
            return resolve(sequenceNo)
        })
    })
}

exports.updateInvoiceNoInvoiceMasterByQouteNo = async (paymentDate, resultOrderNo, paymentMode, quoteNo, paymentType, paymentStatus) => {

    let data = await sirimUtils.convertArrayToQuteString(quoteNo.split(","))

    let query = `UPDATE TBL_SIRIM_INVOICE_Master SET payment_date='${paymentDate}',order_no='${resultOrderNo}', payment_mode='${paymentMode}',payment_type='${paymentType}',payment_status='${paymentStatus}' where Quotation_no IN(${data})`
    let responseData = await mainDb.InsertandReturnID(query);
    //logger.info(query);
    return responseData;
}


// exports.saveOnlinePaymentResponce = async (onliceResponce, userData, currentDate) => {
//     let query = `
//     INSERT INTO tbl_sirim_onlinepayment_req_res(mp_respcode,mp_respdesc,mp_txnid,modified_by,modified_date,transaction_status,transaction_date,responce )
//     OUTPUT INSERTED.ID
//     VALUES('${onliceResponce.mp_respcode}','${onliceResponce.mp_respdesc}','${onliceResponce.mp_txnid}','${userData.userName}','${currentDate}',
//     'success','${onliceResponce.mp_txndate}','${currentDate}'
//     ) WHERE mp_orderno='${onliceResponce.mp_txnid}'`
//     return new Promise((resolve, reject) => {
//         mainDb.InsertandReturnId(query, (error, data) => {
//             if (error) {
//                 logger.info("error id ==>  " + error);
//                 return reject(`${error}, ${query}`)
//             }
//             return resolve(data);
//         })
//     });
// }

exports.quotationDataList = async (invoiceNo) => {
    let query = `select * from tbl_sirim_Invoice_Master where Invoice_no='${invoiceNo}' `
    let responseData = await mainDb.excuteSelectQuery(query);
    return responseData;
}

exports.saveDataOnlinePaymentHistoryBankWire = async (responceData, transactionId, paymentStatus, userData) => {
    let dateTime = 'getdate()';
    if (responceData.fpx_sellerTxnTime && responceData.fpx_sellerTxnTime != null && responceData.fpx_sellerTxnTime != '') {
        let m = moment(responceData.fpx_sellerTxnTime, "YYYY-MM-DD")
        dateTime = moment(m).format("YYYY-MM-DD HH:MM:SS");
    }
    logger.info("saveDataOnlinePaymentHistoryBankWire responceData ==> \n" + JSON.stringify(responceData));

    let query = `insert into tbl_sirim_payment_history(Invoice_no,Transaction_id,Transaction_amount, Transaction_date,Transaction_by,
        payment_status,payment_mode,seller_order_no,buyer_bank,fpx_sellerExOrderNo,fpx_sellerTxnTime,fpx_buyerEmail, fpxTxnId,fpx_sellerId,
        fpx_sellerOrderNo,fpx_txnAmount,fpx_fpxTxnId,fpx_checkSum,mp_bankcode,payment_type,customer_Id,company_name) VALUES (null,'${transactionId}',
        ${responceData.mp_amount},getdate(), '${responceData.mp_email}','${paymentStatus}','${responceData.mp_paytype}',
        '${responceData.fpx_fpxTxnId}' ,'${responceData.BUYER_BANK}' ,'${responceData.fpx_sellerExOrderNo}',
        '${dateTime}','${responceData.fpx_buyerEmail}' ,'${responceData.fpxTxnId}','${responceData.fpx_sellerId}',
        '${responceData.fpx_sellerOrderNo}' ,'${responceData.fpx_txnAmount}' ,'${responceData.fpx_fpxTxnId}' ,
        '${responceData.fpx_checkSum}' ,'${responceData.mp_bankcode}','${paymentConstants.paymentMode}','${userData.cust_code}','${userData.company_name}')`
    let responseData = await mainDb.excuteSelectQuery(query);
    // '${responceData.mp_orderid}','${userData.cust_code}','${userData.companu_name}')`
    return responseData;

}


// exports.saveDataOnlinePaymentHistoryBankWire = async (responceData, transactionId, paymentStatus) => {

//     // var a = new time.Date(1337324400000);

//     // a.setTimezone('Europe/Amsterdam');
//     // console.log(a.toString()); // Fri May 18 2012 09:00:00 GMT+0200 (CEST)
//     // a.setTimezone('Europe/Kiev');
//     // console.log(a.toString()); 
//     let dateTime = 'getdate()';
//     if (responceData.fpx_sellerTxnTime && responceData.fpx_sellerTxnTime != null && responceData.fpx_sellerTxnTime != '') {
//         const m = moment(responceData.fpx_sellerTxnTime, "YYYY-MM-DD")
//         dateTime = moment(m).format("YYYY-MM-DD HH:MM:SS");
//     }


//     logger.info("saveDataOnlinePaymentHistoryBankWire responceData ==> \n" + JSON.stringify(responceData));
//     let query = `insert into tbl_sirim_payment_history(Invoice_no,Transaction_id,Transaction_amount, Transaction_date,Transaction_by,
//         payment_status,payment_type,seller_order_no,buyer_bank,fpx_sellerExOrderNo,fpx_sellerTxnTime,fpx_buyerEmail, fpxTxnId,fpx_sellerId,
//         fpx_sellerOrderNo,fpx_txnAmount,fpx_fpxTxnId,fpx_checkSum,mp_bankcode) VALUES ('${responceData.mp_description}','${transactionId}',
//         ${responceData.mp_amount},getdate(), '${responceData.mp_email}','${paymentStatus}','${responceData.mp_paytype}',
//         '${responceData.fpx_sellerOrderNo}' ,'${responceData.BUYER_BANK}' ,'${responceData.fpx_sellerExOrderNo}',
//         '${dateTime}','${responceData.fpx_buyerEmail}' ,'${responceData.fpxTxnId}','${responceData.fpx_sellerId}',
//         '${responceData.fpx_sellerOrderNo}' ,'${responceData.fpx_txnAmount}' ,'${responceData.fpx_fpxTxnId}' ,
//         '${responceData.fpx_checkSum}' ,'${responceData.mp_bankcode}')`
//     let responseData = await mainDb.excuteSelectQuery(query);
//     return responseData;
// }

exports.saveDataOnlinePaymentHistoryCCPAY = async (responceData, transactionId, paymentStatus, userData) => {
    logger.info("req.path " + JSON.stringify(userData))
    // var a = new time.Date(1337324400000);

    // a.setTimezone('Europe/Amsterdam');
    // console.log(a.toString()); // Fri May 18 2012 09:00:00 GMT+0200 (CEST)
    // a.setTimezone('Europe/Kiev');
    // console.log(a.toString()); 
    // let dateTime = 'getdate()';
    // if (responceData.fpx_sellerTxnTime && responceData.fpx_sellerTxnTime != null && responceData.fpx_sellerTxnTime != '') {
    //     const m = moment(responceData.fpx_sellerTxnTime, "YYYY-MM-DD")
    //     dateTime = moment(m).format("YYYY-MM-DD HH:MM:SS");
    // }

    logger.info("saveDataOnlinePaymentHistoryCCPAY responceData ==> \n" + JSON.stringify(responceData));

    let query = `insert into tbl_sirim_payment_history(Invoice_no,Transaction_id,Transaction_amount, Transaction_date,Transaction_by,
        payment_status,payment_type,seller_order_no,customer_Id,company_name) VALUES (null,'${transactionId}',
        ${responceData.mp_amount},getdate(), '${responceData.mp_email}','${paymentStatus}','${responceData.mp_paytype}',
        '${responceData.mp_orderid}','${userData.cust_code}','${userData.company_name}')`

    logger.info("saveDataOnlinePaymentHistoryCCPAY \n" + query)

    let responseDatas = await mainDb.excuteSelectQuery(query);
    return responseDatas;

}


exports.getdataOrderNo = async (OrderNo) => {
    let query = `select * from tbl_sirim_Invoice_Master where order_no='${OrderNo}' `
    let responseData = await mainDb.executeQuery(query);
    return responseData;
}

exports.getdataByTransectionNo = async (txnNo) => {
    let query = `select * from tbl_sirim_Invoice_Master where Sirim_txnNo='${txnNo}' `
    let responseData = await mainDb.executeQuery(query);
    return responseData;
}

exports.getPaymentdata = async (OrderNo) => {
    let query = `select * from tbl_sirim_Invoice_Master where order_no='${OrderNo}' `
    let responseData = await mainDb.executeQuery(query);
    return responseData;
}

exports.updateOnlineResponceCCPAY = async (responceData, transactionId) => {
    // logger.info("responceData " + JSON.stringify(responceData))
    let query = `update tbl_sirim_onlinepayment_req_res set sirim_txnNo='${transactionId}', mp_respcode='${responceData.RESPONSE_CODE}',
    mp_respdesc='${responceData.RESPONSE_DESC}',mp_txnid='${responceData.mp_txnid}',modified_by='${responceData.mp_email}',
    modified_date=getdate(),transaction_status='${responceData.TXN_STATUS}',transaction_date=getdate(),
    responce='${JSON.stringify(responceData)}' where mp_orderno='${responceData.mp_orderid}'`
    // let query = `update tbl_sirim_onlinepayment_req_res set mp_respcode='${responceData.RESPONSE_CODE}',mp_respdesc='${responceData.RESPONSE_DESC}',mp_txnid='${responceData.mp_txnid}',modified_by='${responceData.mp_email}',modified_date=getdate(),transaction_status='${responceData.TXN_STATUS}',transaction_date=getdate(),responce='${JSON.stringify(responceData)}' where mp_orderno='${responceData.mp_orderno}' and invoiceNo='${responceData.mp_description}' `
    logger.info("updateOnlineReqRes ==> \n" + query);
    let responseDatas = await mainDb.executeQuery(query);
    return responseDatas;
}

exports.updateOnlineResponceBankWire = async (responceData, transactionId, orderNo) => {
    // logger.info("responceData " + JSON.stringify(responceData))
    let query = `update tbl_sirim_onlinepayment_req_res set  sirim_txnNo='${transactionId}', mp_txnid='${responceData.fpxTxnId}',modified_by='${responceData.mp_email}',
    modified_date=getdate(), transaction_status='${paymentConstants.STATUS_SUCCESS}',transaction_date=getdate(), 
    mp_respcode='${responceData.ResponseCode}',buyer_Bank='${responceData.mp_bankcode}',responce='${JSON.stringify(responceData).toString()}'
    where mp_orderno='${orderNo}' `
    // let query = `update tbl_sirim_onlinepayment_req_res set mp_respcode='${responceData.RESPONSE_CODE}',mp_respdesc='${responceData.RESPONSE_DESC}',mp_txnid='${responceData.mp_txnid}',modified_by='${responceData.mp_email}',modified_date=getdate(),transaction_status='${responceData.TXN_STATUS}',transaction_date=getdate(),responce='${JSON.stringify(responceData)}' where mp_orderno='${responceData.mp_orderno}' and invoiceNo='${responceData.mp_description}' `
    logger.info("updateOnlineReqRes ==> \n" + query);
    let responseDatas = await mainDb.executeQuery(query);
    return responseDatas;
}


exports.update_invoice_tbl_onlinePayment = async (paymentMode, orderNo, paymentType, paymentDate, username, status, transactionId, ReceiptNo) => {
    let query = `UPDATE TBL_SIRIM_INVOICE_Master SET sirim_txnNo='${transactionId}',payment_type='${paymentMode}',
    payment_mode='${paymentType}',modified_by='${username}',modified_date=getdate(), 
    payment_date='${moment(new Date).format('YYYY-MM-DD')}',payment_status='${status}'
     where order_no='${orderNo}' `
    let responseData = await mainDb.InsertandReturnID(query);
    logger.info("update_invoice_tbl_onlinePayment ==> \n" + query);
    return responseData;

}


exports.updateOnlineInvoiceMasterSucessPaymentCCPAY = async (responceData, paymentMode, orderNo, invoiceNo, paymentType, paymentDate, username, status, transactionId) => {

    let statusUpdate;
    let paymentStatus;
    if (responceData.TXN_STATUS === 'C' && (Number(responceData.RESPONSE_CODE) === 0 || Number(responceData.RESPONSE_CODE) === 00)) {
        statusUpdate = 3;
        paymentStatus = paymentConstants.STATUS_SUCCESS;
    } else {
        statusUpdate = 1;
        paymentStatus = paymentConstants.STATUS_FAIL;
    }

    let query = `UPDATE TBL_SIRIM_INVOICE_Master SET sirim_txnNo='${transactionId}',payment_type='${paymentMode}',
    payment_mode='${paymentType}',modified_by='${username}',modified_date=getdate(), 
    payment_date='${moment(paymentDate).format('YYYY-MM-DD')}',payment_status='${paymentStatus}',status='${statusUpdate}'
     where order_no='${orderNo}'`
    logger.info("update_invoice_tbl_onlinePayment ==> \n" + query);

    let responseData = await mainDb.InsertandReturnID(query);
    return responseData;

}


exports.TransNumberCheck = async (InvoiceNo) => {

    console.log("InvoiceNo--InvoiceNo---" + JSON.stringify(InvoiceNo))

    var str = InvoiceNo.split(',');

    console.log("---" + JSON.stringify(str));

    // let INVO = await sirimUtils.convertArrayToQuteString(str);
    let INVO = await sirimUtils.convertArrayToQuteString(InvoiceNo.split(","))

    console.log("---N---" + JSON.stringify(INVO));


    // let tempArray = [];
    // for (let i = 0; i < str.length; i++) {

    //     const element = str[i];

    //     tempArray.push(element);

    // }
    // console.log("tempArray---->" + JSON.stringify(tempArray))


    let query = `SELECT Sirim_txnNo FROM tbl_sirim_Invoice_Master WHERE Invoice_no IN (${INVO})`
    let TXNO = await mainDb.executeQuery(query);
    console.log("TXNO---" + JSON.stringify(TXNO));
    let TransNo = TXNO[0].Sirim_txnNo;
    console.log("TXNO--->>>" + JSON.stringify(TransNo));

    if (TransNo) {
        console.log("YASSSSSS---");

        query = `Select payment_status from tbl_sirim_payment_history where  Transaction_id = '${TransNo}'`

        let Status = await mainDb.executeQuery(query);
        console.log("Status---" + Status);
        // console.log("Status 2---" + JSON.stringify(Status.payment_status));
        // console.log("Status 2---" + JSON.stringify(Status[0].payment_status));


        if (Status != null && Status.length > 0 && Status[0].payment_status === 'Failure') {
            query = `UPDATE tbl_sirim_payment_history SET payment_status ='Repayment' WHERE Transaction_id = '${TransNo}'`
            console.log("YASSSSSS+++" + query);
            let resObj = await mainDb.executeQuery(query);
            console.log("YASSSSSS" + query);
            return resObj;
        }
    }
}

exports.updateReceiptNo = async (ReceiptNo, QoutationNo) => {
    let query = `update tbl_sirim_invoice_master set Receipt_no='${ReceiptNo}' where Quotation_no in ('${QoutationNo}')`
    let responseData = await mainDb.InsertandReturnID(query);
    logger.info(query);
    return responseData;

}
exports.updateReceiptNoByInvoiceNo = async (ReceiptNo, InvoiceNo) => {
    let query = `update tbl_sirim_invoice_master set Receipt_no='${ReceiptNo}' where Invoice_no in ('${InvoiceNo}')`
    let responseData = await mainDb.InsertandReturnID(query);
    logger.info(query);
    return responseData;

}