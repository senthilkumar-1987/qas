let invoiceDetails = require('../../../repositories/PaymentRepository/Customers/ViewInvoices');
let loginRepository = require('../../../repositories/LoginRepository');
let cRMIntegration = require('../../../controller/Customers/CRM_Integration');
let voucherDetails = require('../../../repositories/PaymentRepository/Finance/ViewVoucherDetailsLogic');
let responseDto = require('../../../config/ResponseDto')
let invoiceRepo = require('../../../repositories/PaymentRepository/InvoiceDetails');
let countryRepository = require('../../../repositories/CommonRepository/CountryLogic');
let stateLogic = require('../../../repositories/CommonRepository/StateLogic')
let cityLogic = require('../../../repositories/CommonRepository/CityLogic')
var paymentRepository = require('../../../repositories/PaymentRepository/Customers/PaymentRepository')
var constants = require('../../../config/PaymentConstants');
var constant = require('../../../config/Constants');
const Masterpdf = require('../../../PDFUtils/MasterPDF/Masterpdf');
let igstIntegrationService = require('../../Customers/IGSTItegrastionService');
let ReprintPDF = require('../../../PDFUtils/MasterPDF/reprintPDF');
let ReprintSinglePDF = require('../../../PDFUtils/MasterPDF/ReprintSinglePDF');
// const CreditNoteform = require('../../../PDFUtils/MasterPDF/CreditNoteform');
// const time = require('time');
var moment = require('moment');


let loadInvoiceDetails = async (req, res) => {
    try {
        // console.log(moment.unix(20200318161514))
        // var date = new Date(20200318161514);
        var momentObj = moment('20200319195355', 'yyyy-mm-dd');
        //parse integer
        //parse string 20200319195355


        // console.log(momentObj)

        const m = moment("20200319195355", "YYYY-MM-DD")
        console.log(moment(m).format("YYYY-MM-DD HH:MM:SS"))
        // const day = moment().subtract(5, 'days')




        // var a = new time.Date(1337324400000);
        // a.setTimezone('Europe/Amsterdam');
        // console.log(a.toString()); // Fri May 18 2012 09:00:00 GMT+0200 (CEST)
        // a.setTimezone('Europe/Kiev');
        // console.log(a.toString()); 

        // let customerId='09003294';
        // let getCompanyStructureResponce =await cRMIntegration.getCompanyStructureDetails(customerId);
        // // console.log("getCompanyStructureResponce crmid "+JSON.stringify(getCompanyStructureResponce.response.return[0].crmid));
        // console.log("getCompanyStructureResponce gstid "+JSON.stringify(getCompanyStructureResponce.response));

        // console.log(req.userData);
        var custId = req.userData.custId;
        var startDate = req.query.startDate;
        var endDate = req.query.endDate;

        let resultInvoiceDetails = await invoiceDetails.Load_Invoice_Details_ByUser(custId, startDate, endDate)


        return res.json(new responseDto(constants.STATUS_SUCCESS, '', resultInvoiceDetails));


    }
    catch (err) {
        console.log(err);
        return res.json(new responseDto(constants.STATUS_FAIL, constants.STATUS_FAIL, err));
    }
}

let loadpendinginvoices = async (req, res) => {
    try {


        var email = req.query.userName;
        console.log(req);
        let resultInvoiceDetails = await invoiceDetails.PENDING_INVOICES(email)


        return res.json(new responseDto(constants.STATUS_SUCCESS, '', resultInvoiceDetails));


    }
    catch (err) {
        console.log(err);
        return res.json(new responseDto('', constants.STATUS_FAIL, err));
    }
}

let loadpaidinvoices = async (req, res) => {
    try {
        let resultInvoiceDetails = await invoiceDetails.PAID_INVOICES(req.userData.username)
        // console.log("resultInvoiceDetails Length : " + resultInvoiceDetails.length)
        return res.json(new responseDto(constants.STATUS_SUCCESS, '', resultInvoiceDetails));
    }
    catch (err) {
        console.log(err);
        return res.json(new responseDto('', constants.STATUS_FAIL, err));
    }
}

