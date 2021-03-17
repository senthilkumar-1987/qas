let igstIntegrationService = require('../../Customers/IGSTItegrastionService');
const multer = require('multer');
const paymentRepository = require('../../../repositories/PaymentRepository/Customers/PaymentRepository')
const loginRepository = require('../../../repositories/LoginRepository')
const path = require("path");
const Cryptr = require('../../../config/encrypt.decrypt.service')
let responseDto = require('../../../config/ResponseDto');
let voucherDetails = require('../../../repositories/PaymentRepository/Finance/ViewVoucherDetailsLogic');
let ViewVoucherDetails = require('../../../controller/PaymentModuleController/Finance/ViewVoucherDetails');
var receiptPdf = require('../../../PDFUtils/MasterPDF/ReciptPdf');
var paymentConstants = require('../../../config/PaymentConstants');
var constant = require('../../../config/Constants');
let invoiceRepo = require('../../../repositories/PaymentRepository/InvoiceDetails');
var logger = require('../../../logger');
var fs = require('fs');
var request = require('request');
var dateFormat = require('dateformat');
const CompanyTypeController = require('../../CommonController/CompanyTypeController');

exports.onlinePaymentRedirect = async (req, res) => {
    try {

        const requestFormData = {
            "mp_siteid": '12',
            "mp_orderno": '111011',
            "mp_orderid": '991010188888',
            "mp_amount": '1.00',
            "mp_description": 'tset',
            "mp_email": '',
            "mp_respcode": '',
            "mp_respdesc": '',
            "mp_txnid": '',
            "mp_backurl": '',
            "mp_paytype": 'creditcard',
            "mp_sesskey": '',
        };

        // console.log(JSON.stringify(requestFormData))
        // res.redirect('http://pcid-uat.sirim.my'); 
        // res.redirect('https://online.sirim.my/ccpay',requestFormData);
        // res.send({redirect:'https://online.sirim.my/ccpay'})
        // res.header("Access-Control-Allow-Origin", "*");
        //  res.header('Request-Method', 'POST');
        //   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        // request
        // res.redirect('https://online.sirim.my/ccpay');
    }
    catch (e) {
        logger.info("Catch ERROR ==>" + e);
    }
}


exports.saveOnlinePaymentRequests = async (req, res) => {
    logger.info("req.body. ==> " + JSON.stringify(req.originalUrl))
    let request = req.body.data;
    let paymentMode = req.body.paymentMode; //online or offline
    let currentDate = req.body.currentDate;
    let userName = req.body.userName;
    let paymentStatus = req.body.paymentStatus;
    let quotationArr = req.body.quotationArr;
    let paymentType = req.body.paymentType; // ccpay or FPX

    // var OrderNumber = dateFormat(new Date(), "ddmmyyyyHHmmssms");
    // console.log("OrderNumber " + OrderNumber);
    // console.log("Order No: " +"ORDERNO" +new Date().getTime());
    // onlinePaymentResponce,paymentMode,createdDate,createdBy,status 1580808550826 1580808567173
    // let transactionId = await paymentRepository.Get_Transaction_Seq_Value();
    // let newDate = dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss');
    // console.log("currentDate == > " + newDate)

    // let findseq = await invoiceRepo.getSeccode(quotationArr[0].Quotation_no).catch((error) => {
    //     console.log(error)
    //     return res.json(new responseDto(constants.STATUS_FAIL, "", ''))
    // })

    let findseq = await invoiceRepo.getSeccodewithMasterInvNo(quotationArr[0].Quotation_no).catch((error) => {
        console.log(error)
        return res.json(new responseDto(constants.STATUS_FAIL, "", ''))
    })

    let resultOrderNo = await paymentRepository.Get_OrderNo_Seq_Value("orderno", '', findseq[0].Sector_type_unitcode, '');
    let resultOrderid = await paymentRepository.Get_OrderNo_Seq_Value("orderid", '', findseq[0].Sector_type_unitcode, '');
    let transactionId = await paymentRepository.Get_OrderNo_Seq_Value('transid', '', findseq[0].Sector_type_unitcode, '');

    let responseObj = {};
    let totalAmout = 0;

    if (resultOrderNo === null || resultOrderNo === '' || resultOrderid === null || resultOrderid === '' || transactionId === null || transactionId === '') {
        return res.json(new responseDto(paymentConstants.STATUS_FAIL, 'SequenceError', 'Please Contact Administrator'));
    }

    for (let index = 0; index < quotationArr.length; index++) {
        const quotationArrData = quotationArr[index];
        let updateinvoice = await paymentRepository.updateInvoiceNoInvoiceMasterByQouteNo(currentDate, resultOrderNo, paymentType, quotationArrData.Quotation_no, paymentMode, paymentStatus).catch((e) => {
            responseObj.message = e
            return res.json(new responseDto(paymentConstants.STATUS_FAIL, '', responseObj));
        });
        totalAmout = (parseFloat(totalAmout) + parseFloat(quotationArrData.Sub_total_rm));
    }


    let responce = await paymentRepository.saveOnlinePaymentRequest(paymentConstants.siteId, totalAmout, request, paymentMode, paymentType, currentDate, userName, paymentStatus, resultOrderNo, resultOrderid).then(async responce1 => {
        // console.log("responce1 " + JSON.stringify(responce1))
        if (responce1.rowsAffected && responce1.rowsAffected != null && responce1.rowsAffected > 0) {
            let res1 = {
                orderNumber: resultOrderNo,
                invoiceNo: '',
                siteId: paymentConstants.siteId,
                totalAmout: totalAmout,
                orderid: resultOrderid,
                description: transactionId,
                BackUrl: '',
                transactionId: transactionId,
            }
            return res.json(new responseDto(paymentConstants.STATUS_SUCCESS, '', res1));
        } else {
            let returnObj = {};
            return res.json(new responseDto(paymentConstants.STATUS_FAIL, '', returnObj));
        }
    })
}




