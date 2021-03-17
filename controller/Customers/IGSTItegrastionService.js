var paymentRepository = require('../../repositories/PaymentRepository/Customers/PaymentRepository')
var iGSTIntegrationRepository = require('../../repositories/IGSTIntegrationRepository/IGSTIntegrationRepository')
var constants = require('../../config/PaymentConstants');
let cRMIntegration = require('./CRM_Integration');
let crmConfig = require('../../config/CRM-config');
let logger = require('../../logger');
const MessageFormat = require('messageformat');
const mf = new MessageFormat('en');
var dateFormat = require('dateformat');
const { user } = require('../../db');


exports.IgstIntegrationService = async (qouteNo, InvoiceNo, customerId, orderNo, quotationData, igstId) => {
    try {

        let returnResponce = '';

        ////logger.info("customerId ==> " + customerId + " qouteNo " + qouteNo + " InvoiceNo " + InvoiceNo);
        let companyStructureDetails = await cRMIntegration.getCompanyStructureDetails(customerId);
        let structureDetails = companyStructureDetails.response.return[0];
        //query data Registration Application
        let requestRegisterApplication = await iGSTIntegrationRepository.requestRegisterApplication(qouteNo);
        // //logger.info("query data Registration Application ==>  " + JSON.stringify(requestRegisterApplication))
        let requestRegisterApplicationGSTAmt = await iGSTIntegrationRepository.requestRegisterApplicationGSTAmt(requestRegisterApplication[0].CostId);
        //format Registration Application
        let formatRegisterApplicationRequest = await this.requestFormatRegisterApplication(structureDetails, requestRegisterApplication[0], requestRegisterApplicationGSTAmt);
        // //logger.info("formatRegisterApplicationRequest ===> \n" + JSON.stringify(formatRegisterApplicationRequest))
        //SoapUI Requst Registration Application
        let responceRegisterApplication = await cRMIntegration.registerApplication(formatRegisterApplicationRequest);
        // //logger.info("responceRegisterApplication test ==> \n" + JSON.stringify(responceRegisterApplication))
        let responseCode = responceRegisterApplication.response.return.responseCode;
        let applicationID = responceRegisterApplication.response.return.applicationID;
        let responseMessage = responceRegisterApplication.response.return.responseMessage;
        returnResponce = await iGSTIntegrationRepository.insertIGSTIntegrstionResponce(responceRegisterApplication, qouteNo, InvoiceNo, responseCode, applicationID, responseMessage, igstId);
        let applicationId = responceRegisterApplication.response.return.applicationID;
        // let transactionUniqueID = await paymentRepository.Get_Transaction_Seq_Value();

        //Getdata from Sirim InvoiceMaster
        let invoiceMasterData = await iGSTIntegrationRepository.getdataInvoiceMaster(qouteNo);
        let invoiceMasterItemData = await iGSTIntegrationRepository.getInvoiceMasterItemData(invoiceMasterData);
        //query data Register Application Detail responceRegisterApplication.response.return.applicationID
        // let requestRegisterApplicationDetail = await iGSTIntegrationRepository.getDataRegisterApplicationDetail(structureDetails, voucherDetails);
        // //logger.info("invoiceMasterData Details ==> \n" + JSON.stringify(invoiceMasterItemData));
        //format Registration Application Detail
        let formatRegisterApplicationRequestDetail = await this.requestRegisterApplicationDetail(applicationId, requestRegisterApplication[0], invoiceMasterData[0], invoiceMasterItemData);
        //SoapUI Requst Register Application Detail
        let responceRegisterApplicationDetail = await cRMIntegration.registerApplicationDetail(formatRegisterApplicationRequestDetail);
        // //logger.info("responceRegisterApplicationDetail ==> " + JSON.stringify(responceRegisterApplicationDetail));
        returnResponce = await iGSTIntegrationRepository.insertIGSTIntegrstionResponce(responceRegisterApplicationDetail, qouteNo, InvoiceNo, igstId);


        //SoapUI Requst Generate General PaymentInfo
        let bankDetails = [];
        if (invoiceMasterData[0].payment_mode == 'cheque') {
            bankDetails = await iGSTIntegrationRepository.getPaymentDetailsCHEQUE(invoiceMasterData);
            // //logger.info("bankDetails " + JSON.stringify(bankDetails))
        } else if (false) {

        }

        let request = await this.RequestFormatGenerateGeneralPaymentInfo(applicationId, requestRegisterApplication[0], invoiceMasterData[0], invoiceMasterItemData, transactionUniqueID, bankDetails);
        let responceGenerateGeneralPaymentInfo = await cRMIntegration.GenerateGeneralPaymentInfo(request);
        returnResponce = await iGSTIntegrationRepository.insertIGSTIntegrstionResponce(responceGenerateGeneralPaymentInfo, qouteNo, InvoiceNo, igstId);
        // //logger.info("responceGenerateGeneralPaymentInfo ==> " + JSON.stringify(responceGenerateGeneralPaymentInfo));

        //SoapUI Requst Get Receipt Available
        let responceGetReceiptAvailable = await cRMIntegration.getReceiptAvailable(request);
        returnResponce = await iGSTIntegrationRepository.insertIGSTIntegrstionResponce(responceGetReceiptAvailable, qouteNo, InvoiceNo, igstId);
        // //logger.info("responceGetReceiptAvailable ==> " + JSON.stringify(responceGetReceiptAvailable));

        //SoapUI Requst Confirm Service Delivery
        let responceConfirmServiceDelivery = await cRMIntegration.confirmServiceDelivery(request, customerId);
        returnResponce = await iGSTIntegrationRepository.insertIGSTIntegrstionResponce(responceGetReceiptAvailable, qouteNo, InvoiceNo, igstId);
        // //logger.info("responceConfirmServiceDelivery ==> " + JSON.stringify(responceConfirmServiceDelivery));
        return returnResponce;
    } catch (error) {
        //logger.info(error)
        return error
    }

}