let downloadmasterpdf = async (req, res) => {
    try {
        console.log("downloadmasterpdf123" + JSON.stringify(req.body))

        let resObj = await Masterpdf.downloadmasterpdf(req, res)
        console.log("InvoiceNo : " + JSON.stringify(req.body.Invoiceno))
        res.writeHead(200, {
            "Content-Type": "application/pdf",
            'Content-disposition': 'attachment; filename=' + req.body.Invoiceno + '.pdf'
        });
        resObj.streamData.pipe(res);
        return resObj;
    }

    catch (err) {
        console.log(err);
        return res.json(new responseDto('', constants.STATUS_FAIL, err));
    }
}

let downloardSampleInvoicepdf = async (req, res) => {
    try {
        console.log("downloardSampleInvoicepdf123" + JSON.stringify(req.body))

        let resObj = await Masterpdf.downloadSampleInvoicepdf(req, res)
        // console.log("InvoiceNo : " + JSON.stringify(req.body.Invoiceno))
        res.writeHead(200, {
            "Content-Type": "application/pdf",
            'Content-disposition': 'attachment; filename=Invoiceno.pdf'
        });
        resObj.streamData.pipe(res);
        return resObj;
    }

    catch (err) {
        console.log(err);
        return res.json(new responseDto('', constants.STATUS_FAIL, err));
    }
}



let loadQuotationData = async (req, res) => {

    console.log("loadQuotationDatas\n " + JSON.stringify(req.body));
    let request = req.body;
    let responce = [];
    try {

        let userId = req.userData.username;
        let roleId = req.userData.roleId;

        let RoleNames = [];
        for (let index = 0; index < roleId.length; index++) {
            const element = roleId[index];
            RoleNames.push(element.role)
        }
        let userDetails = await invoiceDetails.getUserDerails(userId);

        if (RoleNames.includes('Clerk')) {
            responce = await invoiceDetails.getQuaotationData(request, req.userData, userDetails[0].SecId);
        }

        return res.json(new responseDto(constants.STATUS_SUCCESS, '', responce));
    } catch (error) {
        console.log(error)
        return res.json(new responseDto(constants.STATUS_FAIL, 'No Records Found', responce));
    }
}


let listOfGeneratedInvoice = async (req, res) => {

    console.log("listOfGeneratedInvoice \n " + JSON.stringify(req.body));
    let request = req.body;
    let responce = [];
    try {
        responce = await invoiceRepo.listOfGeneratedInvoice(request, req.userData);
        return res.json(new responseDto(constants.STATUS_SUCCESS, '', responce));
    } catch (error) {
        console.log(error)
        return res.json(new responseDto(constants.STATUS_FAIL, 'No Records Found', responce));
    }
}

let getQuotationData = async (req, res) => {
    console.log("getQuotationData \n " + JSON.stringify(req.body));
    let request = req.body;
    let responce = {};
    try {
        let invoieMaster = await invoiceRepo.getQuotationData(request);
        console.log("invoieMaster--" + JSON.stringify(invoieMaster))
        responce.InvoiceMaster = invoieMaster;
        let CountryName = '';
        let StateName = '';
        let CityName = '';

        if (invoieMaster.length > 0 && invoieMaster[0].Country_id && invoieMaster[0].Country_id != null && invoieMaster[0].Country_id != '') {
            CountryName = await countryRepository.GetCountryNameByCountryId(invoieMaster[0].Country_id).catch((e) => { console.log(e) });
        }
        if (invoieMaster.length > 0 && invoieMaster[0].State_id && invoieMaster[0].State_id != null && invoieMaster[0].State_id != '') {
            StateName = await stateLogic.getstateNameById(invoieMaster[0].State_id).catch((e) => { console.log(e) });
        }
        if (invoieMaster.length > 0 && invoieMaster[0].City_id && invoieMaster[0].City_id != null && invoieMaster[0].City_id != '') {
            CityName = await cityLogic.getCityNameById(invoieMaster[0].City_id).catch((e) => { console.log(e) });
        }

        // console.log(JSON.stringify(CityName[0].CityName))
        if (CountryName && CountryName != null && CountryName != '') {
            responce.CountryName = CountryName;
        }

        if (StateName && StateName.length > 0 && StateName[0].StateName != null && StateName[0].StateName != '') {
            responce.StateName = StateName[0].StateName;
        }
        if (CityName && CityName.length > 0 && CityName[0].CityName != null) {
            responce.CityName = CityName[0].CityName;
        }

        if (invoieMaster && invoieMaster != null) {
            let invoiceDetails = await invoiceRepo.getQuotationDataDetails(invoieMaster);
            responce.invoiceDetails = invoiceDetails;
        }

        try {
            if (invoieMaster[0].Quotation_no !== "") {

                let QuotationNo = invoieMaster[0].Quotation_no

                let getSchematype = await invoiceRepo.GetShemaType(QuotationNo);
                console.log("----S------>..>" + JSON.stringify(getSchematype))
                console.log("getSchematype>>" + getSchematype != [] + ' ' + JSON.stringify(getSchematype))

                if (getSchematype && getSchematype != [] && getSchematype[0].SchemeName === "Foreign Inspection") {

                    let CheckForeignInspection = await invoiceRepo.CheckFI(QuotationNo)

                    if (CheckForeignInspection.length !== 0) {

                        console.log("Agencydata>>> if")

                        responce.Agencydata = CheckForeignInspection

                    }
                    else {
                        console.log("Agencydata>>> else")
                        responce.Agencydata = []
                    }

                }
            }
        } catch (error) {
            console.log(error)
        }

        console.log("responce\n" + JSON.stringify(responce))
        return res.json(new responseDto(constants.STATUS_SUCCESS, '', responce));
    } catch (error) {
        console.log(error)
        return res.json(new responseDto(constants.STATUS_FAIL, 'No Records Found', ''));
    }
}


