const badDebtRepository = require('./BadDebtRepository')
var badDebtsService = require('../CronScheduler/BadDebtsService')
var dateFormat = require('dateformat');
const remainderFirstPdfGeneration = require('./RemainderFirstPdfGeneration');
const constants = require('../config/Constants');
const lodPdf = require('./LODPdf');
const DebtPdf = require('./DebtPdf');
// var x = { };
var moment = require('moment');

exports.BadDebtScheduler = async (date) => {

    try {
        // this.Pdfgenerate();
        let remaindersList = [];
        remaindersList = await badDebtRepository.remaindersList();
        console.log("remaindersList length " + JSON.stringify(remaindersList.length))
        if (remaindersList && remaindersList != null) {
            for (let index = 0; index < remaindersList.length; index++) {
                let freshInvoiceListResponce = [];
                const responceRemainder = remaindersList[index];
                var numberOfdays = responceRemainder.Period;
                var reminderName = responceRemainder.Reminder;
                var reminderDescription = responceRemainder.Reminder_Description;
                // console.log("\n");
                console.log("numberOfdays :: " + numberOfdays)
                console.log("reminderName :: " + reminderName)
                var date = new Date();
                console.log("Current Date :: " + dateFormat(date, "yyyy-mm-dd hh:mm:ss"))
                date.setDate(date.getDate() - numberOfdays);
                var fromDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
                console.log("From Date :: " + dateFormat(fromDate, "yyyy-mm-dd 00:00:00"));
                var toDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);
                console.log("To Date :: " + dateFormat(toDate, "yyyy-mm-dd 23:59:59"));
                freshInvoiceListResponce = await badDebtRepository.freshInvoiveList(dateFormat(fromDate, "yyyy-mm-dd 00:00:00"), dateFormat(toDate, "yyyy-mm-dd 23:59:59"));
                console.log("FreshInvoice length :: " + JSON.stringify(freshInvoiceListResponce) + "\n")

                // let badDebtResponce = '';
                let badDebtMailResponce = '';
                if (freshInvoiceListResponce != null) {
                    if (reminderName == 'Credit Term') {
                        await badDebtsService.ThirtyDays(freshInvoiceListResponce, reminderDescription, reminderName);
                    } else if (reminderName == 'Reminder 1') {
                        await badDebtsService.FortyFiveDays(freshInvoiceListResponce, reminderDescription, reminderName);
                        let invoiceDtailsCustomerId = await badDebtRepository.getDistinctCustomerId(dateFormat(fromDate, "yyyy-mm-dd 00:00:00"), dateFormat(toDate, "yyyy-mm-dd 23:59:59"));
                        let invoiceDtailss = []
                        invoiceDtailss = await badDebtRepository.getIncoiveListWhereCustId(invoiceDtailsCustomerId[0].Customer_id, dateFormat(fromDate, "yyyy-mm-dd 00:00:00"), dateFormat(toDate, "yyyy-mm-dd 23:59:59"));
                        // console.log("invoiceDtails " + JSON.stringify(invoiceDtailss))
                        let pdfResponce = await remainderFirstPdfGeneration.pdfgenerateRemainderFirst(invoiceDtailss);
                        // console.log("pdfResponce fileName " + pdfResponce.fileName)
                        // console.log("pdfResponce filePath " + pdfResponce.filePath)
                        let mailResponce = await badDebtsService.sendMailToCustomerFirstRemainder(invoiceDtailss, pdfResponce.filePath, pdfResponce.fileName);
                        console.log("mailResponce " + JSON.stringify(mailResponce))


                        for (let index = 0; index < invoiceDtailsCustomerId.length; index++) {
                            const element = invoiceDtailsCustomerId[index];
                            let updateEmailResponse = await badDebtRepository.updateBadDebtHistoryEmailStatus(element, reminderDescription, constants.STATUS_ONE);
                        }

                    } else if (reminderName == 'Reminder 2') {
                        await badDebtsService.SixtyDays(freshInvoiceListResponce, reminderDescription, reminderName);


                    } else if (reminderName == 'Bad Debt') {
                        await badDebtsService.SeventyFiveDays(freshInvoiceListResponce, reminderDescription, reminderName);
                        let invoiceDtailsCustomerId = await badDebtRepository.getDistinctCustomerId(dateFormat(fromDate, "yyyy-mm-dd 00:00:00"), dateFormat(toDate, "yyyy-mm-dd 23:59:59"));
                        console.log("invoiceDtailsCustomerId length " + JSON.stringify(invoiceDtailsCustomerId.length))
                        let invoiceDtailss = []
                        invoiceDtailss = await badDebtRepository.getIncoiveListWhereCustId(invoiceDtailsCustomerId[0].Customer_id, dateFormat(fromDate, "yyyy-mm-dd 00:00:00"), dateFormat(toDate, "yyyy-mm-dd 23:59:59"));
                        // console.log("invoiceDtails " + JSON.stringify(invoiceDtailss))
                        let pdfResponce = await remainderFirstPdfGeneration.pdfgenerateRemainderSecend(invoiceDtailss);
                        // console.log("pdfResponce fileName " + pdfResponce.fileName)
                        // console.log("pdfResponce filePath " + pdfResponce.filePath)
                        let mailResponce = await badDebtsService.sendMailToCustomerSecnedRemainder(invoiceDtailss, pdfResponce.filePath, pdfResponce.fileName);
                        console.log("mailResponce " + JSON.stringify(mailResponce))
                        for (let index = 0; index < invoiceDtailsCustomerId.length; index++) {
                            const element = invoiceDtailsCustomerId[index];
                            let updateEmailResponse = await badDebtRepository.updateBadDebtHistoryEmailStatus(element, reminderDescription, constants.STATUS_ONE);
                        }
                    } else if (reminderName == 'LOD') {
                        await badDebtsService.OneTwentyDays(freshInvoiceListResponce, reminderDescription, reminderName);
                        // let pdfResponce = await lodPdf.GenerateLODPdf(freshInvoiceListResponce);
                        // let mailResponce = await badDebtsService.sendMailToSection(freshInvoiceListResponce, pdfResponce.filePath, pdfResponce.fileName);

                        for (let index = 0; index < freshInvoiceListResponce.length; index++) {
                            const element = freshInvoiceListResponce[index];
                            let updateEmailResponse = await badDebtRepository.updateBadDebtHistoryEmailStatus(element, reminderDescription, constants.STATUS_ONE);
                        }
                    } else if (reminderName == 'Debt Collector') {
                        await badDebtsService.ThreeSixtyFiveDays(freshInvoiceListResponce, reminderDescription, reminderName);
                        let pdfResponce = await lodPdf.GenerateLODPdf(freshInvoiceListResponce);
                        let mailResponce = await badDebtsService.sendMailToSection(freshInvoiceListResponce, pdfResponce.filePath, pdfResponce.fileName);
                        console.log(JSON.stringify(mailResponce))
                        for (let index = 0; index < freshInvoiceListResponce.length; index++) {
                            const element = freshInvoiceListResponce[index];
                            let updateEmailResponse = await badDebtRepository.updateBadDebtHistoryEmailStatus(element, reminderDescription, constants.STATUS_ONE);
                        }

                    } else if (reminderName == 'Auto Cancel Invoice') {
                        await badDebtsService.FiveFortyFiveDays(freshInvoiceListResponce, reminderDescription, reminderName);
                    } else {
                        console.log("Bad Debt Remainder List is Empty \nDate " + dateFormat(new Date(), "yyyy-mm-dd hh:mm:ss"))
                    }
                } else {
                    console.log("Invoice Master List is Empty \nDate " + dateFormat(new Date(), "yyyy-mm-dd hh:mm:ss"))
                }
            }
        }
    } catch (error) {
        console.log(error)
    } finally {
        console.log("End BadDebtScheduler")
    }

}

exports.dateFormater = async (date) => {
    try {
        return dateFormat(date, "yyyy-mm-dd 00:00:00");
    } catch (error) {
        console.log("ERROR : " + error);
    }
}


exports.Pdfgenerate = async () => {

    try {
        console.log("Called Pdfgenerate Method")
        // let resObj = await badDebtsService.pdfGenerateService();
        //   let resObj = await RemainderFirstPdfGeneration.generateInvoicePDFService();
        let resObj = await remainderFirstPdfGeneration.pdfgenerateRemainderFirst();
        //res.writeHead(200, {
        //"Content-Type": "application/pdf",
        //"Content-disposition": "attachment; filename=test.pdf"
        //});
        console.log('-FileName- ' + resObj.fileName);
        console.log('-FilePath- ' + resObj.filePath);

        // resObj.pipe(res);
    } catch (error) {
        console.log("ERROR : " + error);
    }
}



 // better would be to have module create an object
/* function Daysss30(){
   console.log("ThirtyDays")
} */