exports.requestFormatRegisterApplication = async (structureDetails, requestRegisterApplications, requestRegisterApplicationGSTAmts) => {

    //logger.info("\nrequestRegisterApplication11 \n" + JSON.stringify(requestRegisterApplication))
    // //logger.info("\nrequestRegisterApplicationGSTAmt \n" + JSON.stringify(requestRegisterApplicationGSTAmt))
    let requestRegisterApplication = requestRegisterApplications[0];
    let requestRegisterApplicationGSTAmt = requestRegisterApplicationGSTAmts[0]
    var request = {
        applicationDescription: requestRegisterApplication.applicationDescription,
        applicationMode: requestRegisterApplication.applicationMode,
        billingaddress1: requestRegisterApplication.billingaddress1,
        billingaddress2: requestRegisterApplication.billingaddress2,
        billingaddress3: requestRegisterApplication.billingaddress3,
        city: requestRegisterApplication.City,
        company: requestRegisterApplication.company,
        country: requestRegisterApplication.CountryName,
        creditterm: requestRegisterApplication.creditterm,
        crmID: structureDetails.crmid,
        currency: requestRegisterApplication.currency,
        customerID: requestRegisterApplication.customerID,
        customerName: requestRegisterApplication.customerName,
        customerType: requestRegisterApplication.customerType,
        email: requestRegisterApplication.Email,
        fileNo: requestRegisterApplication.fileNo,
        foriegntotalAmount: requestRegisterApplication.foriegntotalAmount,
        foriegntotalDiscount: requestRegisterApplication.foriegntotalDiscount,
        foriegntotalGST: requestRegisterApplication.foriegntotalGST,
        gstid: structureDetails.gst_cd,
        postcode: requestRegisterApplication.postcode,
        referenceNo: requestRegisterApplication.gstid,
        scopeofService: requestRegisterApplication.scopeofService,
        sectionCode: requestRegisterApplication.sector_type,
        siteID: requestRegisterApplication.siteID,
        state: requestRegisterApplication.state,
        totalAmount: (requestRegisterApplication.totalAmount == null ? Number(0.00) : Number(requestRegisterApplication.totalAmount)).toFixed(2),
        totalDiscount: (requestRegisterApplication.totalDiscount == null ? Number(0.00) : Number(requestRegisterApplication.totalDiscount)).toFixed(2),
        totalGST: (requestRegisterApplicationGSTAmt.GSTAMOUNT == null ? Number(0.00) : Number(requestRegisterApplicationGSTAmt.GSTAMOUNT)).toFixed(2),
        username: requestRegisterApplication.username
    }
    let obj = {};
    obj.app = request;
    return obj;
}


