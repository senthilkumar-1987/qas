const mainDb = require('../MainDb');


var paymentconstants = require('../../config/PaymentConstants');
const mailTransporter = require('../../config/mail-config')

const MessageFormat = require('messageformat');
const mf = new MessageFormat('en');
var fs = require('fs');













exports.Get_Invoice_Seq_Value = () => {



    return new Promise((resolve, reject) => {

        let query = `EXEC INVLASTUSEDNO 'invoice'  `

        mainDb.GetQueryData(query, (error, data) => {

            if (error) {

                return reject(`${error}, ${query}`)

            }
            //console.log(data)
            let sequenceNo = data[0].seqNo;

            return resolve(sequenceNo)

        })

    })



}




exports.GENERATE_INVOICE = (QuotationDetails, invoiceNo) => {

    // console.log(QuotationDetails);
    return new Promise((resolve, reject) => {
        let query = `INSERT INTO TBL_SIRIM_INVOICE(Quotation_No,Company_Name,File_No,Process_Name,Costing_Desc,Total_Amt,Currency,Created_date,Created_By,Modified_Date,Modified_By,Invoice_Generate_Date,Job_No,Id_No,Audit_Fee,License_No,Apply_Date,Completion_Date,status,bill_to,remarks,email,userName,INVOICE_NO,SCHEME,cust_no,mode_of_payment)
        
        VALUES('${QuotationDetails.QuotationId}','${QuotationDetails.companyName}','${QuotationDetails.fileNo}','${QuotationDetails.companyName}','${QuotationDetails.costingDesc}',${QuotationDetails.total},'${QuotationDetails.currency}',getdate(),'${QuotationDetails.createdBy}',null,'',CONVERT(date,getdate()),'${QuotationDetails.jobNo}','',${QuotationDetails.total},'','',null,'Generated','${QuotationDetails.to}','${QuotationDetails.remarks}','${QuotationDetails.to}','${QuotationDetails.email}','${invoiceNo}','','','')`


        //console.log(query);
        mainDb.GetQueryData(query, (error, data) => {
            if (error) {
                return reject(`${error}, ${query}`)
            }

            return resolve(data)
        })
    })
}



exports.Generate_Invoice_No = (qutationNo, invoiceNo, transactionAmount) => {
    // console.log("szdf "+qutationNo)
    return new Promise((resolve, reject) => {
        let query = `UPDATE TBL_SIRIM_INVOICE_Master set Invoice_no='${invoiceNo}',transaction_amount='${transactionAmount}' WHERE Quotation_no='${qutationNo}'  `
        // console.log(query);
        mainDb.GetQueryData(query, (error, data) => {
            if (error) {
                return reject(`${error}, ${query}`)
            }
            // console.log(data)

            return resolve(data)
        })
    })
}




exports.update_costing_tbl = async (QuotationDetails) => {

    return new Promise((resolve, reject) => {
        let query = ` update tbl_costing set Status=2 where costId='${QuotationDetails.costId}'`



        //       console.log(query);
        mainDb.InsertandReturnID(query, (error, data) => {
            if (error) {
                return reject(`${error}, ${query}`)
            }

            return resolve(data)
        })
    })
}



exports.MAIL_NOTIFICATION_FOR_CUSTOMER_INVOICE_INFO = async (invoiceDetails) => {
    //console.log(invoiceDetails);
    // var s=   fs.writeFile(doc);

    // This string is perfectly ok to use as an attachment to the mandrillAPI
    //  sendMandrillEmailWithAttachment(pdfBase64String);

    // var mail = invoiceDetails.email;
    // console.log("sajdfhgj")
    var companyName = 'sirim';
    var reqEmail = "karthik.c@fasoftwares.com";
    var userName = 'karthik';

    var mailTextContent = mf.compile(paymentconstants.MAIL_NOTIFICATION_INVOICE_INFO);
    mailTextContent = mailTextContent({ contactName: userName })




    var path = companyName + '.pdf'
    var mailOptions = {
        from: 'escistest@sirim.my',
        to: reqEmail,
        subject: 'eSCIS Customer Portal: Invoice Generated ',
        html: mailTextContent,
        attachments: [{
            filename: 'invoice.pdf',
            path: path,
            //  files     : [{filename: 'Report.pdf', content: file}],
            contentType: 'application/pdf'
        }],
    };

    return new Promise((resolve, reject) => {
        mailTransporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return reject(`${error}, ${error}`)
            }
            if (info) {
                fs.unlinkSync(companyName + '.pdf')
            }
            return resolve(paymentconstants.STATUS_SUCCESS);

        })

        //    
        //
    })

};
