const sql = require("mssql");

const config = require('../db');
const db = new sql.ConnectionPool(config).connect();

const mainDb = require('./MainDb');

function GetQueryData(query,callback){
    let obj = {}

    db.then(pool => {
        return pool.query(query)
    }).then(result => {
        data = result.recordset;

        if (!Array.isArray(data) || !data.length) {
            return callback(undefined, null);
        }
        else {
            return callback(undefined, data);
        }
    }).catch(err => {
        console.log('failed');
        return callback(`${err}`, undefined);
    })
}

function InsertUpdateDeleteData(query,callback){
    let obj = {}

    db.then(pool => {
        return pool.query(query)
    }).then(result => { 
        data = result.rowsAffected;

        if (!Array.isArray(data) || !data.length) {
            return callback(undefined, null);
        }
        else {
            return callback(undefined, data[0]);
        }
    }).catch(err => {
        return callback(err.originalError.message, undefined);
    })
}

exports.InsertUpdateDelete = (query) => {
    return new Promise((resolve, reject) => {
        InsertUpdateDeleteData(query,(error, data) => {
            if(error){
                return reject(`${error}, ${query}`);
            }
            return resolve(data);
        });
    })
}

exports.SelectData = (query) => {
    return new Promise((resolve, reject) => {
        mainDb.GetQueryData(query,(error, data) => {
            if(error){
                return reject(`${error}, ${query}`);
            }
            return resolve(data);
        });
    })
}

exports.SelectDataExecuteQuery = (query, parameters) => {
    return new Promise((resolve, reject) => {
        mainDb.executeQuery(query, null, parameters,(error, data) => {
            if(error){
                return reject(`${error}, ${query}`);
            }
            return resolve(data);
        });
    })
}

exports.SelectData_TaskList_ByuserId = (UserID) => {
    return new Promise((resolve, reject) => {
        let query = `SELECT * FROM tbl_task_list WHERE AssignTo=${UserID} AND Status IN (1,3)`;
        mainDb.GetQueryData(query,(error, data) => {
            if(error){
                return reject(`${error}, ${query}`);
            }
            return resolve(data);
        });
    })
}

exports.SelectData_User_ByuserId = (UserID) => {
    return new Promise((resolve, reject) => {
        let query = `SELECT * FROM tbl_user WHERE UserId=${UserID}`;
        mainDb.GetQueryData(query,(error, data) => {
            if(error){
                return reject(`${error}, ${query}`);
            }
            return resolve(data);
        });
    })
}

exports.GetUser_byLoginGUID = (UserID) => {
    return new Promise((resolve, reject) => {
        let query = `SELECT * FROM tbl_user WHERE LoginGUID LIKE '${UserGui}'`;
        mainDb.GetQueryData(query,(error, data) => {
            if(error){
                return reject(`${error}, ${query}`);
            }
            return resolve(data);
        });
    })
}

exports.SelectData_TaskList_BytaskId = (TaskID) => {
    return new Promise((resolve, reject) => {
        let query = `SELECT * FROM tbl_task_list WHERE TaskId=${TaskID}`;
        GetQueryData(query,(error, data) => {
            if(error){
                return reject(`${error}, ${query}`);
            }
            return resolve(data);
        });
    })
}

exports.SelectData_WorkFlowbyWfID = (RefID) => {
    return new Promise((resolve, reject) => {
        let query = `SELECT * FROM tbl_workflow WHERE WfId=${RefID}`;
        GetQueryData(query,(error, data) => {
            if(error){
                return reject(`${error}, ${query}`);
            }
            return resolve(data);
        });
    })
}

exports.SelectData_Job_byJobId = (JobID) => {
    return new Promise((resolve, reject) => {
        let query = `SELECT * FROM tbl_job WHERE JobId=${JobID}`;
    
        GetQueryData(query,(error, data) => {
            if(error){
                return reject(`${error}, ${query}`);
            }
            return resolve(data);
        });
    })
}

exports.SelectData_Job_Type_byJobTypeId = (JobTypeId) => {
    return new Promise((resolve, reject) => {
        let query = `SELECT * FROM tbl_job_type WHERE RecId=${JobTypeId}`;
        GetQueryData(query,(error, data) => {
            if(error){
                return reject(`${error}, ${query}`);
            }
            return resolve(data);
        });
    })
}

exports.SelectData_Job_Type_byJobType = (JobType) => {
    return new Promise((resolve, reject) => {
        let query = `SELECT * FROM tbl_job_type WHERE WHERE JobType LIKE '${JobType}'`;
        GetQueryData(query,(error, data) => {
            if(error){
                return reject(`${error}, ${query}`);
            }
            return resolve(data);
        });
    })
}

exports.SelectData_Job_Link_byJobId = (JobID, status) => {
    return new Promise((resolve, reject) => {
        let query = `SELECT * FROM tbl_job_item WHERE JobId=${JobID} AND status=${status}`;
        GetQueryData(query,(error, data) => {
            if(error){
                return reject(`${error}, ${query}`);
            }
            return resolve(data);
        });
    })
}

exports.SelectData_UserProfile_ByUserID = (userId) => {
    return new Promise((resolve, reject) => {
        let query = `SELECT * FROM tbl_user WHERE UserId=${userId}`
        GetQueryData(query,(error, data) => {
            if(error){
                return reject(`${error}, ${query}`);
            }
            return resolve(data);
        });
    })   
}

exports.SelectFiledDataBy_FileID = (FileId) => {
    return new Promise((resolve, reject) => {
        let query = `SELECT * FROM tbl_file WHERE FileId=${FileId}`;
        GetQueryData(query,(error, data) => {
            if(error){
                return reject(`${error}, ${query}`);
            }
            
            return resolve(data);
        });
    })
}