exports.requestRegisterApplicationDetail = async (applicationID, requestRegisterApplication, invoiceMasterData, invoiceMasterItemData, transactionUniqueID) => {
    let main = {
        applicationID: applicationID,
        company: requestRegisterApplication.company,
        siteID: requestRegisterApplication.siteID,
        username: requestRegisterApplication.username,
    };
    let obj = {};
    let arraylsit = {};
    if (invoiceMasterItemData != null) {
        for (let index = 0; index < invoiceMasterItemData.length; index++) {
            const element = invoiceMasterItemData[index];
            let arrayList = [{
                GSTRate: invoiceMasterData.GSTRate == null ? Number(0.00) : invoiceMasterData.GSTRate,
                currencyRate: requestRegisterApplication.currency,
                foreignTotalDiscount: Number(0.00),
                foreignTotalPrice: Number(0.00),
                foreignUnitPrice: Number(0.00),
                implementerCode: requestRegisterApplication.sector_type,
                incomecode: invoiceMasterData.Detailcode,
                jobCode: requestRegisterApplication.Job_No,
                leadCode: requestRegisterApplication.sector_type,
                otherdescription: element.Item_desc,
                quantity: element.ManHour,
                quotationNo: invoiceMasterData.Quotation_no,
                totalDiscount: (requestRegisterApplication.totalDiscount == null ? Number(0.00) : Number(requestRegisterApplication.totalDiscount)).toFixed(2),
                totalGST: (element.Gst_amount == null || element.Gst_amount == '' ? Number(0.00) : Number(element.Gst_amount)).toFixed(2),
                totalPrice: (element.Total_amount == null || element.Total_amount == '' ? Number(0.00) : Number(element.Total_amount)).toFixed(2),
                transactionUniqueID: requestRegisterApplication.igst_txn_no,
                unitPrice: (element.Unit_price == null || element.Unit_price == '' ? Number(0.00) : Number(element.Unit_price)).toFixed(2),
            }]
            arraylsit[index] = arrayList;
        }
    } else {
        let arrayList = [{
            GSTRate: '0.00',
            currencyRate: '',
            foreignTotalDiscount: '0.00',
            foreignTotalPrice: '0.00',
            foreignUnitPrice: '0.00',
            implementerCode: '',
            incomecode: '',
            jobCode: '',
            leadCode: '',
            otherdescription: '',
            quantity: '',
            quotationNo: '',
            totalDiscount: '0.00',
            totalGST: '',
            totalPrice: '',
            transactionUniqueID: '',
            unitPrice: '',
        }]
        arraylsit[0] = arrayList;
    }


    obj.main = main;
    obj.main = arraylsit;
    //logger.info("obj values" + JSON.stringify(obj))
    return obj;
}

