const multer = require('multer');
let responseDto = require('../../../config/ResponseDto');
var constants = require('../../../config/PaymentConstants');
var commanConstants = require('../../../config/Constants');
const path = require("path");
var fs = require('fs');
var multiparty = require('multiparty');
var paymentRepository = require('../../../repositories/PaymentRepository/Customers/PaymentRepository')
let cRMIntegration = require('../../../controller/Customers/CRM_Integration');
let igstIntegrationService = require('../../Customers/IGSTItegrastionService');
var iGSTIntegrationRepository = require('../../../repositories/IGSTIntegrationRepository/IGSTIntegrationRepository')
let viewVoucherDetailsLogic = require('../../../repositories/PaymentRepository/Finance/ViewVoucherDetailsLogic');
let invoiceRepo = require('../../../repositories/PaymentRepository/InvoiceDetails');

let submitOfflinePaymentMode = async (req, res) => {
    try {
        function scaryClown() {
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve('🤡');
                }, 2000);
            });
        }
        /* 
        
        */
        var storage = multer.diskStorage({
            destination: './UploadsPaymentFiles/'
        });

        var upload = multer({
            storage: storage
        }).any();//Single
        upload(req, res, async function (err) {

            //console.log(req);
            if (err) {
                console.log(err);
                return res.end("Error uploading file.");
            } else {

                let file = req.files;
                console.log("offlineValues" + JSON.stringify(req.files));
                console.log("offlineValues" + JSON.stringify(req.files.filename));
                if (!file) {
                    return res.send({
                        errors: {
                            message: 'file cant be empty'
                        }
                    });
                } else {

                    console.log("Offline Payment req\n" + JSON.stringify(req.body))
                    console.log("req.userData \n" + JSON.stringify(req.userData))
                    let responce = {};
                    // let resultInvoiceSeq = await paymentRepository.Get_Invoice_Seq_Value();
                    let paymentMode = req.body.paymentMode;
                    let paymentType = req.body.paymentType;
                    let createdBy = req.body.userName;
                    let orderNo = req.body.OrderNumber;
                    let transactionAmount = req.body.transactionAmount;
                    let customerId = req.userData.custId;
                    let companyName = req.userData.companyName;
                    let reqFiles = req.files;
                    let userData = req.userData;
                    let paymentDate = req.body.paymentDate;
                    console.log('Invoicessss' + JSON.stringify(req.body))
                    let invoiceN = req.body.InvoiceNumbers;
                    // let customerId = req.body.paymentDate
                    console.log("Paymentdate == > " + companyName)
                    // let transactionId = await paymentRepository.Get_Transaction_Seq_Value();

                    let findseq = await paymentRepository.getdataOrderNo(orderNo).catch((error) => {
                        console.log(error)
                        return res.json(new responseDto(constants.STATUS_FAIL, "", ''))
                    })
                    let transactionId = await paymentRepository.Get_OrderNo_Seq_Value('transid', findseq[0].Invoice_type, findseq[0].Sector_type_unitcode, '');



                    if (transactionId == null || transactionId == '') {
                        return res.json(new responseDto('', constants.STATUS_FAIL, ''));
                    } else {
                        let InvoiceMasrerData = await paymentRepository.getdataOrderNo(orderNo)
                        let txnNo = [];
                        for (let index = 0; index < InvoiceMasrerData.length; index++) {
                            const element = InvoiceMasrerData[index];
                            txnNo.push(element.Sirim_txnNo)
                        }
                        console.log("Old txnNo \n" + txnNo)
                        // let InvoiceMasrerData = await paymentRepository.updateExistingPaymentHistory(txnNo)

                    }
                    await paymentRepository.TransNumberCheck(invoiceN);
                    if (paymentType === 'IBG') {
                        let responseObj = {};
                        let updateinvoice = await paymentRepository.update_invoice_tbl(transactionId, paymentType, orderNo, paymentMode, paymentDate, userData).catch((e) => {
                            responseObj.message = e
                            console.log(e)
                            // return res.json(responseObj);
                            return res.json(new responseDto(constants.STATUS_FAIL, constants.STATUS_FAIL, e));
                        });
                        reqFiles.forEach(async function (f, index) {
                            // console.log("reqFiles ==> " + JSON.stringify(f));

                            let fileData = fs.readFileSync(f.path).toString('base64');
                            let uploadIBGimageId = await paymentRepository.INSERT_IBG_IMAGE(fileData, createdBy)
                            console.log("createdBy  == >  " + createdBy + "\nuploadIBGimageId\n " + uploadIBGimageId)
                            let uploadiIbgmageDetails = await paymentRepository.INSERT_IBG_IMAGE_DETAILS(uploadIBGimageId, transactionId, transactionAmount).catch((e) => {
                                responseObj.message = e
                                console.log(e)
                                // return res.json(responseObj);
                                return res.json(new responseDto(constants.STATUS_FAIL, constants.STATUS_FAIL, e));
                            });

                        });

                        let savepaymentRepository = await paymentRepository.Save_Payment_Repository(createdBy, transactionId, transactionAmount, paymentType, orderNo, paymentMode, customerId, companyName)
                        try {
                            if (commanConstants.EnableIGST == commanConstants.Yes) {
                                //IGST_INTEGRATION_SERVICES
                                let InvocieDataList = await paymentRepository.getdataOrderNo(orderNo);
                                for (let index = 0; index < InvocieDataList.length; index++) {
                                    const element = InvocieDataList[index];
                                    let igstId = element.igst_txn_no;
                                    if (element.Invoice_type === 'CR') {
                                        // quotationDataList.forEach(async function (quotationData, index) { beforePaymentIGSTCRIntegration
                                        let responcess = await igstIntegrationService.afterPaymentIGSTCRIntegration(element.Invoice_no, element.Customer_id, InvocieDataList, userData, igstId);
                                        console.log("beforePaymentIGSTCRIntegration IGST ITEGRASTION RESPONCE ==> " + JSON.stringify(responcess));
                                        // })
                                    } else {
                                        let responcessss = await igstIntegrationService.afterPaymentIGSTAPIntegration(element.Invoice_no, element.Customer_id, InvocieDataList, userData, igstId);
                                        console.log("beforePaymentIGSTAPIntegration IGST ITEGRASTION RESPONCE ==> " + JSON.stringify(responcessss));
                                    }
                                }

                            }
                        } catch (error) {
                            console.log(error)

                        }

                        responce.tnxNo = transactionId;
                        responce.invoiceNo = '';
                        // return res.json(new responseDto(constants.STATUS_SUCCESS, '', responce));
                        // res.json({ 'message': 'Completed', "responce": responce });
                        res.json(new responseDto(constants.STATUS_SUCCESS, '', responce));
                    }

                    let invoiceNo = '';
                    if (paymentType === 'CHEQUE') {
                        let responseObj = {};
                        let updateinvoice = await paymentRepository.update_invoice_tbl(transactionId, paymentType, orderNo, paymentMode, paymentDate, userData).catch((e) => {
                            responseObj.message = e
                            // return res.json(responseObj);
                            return res.json(new responseDto(constants.STATUS_FAIL, constants.STATUS_FAIL, e));
                        });
                        console.log("Filelength" + reqFiles.length)
                        reqFiles.forEach(async function (f, index) {
                            let fileData = fs.readFileSync(f.path).toString('base64');//Check this why store hex
                            // console.log(fileData)

                            let uploadimageId = await paymentRepository.INSERT_CHEQUE_IMAGE(fileData, createdBy).catch((e) => {
                                responseObj.message = e
                                // return res.json(responseObj);
                                return res.json(new responseDto(constants.STATUS_FAIL, constants.STATUS_FAIL, e));
                            });

                            let uploadimageDetails = await paymentRepository.INSERT_CHEQUE_IMAGE_DETAILS(uploadimageId, transactionId, transactionAmount).catch((e) => {
                                responseObj.message = e
                                // return res.json(responseObj);
                                return res.json(new responseDto(constants.STATUS_FAIL, constants.STATUS_FAIL, e));
                            });
                        });
                        // let totalAmout = await paymentRepository.getTotalAmount(resultInvoiceSeq);

                        let savepaymentRepository = await paymentRepository.Save_Payment_Repository(createdBy, transactionId, transactionAmount, paymentType, orderNo, paymentMode, customerId, companyName);
                        try {
                            if (commanConstants.EnableIGST == commanConstants.Yes) {
                                //IGST_INTEGRATION_SERVICES
                                let InvocieDataList = await paymentRepository.getdataOrderNo(orderNo);
                                for (let index = 0; index < InvocieDataList.length; index++) {
                                    const element = InvocieDataList[index];
                                    let igstId = element.igst_txn_no;
                                    if (element.Invoice_type === 'CR') {
                                        // quotationDataList.forEach(async function (quotationData, index) { beforePaymentIGSTCRIntegration
                                        let responcess = await igstIntegrationService.afterPaymentIGSTCRIntegration(element.Invoice_no, element.Customer_id, InvocieDataList, userData, igstId);
                                        console.log("beforePaymentIGSTCRIntegration IGST ITEGRASTION RESPONCE ==> " + JSON.stringify(responcess));
                                        // })
                                    } else {
                                        let responcessss = await igstIntegrationService.afterPaymentIGSTAPIntegration(element.Invoice_no, element.Customer_id, InvocieDataList, userData, igstId);
                                        console.log("beforePaymentIGSTAPIntegration IGST ITEGRASTION RESPONCE ==> " + JSON.stringify(responcessss));
                                    }
                                }

                            }
                        } catch (error) {
                            console.log(error)
                        }

                        // res.json({ 'message': 'Completed' });
                        responce.tnxNo = transactionId;
                        responce.invoiceNo = '';
                        res.json(new responseDto(constants.STATUS_SUCCESS, '', responce));
                    }
                    if (paymentType === 'JOMPAY') {
                        // let responseObj = {};
                        // let updateinvoice = await paymentRepository.update_invoice_tbl(paymentType, orderNo, resultInvoiceSeq, paymentMode, paymentDate).catch((e) => {
                        //     responseObj.message = e
                        //     // return res.json(responseObj);
                        //     return res.json(new responseDto(constants.STATUS_FAIL, constants.STATUS_FAIL, e));
                        // });

                        let responseObj = {};
                        let updateinvoice = await paymentRepository.update_invoice_tbl(transactionId, paymentType, orderNo, paymentMode, paymentDate, userData).catch((e) => {
                            responseObj.message = e
                            // return res.json(responseObj);
                            return res.json(new responseDto(constants.STATUS_FAIL, constants.STATUS_FAIL, e));
                        });

                        // console.log("Invoive Master Id updateinvoice " + JSON.stringify(updateinvoice))
                        reqFiles.forEach(async function (f, index) {


                            let fileData = fs.readFileSync(f.path).toString('base64');
                            let uploadjompayimageId = await paymentRepository.INSERT_JOMPAY_IMAGE(fileData, createdBy);

                            let uploadjopmayimageDetails = await paymentRepository.INSERT_JOMPAY_IMAGE_DETAILS(uploadjompayimageId, transactionId, transactionAmount).catch((e) => {
                                responseObj.message = e
                                // return res.json(responseObj);
                                return res.json(new responseDto(constants.STATUS_FAIL, constants.STATUS_FAIL, e));
                            });


                        });
                        // let totalAmout = await paymentRepository.getTotalAmount(resultInvoiceSeq);

                        let savepaymentRepository = await paymentRepository.Save_Payment_Repository(createdBy, transactionId, transactionAmount, paymentType, orderNo, paymentMode, customerId, companyName)

                        try {
                            if (commanConstants.EnableIGST == commanConstants.Yes) {
                                //IGST_INTEGRATION_SERVICES
                                let InvocieDataList = await paymentRepository.getdataOrderNo(orderNo);
                                for (let index = 0; index < InvocieDataList.length; index++) {
                                    const element = InvocieDataList[index];
                                    let igstId = element.igst_txn_no;
                                    if (element.Invoice_type === 'CR') {
                                        // quotationDataList.forEach(async function (quotationData, index) { beforePaymentIGSTCRIntegration
                                        let responcess = await igstIntegrationService.afterPaymentIGSTCRIntegration(element.Invoice_no, element.Customer_id, InvocieDataList, userData, igstId);
                                        console.log("beforePaymentIGSTCRIntegration IGST ITEGRASTION RESPONCE ==> " + JSON.stringify(responcess));
                                        // })
                                    } else {
                                        let responcessss = await igstIntegrationService.afterPaymentIGSTAPIntegration(element.Invoice_no, element.Customer_id, InvocieDataList, userData, igstId);
                                        console.log("beforePaymentIGSTAPIntegration IGST ITEGRASTION RESPONCE ==> " + JSON.stringify(responcessss));
                                    }
                                }

                            }
                        } catch (error) {
                            console.log(error)
                        }


                        // res.json({ 'message': 'Completed' });
                        responce.tnxNo = transactionId;
                        responce.invoiceNo = '';
                        res.json(new responseDto(constants.STATUS_SUCCESS, '', responce));
                    }
                }
            }
        });
    } catch (e) {
        console.log(e);
        return res.json(new responseDto(constants.STATUS_FAIL, constants.STATUS_FAIL, e));
    }

}

