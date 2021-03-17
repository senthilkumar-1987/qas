const mainDb = require('../MainDb');
const sql = require('mssql')

exports.Get_Enquiry_Seq_Value = () => {

    return new Promise((resolve, reject) => {
        let query = `SELECT NEXT VALUE FOR ENQUIRY_RAISING  as seqNo`
        mainDb.GetQueryData(query, (error, data) => {
            if (error) {
                return reject(`${error}, ${query}`)
            }


            let sequenceNo = data[0].seqNo;
            seqNo = sequenceNo;

            return resolve(sequenceNo)
        })
    })

}

exports.LOAD_ENQ_DETAILS = (userName, type, limit) => {

    console.log(userName, type, limit);
    let query = `SELECT * from tbl_sirim_customers_enquiry where requested_by='${userName}' and scheme_id='${type}' and requested_date   < Dateadd(day,${limit},GETDATE()) `
    console.log(query);
    return new Promise((resolve, reject) => {
        mainDb.GetQueryData(query, (error, data) => {
            if (error) {
                return reject(`${error}, ${query}`)
            }
            // console.log(data.length);
            return resolve(data)
        })
    })
}


exports.NEW_ENQUIRY_RAISING_SAVE = (requstObj, enquiryId, fileData, companyName) => {

    console.log("NEW_ENQUIRY_RAISING_SAVE \n\n" + JSON.stringify(requstObj));
    let query = `INSERT INTO tbl_sirim_customers_enquiry(enquiry_id,enquiry_text,product,scheme_id,sectors_id,requested_date,requested_by,msg_status,application_category,certification_type,message_id,user_name,company_name,is_latest,scheme_name,sector_name,standard,sectorOther,schemeOther,InformationOther,information,remarks,fileupload,fileName)
    VALUES('${enquiryId}','${requstObj.comments}','${requstObj.product}','${requstObj.scheme}','${requstObj.sector}',GETDATE(),'${requstObj.userName}','0','','','','${requstObj.userName}','${requstObj.companyName}',1,'${requstObj.schemeName}','${requstObj.sectorName}'
    ,'${requstObj.standard}','${requstObj.sectorOther}','${requstObj.schemeOther}','${requstObj.InformationOther}','${requstObj.information}','${requstObj.comments}',convert(VARBINARY(max),'${fileData}'),'${requstObj.fileName}')`
    // console.log(query)

    return new Promise((resolve, reject) => {
        mainDb.InsertUpdateDeleteData(query, (error, data) => {
            if (error) {
                return reject(`${error}, ${query}`)
            }
            //console.log(query);
            return resolve(data);

        })
    });

}