let generateSingileInvoice = async (req, res) => {
    console.log("generateSingileInvoice \n " + JSON.stringify(req.body));
    let request = req.body;
    var userData = req.userData
    let responce = {};
    responce.affedtedrow = null;
    let customerId = req.body.customerId;
    let QuotationNo = req.body.QuotationNo
    try {
        let findseq = await invoiceRepo.getSeccode(QuotationNo).catch((error) => {
            console.log(error)
            return res.json(new responseDto(constants.STATUS_FAIL, "Couldn't Be Generate Invoice No", ''))
        })

        let ReceiptNo = await paymentRepository.Get_OrderNo_Seq_Value("receipt", '', findseq[0].Sector_type_unitcode, '').catch((error) => {
            console.log(error)
            return res.json(new responseDto(constants.STATUS_FAIL, "Couldn't Be Generate Receipt No", ''))
        })
        let invoiceNo = '';
        if (ReceiptNo && ReceiptNo != null && ReceiptNo != '') {
            if (findseq && findseq.length > 0 && findseq[0].Invoice_type === 'CR') {
                invoiceNo = await paymentRepository.Get_OrderNo_Seq_Value("invoice", findseq[0].Invoice_type, findseq[0].Sector_type_unitcode, '').catch((error) => {
                    console.log(error)
                    return res.json(new responseDto(constants.STATUS_FAIL, "Couldn't Be Generate Invoice No", ''))
                })
            } else {
                let receiptseq = ReceiptNo.substring(3, 8);
                console.log(ReceiptNo)
                console.log("receiptseq\n" + receiptseq)
                invoiceNo = await paymentRepository.Get_OrderNo_Seq_Value("invoice", findseq[0].Invoice_type, findseq[0].Sector_type_unitcode, receiptseq).catch((error) => {
                    console.log(error)
                    return res.json(new responseDto(constants.STATUS_FAIL, "Couldn't Be Generate Invoice No", ''))
                })
            }
            if (invoiceNo && invoiceNo != null && invoiceNo != '') {

                let resp = await invoiceRepo.insertInvoiceNo(request, invoiceNo, userData).then((resp) => {
                    responce.InvoiceNo = invoiceNo;
                    responce.affedtedrow = resp;
                });
                let InvocieDataList = await paymentRepository.quotationDataList(invoiceNo);
                let responceUpdateReceipt = await paymentRepository.updateReceiptNo(ReceiptNo, QuotationNo);
                let receiptDetailsSave = await voucherDetails.ReceiptDetailsInsert(ReceiptNo, InvocieDataList[0], userData);
                try {
                    let igstId = '';
                    if (constant.EnableIGST == constant.Yes) {
                        //IGST_INTEGRATION_SERVICES
                        igstId = await paymentRepository.Get_OrderNo_Seq_Value("igstid", '', '', '').catch((error) => {
                            console.log(error)
                        })

                        let resIgstIdInsert = await invoiceRepo.updateIgstIdByInvoiceNo(invoiceNo, igstId);


                        console.log("InvocieDataList[0].Customer_id ====>" + InvocieDataList[0].Customer_id)
                        if (InvocieDataList[0].Invoice_type === 'CR') {
                            // quotationDataList.forEach(async function (quotationData, index) { beforePaymentIGSTCRIntegration
                            let responcess = igstIntegrationService.beforePaymentIGSTCRIntegration(invoiceNo, InvocieDataList[0].Customer_id, InvocieDataList, userData, igstId);
                            console.log("beforePaymentIGSTCRIntegration IGST ITEGRASTION RESPONCE ==> " + JSON.stringify(responcess));
                            // })
                        } else {
                            let responcessss = igstIntegrationService.beforePaymentIGSTAPIntegration(invoiceNo, InvocieDataList[0].Customer_id, InvocieDataList, userData, igstId);
                            console.log("beforePaymentIGSTAPIntegration IGST ITEGRASTION RESPONCE ==> " + JSON.stringify(responcessss));
                        }
                    }
                } catch (error) {
                    console.log("Number(responce.affedtedrow)  " + Number(responce.affedtedrow))
                    if (responce.affedtedrow && Number(responce.affedtedrow) >= 0) {
                        console.log("responce\n" + JSON.stringify(responce))
                        return res.json(new responseDto(constants.STATUS_SUCCESS, '', responce));
                    } else {
                        console.log("responce\n" + JSON.stringify(responce))
                        return res.json(new responseDto(constants.STATUS_FAIL, error, ''));
                    }
                }
                console.log("responce\n" + JSON.stringify(responce))
                return res.json(new responseDto(constants.STATUS_SUCCESS, '', responce));

            } else {
                return res.json(new responseDto(constants.STATUS_FAIL, "Couldn't Be Generate Invoice No", ''))
            }
        } else {
            return res.json(new responseDto(constants.STATUS_FAIL, "Couldn't Be Generate Receipt No", ''))
        }
    } catch (error) {
        console.log(error)
        return res.json(new responseDto(constants.STATUS_FAIL, error, ''));
    }
}