let voucherpaymentMode = async (req, res) => {

    console.log("VOUCHER PAYMENT MODE VOUCHER")
    // let resultInvoiceSeq = await paymentRepository.Get_Invoice_Seq_Value();
    // let transactionId = await paymentRepository.Get_Transaction_Seq_Value();
    // console.log(resultInvoiceSeq)
    // console.log(transactionId)
    let responce = {};
    try {
        var invoiceDetails = req.body;
        let orderNumber = req.body.orderNumber;

        let findseq = await paymentRepository.getdataOrderNo(orderNumber).catch((error) => {
            console.log(error)
            return res.json(new responseDto(constants.STATUS_FAIL, "", ''))
        })

        let transactionId = await paymentRepository.Get_OrderNo_Seq_Value('transid', findseq[0].Invoice_type, findseq[0].Sector_type_unitcode, '');
        if (transactionId == null || transactionId == '') {
            return res.json(new responseDto(constants.STATUS_FAIL, "SecquenceError", 'Secquence Not Generate Please Contact Admin'));
        }
        // var invoiceDetails = req.body;
        let responseObj = {};
        let voucherDetails = invoiceDetails.rows;
        let customerId = req.userData.custId;
        let companyName = req.userData.companyName;
        console.log("req.userData \n" + JSON.stringify(req.userData))
        let loginUserName = req.userData.username
        let userData = req.userData;
        let resultVoucher;
        let paymentDate = new Date();
        console.log("invoiceDetails " + JSON.stringify(invoiceDetails));
        // let orderNumber = req.body.orderNumber;
        console.log("orderNumber :: " + orderNumber)
        await paymentRepository.TransNumberCheck(invoiceDetails.invoiceNos);
        let updateInvoiceMaster = await paymentRepository.update_invoice_tbl(transactionId, invoiceDetails.paymentType, invoiceDetails.orderNumber, invoiceDetails.paymentMode, paymentDate, userData)
        voucherDetails.forEach(async (voucherDetail, index) => {
            // console.log(voucherDetail)
            resultVoucher = await paymentRepository.CUSTOMER_VOUCHER_DETAILS(voucherDetail, invoiceDetails.totalAmount, invoiceDetails.userName, loginUserName, transactionId)
        });
        //  let totalAmout = await paymentRepository.getTotalAmount(resultInvoiceSeq);

        await paymentRepository.Save_Payment_Repository(invoiceDetails.userName, transactionId, invoiceDetails.totalAmount, invoiceDetails.paymentType, orderNumber, invoiceDetails.paymentMode, customerId, companyName)
        // if (commanConstants.EnableIGST == commanConstants.Yes) {
        //     //IGST_INTEGRATION_SERVICES
        //     let quotationDataList = await paymentRepository.quotationDataList(invoiceDetails.orderNumber);

        //     quotationDataList.forEach(async function (quotationData, index) {
        //         let responce = await igstIntegrationService.IgstIntegrationService(quotationData.Quotation_no, quotationData.Invoice_no, customerId, invoiceDetails.orderNumber);
        //         console.log("FINAL IGST ITEGRASTION RESPONCE ==> " + JSON.stringify(responce));
        //     })
        // }

        try {
            if (commanConstants.EnableIGST == commanConstants.Yes) {
                //IGST_INTEGRATION_SERVICES
                let InvocieDataList = await paymentRepository.getdataOrderNo(invoiceDetails.orderNumber);
                for (let index = 0; index < InvocieDataList.length; index++) {
                    const element = InvocieDataList[index];
                    let igstId = element.igst_txn_no;
                    if (element.Invoice_type === 'CR') {
                        // quotationDataList.forEach(async function (quotationData, index) { beforePaymentIGSTCRIntegration
                        let responcess = await igstIntegrationService.afterPaymentIGSTCRIntegration(element.Invoice_no, element.Customer_id, InvocieDataList, userData, igstId);
                        console.log("beforePaymentIGSTCRIntegration IGST ITEGRASTION RESPONCE ==> " + JSON.stringify(responcess));
                        // })
                    } else {
                        let responcessss = await igstIntegrationService.afterPaymentIGSTAPIntegration(element.Invoice_no, element.Customer_id, InvocieDataList, userData, igstId);
                        console.log("beforePaymentIGSTAPIntegration IGST ITEGRASTION RESPONCE ==> " + JSON.stringify(responcessss));
                    }
                }
            }
        } catch (error) {
            console.log(error)
        }

        responce.tnxNo = transactionId;
        // responce.invoiceNo = resultInvoiceSeq;
        return res.json(new responseDto(constants.STATUS_SUCCESS, '', responce));
    }
    catch (e) {
        console.log(e);
        return res.json(new responseDto('', constants.STATUS_FAIL, e));
    }

}

