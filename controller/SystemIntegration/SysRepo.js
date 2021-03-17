const mainDb = require('../../repositories/MainDb');

exports.saveAPIDetails = async (inputData, userData) => {
    var query = `INSERT INTO TBL_SIRIM_API_CREDENTIALS (Username, Password, Company_name,Email_id,Status,Created_by,Created_date) VALUES ('${inputData.username}',
        '${inputData.password}','${inputData.company_name}','${inputData.email}','${inputData.status}','${userData.username}',GETDATE())`;

    return await mainDb.executeQuery(query);
}
exports.getAPIDetails = async (inputData) => {
    var query = `SELECT * FROM TBL_SIRIM_API_CREDENTIALS WHERE Username='${inputData.username}' AND STATUS=1`;

    return await mainDb.executeQuery(query);
}
exports.getAllAPI = async (userData) => {
    var query = `SELECT * FROM TBL_SIRIM_API_CREDENTIALS WHERE Created_by='${userData.username}' AND STATUS=1`;
console.log(query)

    return await mainDb.executeQuery(query);
}
exports.UpdateAPIDetaislStatus = async (username, status, userData) => {
    var query = `UPDATE TBL_SIRIM_API_CREDENTIALS SET STATUS=${status}, Modified_by='${userData.username}' , Modified_date=GETDATE() WHERE  Username='${username}' AND STATUS=1`;
   
   console.log(query)
    return await mainDb.executeQuery(query);
}