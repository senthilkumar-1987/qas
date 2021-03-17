const badDebtRepository = require('./BadDebtRepository');
const constants = require('../config/Constants');
const remainderFirstPdfGeneration = require('./RemainderFirstPdfGeneration');
const mailTransporter = require('../config/mail-config')
let invoiceDetailsdata = require('../repositories/PaymentRepository/Customers/ViewInvoices');
const MessageFormat = require('messageformat');
const mf = new MessageFormat('en');
const CUSTOMER_FIRST_TEXT = '<h3>Dear Customer {CUSTOMERNAME},</h3><br><p>FIRST REMAINDER</p><br></p><br><p>Thanks,<br><b>eSCIS Customer Portal</b></p>';
const CUSTOMER_SECEND_TEXT = '<h3>Dear Customer {CUSTOMERNAME},</h3><br><p>SECEND REMAINDER</p><br></p><br><p>Thanks,<br><b>eSCIS Customer Portal</b></p>';

/* x.Daysss30 = function()
{
    console.log('Call me as a string!');
} */

exports.ThirtyDays = async (data, reminderDescription, reminderName) => {
    console.log(reminderDescription + " " + data.length);
    try {
        for (let index = 0; index < data.length; index++) {
            const invoice = data[index];
            console.log("\nindex " + index + " " + invoice.Customer_id);
            let updateResponse = await badDebtRepository.updateBadDebtStatus(invoice.Customer_id, invoice.Id, constants.STATUS_ONE);
            console.log("updateResponse " + JSON.stringify(updateResponse));
            let insertResponse = await badDebtRepository.insertBadDebtHistory(invoice, reminderDescription, reminderName, 'System Inserted');
            console.log("insertResponse " + JSON.stringify(insertResponse));
        }
    } catch (error) {
        console.log(error)
    } finally {
        console.log("End ThirtyDays")
    }
}

exports.FortyFiveDays = async (data, reminderDescription, reminderName) => {
    console.log(reminderDescription + " " + data.length);
    try {
        for (let index = 0; index < data.length; index++) {
            const invoice = data[index];
            // console.log("\nindex " + index + " " + invoice.Customer_id);

            let updateResponse = await badDebtRepository.updateBadDebtStatus(invoice.Customer_id, invoice.Id, constants.STATUS_TWO);
            console.log("updateResponse " + JSON.stringify(updateResponse));
            let insertResponse = await badDebtRepository.insertBadDebtHistory(invoice, reminderDescription, reminderName, 'System Inserted');
            console.log("insertResponse " + JSON.stringify(insertResponse));

        }




    } catch (error) {
        console.log(error)
    } finally {
        console.log("End FortyFiveDays")
    }
}

exports.SixtyDays = async (data, reminderDescription, reminderName) => {
    console.log(reminderDescription + " " + data.length);
    try {
        for (let index = 0; index < data.length; index++) {
            const invoice = data[index];
            console.log("\nindex " + index + " " + invoice.Customer_id);
            let updateResponse = await badDebtRepository.updateBadDebtStatus(invoice.Customer_id, invoice.Id, constants.STATUS_THREE);
            console.log("updateResponse " + JSON.stringify(updateResponse));
            let insertResponse = await badDebtRepository.insertBadDebtHistory(invoice, reminderDescription, reminderName, 'System Inserted');
            console.log("insertResponse " + JSON.stringify(insertResponse));
        }
    } catch (error) {
        console.log(error)
    } finally {
        console.log("End SixtyDays")
    }

}

exports.SeventyFiveDays = async (data, reminderDescription, reminderName) => {
    console.log(reminderDescription + " " + data.length);
    try {
        for (let index = 0; index < data.length; index++) {
            const invoice = data[index];
            console.log("\n Customer_id " + index + " " + invoice.Customer_id);
            console.log("\n invoice_no " + index + " " + invoice.invoice_no);
            let updateResponse = await badDebtRepository.updateBadDebtStatus(invoice.Customer_id, invoice.Id, constants.STATUS_FOUR);
            console.log("updateResponse " + JSON.stringify(updateResponse));
            let insertResponse = await badDebtRepository.insertBadDebtHistory(invoice, reminderDescription, reminderName, 'System Inserted');
            console.log("insertResponse " + JSON.stringify(insertResponse));
        }
    } catch (error) {
        console.log(error)
    } finally {
        console.log("End SeventyFiveDays")
    }
}

exports.OneTwentyDays = async (data, reminderDescription, reminderName) => {
    console.log(reminderDescription + " " + data.length);
    try {
        for (let index = 0; index < data.length; index++) {
            const invoice = data[index];
            console.log("\nindex " + index + " " + invoice.Customer_id);
            let updateResponse = await badDebtRepository.updateBadDebtStatus(invoice.Customer_id, invoice.Id, constants.STATUS_FIVE);
            console.log("updateResponse " + JSON.stringify(updateResponse));
            let insertResponse = await badDebtRepository.insertBadDebtHistory(invoice, reminderDescription, reminderName, 'System Inserted');
            console.log("insertResponse " + JSON.stringify(insertResponse));
        }
    } catch (error) {
        console.log(error)
    } finally {
        console.log("End OneTwentyDays")
    }

}