let generateMasterInvoice = async (req, res) => {
    console.log("generateMasterInvoice \n " + JSON.stringify(req.body));
    let request = req.body.tbldata;
    let commanInvoiceData = req.body;
    let userData = req.userData;
    let responce = {};
    responce.affedtedrow = 0;
    // let temp = []
    try {
        // masterinvoice
        // invoice
        let findseq = '';
        // for (let index = 0; index < request.length; index++) {
        const element = request[0].Quotation_no;
        findseq = await invoiceRepo.getSeccode(element).catch((error) => {
            console.log(error)
            return res.json(new responseDto(constants.STATUS_FAIL, "Couldn't Be Generate Master Invoice No", ''))
        })
        // temp.push(findseq)
        // }
        let masterinvoiceNo = await paymentRepository.Get_OrderNo_Seq_Value("masterinvoiceno", '', findseq[0].Sector_type_unitcode, '').catch((error) => {
            console.log(error)
            return res.json(new responseDto(constants.STATUS_FAIL, "Couldn't Be Generate Master Invoice No", ''))
        })
        let ReceiptNo = await paymentRepository.Get_OrderNo_Seq_Value("receipt", '', findseq[0].Sector_type_unitcode, '').catch((error) => {
            console.log(error)
            return res.json(new responseDto(constants.STATUS_FAIL, "Couldn't Be Generate Receipt No", ''))
        })

        for (let index = 0; index < request.length; index++) {
            const element = request[index];
            let customerId = element.customerId;
            let invoiceNo = '';
            if (ReceiptNo && ReceiptNo != null && ReceiptNo != '') {
                if (findseq && findseq.length > 0 && findseq[0].Invoice_type === 'CR') {
                    invoiceNo = await paymentRepository.Get_OrderNo_Seq_Value("invoice", findseq[0].Invoice_type, findseq[0].Sector_type_unitcode, '').catch((error) => {
                        console.log(error)
                        return res.json(new responseDto(constants.STATUS_FAIL, "Couldn't Be Generate Invoice No", ''))
                    })
                } else {
                    let receiptseq = ReceiptNo.substring(3, 8);
                    console.log(ReceiptNo)
                    console.log("receiptseq\n" + receiptseq)
                    invoiceNo = await paymentRepository.Get_OrderNo_Seq_Value("invoice", findseq[0].Invoice_type, findseq[0].Sector_type_unitcode, receiptseq).catch((error) => {
                        console.log(error)
                        return res.json(new responseDto(constants.STATUS_FAIL, "Couldn't Be Generate Invoice No", ''))
                    })
                }


                console.log("invoiceNo " + invoiceNo)
                await invoiceRepo.insertMasterInvoiceNo(element, invoiceNo, masterinvoiceNo, userData, commanInvoiceData).then((resp) => {
                    // responce.InvoiceNo = invoiceNo;
                    responce.affedtedrow = Number(responce.affedtedrow) + Number(resp);
                    // console.log("Insert Responcestest ==>" + JSON.stringify(test))
                });;
                console.log("responce\n" + JSON.stringify(responce))
                let InvocieDataList = await paymentRepository.quotationDataList(invoiceNo);
                let responceUpdateReceipt = await paymentRepository.updateReceiptNoByInvoiceNo(ReceiptNo, invoiceNo);
                let receiptDetailsSave = await voucherDetails.ReceiptDetailsInsert(ReceiptNo, InvocieDataList[0], userData);
                // InserRecipt
                try {
                    let igstId = '';
                    if (constant.EnableIGST == constant.Yes) {
                        //IGST_INTEGRATION_SERVICES
                        // let InvocieDataList = await paymentRepository.quotationDataList(invoiceNo);
                        igstId = await paymentRepository.Get_OrderNo_Seq_Value("igstid", '', '', '').catch((error) => {
                            console.log(error)
                        })

                        let resIgstIdInsert = await invoiceRepo.updateIgstIdByInvoiceNo(invoiceNo, igstId).then((resp) => { });
                        if (element.Invoice_type === 'CR') {
                            // quotationDataList.forEach(async function (quotationData, index) { beforePaymentIGSTCRIntegration
                            let responcess = FsFsFsFsigstIntegrationService.beforePaymentIGSTCRIntegration(invoiceNo, element.Customer_id, InvocieDataList, userData, igstId);
                            console.log("beforePaymentIGSTCRIntegration IGST ITEGRASTION RESPONCE ==> " + JSON.stringify(responcess));
                            // })
                        } else {
                            let responcessss = igstIntegrationService.beforePaymentIGSTAPIntegration(invoiceNo, element.Customer_id, InvocieDataList, userData, igstId);
                            console.log("beforePaymentIGSTAPIntegration IGST ITEGRASTION RESPONCE ==> " + JSON.stringify(responcessss));
                        }
                    }

                } catch (error) {
                    console.log("Number(responce.affedtedrow)  " + Number(responce.affedtedrow))
                    if (responce.affedtedrow && Number(responce.affedtedrow) >= 0 && responce.affedtedrow === request.length) {
                        console.log("responce\n" + JSON.stringify(responce))
                        //return res.json(new responseDto(constants.STATUS_SUCCESS, '', responce));
                    } else {
                        console.log("responce\n" + JSON.stringify(responce))
                    }
                }
            } else {
                return res.json(new responseDto(constants.STATUS_FAIL, "Couldn't Be Generate Receipt No", ''))
            }
        }



        console.log("masterinvoiceNo " + masterinvoiceNo)

        responce.MasterInvoiceNo = masterinvoiceNo;
        return res.json(new responseDto(constants.STATUS_SUCCESS, '', responce));

    } catch (error) {
        console.log(error)
        return res.json(new responseDto(constants.STATUS_FAIL, error));
    }
}