exports.requestConfirmServiceDeliveryInclusiveTaxinvoice = async (applicationID, requestRegisterApplication, invoiceMasterData, invoiceMasterItemData, userData) => {
    console.log(JSON.stringify(userData))
    let main = {
        applicationID: applicationID,
        approveDate: dateFormat(new Date(), 'yyyy-MM-dd'),
        approvedby: userData.contactPerson,
        company: requestRegisterApplication.company,
        deliveryDate: dateFormat(new Date(), 'yyyy-MM-dd'),
        referenceNo: '',
        siteID: requestRegisterApplication.siteID,
        username: requestRegisterApplication.User_name,
    };
    let obj = {};
    let arraylsit = {};

    let arrayDelivery = {
        quantity: invoiceMasterItemData === (undefined || null) ? '0' : invoiceMasterItemData.length,
        transactionUniqueID: invoiceMasterData[0].igst_txn_no,
    };
    if (invoiceMasterItemData && invoiceMasterItemData != null) {
        for (let index = 0; index < invoiceMasterItemData.length; index++) {
            const element = invoiceMasterItemData[index];
            let tax = [{
                advanceAmount: invoiceMasterData[0].Advance_paid_amount,
                currencyRate: invoiceMasterData[0].Currency,
                foreignTotalDiscount: '0.0',
                foreignTotalPrice: '0.0',
                foreignUnitPrice: '0.0',
                implementerCode: requestRegisterApplication.sectionCode,
                incomecode: invoiceMasterData[0].Detailcode,
                jobCode: invoiceMasterData[0].Job_id,
                leadCode: requestRegisterApplication.sector_type,
                otherdescription: element.Item_desc,
                quantity: element.ManHour,
                quotationNo: invoiceMasterData[0].Quotation_no,
                totalDiscount: requestRegisterApplication.totalDiscount,
                totalGST: element.Gst_amount,
                totalPrice: element.Total_amount,
                transactionUniqueID: invoiceMasterData[0].igst_txn_no,
                unitPrice: element.Unit_price,
            }]
            arraylsit[index] = tax;
        }
    } else {
        let tax = [{
            advanceAmount: '0.00',
            currencyRate: '',
            foreignTotalDiscount: '0.00',
            foreignTotalPrice: '0.00',
            foreignUnitPrice: '0.00',
            implementerCode: '',
            incomecode: '',
            jobCode: '',
            leadCode: '',
            otherdescription: '',
            quantity: '',
            quotationNo: '',
            totalDiscount: '0.00',
            totalGST: '0.00',
            totalPrice: '0.00',
            transactionUniqueID: '',
            unitPrice: '0.00',
        }]
        arraylsit[0] = tax;
    }


    obj.main = main;
    obj.arrayDelivery = arrayDelivery;
    obj.main = arraylsit;
    //logger.info("obj values" + JSON.stringify(obj))
    return obj;
}


exports.requestGenerateCreditPayment = async (applicationID, invoiceMasterData, requestRegisterApplication) => {

    let main = {
        applicationID: applicationID,
        company: 'K',
        siteID: 'SCIS',
        username: invoiceMasterData[0].User_name,
    };
    let obj = {};
    let arraylsit = {};

    for (let index = 0; index < invoiceMasterData.length; index++) {
        const element = invoiceMasterData[index];
        let arrayList = [{
            GSTRate: invoiceMasterData[0].Gst_amount_rm,
            currencyRate: invoiceMasterData[0].Currency,
            foreignTotalDiscount: '0.0',
            foreignTotalPrice: '0.0',
            foreignUnitPrice: '0.0',
            implementerCode: invoiceMasterData[0].IncomeDetailCodeId,
            incomecode: invoiceMasterData[0].IncomeDetailCodeId,
            jobCode: invoiceMasterData[0].Job_id,
            leadCode: requestRegisterApplication.sector_type,
            otherdescription: element.Item_desc,
            quantity: element.ManHour,
            quotationNo: invoiceMasterData.Quotation_no,
            totalDiscount: requestRegisterApplication.totalDiscount,
            totalGST: element.Gst_amount,
            totalPrice: element.Total_amount,
            transactionUniqueID: invoiceMasterData.igst_txn_no,
            unitPrice: element.Unit_price,
        }]
        arraylsit[index] = arrayList;
    }

    obj.main = main;
    obj.main = arraylsit;
    //logger.info("obj values" + JSON.stringify(obj))
    return obj;
}


