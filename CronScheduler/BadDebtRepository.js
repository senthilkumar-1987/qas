const mainDb = require('../repositories/MainDb');
const queryRepository = require('../repositories/QueryRepository');
const constants = require('../config/Constants');

exports.remaindersList = async () => {
    return new Promise((resolve, reject) => {
        let query = `select * from tbl_sirim_bad_dept_reminder_settings where status=${constants.STATUS_ONE}`
        mainDb.GetQueryData(query, (error, data) => {
            if (error) {
                return reject(`${error}, ${query}`)
            }
            return resolve(data)
        })
    })
}



exports.getSectionEmails = async (secid) => {
    return new Promise((resolve, reject) => {
        let query = `select EmailAddr from tbl_user where SecId=${secid}`
        mainDb.GetQueryData(query, (error, data) => {
            if (error) {
                return reject(`${error}, ${query}`)
            }
            return resolve(data)
        })
    })
}

exports.getFinanceEmails = async (role) => {
    return new Promise((resolve, reject) => {
        let query = `select EmailAddr from tbl_user where Role='${role}'`
        mainDb.GetQueryData(query, (error, data) => {
            if (error) {
                return reject(`${error}, ${query}`)
            }
            return resolve(data)
        })
    })
}

exports.freshInvoiveList = (fromDate, toDate) => {
    return new Promise((resolve, reject) => {
        let query = `select * from dbo.tbl_sirim_Invoice_Master where invoice_date BETWEEN '${fromDate}' AND '${toDate}' and (payment_type is null or payment_type='') and status='1'`
        console.log(query)
        mainDb.GetQueryData(query, (error, data) => {
            if (error) {
                return reject(`${error}, ${query}`)
            }
            return resolve(data)
        })
    })
}

exports.updateBadDebtStatus = (Customer_id, id, status) => {
    // console.log("updateBadDebtStatus ==> " + Customer_id, id, status);
    let query = `UPDATE dbo.tbl_sirim_Invoice_Master SET bad_debt_status = '${status}' where Id='${id}' and Customer_id='${Customer_id}'`
    return new Promise((resolve, reject) => {
        mainDb.InsertUpdateDeleteData(query, (error, data) => {
            if (error) {
                return reject(`${error}, ${query}`)
            }
            return resolve(data);
        })
    });
}

exports.insertBadDebtHistory = (invoice, remarks, reminderName, Createdby) => {
    console.log("insertBadDebtHistory " + JSON.stringify(invoice))
    let query = `INSERT INTO tbl_sirim_bad_dept_history (Customer_id,Customer_name,User_name,Company_name,File_no,Quotation_no,License_no,Bad_dept_status,Remarks,Created_date,Created_by,RemainderName,Invoice_no)
                VALUES('${invoice.Customer_id}','${invoice.Customer_name}','${invoice.User_name}','${invoice.Company_name}',
                '${invoice.File_no}','${invoice.Quotation_no}','${invoice.License_no}','${invoice.Bad_debt_status}','${remarks}',GETDATE(),'${Createdby}','${reminderName}','${invoice.Invoice_no}')`
    return new Promise((resolve, reject) => {
        mainDb.InsertUpdateDeleteData(query, (error, data) => {
            if (error) {
                return reject(`${error}, ${query}`)
            }
            return resolve(data);
        })
    });
}

exports.updateBadDebtHistoryEmailStatus = async (invoice, remarks, status) => {
    // console.log("updateBadDebtHistoryEmailStatus " + remarks)
    let query = `UPDATE dbo.tbl_sirim_bad_dept_history SET Email_triger = '${status}' where File_no='${invoice.File_no}'  `
    return new Promise((resolve, reject) => {
        mainDb.InsertUpdateDeleteData(query, (error, data) => {
            if (error) {
                return reject(`${error}, ${query}`)
            }
            return resolve(data);
        })
    });
}



exports.getDistinctCustomerId = (fromDate, toDate) => {
    // console.log("getDistinctCustomerId " + fromDate)
    let query = `select distinct Customer_id  from dbo.tbl_sirim_Invoice_Master where invoice_date BETWEEN '${fromDate}' AND '${toDate}'  and invoice_type='CR' and (payment_type is null or payment_type='') and status='1' `
    // console.log("query ==> "+query)
    return new Promise((resolve, reject) => {
        mainDb.GetQueryData(query, (error, data) => {
            if (error) {
                return reject(`${error}, ${query}`)
            }
            // console.log(JSON.stringify(data));
            return resolve(data);
        })
    });
}



exports.getIncoiveListWhereCustId = (CustomerId, fromDate, toDate) => {
    // console.log("getIncoiveListWhereCustId " + CustomerId)
    // let query = `select * from tbl_sirim_Invoice_Details where Invoice_master_id in (select Id from tbl_sirim_Invoice_Master where Invoice_no='${InvoiceNo}' )`
    let query = `select *  from dbo.tbl_sirim_Invoice_Master where invoice_date BETWEEN '${fromDate}' AND '${toDate}'  and invoice_type='CR' and (payment_type is null or payment_type='') and status='1' and Customer_id='${CustomerId}' `
    console.log(query)
    return new Promise((resolve, reject) => {
        mainDb.GetQueryData(query, (error, data) => {
            if (error) {
                return reject(`${error}, ${query}`)
            }
            return resolve(data);
        })
    });
}


exports.getStateDetailsById = (Id) => {
    // console.log("getStateDetailsById " + Id)
    let query = `select * from tbl_state where StateId= '${Id}'  and Status='1'`
    return new Promise((resolve, reject) => {
        mainDb.GetQueryData(query, (error, data) => {
            if (error) {
                return reject(`${error}, ${query}`)
            }
            return resolve(data);
        })
    });
}


exports.getCityDetailsById = (Id) => {
    // console.log("getCityDetailsById " + Id)
    let query = `select * from tbl_city where RecId = '${Id}' and Status='1' `
    return new Promise((resolve, reject) => {
        mainDb.GetQueryData(query, (error, data) => {
            if (error) {
                return reject(`${error}, ${query}`)
            }
            return resolve(data);
        })
    });
}


exports.getCountryDetailsById = (Id) => {
    // console.log("getCountryDetailsById " + Id)
    let query = `select * from tbl_country where CountryId= '${Id}' and Status='1' `
    return new Promise((resolve, reject) => {
        mainDb.GetQueryData(query, (error, data) => {
            if (error) {
                return reject(`${error}, ${query}`)
            }
            return resolve(data);
        })
    });
}


exports.getAddressDetailsById = (Id) => {
    // console.log("getAddressDetailsById " + Id);
    let query = `select * from tbl_address where AddrId= '${Id}' and Status='1' `
    return new Promise((resolve, reject) => {
        mainDb.GetQueryData(query, (error, data) => {
            if (error) {
                return reject(`${error}, ${query}`)
            }
            return resolve(data);
        })
    });
}


exports.getcontact_person = async (username) => {
    return new Promise((resolve, reject) => {
        let query = `select contact_person_name from tbl_sirim_users tsu  where username ='${username}'`
        console.log("getcontact_person>" + query)
        mainDb.GetQueryData(query, (error, data) => {
            if (error) {
                return reject(`${error}, ${query}`)
            }
            return resolve(data)
        })
    })
}