exports.getDataByOrderNo = async (req, res) => {
    logger.info("getDataByOrederNo " + JSON.stringify(req.body))
    let responcedate = {};
    try {
        let responce = await paymentRepository.getdataOrderNo(req.body.orderNo).then(async responce => {
            logger.info("responce==> \n" + JSON.stringify(responce))
            responcedate.invoiceMasterData = responce

        });
        let responce1 = await paymentRepository.getPaymentdata(req.body.orderNo).then(async responce1 => {
            logger.info("responce==> \n" + JSON.stringify(responce1))
            responcedate.paymentHistoryData = responce1

        });
        return res.json(new responseDto(paymentConstants.STATUS_SUCCESS, '', responcedate));

    } catch (error) {
        return res.json(new responseDto(paymentConstants.STATUS_FAIL, error, ''));
    }
}


exports.onlinePaymentSuccess = async (req, res) => {
    let responceData = req.body;
    // let userData = req.userData;
    let currentDate = dateFormat(new Date(), 'yyyy-mm-dd hh:mm:ss');
    console.log("req url \n" + req.path)
    logger.info("onlinePaymentSuccess responceData \n" + JSON.stringify(responceData));
    try {
        let transactionId = responceData.mp_orderno
        let userData = await loginRepository.login(responceData.mp_email);
        console.log("userData success\n" + JSON.stringify(userData))
        let userDetails;
        if (userData && userData != null) {
            userDetails = userData[0];
        }

        let findseq = await paymentRepository.getdataOrderNo(responceData.mp_orderid).catch(() => {
            console.log(error)
            return res.json(new responseDto(constants.STATUS_FAIL, "", ''))
        })

        if (responceData && responceData != null && responceData.mp_paytype && (responceData.mp_paytype === paymentConstants.patmentTypeBankWire || responceData.mp_paytype === '4~bankwire')) {
            if (Number(responceData.ResponseCode) == constant.STATUS_FPX_ZERO) {

                let ReceiptNo = findseq[0].Receipt_no//await paymentRepository.Get_OrderNo_Seq_Value("receipt", '', findseq[0].Sector_type_unitcode, '');
                logger.info("ReceiptNo ==> " + ReceiptNo)
                let invoiceNo = responceData.mp_description
                let OrderNo = responceData.mp_orderid;
                await paymentRepository.updateOnlineResponceBankWire(responceData, transactionId, OrderNo).then(async res => { })
                await paymentRepository.update_invoice_tbl_onlinePayment(paymentConstants.paymentMode, responceData.mp_orderid, responceData.mp_paytype, new Date(), responceData.mp_email, paymentConstants.STATUS_SUCCESS, transactionId, ReceiptNo)
                await paymentRepository.saveDataOnlinePaymentHistoryBankWire(responceData, transactionId, 'Success', userDetails)
                // await voucherDetails.UpdateInvoiceMaster(ReceiptNo, OrderNo);
                try {
                    let receiptPDF = await receiptPdf.generateReceiptPdf(ReceiptNo, req, res);
                    await voucherDetails.ReceiptDetailsSave(ReceiptNo, OrderNo, receiptPDF.InvoiceDetailsList[0], receiptPDF.streamData.filepath, receiptPDF.streamData.fileName);
                    let ToMailId = receiptPDF.InvoiceDetailsList[0].User_name;
                    // await this.sendMailToCustomerSecnedRemainder(ReceiptNo, receiptPDF.streamData.filePath, receiptPDF.streamData.fileName, ToMailId)    
                    let mailresponce = await ViewVoucherDetails.sendMailToCustomerSecnedRemainder(ReceiptNo, receiptPDF.streamData.filePath, receiptPDF.streamData.fileName, ToMailId)
                    logger.info("mailresponce FPX \n" + JSON.stringify(mailresponce))
                } catch (error) {
                    console.log("Receipt PDF Error\n" + error)
                }

                await voucherDetails.UPDATE_STATUS_FINANCE(OrderNo, constant.STATUS_THREE, constant.STATUS_SUCCESS, ReceiptNo, '');
                await voucherDetails.Update_payment_Repo(OrderNo, constant.STATUS_THREE);

                if (constant.EnableIGST === constant.Yes) {
                    //IGST_INTEGRATION_SERVICES
                    let InvocieDataList = await paymentRepository.getdataOrderNo(OrderNo);
                    for (let index = 0; index < InvocieDataList.length; index++) {
                        try {
                            const element = InvocieDataList[index];
                            let igstId = element.igst_txn_no;
                            if (element.Invoice_type === 'CR') {
                                // quotationDataList.forEach(async function (quotationData, index) { beforePaymentIGSTCRIntegration
                                let responcess = await igstIntegrationService.afterPaymentIGSTCRIntegration(element.Invoice_no, element.Customer_id, InvocieDataList, userDetails, igstId);
                                console.log("beforePaymentIGSTCRIntegration IGST ITEGRASTION RESPONCE ==> " + JSON.stringify(responcess));
                                // })
                            } else {
                                let responcessss = await igstIntegrationService.afterPaymentIGSTAPIntegration(element.Invoice_no, element.Customer_id, InvocieDataList, userDetails, igstId);
                                console.log("beforePaymentIGSTAPIntegration IGST ITEGRASTION RESPONCE ==> " + JSON.stringify(responcessss));
                            }
                        } catch (error) {
                            console.log(error)
                        }
                    }

                }
                res.redirect(constant.SERVICE_URL_ROOT + "/epayment/success?title=" + transactionId + "&status=" + paymentConstants.STATUS_SUCCESS);

            } else {
                let OrderNo = responceData.mp_orderid;
                let responce = await paymentRepository.updateOnlineResponceBankWire(responceData, transactionId, OrderNo).then(async res => { })
                let updateInvoiceMaster = await paymentRepository.update_invoice_tbl_onlinePayment(paymentConstants.paymentMode, responceData.mp_orderid, responceData.mp_paytype, new Date(), responceData.mp_email, paymentConstants.STATUS_FAIL, transactionId, '')
                await paymentRepository.saveDataOnlinePaymentHistoryBankWire(responceData, transactionId, paymentConstants.STATUS_FAIL, userDetails)
                res.redirect(constant.SERVICE_URL_ROOT + "/epayment/failed?title=" + transactionId + "&status=" + paymentConstants.STATUS_FAIL);
            }
        } else if (responceData && responceData != null && responceData.mp_paytype && responceData.mp_paytype === paymentConstants.patmentTypeCCPay) {
            console.log("inside else if" + responceData.RESPONSE_CODE);
            if (Number(responceData.RESPONSE_CODE) == constant.STATUS_ZERO || Number(responceData.RESPONSE_CODE) == constant.STATUS_FPX_ZERO) {
                // let responce = await paymentRepository.updateOnlineResponceCCPAY(responceData, transactionId).then(async res => { })
                // let updateInvoiceMaster = await paymentRepository.update_invoice_tbl_onlinePayment(paymentConstants.paymentMode, responceData.mp_orderno, responceData.mp_description, responceData.mp_paytype, new Date(), responceData.mp_email, paymentConstants.STATUS_FAIL, transactionId)
                // await paymentRepository.saveDataOnlinePaymentHistoryCCPAY(responceData, transactionId, paymentConstants.STATUS_FAIL)
                console.log("inside if");
                let ReceiptNo = findseq[0].Receipt_no //await paymentRepository.Get_OrderNo_Seq_Value("receipt", findseq[0].Invoice_type, findseq[0].Sector_type_unitcode, '');
                let OrderNo = responceData.mp_orderid;
                let invoiceNo = responceData.mp_description
                await paymentRepository.updateOnlineResponceCCPAY(responceData, transactionId).then(async res => { })
                await paymentRepository.updateOnlineInvoiceMasterSucessPaymentCCPAY(responceData, paymentConstants.paymentMode, OrderNo, responceData.mp_description, responceData.mp_paytype, new Date(), responceData.mp_email, paymentConstants.STATUS_SUCCESS, transactionId)
                await paymentRepository.saveDataOnlinePaymentHistoryCCPAY(responceData, transactionId, 'Success', userDetails)
                // await voucherDetails.UpdateInvoiceMaster(ReceiptNo, OrderNo);
                console.log("succ");
                try {
                    let receiptPDF = await receiptPdf.generateReceiptPdf(ReceiptNo, req, res);
                    await voucherDetails.ReceiptDetailsSave(ReceiptNo, OrderNo, receiptPDF.InvoiceDetailsList[0], receiptPDF.streamData.filePath, receiptPDF.streamData.fileName);
                    let ToMailId = receiptPDF.InvoiceDetailsList[0].User_name;
                    // await this.sendMailToCustomerSecnedRemainder(ReceiptNo, receiptPDF.streamData.filePath, receiptPDF.streamData.fileName, ToMailId)
                    await ViewVoucherDetails.sendMailToCustomerSecnedRemainder(ReceiptNo, receiptPDF.streamData.filePath, receiptPDF.streamData.fileName, ToMailId)
                } catch (error) {
                    console.log("Receipt PDF Error\n" + error)
                }

                await voucherDetails.UPDATE_STATUS_FINANCE(OrderNo, constant.STATUS_THREE, constant.STATUS_SUCCESS, ReceiptNo, '');
                await voucherDetails.Update_payment_Repo(OrderNo, constant.STATUS_THREE);
                console.log("redirect:" + constant.SERVICE_URL_ROOT + "/epayment/success?title=" + OrderNo + "&status=" + paymentConstants.STATUS_SUCCESS);
                res.redirect(constant.SERVICE_URL_ROOT + "/epayment/success?title=" + OrderNo + "&status=" + paymentConstants.STATUS_SUCCESS);

            } else {

                console.log("redirect esle:" + constant.SERVICE_URL_ROOT + "/epayment/success?title=" + OrderNo + "&status=" + paymentConstants.STATUS_SUCCESS);
                await paymentRepository.updateOnlineResponceCCPAY(responceData, transactionId).then(async res => { })
                await paymentRepository.updateOnlineInvoiceMasterSucessPaymentCCPAY(responceData, paymentConstants.paymentMode, responceData.mp_orderid, responceData.mp_description, responceData.mp_paytype, new Date(), responceData.mp_email, paymentConstants.STATUS_SUCCESS, transactionId)
                await paymentRepository.saveDataOnlinePaymentHistoryCCPAY(responceData, transactionId, paymentConstants.STATUS_FAIL, userDetails)
                res.redirect(constant.SERVICE_URL_ROOT + "/epayment/failed?title=" + transactionId + "&status=" + paymentConstants.STATUS_FAIL);
            }

        } else {
            res.redirect(constant.SERVICE_URL_ROOT + "/epayment/failed?title=Payment Failed&status=" + paymentConstants.STATUS_FAIL);
        }

    } catch (error) {
        logger.info("onlinePaymentSuccess ERROR ==> \n" + error)
        res.redirect(constant.SERVICE_URL_ROOT + "/epayment/failed?title=Payment Failed&status=" + paymentConstants.STATUS_FAIL);
    }
}


