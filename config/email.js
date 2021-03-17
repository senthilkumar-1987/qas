const mailTransporter = require('./mail-config')
const MessageFormat = require('messageformat');
const mf = new MessageFormat('en');
const Constantdata = require('./Constants')


exports.sendmail = async (Sender_email_id, textdata, customerName_data, To_mail_id, Path, Name, cc_Clerk_Name, cc_OE_Name) => {
    console.log("--------mail started-----")
    console.log("Sender_email_id " + Sender_email_id)
    console.log("textdata " + textdata)
    console.log("customerName_data " + customerName_data)
    console.log("To_mail_id " + To_mail_id)
    console.log("Path " + Path)
    console.log("Name " + Name)
    console.log("cc_Clerk_Name " + cc_Clerk_Name)


    const TEXT = textdata;
    var sendermail_id = Sender_email_id;
    var customerName = customerName_data;
    var reqEmail = To_mail_id;
    var ccEmailid = cc_Clerk_Name + "," + cc_OE_Name
    // console.log(cc_Clerk_Name + "," + cc_OE_Name + "\n ccEmailidccEmailidccEmailid " + ccEmailid)
    var mailTextContent = mf.compile(textdata);
    mailTextContent = mailTextContent({ CUSTOMERNAME: customerName })
    var mailOptions = {
        from: sendermail_id,
        to: cc_OE_Name,
        // cc: ccEmailid,
        subject: 'eSCIS Portal: Invoice Cancellation ',
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
}