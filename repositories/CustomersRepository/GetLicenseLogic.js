const mainDb = require('../MainDb');
var constants = require('../../config/Constants');
const Cryptr = require('../../config/encrypt.decrypt.service')
exports.getlicenseDetails = (data, custid) => {


    return new Promise((resolve, reject) => {


        let query = `select s.SchemeId, ISNULL(p.ProdName,'') as 'ProdName',f.FileStatus,
        f.FileId, f.FileNo, ISNULL(c.CertNo, '') as 'LicenceNo', s.SchemeName,
        case when m.ProdId IS NOT NULL then dbo.fnStandardByProductID(m.ProdId) else '' end as StandardCode,
        fs.Description, CASE WHEN c.ExpiryDate IS NULL THEN '' ELSE CONVERT(varchar(50), c.ExpiryDate, 121) END AS 'ExpiryDate',
        dbo.fnTestRptbyFileID(f.FileId) as TypeTestRptNo,
        case when n.FileId IS NOT NULL then 'Yes' else '' end as 'NCR',
        CASE WHEN sv.SurvDate IS NULL THEN '' ELSE CONVERT(varchar(50), sv.SurvDate, 121) END AS 'AuditDate'
        from tbl_file f
        join tbl_master_link m on m.RecId=f.AppId
        join tbl_scheme_type s on s.SchemeId=f.SchemeId
        join tbl_file_status fs on fs.RecId=f.FileStatus
        left join tbl_cert c on c.FileId=f.FileId
        left join tbl_product p on p.ProdId=m.ProdId and p.Status='1'
        left join (select FileId From tbl_ncr where Status='1' and NcrStatus='1' group by FileId) n on n.FileId=f.FileId
        left join (select Max(SurvDate) as SurvDate, s.FileId From tbl_surveillance s, tbl_audit_rpt a
        where s.Status<>0 and s.SurvType = 'I' and a.fileid=s.FileId and a.JobId=s.JobId and a.Status='1'
        group by s.FileId) sv on sv.FileId = f.FileId
        where f.Status=1 and m.Status=1 `


        if (custid !== null) {
            query += ` And f.CustId='${custid}'`
        }
        if (data.fileNo !== null) {
            query += ` AND f.FileNo ='${data.fileNo}'`
        }
        if (data.licenseNo !== null) {
            query += ` AND c.CertNo='${data.licenseNo}'`
        }
        if (data.fileId1 !== null) {
            query += ` And f.FileId='${data.fileId1}'`

        }

        console.log("getlicenseDetails \n" + query)

        mainDb.GetQueryData(query, (error, data) => {
            if (error) {
                return reject(`${error}, ${query}`)
            }
            // console.log('obj')
            return resolve(data)
        })
    })
}


exports.getAllLicenseDetails = (customerDetails) => {
    console.log("customerDetails" + JSON.stringify(customerDetails));
    let custid = "";
    if (customerDetails.length !== 0) {
        custid = customerDetails[0].CustId
    } else {
        custid = ""
    }
    return new Promise((resolve, reject) => {

        let query = `select s.SchemeId, ISNULL(p.ProdName,'') as 'ProdName',f.FileStatus,
        f.FileId, f.FileNo, ISNULL(c.CertNo, '') as 'LicenceNo', s.SchemeName,
        case when m.ProdId IS NOT NULL then dbo.fnStandardByProductID(m.ProdId) else '' end as StandardCode,
        fs.Description, CASE WHEN c.ExpiryDate IS NULL THEN '' ELSE CONVERT(varchar(50), c.ExpiryDate, 121) END AS 'ExpiryDate',
        dbo.fnTestRptbyFileID(f.FileId) as TypeTestRptNo,
        case when n.FileId IS NOT NULL then 'Yes' else '' end as 'NCR',
        CASE WHEN sv.SurvDate IS NULL THEN '' ELSE CONVERT(varchar(50), sv.SurvDate, 121) END AS 'AuditDate'
        from tbl_file f
        join tbl_master_link m on m.RecId=f.AppId
        join tbl_scheme_type s on s.SchemeId=f.SchemeId
        join tbl_file_status fs on fs.RecId=f.FileStatus
        left join tbl_cert c on c.FileId=f.FileId
        left join tbl_product p on p.ProdId=m.ProdId and p.Status='1'
        left join (select FileId From tbl_ncr where Status='1' and NcrStatus='1' group by FileId) n on n.FileId=f.FileId
        left join (select Max(SurvDate) as SurvDate, s.FileId From tbl_surveillance s, tbl_audit_rpt a
        where s.Status<>0 and s.SurvType = 'I' and a.fileid=s.FileId and a.JobId=s.JobId and a.Status='1'
        group by s.FileId) sv on sv.FileId = f.FileId
        where f.Status=1 and m.Status=1 and f.CustId= '${custid}'`
        //${custid}
        console.log("getAllLicenseDetails  == .\n" + query) //'11166' '${CustId}'

        mainDb.GetQueryData(query, (error, data) => {
            if (error) {
                return reject(`${error}, ${query} `)
            }
            // console.log('Onload data length ' + data.length)
            return resolve(data)
        })
    })
}

exports.getCustIdByCustomerCode = (CustId) => {

    return new Promise((resolve, reject) => {

        let query = `select * from tbl_customer where CustCode = '${CustId}' And Status = 1 order by custid desc`

        console.log("getCustIdByCustomerCode  ==> \n" + query) //'11166' '${CustId}' 

        mainDb.GetQueryData(query, (error, data) => {
            if (error) {
                return reject(`${error}, ${query} `)
            }
            // console.log('obj')
            return resolve(data)
        })
    })
}