exports.ThreeSixtyFiveDays = async (data, reminderDescription, reminderName) => {
    console.log(reminderDescription + " " + data.length);
    try {
        for (let index = 0; index < data.length; index++) {
            const invoice = data[index];
            console.log("\nindex " + index + " " + invoice.Customer_id);
            let updateResponse = await badDebtRepository.updateBadDebtStatus(invoice.Customer_id, invoice.Id, constants.STATUS_SIX);
            console.log("updateResponse " + JSON.stringify(updateResponse));
            let insertResponse = await badDebtRepository.insertBadDebtHistory(invoice, reminderDescription, reminderName, 'System Inserted');
            console.log("insertResponse " + JSON.stringify(insertResponse));
        }
    } catch (error) {
        console.log(error)
    } finally {
        console.log("End ThreeSixtyFiveDays")
    }

}

exports.FiveFortyFiveDays = async (data, reminderDescription, reminderName) => {
    console.log(reminderDescription + " " + data.length);
    try {
        for (let index = 0; index < data.length; index++) {
            const invoice = data[index];
            console.log("\nindex " + index + " " + invoice.Customer_id);
            let updateResponse = await badDebtRepository.updateBadDebtStatus(invoice.Customer_id, invoice.Id, constants.STATUS_SEVEN);
            console.log("updateResponse " + JSON.stringify(updateResponse));
            let insertResponse = await badDebtRepository.insertBadDebtHistory(invoice, reminderDescription, reminderName, 'System Inserted');
            console.log("insertResponse " + JSON.stringify(insertResponse));
        }
    } catch (error) {
        console.log(error)
    } finally {
        console.log("End FiveFortyFiveDays")
    }

}