exports.SelectData_MasterLink_byRecId = (AppId, status) => {
    return new Promise((resolve, reject) => {
        let query = `SELECT * FROM tbl_master_link WHERE RecId=${AppId} AND Status=${status}`;
        GetQueryData(query,(error, data) => {
            if(error){
                return reject(`${error}, ${query}`);
            }
            return resolve(data);
        });
    })
}

exports.SelectData_MasterLink_ByRecIdNoStatus = (AppId) => {
    return new Promise((resolve, reject) => {
        let query = `SELECT * FROM tbl_master_link WHERE RecId=${AppId}`;
        GetQueryData(query,(error, data) => {
            if(error){
                return reject(`${error}, ${query}`);
            }
            return resolve(data);
        });
    })
}

exports.SelectData_Cert_byFileID = (intFileId, status = 1) => {
    return new Promise((resolve, reject) => {
        let query = `SELECT * FROM tbl_cert WHERE FileId=${intFileId} AND Status=${status}`;
        GetQueryData(query,(error, data) => {
            if(error){
                return reject(`${error}, ${query}`);
            }
            return resolve(data);
        });
    })
}

exports.SelectData_Cust_byCustID = (CustId) => {
    return new Promise((resolve, reject) => {
        let query = `SELECT * FROM tbl_customer WHERE CustId=${CustId}`;
        GetQueryData(query,(error, data) => {
            if(error){
                return reject(`${error}, ${query}`);
            }
            return resolve(data);
        });
    })
}

exports.SelectProductdData_byProdID = (ProdId) => {
    return new Promise((resolve, reject) => {
        let query = `SELECT tbl1.ProdId,tbl1.ProdName,tbl1.Status,tbl1.ModifiedBy,tbl1.ModifiedDate,tbl1.FileId,tbl1.LibProdId FROM tbl_product tbl1 JOIN tbl_lib_prod tbl2 ON tbl1.LibProdId=tbl2.ProdId WHERE tbl1.ProdId = ${ProdId} AND tbl2.Status = 1`;
        GetQueryData(query,(error, data) => {
            if(error){
                return reject(`${error}, ${query}`);
            }
            return resolve(data);
        });
    })
}

exports.Select_StandardData_ProdId = (ProdId) => {
    return new Promise((resolve, reject) => {
        let query = `SELECT * FROM tbl_standard WHERE ProdId=${ProdId}`;
        GetQueryData(query,(error, data) => {
            if(error){
                return reject(`${error}, ${query}`);
            }
            return resolve(data);
        });
    })
}

exports.SelectStandardLibData_standardLibId = (StandardId) => {
    return new Promise((resolve, reject) => {
        let query = `SELECT * FROM tbl_lib_standard WHERE StandardId=${StandardId}`;
        GetQueryData(query,(error, data) => {
            if(error){
                return reject(`${error}, ${query}`);
            }
            return resolve(data);
        });
    })
}

exports.SelectData_MasterAddr_byMasterRefId_type = (RecId, CompType, status = 1) => {
    return new Promise((resolve, reject) => {
        let query = `SELECT * FROM tbl_master_addr WHERE MasRecId=${RecId} AND CompType = '${CompType}' AND Status=${status}`;
        GetQueryData(query,(error, data) => {
            if(error){
                return reject(`${error}, ${query}`);
            }
            return resolve(data);
        });
    })
}

exports.SelectData_Contact_byContactID = (ContactID1) => {
    return new Promise((resolve, reject) => {
        let query = `SELECT * FROM tbl_contact WHERE ContactId=${ContactID1}`;
        GetQueryData(query,(error, data) => {
            if(error){
                return reject(`${error}, ${query}`);
            }
            return resolve(data);
        });
    })
}

exports.SelectData_Address_ByAddrID = (AddrId) => {
    return new Promise((resolve, reject) => {
        let query = `SELECT * FROM tbl_address WHERE AddrId=${AddrId}`;
        GetQueryData(query,(error, data) => {
            if(error){
                return reject(`${error}, ${query}`);
            }
            return resolve(data);
        });
    })
}

exports.SelectData_City_ByCityID = (City) => {
    return new Promise((resolve, reject) => {
        let query = `SELECT * FROM tbl_city WHERE RecId=${City}`;
        GetQueryData(query,(error, data) => {
            if(error){
                return reject(`${error}, ${query}`);
            }
            return resolve(data);
        });
    })
}

exports.SelectData_State_ByStateId = (StateCode) => {
    return new Promise((resolve, reject) => {
        let query = `SELECT * FROM tbl_state WHERE StateId=${StateCode}`;
        GetQueryData(query,(error, data) => {
            if(error){
                return reject(`${error}, ${query}`);
            }
            return resolve(data);
        });
    })
}

exports.SelectData_Country_byCountryID = (CountryCode) => {
    return new Promise((resolve, reject) => {
        let query = `SELECT * FROM tbl_country WHERE CountryId=${CountryCode}`;
        GetQueryData(query,(error, data) => {
            if(error){
                return reject(`${error}, ${query}`);
            }
            return resolve(data);
        });
    })
}

exports.SelectData_Address_byCustID = (CustId) => {
    return new Promise((resolve, reject) => {
        let query = `SELECT * FROM tbl_address WHERE CustId=${CountryCode} AND Status=1`;
        GetQueryData(query,(error, data) => {
            if(error){
                return reject(`${error}, ${query}`);
            }
            return resolve(data);
        });
    })
}