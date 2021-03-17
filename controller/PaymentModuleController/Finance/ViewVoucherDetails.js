let voucherDetails = require('../../../repositories/PaymentRepository/Finance/ViewVoucherDetailsLogic');

let responseDto = require('../../../config/ResponseDto')


var constants = require('../../../config/PaymentConstants');
var constant = require('../../../config/Constants');

var receiptPdf = require('../../../PDFUtils/MasterPDF/ReciptPdf');

var PaymentRepository = require('../../../repositories/PaymentRepository/Customers/PaymentRepository')

const mailTransporter = require('../../../config/mail-config')
const MessageFormat = require('messageformat');
const mf = new MessageFormat('en');
const CUSTOMER_REJECT_CONTANT = '<h3>Dear Customer {CUSTOMERNAME},</h3><br><p>Your Payment Is Rejected By Finance</p><br><p>Remark : {REMARK}</p><br><br><p>Thanks,<br><b>eSCIS Customer Portal</b></p>';
const CUSTOMER_SECEND_TEXT = '<h3>Dear Customer {CUSTOMERNAME},</h3><br><p><p>Your Receipt has been Generated.</p><p><br><p>Please find the Attachement.</p><br></p><br><p>Thanks,<br><b>eSCIS Customer Portal</b></p>';


let LoadInvoicveDetails = async (req, res) => {  // Dashboard
    try {

        let status = req.query.status;
        // console.log(req.query.status);
        let resultInvoicveDetails = await voucherDetails.LOAD_INVOICE_DETAILS(status);
        //console.log(resultVoucherDetails);

        return res.json(new responseDto(constants.STATUS_SUCCESS, '', resultInvoicveDetails));


    }
    catch (err) {
        console.log(err);
        return res.json(new responseDto('', constants.STATUS_FAIL, err));
    }
}



let getPaymentPendingDatas = async (req, res) => { //Load Pending Payment
    let responce = {};
    try {

        let status = req.query.status;
        console.log("getPaymentPendingDatas \n" + status);
        let resultInvoicveDetails = await voucherDetails.LOAD_INVOICE_DETAILS(status);
        responce.InvoiceMasterData = resultInvoicveDetails;
        paymentHistory = await voucherDetails.getPendingPaymentData(status);
        responce.paymentHistory = paymentHistory;
        return res.json(new responseDto(constants.STATUS_SUCCESS, '', responce));
    } catch (err) {
        console.log(err);
        return res.json(new responseDto(constants.STATUS_FAIL, constants.STATUS_FAIL, err));
    }
}




let getPaymentRejectedData = async (req, res) => { //Load Pending Payment
    let responce = {};
    try {
        let status = "'" + req.body.join("','") + "'";
        console.log("getPaymentPendingDatas \n" + status);
        // let resultInvoicveDetails = await voucherDetails.LOAD_INVOICE_DETAILS(status);
        // responce.InvoiceMasterData = resultInvoicveDetails;
        paymentHistory = await voucherDetails.getrejectedPayments(status);
        // responce.paymentHistory = paymentHistory;
        return res.json(new responseDto(constants.STATUS_SUCCESS, '', paymentHistory));
    } catch (err) {
        console.log(err);
        return res.json(new responseDto(constants.STATUS_FAIL, constants.STATUS_FAIL, err));
    }
}





