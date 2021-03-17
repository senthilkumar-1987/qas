const sql = require("mssql");

const config = require('../db');
const db = new sql.ConnectionPool(config).connect();

function GetQueryData(query,callback){
    let obj = {}

    db.then(pool => {
        return pool.query(query)
    }).then(result => {
        data = result.recordset;

        return callback(undefined, data);
    }).catch(err => {
        console.log(err);
        return callback(`${err}`, undefined);
    })
}

exports.SelectData_TaskList_BytaskId = (TaskID, callback) => {
    let query = `SELECT * FROM tbl_task_list WHERE TaskId=${TaskID}`;
    GetQueryData(query,(error, data) => {
        if(error){
            return callback(`${error}, ${query}`, undefined);
        }
        return callback(undefined, data);
    });
}

exports.SelectData_WorkFlowbyWfID = (RefID, callback) => {
    let query = `SELECT * FROM tbl_workflow WHERE WfId=${RefID}`;
    GetQueryData(query,(error, data) => {
        if(error){
            return callback(`${error}, ${query}`, undefined);
        }
        return callback(undefined, data);
    });
}

exports.SelectData_Job_byJobId = (JobID, callback) => {
    let query = `SELECT * FROM tbl_job WHERE JobId=${JobID}`;
    
    GetQueryData(query,(error, data) => {
        if(error){
            return callback(`${error}, ${query}`, undefined);
        }
        return callback(undefined, data);
    });
}

exports.SelectData_Job_Type_byJobTypeId = (JobTypeId, callback) => {
    let query = `SELECT * FROM tbl_job_type WHERE RecId=${JobTypeId}`;
    GetQueryData(query,(error, data) => {
        if(error){
            return callback(`${error}, ${query}`, undefined);
        }
        return callback(undefined, data);
    });
}

exports.SelectData_Job_Type_byJobType = (JobType, callback) => {
    let query = `SELECT * FROM tbl_job_type WHERE WHERE JobType LIKE '${JobType}'`;
    GetQueryData(query,(error, data) => {
        if(error){
            return callback(`${error}, ${query}`, undefined);
        }
        return callback(undefined, data);
    });
}

exports.SelectData_Job_Link_byJobId = (JobID, status, callback) => {
    let query = `SELECT * FROM tbl_job_item WHERE JobId=${JobID} AND status=${status}`;
    GetQueryData(query,(error, data) => {
        if(error){
            return callback(`${error}, ${query}`, undefined);
        }
        return callback(undefined, data);
    });
}

exports.SelectData_UserProfile_ByUserID = (userId, callback) => {
    let query = `SELECT * FROM tbl_user WHERE UserId=${userId}`
    GetQueryData(query,(error, data) => {
        if(error){
            return callback(`${error}, ${query}`, undefined);
        }
        return callback(undefined, data);
    });
}

exports.SelectFiledDataBy_FileID = (FileId, callback) => {
    let query = `SELECT * FROM tbl_file WHERE FileId=${FileId}`;
    GetQueryData(query,(error, data) => {
        if(error){
            return callback(`${error}, ${query}`, undefined);
        }
        return callback(undefined, data);
    });
}

exports.SelectData_MasterLink_ByRecIdNoStatus = (AppId, callback) => {
    let query = `SELECT * FROM tbl_master_link WHERE RecId=${AppId}`;
    GetQueryData(query,(error, data) => {
        if(error){
            return callback(`${error}, ${query}`, undefined);
        }
        return callback(undefined, data);
    });
}

exports.SelectData_Cert_byFileID = (intFileId, status = 1, callback) => {
    let query = `SELECT * FROM tbl_cert WHERE FileId=${intFileId} AND Status=${status}`;
    GetQueryData(query,(error, data) => {
        if(error){
            return callback(`${error}, ${query}`, undefined);
        }
        return callback(undefined, data);
    });
}

exports.SelectData_Cust_byCustID = (CustId, callback) => {
    let query = `SELECT * FROM tbl_customer WHERE CustId=${CustId}`;
    GetQueryData(query,(error, data) => {
        if(error){
            return callback(`${error}, ${query}`, undefined);
        }
        return callback(undefined, data);
    });
}

exports.SelectProductdData_byProdID = (ProdId, callback) => {
    let query = `SELECT tbl1.ProdId,tbl1.ProdName,tbl1.Status,tbl1.ModifiedBy,tbl1.ModifiedDate,tbl1.FileId,tbl1.LibProdId FROM tbl_product tbl1 JOIN tbl_lib_prod tbl2 ON tbl1.LibProdId=tbl2.ProdId WHERE tbl1.ProdId = ${ProdId} AND tbl2.Status = 1`;
    GetQueryData(query,(error, data) => {
        if(error){
            return callback(`${error}, ${query}`, undefined);
        }
        return callback(undefined, data);
    });
}

exports.Select_StandardData_ProdId = (ProdId, callback) => {
    let query = `SELECT * FROM tbl_standard WHERE ProdId=${ProdId}`;
    GetQueryData(query,(error, data) => {
        if(error){
            return callback(`${error}, ${query}`, undefined);
        }
        return callback(undefined, data);
    });
}

exports.SelectStandardLibData_standardLibId = (StandardId, callback) => {
    let query = `SELECT * FROM tbl_lib_standard WHERE StandardId=${StandardId}`;
    GetQueryData(query,(error, data) => {
        if(error){
            return callback(`${error}, ${query}`, undefined);
        }
        return callback(undefined, data);
    });
}

exports.SelectData_MasterAddr_byMasterRefId_type = (RecId, CompType, status = 1, callback) => {
    let query = `SELECT * FROM tbl_master_addr WHERE MasRecId=${RecId} AND CompType = '${CompType}' AND Status=${status}`;
    GetQueryData(query,(error, data) => {
        if(error){
            return callback(`${error}, ${query}`, undefined);
        }
        return callback(undefined, data);
    });
}

exports.SelectData_Contact_byContactID = (ContactID1, callback) => {
    let query = `SELECT * FROM tbl_contact WHERE ContactId=${ContactID1}`;
    GetQueryData(query,(error, data) => {
        if(error){
            return callback(`${error}, ${query}`, undefined);
        }
        return callback(undefined, data);
    });
}