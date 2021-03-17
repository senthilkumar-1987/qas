const sql = require("mssql");
const config = require('../db');
const db = new sql.ConnectionPool(config).connect();
const mainDb = require('./MainDb');


//SELECT QUERY
exports.GetAllRoles = () => {
    return new Promise((resolve, reject) => {
        let query = `SELECT RoleName FROM dbo.aspnet_Roles order by RoleName `
        mainDb.GetQueryData(query,(error, Sdata) => {
            if(error){
                return reject(`${error}, ${query}`);
            }
            return resolve(data);
        });
    })   
}
