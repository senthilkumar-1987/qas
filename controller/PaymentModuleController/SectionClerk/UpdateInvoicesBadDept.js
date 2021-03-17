var creditNotePdf = require('../../../PDFUtils/MasterPDF/CreditNoteform');
let UpdateBadDeptStatus = require('../../../repositories/PaymentRepository/SectionClerk/UpdateBadDeptStatus');
let invoiceDetailsdata = require('../../../repositories/PaymentRepository/Customers/ViewInvoices');
let newCustomerRegistrationLogic = require('../../../repositories/CustomersRepository/NewCustomerRegistrationLogic');
var sendmail = require('../../../config/email');
let responseDto = require('../../../config/ResponseDto')
var constants = require('../../../config/PaymentConstants');
const lodPdf = require('../../../CronScheduler/LODPdf');
const sirimUtils = require('../../../repositories/ReportsMgtRepo/SirimUtils');
const DebtPdf = require('../../../CronScheduler/DebtPdf');
const badDebtRepository = require('../../../CronScheduler/BadDebtRepository');
var badDebtsService = require('../../../CronScheduler/BadDebtsService')
var Constdata = require('../../../config/Constants')


let updateBadDeptStatus = async (req, res) => {
    try {

        let invoiceDetails = req.body;
        let status = invoiceDetails.status;
        let invoiceNo = invoiceDetails.invoiceNo;
        let userData = req.userData;
        console.log("testinvoiceNo \n" + invoiceNo)
        console.log("statusstatusstatus ==> " + status)
        let resultCurrentYearInvoices = '';

        if (Number(status) === 10) {
            resultCurrentYearInvoices = await UpdateBadDeptStatus.UpdateBadDeptStatus(invoiceNo, status, userData);
            console.log("into status");
            let InvoiceMAsterpdf = await invoiceDetailsdata.InvoiceMasterdetails(invoiceNo)
            console.log("InvoiceMAsterpdf " + JSON.stringify(InvoiceMAsterpdf[0].Modified_by))



            let data = await sirimUtils.convertArrayToQuteString(invoiceNo.split(","))
            console.log("----mm---" + JSON.stringify(data));

            let OEname = await invoiceDetailsdata.getOEName(data);
            let HeadName = await invoiceDetailsdata.getHeadName(data);
            let SC = await invoiceDetailsdata.getSCData(data)

            console.log("Oename" + JSON.stringify(OEname))
            console.log("Headname" + JSON.stringify(HeadName))
            console.log("ss----------" + JSON.stringify(SC));



            let creditPdf = await creditNotePdf.generateCreditformPDF(req, res, InvoiceMAsterpdf, SC, OEname, HeadName)
            console.log("creditPdf>>" + creditPdf.filepath)
            console.log("InvoiceMAsterpdf.Customer" + InvoiceMAsterpdf[0].Modified_by);

            let created_by_email_id = await invoiceDetailsdata.get_createdby_emailid(InvoiceMAsterpdf[0].Modified_by)
            let FinanceEmail = await newCustomerRegistrationLogic.getAdminDetails('Finance')
            console.log("FinanceEmail \n" + JSON.stringify(FinanceEmail))
            console.log("created_by_email_id " + JSON.stringify(created_by_email_id))
            let Path = creditPdf.filepath

            let clerkUsername = await invoiceDetailsdata.getSectionClerkUsernameByRemainder(invoiceNo, 'SC Rise Cancel Invoice');
            let clerkEMailId = ''
            if (clerkUsername != null && clerkUsername.length > 0) {
                clerkEMailId = await invoiceDetailsdata.getSectionClerkEmailidByusername(clerkUsername[0].Created_by);
            }
            console.log(JSON.stringify(clerkEMailId))
            // let OEUsername = await invoiceDetailsdata.getSectionClerkUsernameByRemainder(invoiceNo, 'Operation Executive Approved Cancel Invoice');

            // if (OEUsername != null && OEUsername.length > 0) {
            // OEEMailId = await invoiceDetailsdata.getSectionClerkEmailidByusername(OEUsername[0].Created_by);
            // }
            let OEEMailId = ''
            OEEMailId = await invoiceDetailsdata.getInternalUserEmailidByRole('Operation Executive');
            let temp = [];
            for (let index = 0; index < OEEMailId.length; index++) {
                const element = OEEMailId[index];
                temp.push(element.EmailAddr)
            }
            if (clerkEMailId != null && clerkEMailId != '' && clerkEMailId.length > 0) {
                temp.push(clerkEMailId[0].EmailAddr)
            }
            // temp.push('kathiravanmca2014@gmail.com')
            // temp.push('karthik.c@accordinnovations.com')
            var OERmailds = temp.toString()

            console.log("OEEMailId Operation Executive \n" + JSON.stringify(OERmailds))
            let mail = await sendmail.sendmail(Constdata.From_Mail, Constdata.credit_Note_Text, InvoiceMAsterpdf[0].Customer_name,
                InvoiceMAsterpdf[0].User_name, Path, creditPdf.filename, '', OERmailds)
            console.log("mail 10" + JSON.stringify(mail))
        } else if (Number(status) === 9) {
            let InvoiceMAsterpdfLength = await invoiceDetailsdata.checkCurrentAndPrevYearInvoice(invoiceNo)
            console.log("InvoiceMAsterpdf.length\n" + JSON.stringify(InvoiceMAsterpdfLength))
            if (InvoiceMAsterpdfLength && InvoiceMAsterpdfLength != null && InvoiceMAsterpdfLength.length > 0) {
                console.log("testtesttesttes")
                resultCurrentYearInvoices = await UpdateBadDeptStatus.UpdateBadDeptStatus(invoiceNo, status, userData);
            } else {
                let InvoiceMAsterpdf = await invoiceDetailsdata.InvoiceMasterdetails(invoiceNo)
                resultCurrentYearInvoices = await UpdateBadDeptStatus.UpdateBadDeptStatusByHead(invoiceNo, status, userData);
                console.log("into status");
                // let InvoiceMAsterpdf = await invoiceDetailsdata.InvoiceMasterdetails(invoiceNo)
                console.log("InvoiceMAsterpdf " + JSON.stringify(InvoiceMAsterpdf[0].Modified_by))
                let data = await sirimUtils.convertArrayToQuteString(invoiceNo.split(","))
                let OEname = await invoiceDetailsdata.getOEName(data);
                let HeadName = []
                let SC = await invoiceDetailsdata.getSCData(data)

                console.log("Oename" + JSON.stringify(OEname))
                console.log("Headname" + JSON.stringify(HeadName))
                console.log("ss----------" + JSON.stringify(SC));

                let creditPdf = await creditNotePdf.generateCreditformPDF(req, res, InvoiceMAsterpdf, SC, OEname, HeadName)

                console.log("creditPdf>>" + creditPdf.filepath)
                console.log("InvoiceMAsterpdf.Customer" + InvoiceMAsterpdf[0].Modified_by);
                let created_by_email_id = await invoiceDetailsdata.get_createdby_emailid(InvoiceMAsterpdf[0].Modified_by)
                let FinanceEmail = await newCustomerRegistrationLogic.getAdminDetails('Finance')
                console.log("FinanceEmail \n" + JSON.stringify(FinanceEmail))
                console.log("created_by_email_id " + JSON.stringify(created_by_email_id))
                let Path = creditPdf.filepath

                let clerkUsername = await invoiceDetailsdata.getSectionClerkUsernameByRemainder(invoiceNo, 'SC Rise Cancel Invoice');
                let clerkEMailId = ''
                if (clerkUsername != null && clerkUsername.length > 0) {
                    clerkEMailId = await invoiceDetailsdata.getSectionClerkEmailidByusername(clerkUsername[0].Created_by);
                }
                // let OEUsername = await invoiceDetailsdata.getSectionClerkUsernameByRemainder(invoiceNo, 'Operation Executive Approved Cancel Invoice');
                // let OEEMailId = ''
                // if (OEUsername != null && OEUsername.length > 0) {
                //     OEEMailId = await invoiceDetailsdata.getSectionClerkEmailidByusername(OEUsername[0].Created_by);
                // }
                let OEEMailId = ''
                OEEMailId = await invoiceDetailsdata.getInternalUserEmailidByRole('Operation Executive');
                let temp = [];
                for (let index = 0; index < OEEMailId.length; index++) {
                    const element = OEEMailId[index];
                    temp.push(element.EmailAddr)
                }
                if (clerkEMailId != null && clerkEMailId != '' && clerkEMailId.length > 0) {
                    temp.push(clerkEMailId[0].EmailAddr)
                }
                // temp.push('kathiravanmca2014@gmail.com')
                // temp.push('karthik.c@accordinnovations.com')
                var OERmailds = temp.toString()

                let mail = await sendmail.sendmail(Constdata.From_Mail, Constdata.credit_Note_Text, InvoiceMAsterpdf[0].Customer_name, InvoiceMAsterpdf[0].User_name, Path, creditPdf.filename, '', OERmailds)
                console.log("mail 10" + JSON.stringify(mail))

            }
        } else {
            resultCurrentYearInvoices = await UpdateBadDeptStatus.UpdateBadDeptStatus(invoiceNo, status, userData);
            if (Number(status) === 8) {
                let freshInvoiceListResponce = await invoiceDetailsdata.InvoiceMasterdetails(invoiceNo)
                // let pdfResponce = await lodPdf.GenerateLODPdf(freshInvoiceListResponce);
                let pdfResponce = await DebtPdf.pdfgenerate(freshInvoiceListResponce);
                let mailResponce = await badDebtsService.sendMailToOELOD(freshInvoiceListResponce, pdfResponce.filePath, pdfResponce.fileName, userData);
                console.log(JSON.stringify(mailResponce))

            }
        }


        let RemainderName = ''
        if (Number(status) === 7) {
            RemainderName = 'SC Rise Cancel Invoice'
        } else if (Number(status) === 8) {
            RemainderName = 'Operation Executive Approved Cancel Invoice'
        } else if (Number(status) === 9) {
            RemainderName = 'Head Approved Cancel Invoice'
        } else if (Number(status) === 10) {
            RemainderName = 'General Manager Approved Cancel Invoice'
        } else if (Number(status) === 6) {
            RemainderName = 'Reject Cancel Invoice'
        } else {
            RemainderName = 'Invoice Canceled'
        }
        let username = userData.username;
        console.log("RemainderNameRemainderNameRemainderName ==> " + RemainderName)
        let freshInvoiceListResponce = await invoiceDetailsdata.InvoiceMasterdetails(invoiceNo)
        for (let index = 0; index < freshInvoiceListResponce.length; index++) {
            const invoice = freshInvoiceListResponce[index];
            let insertResponse = await badDebtRepository.insertBadDebtHistory(invoice, RemainderName, RemainderName, username);
            console.log("insertResponse " + JSON.stringify(insertResponse));
        }

        return res.json(new responseDto(constants.STATUS_SUCCESS, '', resultCurrentYearInvoices));

    } catch (err) {
        console.log(err);
        return res.json(new responseDto('', constants.STATUS_FAIL, err));
    }
}

module.exports = {
    updateBadDeptStatus
}