let financestatusupdate = async (req, res) => {
    let responce = {};
    try {
        console.log("req.userData " + JSON.stringify(req.userData))
        console.log("financestatusupdate req.body " + JSON.stringify(req.query))
        let userData = req.userData;
        var orderNo = req.query.invoiceNo;
        var status = req.query.status;
        var rejectedRemark = req.query.rejectedreMark;
        let ReceiptNo = req.query.receiptNo;

        if (status == 3) {
            // let findseq = await PaymentRepository.getdataOrderNo(orderNo).catch(() => {
            //     console.log(error)
            //     return res.json(new responseDto(constants.STATUS_FAIL, "", ''))
            // })
            // let ReceiptNo = await PaymentRepository.Get_OrderNo_Seq_Value("receipt", '', findseq[0].Sector_type_unitcode, '');

            console.log("Recipt No " + ReceiptNo)
            if (ReceiptNo && ReceiptNo != null) {
                let resultupdatestatus = await voucherDetails.UPDATE_STATUS_FINANCE(orderNo, status, constants.STATUS_SUCCESS, ReceiptNo, '');
                let receiptPDF = await receiptPdf.generateReceiptPdf(ReceiptNo, req, res);
                console.log("resultupdatestatus " + JSON.stringify(resultupdatestatus))
                console.log("receiptPDF s ==>\n" + JSON.stringify(receiptPDF.streamData.filepath))
                let receiptDetailsSave = await voucherDetails.ReceiptDetailsSave(ReceiptNo, orderNo, receiptPDF.InvoiceDetailsList[0], receiptPDF.streamData.filepath, receiptPDF.streamData.fileName);
                let resiltpaymentHistory = await voucherDetails.Update_payment_Repo(orderNo, status);
                console.log("resiltpaymentHistory " + JSON.stringify(resiltpaymentHistory))
                // let UpdateInvoiceMaster = await voucherDetails.UpdateInvoiceMaster(ReceiptNo, orderNo);
                let ToMailId = receiptPDF.InvoiceDetailsList[0].User_name;
                console.log("ToMailId \n" + ToMailId)
                let EmailIt = await this.sendMailToCustomerSecnedRemainder(ReceiptNo, receiptPDF.streamData.filepath, receiptPDF.streamData.fileName, ToMailId)
                console.log("EmailIt" + JSON.stringify(EmailIt))
                responce.ReceiptNo = ReceiptNo;
                return res.json(new responseDto(constants.STATUS_SUCCESS, '', responce));
            } else {
                return res.json(new responseDto(constants.STATUS_FAIL, 'Receipt Cannot be Generated', ''));
            }
            // path
            // db save
            // email
        } else if (status == 5) {
            let resultupdatestatus = await voucherDetails.UPDATE_STATUS_FINANCE(orderNo, status, constants.STATUS_REJECTED, '', rejectedRemark);
            console.log("resultupdatestatus " + JSON.stringify(resultupdatestatus))
            let resiltpaymentHistory = await voucherDetails.Update_payment_Repo(orderNo, status);
            let EmailIt = await this.rejectPaymentMail(userData.email, rejectedRemark)
            responce.ReceiptNo = '';
            return res.json(new responseDto(constants.STATUS_SUCCESS, '', responce));
        }
    }
    catch (err) {
        console.log(err);
        return res.json(new responseDto(constants.STATUS_FAIL, constants.STATUS_FAIL, err));
    }
}


// let financestatusupdate = async (req, res) => {
//     try {

//         var invoiceNo = req.query.invoiceNo;
//         var status = req.query.status;
//         let invoiceMasterData = await voucherDetails.InvoiceMasterdetails(invoiceNo)
//         console.log("invoiceMasterData 1 " + JSON.stringify(invoiceMasterData))
//         // let  receiptPdfgenerate=await receiptPdf.generateReceiptPdf(req,res,InvoiceDetails)

//         // let receiptPdfgenerate = await receiptPdf.generateReceiptPdf(req, res, invoiceMasterData)
//         // console.log("receiptPdfgenerate " + JSON.stringify(receiptPdfgenerate))
//         console.log("req.query 1" + JSON.stringify(req.query))
//         let resultupdatestatus = await voucherDetails.UPDATE_STATUS_FINANCE(invoiceNo, status);

//         console.log("resultupdatestatus " + JSON.stringify(resultupdatestatus))
//         let resiltpaymentHistory = await voucherDetails.Update_payment_Repo(invoiceNo, status);

//         console.log("resiltpaymentHistory " + JSON.stringify(resiltpaymentHistory))