let getQuotationDatabyOrderno = async (req, res) => {

    console.log("getQuotationDatabyOrderno body \n " + JSON.stringify(req.body));
    console.log("getQuotationDatabyOrderno query \n " + JSON.stringify(req.query));
    let request = req.body;
    let responce = [];
    try {
        responce = await invoiceRepo.getQoutationDataByOrderNumber(request);
        return res.json(new responseDto(constants.STATUS_SUCCESS, '', responce));
    } catch (error) {
        console.log(error)
        return res.json(new responseDto(constants.STATUS_FAIL, 'No Records Found', responce));
    }
}

let getInvoiceData = async (req, res) => {

    console.log("InvoiceData body \n " + JSON.stringify(req.body));
    let request = req.body.InvoiceNo;
    let MasterInvoiceNo = req.body.MasterInvoiceNo;
    let responce = [];

    try {
        if (MasterInvoiceNo && MasterInvoiceNo !== null && MasterInvoiceNo !== "") {
            console.log('if')
            responce = await invoiceRepo.GetMasterInvoiceDataByMasterInvoiceNo(MasterInvoiceNo);
        } else {
            console.log('else')
            responce = await invoiceRepo.GetInvoiceDataByInvoiceNo(request);

        }
        console.log(JSON.stringify(responce))

        return res.json(new responseDto(constants.STATUS_SUCCESS, '', responce));
    } catch (error) {
        console.log(error)
        return res.json(new responseDto(constants.STATUS_FAIL, 'No Records Found', responce));
    }
}

