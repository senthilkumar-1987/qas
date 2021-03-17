const mainDb = require('../../repositories/MainDb');


exports.getAllAllBankCode = async (userData) => {
    var query = `SELECT * FROM tbl_sirim_bank_code WHERE  STATUS=1`;
    console.log(query)

    return await mainDb.executeQuery(query);
}


// exports.BankCodeSave = async (inputData, userData) => {
//     var query = `INSERT INTO tbl_sirim_bank_code (Bank_code, Bank_name, Banl_glac,Pay_type,Pay_descry,Status,[Type],Created_by,Created_date,Modified_by,Modified_date) VALUES ('${inputData.bank_code}' ,'${inputData.bank_name}','${inputData.bank_glac}','${inputData.pay_type}','${inputData.pay_descry}','${inputData.status}','${inputData.type}','System',GETDATE(),'System',GETDATE())`;
//       console.log(query)
//     return await mainDb.executeQuery(query);
// }

exports.BankCodeSave = async (inputData, userData) => {
    let query = `INSERT INTO tbl_sirim_bank_code (Bank_code, Bank_name, Banl_glac,Pay_type,Pay_descry,Status,[Type],Created_by,Created_date,Modified_by,Modified_date) VALUES ('${inputData.bank_code}' ,'${inputData.bank_name}','${inputData.bank_glac}','${inputData.pay_type}','${inputData.pay_descry}','${inputData.status}','${inputData.type}','System',GETDATE(),'System',GETDATE())`;
    console.log(query)
    return await mainDb.executeUpdateQuery(query)
}

exports.checkpaytype = async (inputData) => {
    let query = `Select * from tbl_sirim_bank_code where Pay_type='${inputData.pay_type}'and STATUS=1`;
    return await mainDb.executeQuery(query)
}

exports.updateBankCodeDetails = async (Id, status, userData) => {
    var query = `UPDATE tbl_sirim_bank_code SET STATUS=${status}, Modified_by='System' , Modified_date=GETDATE() WHERE  Id=${Id} AND STATUS=1`;

    console.log(query)
    return await mainDb.executeQuery(query);
}