//         return res.json(new responseDto(constants.STATUS_SUCCESS, '', resultupdatestatus));
//     }
//     catch (err) {
//         console.log(err);
//         return res.json(new responseDto('', constants.STATUS_FAIL, err));
//     }
// }

let getcustomervoucherDetails = async (req, res) => {

    try {

        let responce = {};
        let voucherResponse = await voucherDetails.GET_VOUCHER_DETAILS_BY_INVOICENO(req.query.invoiceNo);
        let invoiceMasterData = await voucherDetails.InvoiceMasterdetails(req.query.invoiceNo)
        responce.voucherData = voucherResponse;
        responce.invoiceMasterData = invoiceMasterData;
        return res.json(new responseDto(constants.STATUS_SUCCESS, '', responce));
    } catch (e) {
        return res.json(new responseDto('', constants.STATUS_FAIL, e));

    }
}


exports.sendMailToCustomerSecnedRemainder = async (ReceiptNo, Path, Name, ToMailId) => {
    var customerName = 'Customer';
    var mailTextContent = mf.compile(CUSTOMER_SECEND_TEXT);
    mailTextContent = mailTextContent({ CUSTOMERNAME: customerName, ReceiptNo: ReceiptNo })

    var mailOptions = {
        from: constant.From_Mail,
        to: ToMailId,
        subject: 'Receipt PDF Generated.',
        html: mailTextContent, attachments: [{
            filename: Name,
            path: Path,
            //  files     : [{filename: 'Report.pdf', content: file}],
            contentType: 'application/pdf'
        }],
    };

    return new Promise((resolve, reject) => {
        mailTransporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return reject(`${error}, ${error}`)
            }
            return resolve(info);
        })
    })
};



exports.rejectPaymentMail = async (ToMailId, rejectedRemark) => {
    // var companyName = ReceiptNo;
    //var reqEmail =  invoiceDetails.User_name;
    var customerName = 'Customer';

    var mailTextContent = mf.compile(CUSTOMER_REJECT_CONTANT);
    mailTextContent = mailTextContent({ CUSTOMERNAME: customerName, REMARK: rejectedRemark })

    var mailOptions = {
        from: constant.From_Mail,
        to: constant.From_Mail,//ToMailId,
        //     cc: 'dinesh.n@fasoftwares.com',
        subject: 'Payment Rejected.',
        // html: mailTextContent, attachments: [{
        //     filename: ReceiptNo,
        //     path: Path,
        //     //  files     : [{filename: 'Report.pdf', content: file}],
        //     contentType: 'application/pdf'
        // }],
    };

    return new Promise((resolve, reject) => {
        mailTransporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return reject(`${error}, ${error}`)
            }
            return resolve(info);
        })
    })
};

let getvoucherDetailsByTransectioNo = async (req, res) => {
    console.log("Request req.body \n" + JSON.stringify(req.body));
    try {
        let responce = {};

        let voucherResponse = await voucherDetails.getVoucherDetails(req.body.TransactionNo);
        let invoiceMasterData = await voucherDetails.InvoiceMasterdetails(req.body.orderNo)
        let TransactionData = await voucherDetails.getTransectionDetails(req.body.TransactionNo)
        responce.voucherData = voucherResponse;
        responce.invoiceMasterData = invoiceMasterData;
        responce.TransactionData = TransactionData;
        return res.json(new responseDto(constants.STATUS_SUCCESS, '', responce));
    } catch (e) {
        console.log(e)
        return res.json(new responseDto(constants.STATUS_FAIL, constants.STATUS_FAIL, e));
    }
}