exports.RequestFormatGenerateGeneralPaymentInfo = async (applicationId, requestRegisterApplication, invoiceMasterData, invoiceMasterItemData, transactionUniqueID, bankDetails) => {
    let paymentMethod = '';
    let systemId = ''

    let customerId = ''
    let bank_code_Details = await iGSTIntegrationRepository.getBankCodeDetails(invoiceMasterData);
    console.log(JSON.stringify(bank_code_Details.length))
    if (invoiceMasterData.payment_type == 'online') {
        if (invoiceMasterData.payment_mode == 'creditcard') {
            paymentMethod = 'CC';
            systemId = 'CRD'
        } else {
            paymentMethod = 'FPX';
            systemId = 'FPX'
        }

    }


    let advpay = {
        bank: invoiceMasterData.payment_mode !== 'cheque' ? '' : bankDetails[0].BANK_NAME,
        bankglac: bank_code_Details.length > 0 ? bank_code_Details[0].Banl_glac : '',
        cashType: '',
        chequeNo: invoiceMasterData.payment_mode !== 'cheque' ? '' : bankDetails[0].CHQUE_NO,
        company: 'K',
        customerCode: invoiceMasterData.Customer_id,
        date: '',
        paymentMethod: paymentMethod,
        paytype: invoiceMasterData.payment_type,
        receiptNo: invoiceMasterData.Receipt_no,
        siteID: 'ESCS',
        systemID: systemId,
        totaladvanceAmount: invoiceMasterData.Advance_paid_amount,
        username: invoiceMasterData.User_name,
    };
    let arrayAdvPayline = {
        advanceAmount: invoiceMasterData.Advance_paid_amount,
        applicationID: applicationId,
        approvedBy: invoiceMasterData.Approved_by,
        approvedDate: invoiceMasterData.Approval_date,
        batchid: invoiceMasterData.Batch_No,
        contactPerson: '',
        faxNo: '',
        invoiceNo: invoiceMasterData.Invoice_no,
        licenseNo: invoiceMasterData.License_no,
        phoneNo: '',
        preparedBy: invoiceMasterData.Prepared_by,
        productName: invoiceMasterData.Product,
        sectCode: invoiceMasterData.SecId,
        transid: transactionUniqueID,
    }
    let obj = {};
    obj.advpay = advpay;
    obj.advpay.arrayAdvPayline = arrayAdvPayline;
    //logger.info("RequestFormatGenerateGeneralPaymentInfo " + JSON.stringify(obj))
    return obj;
}


exports.RequestFormatGetReceiptAvailable = async () => {
    let getReceiptAvailable = {
        appid: ''
    };
    let obj = {};
    obj.getReceiptAvailable = getReceiptAvailable;
    return obj;
}


exports.RequestFormatconfirmServiceDelivery = async (obj) => {
    let main = {
        applicationID: '',
        approveDate: '',
        approvedby: '',
        company: '',
        deliveryDate: '',
        referenceNo: '',
        siteID: '',
        username: '',
        arrayDelivery: {
            quantity: '',
            transactionUniqueID: ''
        }
    }
    return main;
}