let getMasterInvoiceData = async (req, res) => {

    console.log("InvoiceData body \n " + JSON.stringify(req.body));
    let request = req.body.InvoiceNo;
    let responce = [];
    try {
        responce = await invoiceRepo.GetInvoiceDataByInvoiceNo(request);
        console.log(JSON.stringify(responce))
        if (responce === null && responce <= 0) {
            responce = await invoiceRepo.GetMasterInvoiceDataByMasterInvoiceNo(request);
        }

        return res.json(new responseDto(constants.STATUS_SUCCESS, '', responce));
    } catch (error) {
        console.log(error)
        return res.json(new responseDto(constants.STATUS_FAIL, 'No Records Found', responce));
    }
}


let generateManualInvoice = async (req, res) => {

    console.log("generateManualInvoiceRequest \n " + JSON.stringify(req.body));
    let request = req.body;
    let invoiceNo = '';
    let userData = req.userData;
    let responceObj = [];
    let invoiceType = request.invoicetype
    try {

        let valdiatecustode = await invoiceRepo.getCustcode(request.customerId).catch((e) => {
            console.log(e);
            return res.json(new responseDto(constants.STATUS_FAIL, "Please try Again!", e))
        });

        let getcustomerName = await invoiceRepo.getcustomerName(request).catch((e) => {
            console.log(e);
            return res.json(new responseDto(constants.STATUS_FAIL, "Please try Again!", e))
        });

        if (getcustomerName.length > 0) {

            request.customerName = getcustomerName[0].contact_person_name;


            console.log("valdiatecustode" + JSON.stringify(valdiatecustode))

            if (valdiatecustode !== null && valdiatecustode.length > 0) {

                let UnitCode = '';
                let SectionUnitCode = await invoiceRepo.getSectionUnitCode(userData.username);
                console.log(JSON.stringify(SectionUnitCode))
                if (SectionUnitCode && SectionUnitCode != null && SectionUnitCode != '' && SectionUnitCode.length > 0) {
                    UnitCode = SectionUnitCode[0].UnitCode;
                }

                let ReceiptNo = await paymentRepository.Get_OrderNo_Seq_Value("receipt", '', UnitCode, '').catch((error) => {
                    console.log(error)
                    return res.json(new responseDto(constants.STATUS_FAIL, "Couldn't Be Generate Receipt No", error))
                })

                if (invoiceType && invoiceType > 0 && invoiceType === 'CR') {
                    invoiceNo = await paymentRepository.Get_OrderNo_Seq_Value("invoice", invoiceType, UnitCode, '').catch((error) => {
                        console.log(error)
                        return res.json(new responseDto(constants.STATUS_FAIL, "Couldn't Be Generate Invoice No", error))
                    })
                } else {
                    let receiptseq = ReceiptNo.substring(3, 8);
                    console.log(ReceiptNo)
                    console.log("receiptseq\n" + receiptseq)
                    invoiceNo = await paymentRepository.Get_OrderNo_Seq_Value("invoice", invoiceType, UnitCode, receiptseq).catch((error) => {
                        console.log(error)
                        return res.json(new responseDto(constants.STATUS_FAIL, "Couldn't Be Generate Invoice No", error))
                    })
                }

                if (invoiceNo && invoiceNo != null) {
                    let userDataSecId = await loginRepository.loginDetails(userData.username)
                    console.log(JSON.stringify(userDataSecId))
                    let SecId = '';
                    if (userDataSecId && userDataSecId != null && userDataSecId != '' && userDataSecId.length > 0) {
                        SecId = userDataSecId[0].SecId;
                    }

                    let responceInvoiceMaster = await invoiceRepo.InsertInvoiceMasterData(invoiceNo, request, SecId, UnitCode);
                    let responceUpdateReceipt = await paymentRepository.updateReceiptNoByInvoiceNo(ReceiptNo, invoiceNo);
                    console.log(JSON.stringify(responceInvoiceMaster))
                    try {
                        if (responceInvoiceMaster && responceInvoiceMaster != null) {
                            for (let index = 0; index < request.InvoiceDetails.length; index++) {
                                const element = request.InvoiceDetails[index];
                                // if (element.description != null && element.description != '' && element.FileNo != null && element.FileNo != ''
                                //     && element.LicenseNo != null && element.LicenseNo != '' && element.JobDate != null && element.JobDate != ''Rviewin
                                //     && element.SubAmount != null && element.SubAmount != '' && element.GstAmount != null && element.GstAmount != ''
                                //     && element.GrantTotal != null && element.GrantTotal != '') {
                                if (element.Description !== null && element.Description !== "") {
                                    let responceInvoiceDetails = await invoiceRepo.insertInvoiceDetailsData(responceInvoiceMaster.Id, element, request);
                                    responceObj.InvoiceNo = invoiceNo;
                                }
                                //   }
                            }

                            //
                        }
                    } catch (error) {
                        return res.json(new responseDto(constants.STATUS_FAIL, 'Please try Again!', ''));
                    }
                    responceObj.InvoiceNo = invoiceNo;
                } else {
                    responceObj.InvoiceNo = '';
                }
            } else {
                return res.json(new responseDto(constants.STATUS_FAIL, "Invalid Customer Code", ''))

            }

        } else {
            return res.json(new responseDto(constants.STATUS_FAIL, "Invalid User Name", ''))
        }


        return res.json(new responseDto(constants.STATUS_SUCCESS, '', invoiceNo));
    } catch (error) {
        console.log(error)
        return res.json(new responseDto(constants.STATUS_FAIL, 'Please try Again!', ''));
    }
}