// let insetfiles = (req, res) => new Promise((resolve, reject) => {

//     var form = new multiparty.Form();
//     form.parse(req, function async(err, fields, files) {
//         var filePath = files.file[0].path
//         let fileName = files.file[0].originalFilename
//         let requestData = fields;
//         try {
//             console.log(filePath)
//             console.log(fileName)
//             console.log(JSON.stringify(requestData.InvoiceNo))
//         } catch (error) {
//             console.log(error)
//         }

//     });

// });


let PayManualPayment = async (req, res) => {

    console.log("Manual Payment")

    // const [totalRow, rowdataVoucher, rowdataCustCode] = await insetfiles(req, res)

    console.log(JSON.stringify(req.body))
    // let transactionId = await paymentRepository.Get_Transaction_Seq_Value();
    // let resultOrderNo = await paymentRepository.('orderno', '', '');
    let responce = {};
    var invoiceDetails = req.body;
    var InvoiceData = req.body.InvoiceData
    try {

        let findseq = await paymentRepository.quotationDataList(InvoiceData[0].Invoice_no).catch((error) => {
            console.log(error)
            return res.json(new responseDto(constants.STATUS_FAIL, "", ''))
        })

        console.log(`oooo ` + JSON.stringify(findseq));
        let transactionId = await paymentRepository.Get_OrderNo_Seq_Value('transid', findseq[0].Invoice_type, findseq[0].Sector_type_unitcode, '');
        let resultOrderNo = await paymentRepository.Get_OrderNo_Seq_Value('orderno', findseq[0].Invoice_type, findseq[0].Sector_type_unitcode, '');
        if (transactionId === null || transactionId == '') {
            return res.json(new responseDto(constants.STATUS_FAIL, "SecquenceError", 'Secquence Not Generate Please Contact Admin'));
        }
        if (resultOrderNo === null || resultOrderNo == '') {
            return res.json(new responseDto(constants.STATUS_FAIL, "SecquenceError", 'Secquence Not Generate Please Contact Admin'));
        }

        if (invoiceDetails.InvoiceNo === null || invoiceDetails.InvoiceNo === '') {
            return res.json(new responseDto(constants.STATUS_FAIL, "SecquenceError", 'Try Again'));
        }
        let responseObj = {};
        let customerId = req.userData.custId;
        let companyName = req.userData.companyName;
        let loginUserName = req.userData.username
        let userData = req.userData;
        let paymentDate = new Date();
        let customerCode = '';
        let company = '';
        console.log(JSON.stringify(req.userData))

        for (let index = 0; index < InvoiceData.length; index++) {
            const element = InvoiceData[index];
            // let invoiceMasterData = await paymentRepository.quotationDataList(element.Invoice_no);
            let UpdateOrderNo = await paymentRepository.UpdateByInvoiceNo(element.Invoice_no, resultOrderNo);
            let updateInvoiceMaster = await paymentRepository.update_invoice_tbl(transactionId, invoiceDetails.paymentType, resultOrderNo,
                invoiceDetails.paymentMode, paymentDate, userData, invoiceDetails.remarks)
            customerCode = element.Customer_id
            company = element.Company_name
        }

        await paymentRepository.Save_Payment_Repository(invoiceDetails.userName, transactionId, invoiceDetails.totalAmount, invoiceDetails.paymentType, resultOrderNo, invoiceDetails.paymentMode, customerCode, company)


        try {
            if (commanConstants.EnableIGST == commanConstants.Yes) {
                //IGST_INTEGRATION_SERVICES
                let InvocieDataList = await paymentRepository.getdataOrderNo(resultOrderNo);
                for (let index = 0; index < InvocieDataList.length; index++) {
                    const element = InvocieDataList[index];
                    let igstId = element.igst_txn_no;
                    if (element.Invoice_type === 'CR') {
                        // quotationDataList.forEach(async function (quotationData, index) { beforePaymentIGSTCRIntegration
                        let responcess = await igstIntegrationService.afterPaymentIGSTCRIntegration(element.Invoice_no, element.Customer_id, InvocieDataList, userData, igstId);
                        console.log("beforePaymentIGSTCRIntegration IGST ITEGRASTION RESPONCE ==> " + JSON.stringify(responcess));
                        // })
                    } else {
                        let responcessss = await igstIntegrationService.afterPaymentIGSTAPIntegration(element.Invoice_no, element.Customer_id, InvocieDataList, userData, igstId);
                        console.log("beforePaymentIGSTAPIntegration IGST ITEGRASTION RESPONCE ==> " + JSON.stringify(responcessss));
                    }
                }
            }
        } catch (error) {
            console.log(error)
        }
        responce.tnxNo = transactionId;
        return res.json(new responseDto(constants.STATUS_SUCCESS, '', responce));
    }
    catch (e) {
        console.log(e);
        return res.json(new responseDto('', constants.STATUS_FAIL, e));
    }
}