exports.beforePaymentIGSTCRIntegration = async (InvoiceNo, customerId, InvocieDataList, userData, igstId) => {
    let companyStructureDetails;
    let structureDetails;
    try {
        // registerApplication
        companyStructureDetails = await cRMIntegration.getCompanyStructureDetails(customerId);
        structureDetails = companyStructureDetails.response.return[0];
    } catch (error) {
        console.log(error)
    }
    let requestRegisterApplication;
    let requestRegisterApplicationGSTAmt;
    let formatRegisterApplicationRequest;
    let responceRegisterApplication;
    let responseCode;
    let applicationID;
    let responseMessage;
    let applicationId;
    let returnResponce;
    try {
        requestRegisterApplication = await iGSTIntegrationRepository.requestRegisterApplication(InvoiceNo);
        console.log("requestRegisterApplicationrequestRegisterApplication\n\n" + JSON.stringify(requestRegisterApplication))
        requestRegisterApplicationGSTAmt = await iGSTIntegrationRepository.requestRegisterApplicationGSTAmt(InvoiceNo);
        console.log("requestRegisterApplicationGSTAmtrequestRegisterApplicationGSTAmt\n\n" + JSON.stringify(requestRegisterApplicationGSTAmt))
        formatRegisterApplicationRequest = await this.requestFormatRegisterApplication(structureDetails, requestRegisterApplication, requestRegisterApplicationGSTAmt);
        console.log("formatRegisterApplicationRequestformatRegisterApplicationRequest\n\n" + JSON.stringify(formatRegisterApplicationRequest))
        responceRegisterApplication = await cRMIntegration.registerApplication(formatRegisterApplicationRequest);
        responseCode = responceRegisterApplication.response.return.responseCode;
        applicationID = responceRegisterApplication.response.return.applicationID;
        responseMessage = responceRegisterApplication.response.return.responseMessage;
        returnResponce = await iGSTIntegrationRepository.insertIGSTIntegrstionResponce(responceRegisterApplication, InvoiceNo, responseCode, applicationID, responseMessage, igstId);
        applicationId = responceRegisterApplication.response.return.applicationID;
    } catch (error) {
        console.log(error)
    }

    let invoiceMasterData;
    let invoiceMasterItemData;
    let formatRegisterApplicationRequestDetail;
    let registerApplicationDetail;
    try {
        invoiceMasterData = await iGSTIntegrationRepository.getdataInvoiceMaster(InvoiceNo);
        invoiceMasterItemData = await iGSTIntegrationRepository.getInvoiceMasterItemData(invoiceMasterData);
        formatRegisterApplicationRequestDetail = await this.requestRegisterApplicationDetail(applicationId, requestRegisterApplication, invoiceMasterData[0], invoiceMasterItemData);
        registerApplicationDetail = await cRMIntegration.registerApplicationDetail(formatRegisterApplicationRequestDetail);
        responseCode = ''//registerApplicationDetail.response.return.responseCode;
        // applicationID = registerApplicationDetail.response.return.applicationID;
        responseMessage = ''//registerApplicationDetail.response.return.responseMessage;
        returnResponce = await iGSTIntegrationRepository.insertIGSTIntegrstionResponce(registerApplicationDetail, InvoiceNo, responseCode, applicationID, responseMessage, igstId);
    } catch (error) {
        console.log(error)
    }

    let requestConfirmServiceDeliveryInclusiveTaxinvoice;
    let confirmServiceDeliveryInclusiveTaxinvoice;
    try {
        requestConfirmServiceDeliveryInclusiveTaxinvoice = await this.requestConfirmServiceDeliveryInclusiveTaxinvoice(applicationId, requestRegisterApplication[0], invoiceMasterData, invoiceMasterItemData, userData);
        confirmServiceDeliveryInclusiveTaxinvoice = await cRMIntegration.confirmServiceDeliveryInclusiveTaxinvoice(requestConfirmServiceDeliveryInclusiveTaxinvoice);
        responseCode = ''//confirmServiceDeliveryInclusiveTaxinvoice.response.return === undefined ? confirmServiceDeliveryInclusiveTaxinvoice.response.statusCode : confirmServiceDeliveryInclusiveTaxinvoice.response.return
        // applicationID = registerApplicationDetail.response.return.applicationID;
        responseMessage = ''//confirmServiceDeliveryInclusiveTaxinvoice.response.return.responseMessage === undefined ? '' : confirmServiceDeliveryInclusiveTaxinvoice.response.body;
        returnResponce = await iGSTIntegrationRepository.insertIGSTIntegrstionResponce(confirmServiceDeliveryInclusiveTaxinvoice, InvoiceNo, responseCode, applicationID, responseMessage, igstId);
    } catch (error) {
        console.log(error)
    }

}



exports.afterPaymentIGSTCRIntegration = async (InvoiceNo, customerId, InvocieDataList, userdata, igstId) => {
    let igstDetails = await iGSTIntegrationRepository.getigstDetails(InvoiceNo);
    let appId = ''
    if (igstDetails != null && igstDetails.length > 0) {
        appId = igstDetails[0].applicationID
    }

    let getInvoiceMasterDetails = await iGSTIntegrationRepository.getInvoiceMasterDetails(InvoiceNo);

    // console.log("igstDetails ===>" + JSON.stringify(igstDetails))
    //GenerateCreditPayment
    requestRegisterApplication = await iGSTIntegrationRepository.requestRegisterApplication(InvoiceNo);
    let requestGenerateCreditPayment = await this.requestGenerateCreditPayment(appid, getInvoiceMasterDetails, requestRegisterApplication);
    //SoapUI Requst Register Application Detail
    let GenerateCreditPayment = await cRMIntegration.GenerateCreditPayment(requestGenerateCreditPayment);
    // //logger.info("responceRegisterApplicationDetail ==> " + JSON.stringify(responceRegisterApplicationDetail));
    responseCode = ''//GenerateCreditPayment.response.return.responseCode;
    // applicationID = registerApplicationDetail.response.return.applicationID;
    responseMessage = ''//GenerateCreditPayment.response.return.responseMessage;
    returnResponce = await iGSTIntegrationRepository.insertIGSTIntegrstionResponce(GenerateCreditPayment, InvoiceNo, responseCode, igstDetails[0].applicationID, responseMessage, igstId);

}