let rePrintInvoicePDF = async (req, res) => {
    try {
        let inputData = req.body;
        let resObj = {};
        console.log("downloardSampleInvoicepdf123" + JSON.stringify(req.body))
        console.log("MasterInvoiceNo ----> " + JSON.stringify(inputData.MasterInvoiceNo))

        if (inputData.MasterInvoiceNo !== null && inputData.MasterInvoiceNo !== '') {
            resObj = await ReprintPDF.downloadSampleInvoicepdf(req, res);
            res.writeHead(200, {
                "Content-Type": "application/pdf",
                'Content-disposition': 'attachment; filename=' + inputData.MasterInvoiceNo + '.pdf'
            });
            resObj.streamData.pipe(res);

        } else {
            console.log("/''///''/////")
            resObj = await ReprintSinglePDF.downloadSampleInvoicepdf(req, res)
            // console.log("InvoiceNo : " + JSON.stringify(req.body.Invoiceno))
            res.writeHead(200, {
                "Content-Type": "application/pdf",
                'Content-disposition': 'attachment; filename=Invoiceno.pdf'
            });
            resObj.streamData.pipe(res);
        }

        return resObj;
    }

    catch (err) {
        console.log(err);
        return res.json(new responseDto('', constants.STATUS_FAIL, err));
    }
}

module.exports = {
    loadInvoiceDetails, loadpendinginvoices, loadpaidinvoices, downloadmasterpdf, loadQuotationData, listOfGeneratedInvoice,
    getQuotationData, generateSingileInvoice, generateMasterInvoice, downloardSampleInvoicepdf, getQuotationDatabyOrderno,
    getInvoiceData, generateManualInvoice, rePrintInvoicePDF, getMasterInvoiceData
}