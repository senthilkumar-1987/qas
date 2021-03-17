const mainDb = require('../MainDb');

exports.Get_Customer_Enquiry_Seq_Value = () => {

    return new Promise((resolve, reject) => {
        let query = `SELECT NEXT VALUE FOR ENQUIRY_ID_SEQ  as seqNo`
        mainDb.GetQueryData(query, (error, data) => {
            if (error) {
                return reject(`${error}, ${query}`)
            }


            let sequenceNo = data[0].seqNo;
            seqNo = "ENQ" + sequenceNo;

            return resolve(seqNo)
        })
    })

}
exports.Get_Customer_Message_Seq_Value = () => {

    return new Promise((resolve, reject) => {
        let query = `SELECT NEXT VALUE FOR MESSAGE_ID_SEQ  as seqNo`
        mainDb.GetQueryData(query, (error, data) => {
            if (error) {
                return reject(`${error}, ${query}`)
            }


            let sequenceNo = data[0].seqNo;
            seqNo = "MSG" + sequenceNo;


            return resolve(seqNo)
        })
    })

}
// Existing Service
/* exports.Get_Message_Details_ByMsgId = (messageId) => {
    //console.log(messageId);
    return new Promise((resolve, reject) => {
        let query = `SELECT * FROM  TBL_SIRIM_CUSTOMERS_MSG ENQ LEFT JOIN tbl_sirim_msg_reply REPLY ON ENQ.ENQUIRY_ID = REPLY.ENQUIRY_ID WHERE ENQ.MESSAGE_ID='${messageId}' order by ENQ.requested_date;`

        mainDb.GetQueryData(query, (error, data) => {
            if (error) {
                return reject(`${error}, ${query}`)

            }
            return resolve(data);
        })
    })

} */


exports.Get_Message_Details_ByMsgId = async (messageId) => {

    let customerMessages = await this.Get_Message_Details_ByMsgId_Details(messageId);

    // console.log('customerMessages--> ' + JSON.stringify(customerMessages));
    let messages = [];
    for (let i = 0; i < customerMessages.length; i++) {
        let dataElement = customerMessages[i];

        let replyTexts = await this.getTblSirimCustomerMessages(dataElement.enquiry_id);
        if (null === replyTexts) {
            replyTexts = [];
        }
        // console.log('replyTexts--> ' + JSON.stringify(replyTexts));
        // let message = {
        //     'enquiry_id': dataElement.enquiry_id, 'enquiry_text': dataElement.enquiry_text, 'requested_by': dataElement.requested_by, 'msg_status': dataElement.msg_status,
        //     'file_no': dataElement.file_no, 'license_no': dataElement.license_no, 'file_id': dataElement.file_id, 'license_id': dataElement.license_id, 'reply_messages': replyTexts
        // };
        let message = {
            'enquiry_id': dataElement.enquiry_id, 'enquiry_text': dataElement.enquiry_text, 'requested_by': dataElement.requested_by, 'msg_status': dataElement.msg_status,
            'file_no': dataElement.file_no, 'license_no': dataElement.license_no, 'file_id': dataElement.file_id, 'license_id': dataElement.license_id, 'created_date': dataElement.created_date, 'reply_messages': replyTexts, 'created_by': dataElement.created_by
        };
        messages.push(message);
    }

    console.log('Responce messages--> ' + JSON.stringify(messages));
    return messages;

}

exports.Get_Message_Details_ByMsgId_Details = (messageId) => {
    //console.log(messageId);
    return new Promise((resolve, reject) => {
        // let query = `SELECT * FROM  TBL_SIRIM_CUSTOMERS_MSG ENQ LEFT JOIN tbl_sirim_msg_reply REPLY ON ENQ.ENQUIRY_ID = REPLY.ENQUIRY_ID WHERE ENQ.MESSAGE_ID='${messageId}' order by ENQ.requested_date;`


        let messageQuery = `SELECT * FROM TBL_SIRIM_CUSTOMERS_MSG WHERE message_id='${messageId}' ORDER BY REQUESTED_DATE ASC`



        mainDb.GetQueryData(messageQuery, (error, data) => {
            if (error) {
                return reject(`${error}, ${messageQuery}`)

            }
            return resolve(data);
        })
    })

}