exports.beforePaymentIGSTAPIntegration = async (InvoiceNo, customerId, InvocieDataList, userdata, igstId) => {

    // registerApplication
    let companyStructureDetails = await cRMIntegration.getCompanyStructureDetails(customerId);
    let structureDetails = companyStructureDetails.response.return[0];
    //query data Registration Application
    let requestRegisterApplication = await iGSTIntegrationRepository.requestRegisterApplication(InvoiceNo);
    // //logger.info("query data Registration Application ==>  " + JSON.stringify(requestRegisterApplication))
    let requestRegisterApplicationGSTAmt = await iGSTIntegrationRepository.requestRegisterApplicationGSTAmt(InvoiceNo);
    //format Registration Application
    let formatRegisterApplicationRequest = await this.requestFormatRegisterApplication(structureDetails, requestRegisterApplication, requestRegisterApplicationGSTAmt);
    // //logger.info("formatRegisterApplicationRequest ===> \n" + JSON.stringify(formatRegisterApplicationRequest))
    //SoapUI Requst Registration Application
    let responceRegisterApplication = await cRMIntegration.registerApplication(formatRegisterApplicationRequest);
    logger.info("responceRegisterApplication test ==> \n" + JSON.stringify(responceRegisterApplication))
    let responseCode = responceRegisterApplication.response.return.responseCode;
    let applicationID = responceRegisterApplication.response.return.applicationID;
    let responseMessage = responceRegisterApplication.response.return.responseMessage;
    returnResponce = await iGSTIntegrationRepository.insertIGSTIntegrstionResponce(responceRegisterApplication, InvoiceNo, responseCode, applicationID, responseMessage, igstId);
    let applicationId = responceRegisterApplication.response.return.applicationID;

    //requestRegisterApplicationDetail
    //Getdata from Sirim InvoiceMaster
    let invoiceMasterData = await iGSTIntegrationRepository.getdataInvoiceMaster(InvoiceNo);
    let invoiceMasterItemData = await iGSTIntegrationRepository.getInvoiceMasterItemData(invoiceMasterData);
    //query data Register Application Detail responceRegisterApplication.response.return.applicationID
    // let requestRegisterApplicationDetail = await iGSTIntegrationRepository.getDataRegisterApplicationDetail(structureDetails, voucherDetails);
    // //logger.info("invoiceMasterData ==> " + JSON.stringify(invoiceMasterItemData));
    //format Registration Application Detail
    let formatRegisterApplicationRequestDetail = await this.requestRegisterApplicationDetail(applicationId, requestRegisterApplication[0], invoiceMasterData[0], invoiceMasterItemData);
    //SoapUI Requst Register Application Detail
    try {
        let registerApplicationDetail = await cRMIntegration.registerApplicationDetail(formatRegisterApplicationRequestDetail);
        logger.info("responceRegisterApplicationDetail ==>\n " + JSON.stringify(registerApplicationDetail));
        responseCode = ''//registerApplicationDetail.response.return.responseCode;
        // applicationID = registerApplicationDetail.response.return.applicationID;
        responseMessage = ''//registerApplicationDetail.response.return.responseMessage;
        console.log("responseMessageresponseMessage\n" + responseCode + " " + responseMessage)
        returnResponce = await iGSTIntegrationRepository.insertIGSTIntegrstionResponce(registerApplicationDetail, InvoiceNo, responseCode, applicationID, responseMessage, igstId);




        //SoapUI Requst Generate General PaymentInfo
        let bankDetails = [];
        if (invoiceMasterData[0].payment_mode == 'cheque') {
            bankDetails = await iGSTIntegrationRepository.getPaymentDetailsCHEQUE(invoiceMasterData);
            logger.info("bankDetails " + JSON.stringify(bankDetails))
        } else if (false) {

        }

        let request = await this.RequestFormatGenerateGeneralPaymentInfo(applicationId, requestRegisterApplication[0], invoiceMasterData[0], invoiceMasterItemData, '', bankDetails);
        let responceGenerateGeneralPaymentInfo = await cRMIntegration.GenerateGeneralPaymentInfo(request);
        logger.info("responceGenerateGeneralPaymentInfo1 ==> \n" + JSON.stringify(responceGenerateGeneralPaymentInfo))
        responseCode = responceGenerateGeneralPaymentInfo.response.return.responseCode;
        // applicationID = responceGenerateGeneralPaymentInfo.response.return.applicationID;
        responseMessage = responceGenerateGeneralPaymentInfo.response.return.responseMessage;
        returnResponce = await iGSTIntegrationRepository.insertIGSTIntegrstionResponce(responceGenerateGeneralPaymentInfo, InvoiceNo, responseCode, applicationID, responseMessage, igstId);
        // //logger.info("responceGenerateGeneralPaymentInfo ==> " + JSON.stringify(responceGenerateGeneralPaymentInfo));
    } catch (error) {
        console.log("CatchError")
        console.log(error)
    }



}


