const mainDb = require('../MainDb');

exports.CPA_ENQUIRES_REPLY = (MessageDetails) => {
    console.log(JSON.stringify(MessageDetails))
    // let query = `INSERT INTO tbl_sirim_msg_reply(enquiry_id,reply_text,reply_by,reply_time,user_id)
    // VALUES('${MessageDetails.enqId}','${MessageDetails.comments}','admin',GETDATE(),'admin')`
    let query = `INSERT INTO tbl_sirim_msg_reply(enquiry_id,reply_text,reply_by,reply_time,user_id)
    VALUES('${MessageDetails.enqId}','${MessageDetails.comments}','${MessageDetails.currentUser}',GETDATE(),'${MessageDetails.registerId}')`
    console.log(query);
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