function offlineUploadedFileExtensionValidatons(file) {
    console.log("FILENAME--------------->" + file.originalname)
    var ext = path.extname(file.originalname);
    if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
        return false;
    }
    return true;

}

let updateReferenceNo = async (req, res) => {
    try {

        let QutatationDetails = req.body.props;
        let resultOrderNo = '';
        console.log("OrderNo" + JSON.stringify(QutatationDetails.quotationArr));
        if (QutatationDetails.quotationArr[0].Quotation_no && QutatationDetails.quotationArr[0].Quotation_no != null && QutatationDetails.quotationArr[0].Quotation_no != '') {
            // let findseq = await invoiceRepo.getSeccode(QutatationDetails.quotationArr[0].Quotation_no).catch((error) => {
            //     console.log(error)
            //     return res.json(new responseDto(constants.STATUS_FAIL, "", ''))
            // })
            let findseq = await invoiceRepo.getSeccodewithMasterInvNo(QutatationDetails.quotationArr[0].Quotation_no).catch((error) => {
                console.log(error)
                return res.json(new responseDto(constants.STATUS_FAIL, "", ''))
            })
            resultOrderNo = await paymentRepository.Get_OrderNo_Seq_Value('orderno', findseq[0].Invoice_type, findseq[0].Sector_type_unitcode, '');
        } else {
            return res.json(new responseDto(constants.STATUS_FAIL, "", ''))
        }
        if (resultOrderNo && resultOrderNo != null && resultOrderNo != '') {
            console.log("order No" + resultOrderNo)

            QutatationDetails.quotationArr.forEach(async element => {

                // let updateOrderNo = await paymentRepository.UpdateOrderNo(element.Quotation_no, resultOrderNo)
                let updateOrderNo = await paymentRepository.UpdateOrderNowithMasterInvNo(element.Quotation_no, resultOrderNo)
            });
            return res.json(new responseDto(constants.STATUS_SUCCESS, '', resultOrderNo));
        } else {
            return res.json(new responseDto(constants.STATUS_FAIL, "Couldn't Be Generate Order No", ''))
        }



    }
    catch (e) {
        console.log(e);
        return res.json(new responseDto(constants.STATUS_FAIL, '', e));
    }
}