exports.afterPaymentIGSTAPIntegration = async (InvoiceNo, customerId, InvocieDataList, userdata, igstId) => {

    let igstDetails = await iGSTIntegrationRepository.getigstDetails(InvoiceNo);
    let getInvoiceMasterDetails = await iGSTIntegrationRepository.getInvoiceMasterDetails(InvoiceNo);
    let requestRegisterApplication = await iGSTIntegrationRepository.requestRegisterApplication(InvoiceNo);
    //SoapUI Requst Get Receipt Available
    let appId = ''
    if (igstDetails != null && igstDetails.length > 0) {
        appId = igstDetails[0].applicationID
    }
    let request = {
        appId: appId
    }
    let responceGetReceiptAvailable = await cRMIntegration.getReceiptAvailable(request, userdata);
    responseCode = ''// responceGetReceiptAvailable.response.return.responseCode;
    // applicationID = registerApplicationDetail.response.return.applicationID;
    responseMessage = ''//responceGetReceiptAvailable.response.return.responseMessage;
    returnResponce = await iGSTIntegrationRepository.insertIGSTIntegrstionResponce(responceGetReceiptAvailable, InvoiceNo, responseCode, appId, responseMessage, igstId);
    // //logger.info("responceGetReceiptAvailable ==> " + JSON.stringify(responceGetReceiptAvailable));
    let invoiceMasterItemData = await iGSTIntegrationRepository.getInvoiceMasterItemData(getInvoiceMasterDetails);
    //confirmServiceDeliveryInclusiveTaxinvoice
    let requestConfirmServiceDeliveryInclusiveTaxinvoice = await this.requestConfirmServiceDeliveryInclusiveTaxinvoice(appId, requestRegisterApplication[0], getInvoiceMasterDetails, invoiceMasterItemData, user);
    //SoapUI Requst Register Application Detail
    let confirmServiceDeliveryInclusiveTaxinvoice = await cRMIntegration.confirmServiceDeliveryInclusiveTaxinvoice(requestConfirmServiceDeliveryInclusiveTaxinvoice, userdata);
    // //logger.info("responceRegisterApplicationDetail ==> " + JSON.stringify(responceRegisterApplicationDetail));
    responseCode = ''//confirmServiceDeliveryInclusiveTaxinvoice.response.return.responseCode;
    // applicationID = registerApplicationDetail.response.return.applicationID;
    responseMessage = ''//confirmServiceDeliveryInclusiveTaxinvoice.response.return.responseMessage;
    returnResponce = await iGSTIntegrationRepository.insertIGSTIntegrstionResponce(confirmServiceDeliveryInclusiveTaxinvoice, InvoiceNo, responseCode, appId, responseMessage, igstId);


}