exports.getTblSirimCustomerMessages = async (enquiry_id) => {

    return new Promise((resolve, reject) => {
        let replyMessagesQuery = `select * from tbl_sirim_msg_reply WHERE enquiry_id='${enquiry_id}' ORDER BY reply_time ASC`

        // console.log('replyMessagesQuery--> '+replyMessagesQuery);
        mainDb.GetQueryData(replyMessagesQuery, (error, data) => {
            if (error) {
                return reject(`${error}, ${replyMessagesQuery}`)

            }
            return resolve(data);
        })
    })
}



exports.Insert_Enquiry_details = (enquiryId, messageId, MessageDetails) => {
    console.log(JSON.stringify(MessageDetails));
    // let query = `INSERT INTO TBL_SIRIM_CUSTOMERS_MSG(enquiry_id,enquiry_text,requested_date,requested_by,msg_status,file_no,license_no,message_id,user_name,company_name,is_latest,file_id,license_id)
    // VALUES('${enquiryId}','${MessageDetails.enquiryText}',GETDATE(),'${MessageDetails.userName}','open','${MessageDetails.fileNo1}','${MessageDetails.licenseNo}','${messageId}','${MessageDetails.userName}','${MessageDetails.userName}',1,'${MessageDetails.fileId1}','${MessageDetails.licenseId}')`
    let query = `INSERT INTO TBL_SIRIM_CUSTOMERS_MSG(enquiry_id,enquiry_text,requested_date,requested_by,msg_status,file_no,license_no,message_id,user_name,company_name,is_latest,file_id,license_id,created_by,created_date)
    VALUES('${enquiryId}','${MessageDetails.enquiryText}',GETDATE(),'${MessageDetails.userName}','open','${MessageDetails.fileNo1}','${MessageDetails.licenseNo}','${messageId}','${MessageDetails.userName}','${MessageDetails.userName}',1,'${MessageDetails.fileId1}','${MessageDetails.licenseId}','${MessageDetails.contactPerson}',GETDATE())`
    return new Promise((resolve, reject) => {
        mainDb.InsertUpdateDeleteData(query, (error, data) => {
            if (error) {
                console.log("error" + error)
                return reject(`${error}, ${query}`)
            }
            console.log(query);
            return resolve(data);
        })
    });


}

exports.UPDATE_Enquiry_details = (enquiryId, MessageDetails) => {

    // console.log(MessageDetails.newComments);

    // let query = `
    // UPDATE tbl_sirim_customers_msg SET is_latest=0 WHERE message_id ='${MessageDetails.messageId}' ;
    // INSERT INTO TBL_SIRIM_CUSTOMERS_MSG(enquiry_id,enquiry_text,requested_date,requested_by,msg_status,file_no,license_no,message_id,user_name,company_name,is_latest,file_id,license_id)
    // VALUES('${enquiryId}','${MessageDetails.newComments}',GETDATE(),'${MessageDetails.userName}','open','${MessageDetails.fileNo}','${MessageDetails.licenseNo}','${MessageDetails.messageId}','${MessageDetails.userName}','${MessageDetails.userName}',1,'${MessageDetails.fileId}','${MessageDetails.licenseId}')`
    let query = `
    UPDATE tbl_sirim_customers_msg SET is_latest=0 WHERE message_id ='${MessageDetails.messageId}' ;
    INSERT INTO TBL_SIRIM_CUSTOMERS_MSG(enquiry_id,enquiry_text,requested_date,requested_by,msg_status,file_no,license_no,message_id,user_name,company_name,is_latest,file_id,license_id,created_date,created_by)
    VALUES('${enquiryId}','${MessageDetails.newComments}',GETDATE(),'${MessageDetails.userName}','open','${MessageDetails.fileNo}','${MessageDetails.licenseNo}','${MessageDetails.messageId}','${MessageDetails.userName}','${MessageDetails.userName}',1,'${MessageDetails.fileId}','${MessageDetails.licenseId}',GETDATE(),'${MessageDetails.contactPerson}')`
    return new Promise((resolve, reject) => {
        mainDb.InsertUpdateDeleteData(query, (error, data) => {
            if (error) {
                console.log("error" + error)
                return reject(`${error}, ${query}`)
            }
            return resolve(data);
        })
    });


}