exports.sendMailToCustomerFirstRemainder = async (invoiceDetails, Path, Name) => {

    var SectionEmail = await badDebtRepository.getSectionEmails(invoiceDetails[0].SecId);
    let temp = [];
    for (let index = 0; index < SectionEmail.length; index++) {
        const element = SectionEmail[index];
        temp.push(element.EmailAddr)
    }
    var FinanceEmail = await badDebtRepository.getFinanceEmails('Finance');

    for (let index = 0; index < FinanceEmail.length; index++) {
        const element = FinanceEmail[index];
        temp.push(element.EmailAddr)
    }
    var ccEmailid = temp.toString()
    var companyName = invoiceDetails[0].Company_name;
    var reqEmail = invoiceDetails[0].User_name;
    var customerName = ""
    let contactname = await badDebtRepository.getcontact_person(invoiceDetails[0].User_name).catch((e) => {
        console.log(e);
    });
    if (contactname !== null && contactname.length > 0) {

        customerName = contactname[0].contact_person_name
        console.log("first Remainder")
        console.log("sendMailToCustomerFirstRemainder if" + customerName)

    } else {
        customerName = invoiceDetails[0].Customer_name
        console.log("sendMailToCustomerFirstRemainder else" + customerName)

    }
    console.log('Mail ' + reqEmail)
    var mailTextContent = mf.compile(constants.CUSTOMER_FIRST_TEXT_BAD_DEBT);
    mailTextContent = mailTextContent({ CUSTOMERNAME: customerName })

    var mailOptions = {
        from: constants.From_Mail,
        to: reqEmail,
        cc: ccEmailid,
        subject: 'eSCIS Portal: Outstanding Payment - 1st Reminder  ',
        html: mailTextContent,
        attachments: [{
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

exports.sendMailToCustomerSecnedRemainder = async (invoiceDetails, Path, Name) => {

    var SectionEmail = await badDebtRepository.getSectionEmails(invoiceDetails[0].SecId);
    let temp = [];
    for (let index = 0; index < SectionEmail.length; index++) {
        const element = SectionEmail[index];
        temp.push(element.EmailAddr)
    }
    var FinanceEmail = await badDebtRepository.getFinanceEmails('Finance');

    for (let index = 0; index < FinanceEmail.length; index++) {
        const element = FinanceEmail[index];
        temp.push(element.EmailAddr)
    }
    var ccEmailid = temp.toString()
    var companyName = invoiceDetails[0].Company_name;
    var reqEmail = invoiceDetails[0].User_name;

    var customerName = ""
    let contactname = await badDebtRepository.getcontact_person(invoiceDetails[0].User_name).catch((e) => {
        console.log(e);
    });
    if (contactname !== null && contactname.length > 0) {

        customerName = contactname[0].contact_person_name
        console.log("secend Remainder")

    } else {
        customerName = invoiceDetails[0].Customer_name

    }
    var mailTextContent = mf.compile(constants.CUSTOMER_FIRST_TEXT_BAD_DEBT);
    mailTextContent = mailTextContent({ CUSTOMERNAME: customerName, COMPANY_NAME: companyName })

    var mailOptions = {
        from: constants.From_Mail,
        to: reqEmail,
        cc: ccEmailid,
        subject: 'eSCIS Customer Portal: Outstanding Payment - 2nd Reminder ',
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

exports.sendMailToSection = async (invoiceDetails, Path, Name) => {

    var SectionEmail = await badDebtRepository.getSectionEmails(invoiceDetails[0].SecId);
    let temp = [];
    for (let index = 0; index < SectionEmail.length; index++) {
        const element = SectionEmail[index];
        // temp.push(element.EmailAddr)
    }
    // var FinanceEmail = await badDebtRepository.getFinanceEmails('Finance');
    // for (let index = 0; index < FinanceEmail.length; index++) {
    //     const element = FinanceEmail[index];
    //     temp.push(element.EmailAddr)
    // }

    let OEEMailId = ''
    OEEMailId = await invoiceDetailsdata.getInternalUserEmailidByRole('Operation Executive');
    for (let index = 0; index < OEEMailId.length; index++) {
        const element = OEEMailId[index];
        temp.push(element.EmailAddr)
    }
    // temp.push('kathiravan.d@fasoftwares.com')
    // temp.push('karthik.c@accordinnovations.com')

    var ccEmailid = temp.toString()
    var companyName = invoiceDetails[0].Company_name;
    // var reqEmail = invoiceDetails[0].User_name;

    var customerName = ""
    // let contactname = await badDebtRepository.getcontact_person(invoiceDetails[0].User_name).catch((e) => {
    //     console.log(e);
    // });
    // if (contactname !== null && contactname.length > 0) {

    //     customerName = contactname[0].contact_person_name
    //     console.log("secend Remainder")

    // } else {
    //     customerName = invoiceDetails[0].Customer_name

    // }
    var mailTextContent = mf.compile(constants.CUSTOMER_FIRST_TEXT_DEBT);
    mailTextContent = mailTextContent({ CUSTOMERNAME: '', COMPANY_NAME: '' })

    var mailOptions = {
        from: constants.From_Mail,
        to: ccEmailid,
        // to: 'narysma@gmail.com,karthik.c@accordinnovationcom,kathiravanmca2014@gmail.com',
        // cc: ccEmailid,
        subject: 'eSCIS Customer Portal: List of Debt Collector (' + companyName + ')',
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

exports.pdfGenerateService = async () => {
    console.log("pdfGenerateService");
    let responce = await remainderFirstPdfGeneration.generateInvoicePDFService();
    return responce;
}


exports.sendMailToOELOD = async (invoiceDetails, Path, Name, userdata) => {

    // var SectionEmail = await badDebtRepository.getSectionEmails(invoiceDetails[0].SecId);
    // let temp = [];
    // for (let index = 0; index < SectionEmail.length; index++) {
    //     const element = SectionEmail[index];
    //     temp.push(element.EmailAddr)
    // }
    // var FinanceEmail = await badDebtRepository.getFinanceEmails('Finance');

    // for (let index = 0; index < FinanceEmail.length; index++) {
    //     const element = FinanceEmail[index];
    //     temp.push(element.EmailAddr)
    // }

    // var ccEmailid = temp.toString()

    var companyName = invoiceDetails[0].Company_name;
    var reqEmail = userdata.email//invoiceDetails[0].User_name;
    console.log("reqEmailreqEmailreqEmailreqEmail \n" + reqEmail)
    // var customerName = "All"
    // let contactname = await badDebtRepository.getcontact_person(invoiceDetails[0].User_name).catch((e) => {
    //     console.log(e);
    // });
    // if (contactname !== null && contactname.length > 0) {
    //     customerName = contactname[0].contact_person_name
    //     console.log("secend Remainder")
    // } else {
    //     customerName = invoiceDetails[0].Customer_name
    // }
    var mailTextContent = mf.compile(constants.CUSTOMER_FIRST_TEXT_LOD);
    mailTextContent = mailTextContent({ CUSTOMERNAME: userdata.contactPerson, COMPANY_NAME: companyName })

    var mailOptions = {
        from: constants.From_Mail,
        to: reqEmail,
        // cc: 'kathiravanmca2014@gmail.com,karthik.c@accordinnovations.com',
        // to: 'kathiravan.d@fasoftwares.com',temp.push('kathiravanmca2014@gmail.com')
        subject: 'eSCIS Customer Portal: Letter of Demand (' + companyName + ')',
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