let getTransectionDetails = async (req, res) => {
    console.log("getTransectionDetails Request req.body \n" + JSON.stringify(req.body));
    let responceData = {};
    let responseObj = {};
    try {
        if (req.body.paymentType === constants.CHEQUE) {
            var resultVoucher = await PaymentRepository.GET_CHEQUE_DETAILS(req.body.TransactionNo).catch((e) => {
                responseObj.message = e
            });
            let invoiceMasterData = await voucherDetails.InvoiceMasterdetails(req.body.orderNo).catch((e) => {
                responseObj.message = e
            });
            responceData.responce = resultVoucher;
            responceData.invoiceMasterData = invoiceMasterData;

            return res.json(new responseDto(constants.STATUS_SUCCESS, responseObj, responceData));
        } else if (req.body.paymentType === constants.IBG) {
            var resultofflineimage = await PaymentRepository.GET_IBG_DETAILS(req.body.TransactionNo).catch((e) => {
                responseObj.message = e
            });
            let invoiceMasterData = await voucherDetails.InvoiceMasterdetails(req.body.orderNo).catch((e) => {
                responseObj.message = e
            });
            responceData.responce = resultofflineimage;
            responceData.invoiceMasterData = invoiceMasterData;
            return res.json(new responseDto(constants.STATUS_SUCCESS, responseObj, responceData));
        } else if (req.body.paymentType === constants.VOUCHER) {
            try {

                let voucherResponse = await voucherDetails.getVoucherDetails(req.body.TransactionNo).catch((e) => {
                    responseObj.message = e
                });

                console.log("voucherResponse\n" + JSON.stringify(voucherResponse))
                let invoiceMasterData = await voucherDetails.InvoiceMasterdetails(req.body.orderNo).catch((e) => {
                    responseObj.message = e
                });
                console.log("invoiceMasterData\n" + JSON.stringify(invoiceMasterData))
                let TransactionData = await voucherDetails.getTransectionDetails(req.body.TransactionNo).catch((e) => {
                    responseObj.message = e
                });
                console.log("TransactionData\n" + JSON.stringify(TransactionData))
                responceData.voucherData = voucherResponse;
                responceData.invoiceMasterData = invoiceMasterData;
                responceData.responce = TransactionData;
            } catch (error) {
                console.log(error)
            }
            return res.json(new responseDto(constants.STATUS_SUCCESS, responseObj, responceData));
        } else if (req.body.paymentType === constants.JOMPAY) {
            try {
                var resultofflineimage = await PaymentRepository.GET_JOMPAY_DETAILS(req.body.TransactionNo);
                // var resultvoucherDetails = await PaymentRepository.GET_VOUCHERDETAILS(req.body.orderNo).catch((e) => {
                //     responseObj.message = e
                // });
                let invoiceMasterData = await voucherDetails.InvoiceMasterdetails(req.body.orderNo).catch((e) => {
                    responseObj.message = e
                });
                responceData.responce = resultofflineimage;
                responceData.invoiceMasterData = invoiceMasterData;
            } catch (error) {
                console.log(error)
            }

            return res.json(new responseDto(constants.STATUS_SUCCESS, responseObj, responceData));
        } else {
            try {
                // var resultofflineimage = await PaymentRepository.GET_JOMPAY_DETAILS(req.body.TransactionNo);
                // var resultvoucherDetails = await PaymentRepository.GET_VOUCHERDETAILS(req.body.orderNo).catch((e) => {
                //     responseObj.message = e
                // });
                let invoiceMasterData = await voucherDetails.InvoiceMasterdetails(req.body.orderNo).catch((e) => {
                    responseObj.message = e
                });
                // responceData.responce = resultofflineimage;
                responceData.invoiceMasterData = invoiceMasterData;
                return res.json(new responseDto(constants.STATUS_SUCCESS, responseObj, responceData));
            } catch (error) {
                console.log(error)
            }



            // return res.json(new responseDto(constants.STATUS_FAIL, "Failed", ""));
        }
        // return res.json(new responseDto(constants.STATUS_SUCCESS, '', responce));
    } catch (e) {
        return res.json(new responseDto(constants.STATUS_FAIL, constants.STATUS_FAIL, e));

    }
}



module.exports = {
    LoadInvoicveDetails, financestatusupdate, getcustomervoucherDetails, getPaymentPendingDatas, getvoucherDetailsByTransectioNo, getTransectionDetails, getPaymentRejectedData
}