let getofflineDetails = async (req, res) => {

    //console.log(req.query);
    // console.log(req.query.paymentType)
    let responseObj = {};
    let responceData = {};
    try {
        if (req.query.paymentType == 'CHEQUE') {
            var resultVoucher = await paymentRepository.GET_CHEQUE_DETAILS(req.query.invoiceNo).catch((e) => {
                responseObj.message = e
            });
            let invoiceMasterData = await viewVoucherDetailsLogic.InvoiceMasterdetails(req.query.invoiceNo).catch((e) => {
                responseObj.message = e
            });
            responceData.responce = resultVoucher;
            responceData.invoiceMasterData = invoiceMasterData;

            return res.json(new responseDto(constants.STATUS_SUCCESS, '', responceData));
        } else if (req.query.paymentType == 'IBG') {
            var resultofflineimage = await paymentRepository.GET_IBG_DETAILS(req.query.invoiceNo).catch((e) => {
                responseObj.message = e
            });
            let invoiceMasterData = await viewVoucherDetailsLogic.InvoiceMasterdetails(req.query.invoiceNo).catch((e) => {
                responseObj.message = e
            });
            responceData.responce = resultofflineimage;
            responceData.invoiceMasterData = invoiceMasterData;
            return res.json(new responseDto(constants.STATUS_SUCCESS, '', responceData));
        } else if (req.query.paymentType == 'voucher') {
            // console.log((req.query.paymentType))
            var resultvoucherDetails = await paymentRepository.GET_VOUCHERDETAILS(req.query.invoiceNo).catch((e) => {
                responseObj.message = e

            });
            let invoiceMasterData = await viewVoucherDetailsLogic.InvoiceMasterdetails(req.query.invoiceNo).catch((e) => {
                responseObj.message = e
            });
            responceData.responce = resultvoucherDetails;
            responceData.invoiceMasterData = invoiceMasterData;
            return res.json(new responseDto(constants.STATUS_SUCCESS, '', responceData));
        } else if (req.query.paymentType == "JOMPAY") {

            var resultofflineimage = await paymentRepository.GET_JOMPAY_DETAILS(req.query.invoiceNo);
            var resultvoucherDetails = await paymentRepository.GET_VOUCHERDETAILS(req.query.invoiceNo).catch((e) => {
                responseObj.message = e

            });
            let invoiceMasterData = await viewVoucherDetailsLogic.InvoiceMasterdetails(req.query.invoiceNo).catch((e) => {
                responseObj.message = e
            });
            responceData.responce = resultofflineimage;
            responceData.invoiceMasterData = invoiceMasterData;
            return res.json(new responseDto(constants.STATUS_SUCCESS, '', responceData));
        } else {
            return res.json(new responseDto(constants.STATUS_FAIL, "Failed", ""));
        }
    } catch (error) {
        console.log(error)
        return res.json(new responseDto(constants.STATUS_FAIL, error, ""));
    }

}


let onlinePaymentRedirect = async (req, res) => {
    try {
        res.redirect('http://pcid-uat.sirim.my:80');
    }
    catch (e) {
        console.log(e);
        // return res.json(new responseDto('', constants.STATUS_FAIL, e));
    }

}

module.exports = {
    submitOfflinePaymentMode, voucherpaymentMode, getofflineDetails, onlinePaymentRedirect, updateReferenceNo, PayManualPayment
}