exports.onlinePaymentFailed = async (req, res) => {
    logger.info("onlinePaymentFailed responceData " + JSON.stringify(req.body))
    logger.info("req.path " + req.path)
    let responceData = req.body;
    // let userData = req.userData;

    try {
        let transactionId = responceData.mp_orderno
        let userData = await loginRepository.login(responceData.mp_email);
        console.log("userData Faild \n" + JSON.stringify(userData))
        let userDetails;
        if (userData && userData != null) {
            userDetails = userData[0];
        }
        if (responceData && responceData != null && responceData.mp_paytype && (responceData.mp_paytype === paymentConstants.patmentTypeBankWire || responceData.mp_paytype === '4~bankwire')) {

            let OrderNo = responceData.mp_orderid;
            let invoiceNo = responceData.mp_description

            try {
                let responce = await paymentRepository.updateOnlineResponceBankWire(responceData, transactionId, OrderNo).then(async res => { })
                let updateInvoiceMaster = await paymentRepository.update_invoice_tbl_onlinePayment(paymentConstants.paymentMode, responceData.mp_orderid, responceData.mp_paytype, new Date(), responceData.mp_email, paymentConstants.STATUS_FAIL, transactionId, '')
                await paymentRepository.saveDataOnlinePaymentHistoryBankWire(responceData, transactionId, paymentConstants.STATUS_FAIL, userDetails)
                //IGST INTEGRATION
                // let quotationDataList = await paymentRepository.quotationDataList(invoiceDetails.orderNumber);
                // quotationDataList.forEach(async function (quotationData, index) {
                //     let responce = await igstIntegrationService.IgstIntegrationService(quotationData.Quotation_no, resultInvoiceSeq, customerId, invoiceDetails.orderNumber);
                //     console.log("FINAL IGST ITEGRASTION RESPONCE ==> " + JSON.stringify(responce));
                // })    
                res.redirect(constant.SERVICE_URL_ROOT + "/epayment/failed?title=" + transactionId + "&status=" + paymentConstants.STATUS_FAIL);
            } catch (error) {
                console.log(error)
                let err = 'Payment Failed';
                res.redirect(constant.SERVICE_URL_ROOT + "/epayment/failed?title=" + err + "&status=" + paymentConstants.STATUS_FAIL);
            }


        } else if (responceData && responceData != null && responceData.mp_paytype && responceData.mp_paytype === paymentConstants.patmentTypeCCPay) {

            try {
                let responce = await paymentRepository.updateOnlineResponceCCPAY(responceData, transactionId).then(async res => { })
                let updateInvoiceMaster = await paymentRepository.update_invoice_tbl_onlinePayment(paymentConstants.paymentMode, responceData.mp_orderid, responceData.mp_paytype, new Date(), responceData.mp_email, paymentConstants.STATUS_FAIL, transactionId, '')
                await paymentRepository.saveDataOnlinePaymentHistoryCCPAY(responceData, transactionId, paymentConstants.STATUS_FAIL, userDetails)
                //IGST INTEGRATION
                // let quotationDataList = await paymentRepository.quotationDataList(invoiceDetails.orderNumber);
                // quotationDataList.forEach(async function (quotationData, index) {
                //     let responce = await igstIntegrationService.IgstIntegrationService(quotationData.Quotation_no, resultInvoiceSeq, customerId, invoiceDetails.orderNumber);
                //     console.log("FINAL IGST ITEGRASTION RESPONCE ==> " + JSON.stringify(responce));
                // })
                res.redirect(constant.SERVICE_URL_ROOT + "/epayment/failed?title=" + transactionId + "&status=" + paymentConstants.STATUS_FAIL);

            } catch (error) {
                console.log(error)
                let err = 'Payment Failed';
                res.redirect(constant.SERVICE_URL_ROOT + "/epayment/failed?title=" + err + "&status=" + paymentConstants.STATUS_FAIL);
            }

        } else {
            let err = 'Payment Failed';
            res.redirect(constant.SERVICE_URL_ROOT + "/epayment/failed?title=" + err + "&status=" + paymentConstants.STATUS_FAIL);
        }

    } catch (error) {
        logger.info("ONLINEPAYMENTFAILED ERROR ==>\n " + error)
        let err = 'Payment Failed';
        res.redirect(constant.SERVICE_URL_ROOT + "/epayment/failed?title=" + err + "&status=" + paymentConstants.STATUS_FAIL);
    }

}

