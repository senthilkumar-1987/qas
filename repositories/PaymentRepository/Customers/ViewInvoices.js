const mainDb = require('../../MainDb');
const sirimUtils = require('../../ReportsMgtRepo/SirimUtils');

exports.Load_Invoice_Details_ByUser = (custId, startDate, endDate) => {

    let date = " 00:00:00"
    return new Promise((resolve, reject) => {
        // let query = `SELECT  * FROM TBL_SIRIM_INVOICE_Master master  WHERE master.customer_id='${custId}' and status IN (1,5)`;
        let query = `SELECT
        Currency,(SELECT SUM(bd.Sub_total)
        FROM tbl_sirim_invoice_master bd
        WHERE bd.MasterInvoiceNo=master.MasterInvoiceNo AND bd.customer_id='${custId}' AND status IN(1,5))AS Sub_total,
        (SELECT SUM(bd.Sub_total_rm)
        FROM tbl_sirim_invoice_master bd
        WHERE bd.MasterInvoiceNo=master.MasterInvoiceNo AND bd.customer_id='${custId}' AND status IN(1,5) )AS Sub_total_rm,
        stuff( (select ', ' + cast(Invoice_no as varchar(max)) from tbl_sirim_invoice_master t 
        where t.MasterInvoiceNo=master.MasterInvoiceNo  for xml path ('')), 1, 1, '' ) AS Invoice_no,
        stuff( (select ', ' + cast(Quotation_no as varchar(max)) from tbl_sirim_invoice_master t 
        where t.MasterInvoiceNo=master.MasterInvoiceNo  for xml path ('')), 1, 1, '' ) AS Quotation_no,
        stuff( (select ', ' + cast(File_no as varchar(max)) from tbl_sirim_invoice_master t 
        where t.MasterInvoiceNo=master.MasterInvoiceNo for xml path ('')), 1, 1, '')AS File_no,
        stuff( (select ', ' + cast(License_no as varchar(max)) from tbl_sirim_invoice_master t 
        where t.MasterInvoiceNo=master.MasterInvoiceNo for xml path ('')), 1, 1, '')AS License_no,
        MasterInvoiceNo,CAST(invoice_date AS DATE) AS invoice_date ,Bad_debt_status,Order_no   FROM tbl_sirim_invoice_master master
        WHERE MasterInvoiceNo!='' and Customer_id='${custId}' AND status IN(1,5) GROUP BY MasterInvoiceNo,Currency,
        CAST(Invoice_date AS DATE),Bad_debt_status,Quotation_no,Order_no
        UNION
        SELECT  Currency,Sub_total,Sub_total_rm,Invoice_no,Quotation_no,File_no,License_no,MasterInvoiceNo,
        CAST(invoice_date AS DATE) AS invoice_date,Bad_debt_status,Order_no FROM TBL_SIRIM_INVOICE_Master b  
        WHERE b.customer_id='${custId}'
        and status IN (1,5) AND (b.MasterInvoiceNo='' OR b.MasterInvoiceNo IS NULL OR b.MasterInvoiceNo='NULL') ORDER BY Invoice_date`
        if (startDate !== '' && endDate !== '' && startDate !== null && endDate !== null) {

            // query = `
            // SELECT  * FROM TBL_SIRIM_INVOICE_Master master  WHERE master.customer_id='${custId}' and master.invoice_date BETWEEN '${startDate + ' 00:00:00'}' and '${endDate + ' 23:59:59'}' and status In (1,5)
            // `
            query = `SELECT
            Currency,(SELECT SUM(bd.Sub_total)
            FROM tbl_sirim_invoice_master bd
            WHERE bd.MasterInvoiceNo=master.MasterInvoiceNo AND bd.customer_id='${custId}' 
            AND invoice_date BETWEEN '${startDate + ' 00:00:00'}' AND '${endDate + ' 23:59:59'}' AND status IN(1,5))AS Sub_total,
            (SELECT SUM(bd.Sub_total_rm)
            FROM tbl_sirim_invoice_master bd
            WHERE bd.MasterInvoiceNo=master.MasterInvoiceNo AND bd.customer_id='${custId}' 
            AND invoice_date BETWEEN '${startDate + ' 00:00:00'}' AND '${endDate + ' 23:59:59'}' AND status IN(1,5) )AS Sub_total_rm,
            stuff( (select ', ' + cast(Invoice_no as varchar(max)) from tbl_sirim_invoice_master t 
            where t.MasterInvoiceNo=master.MasterInvoiceNo  for xml path ('')), 1, 1, '' ) AS Invoice_no,
            
            stuff( (select ', ' + cast(Quotation_no as varchar(max)) from tbl_sirim_invoice_master t
            where t.MasterInvoiceNo=master.MasterInvoiceNo  for xml path ('')), 1, 1, '' ) AS Quotation_no,
            
            stuff( (select ', ' + cast(File_no as varchar(max)) from tbl_sirim_invoice_master t
            where t.MasterInvoiceNo=master.MasterInvoiceNo for xml path ('')), 1, 1, '')AS File_no,
            stuff( (select ', ' + cast(License_no as varchar(max)) from tbl_sirim_invoice_master t
            where t.MasterInvoiceNo=master.MasterInvoiceNo for xml path ('')), 1, 1, '')AS License_no,MasterInvoiceNo,
            CAST(invoice_date AS DATE) AS invoice_date ,Bad_debt_status,Order_no   FROM tbl_sirim_invoice_master master
            WHERE MasterInvoiceNo!='' and Customer_id='${custId}' AND status IN(1,5)
            AND invoice_date BETWEEN '${startDate + ' 00:00:00'}' AND '${endDate + ' 23:59:59'}' 
            GROUP BY MasterInvoiceNo,Currency,CAST(Invoice_date AS DATE),Bad_debt_status,Quotation_no,Order_no
            UNION
            SELECT  Currency,Sub_total,Sub_total_rm,Invoice_no,Quotation_no,File_no,License_no,MasterInvoiceNo,
            CAST(invoice_date AS DATE) AS invoice_date,Bad_debt_status,Order_no FROM TBL_SIRIM_INVOICE_Master b 
            WHERE b.customer_id='${custId}' AND invoice_date BETWEEN '${startDate + ' 00:00:00'}' AND '${endDate + ' 23:59:59'}' 
            and status IN (1,5) AND (b.MasterInvoiceNo='' OR b.MasterInvoiceNo IS NULL OR b.MasterInvoiceNo='NULL') ORDER BY Invoice_date`
        }

        console.log(query);
        mainDb.GetQueryData(query, (error, data) => {
            if (error) {
                return reject(`${error}, ${query}`)
            }
            // console.log(data)

            return resolve(data)
        })
    })
}




exports.PENDING_INVOICES = (userName) => {

    return new Promise((resolve, reject) => {
        let query = `
        SELECT  * FROM TBL_SIRIM_INVOICE WHERE EMAIL='${userName}';`
        mainDb.GetQueryData(query, (error, data) => {
            if (error) {
                return reject(`${error}, ${query}`)
            }
            //console.log(query)

            return resolve(data)
        })
    })
}


exports.PAID_INVOICES = (userName) => {
    console.log(userName)
    return new Promise((resolve, reject) => {
        let query = `
        SELECT
        (
        SELECT SUM(bd.Sub_total)
        FROM tbl_sirim_invoice_master bd
        WHERE bd.MasterInvoiceNo=master.MasterInvoiceNo AND  User_name='${userName}'  and status NOT IN (0,1)) AS Sub_total,
        (
        SELECT SUM(bd.Sub_total_rm)
        FROM tbl_sirim_invoice_master bd
        WHERE bd.MasterInvoiceNo=master.MasterInvoiceNo AND  User_name='${userName}'  and status NOT IN (0,1)) AS Sub_total_rm,
        (
        SELECT SUM(bd.gst_amount_rm)
        FROM tbl_sirim_invoice_master bd
        WHERE bd.MasterInvoiceNo=master.MasterInvoiceNo AND  User_name='${userName}'  and status NOT IN (0,1)) AS Gst_amount_rm,
        stuff((SELECT ', ' + CAST(Invoice_no AS VARCHAR(MAX))
        FROM tbl_sirim_invoice_master t
        WHERE t.MasterInvoiceNo=master.MasterInvoiceNo FOR XML path ('')), 1, 1, '') AS Invoice_no,
        stuff((
        SELECT ', ' + CAST(File_no AS VARCHAR(MAX))
        FROM tbl_sirim_invoice_master t 
        WHERE t.MasterInvoiceNo=master.MasterInvoiceNo FOR XML path ('')), 1, 1, '') AS File_no,
        stuff((
        SELECT ', ' + CAST(Quotation_no AS VARCHAR(MAX))
        FROM tbl_sirim_invoice_master t
        WHERE t.MasterInvoiceNo=master.MasterInvoiceNo FOR XML path ('')), 1, 1, '') AS Quotation_no,
        stuff((
        SELECT ', ' + CAST(license_no AS VARCHAR(MAX))
        FROM tbl_sirim_invoice_master t
        WHERE t.MasterInvoiceNo=master.MasterInvoiceNo FOR XML path ('')), 1, 1, '') AS License_no,
        stuff((
        SELECT ', ' + CAST(receipt_no AS VARCHAR(MAX))
        FROM tbl_sirim_invoice_master t
        WHERE t.MasterInvoiceNo=master.MasterInvoiceNo FOR XML path ('')), 1, 1, '') AS Receipt_no,
        (
        SELECT distinct status
        FROM tbl_sirim_invoice_master bd
        WHERE bd.MasterInvoiceNo=master.MasterInvoiceNo AND  User_name='${userName}'  and status NOT IN (0,1)) AS status,
        (select DISTINCT CASE WHEN master.Status=2 THEN 'Pending Verification'
        WHEN master.Status=3 THEN 'Paid'
        WHEN master.Status=4 THEN 'Hold'
        WHEN master.Status=5 THEN 'Unpaid'
        ELSE 'Unpaid' END ) AS UIStatus,
                
        payment_mode,currency,company_name,User_name, CAST(Invoice_date AS DATE)  AS Invoice_Date ,
        MasterInvoiceNo,CAST(Payment_Date AS DATE)  AS Payment_Date,Remarks
        FROM tbl_sirim_invoice_master MASTER
        WHERE MasterInvoiceNo!=''  AND User_name='${userName}'  and status NOT IN (0,1)
        GROUP BY Invoice_No,payment_mode,currency,company_name,User_name, CAST(Invoice_date AS DATE) ,File_no,Quotation_no,MasterInvoiceNo,CAST(Payment_Date AS DATE),Receipt_no,status,Remarks
                
        UNION
        SELECT Sub_total,Sub_total_rm,Gst_amount_rm,Invoice_no,File_no,Quotation_no,License_no,Receipt_no,status,(CASE WHEN Status=2 THEN 'Pending Verification'
        WHEN Status=3 THEN 'Paid'
        WHEN Status=4 THEN 'Hold'
        WHEN Status=5 THEN 'Unpaid'
        ELSE 'Unpaid' END) AS UIStatus,payment_mode,currency,company_name,User_name, CAST(Invoice_date AS DATE)  AS Invoice_Date,MasterInvoiceNo,CAST(Payment_Date AS DATE)  AS Payment_Date,Remarks
        FROM
        tbl_sirim_invoice_master 
        WHERE User_name='${userName}'  and status NOT IN (0,1) AND (masterinvoiceno='' OR masterinvoiceno IS NULL)`
        console.log("PAID_INVOICESss ==> " + query)
        mainDb.GetQueryData(query, (error, data) => {
            if (error) {
                return reject(`${error}, ${query}`)
            }
            //console.log(query)

            return resolve(data)
        })
    })
}


exports.InvoiceMasterdetails = async (invoiceNo) => {

    let data = await sirimUtils.convertArrayToQuteString(invoiceNo.split(","))

    return new Promise((resolve, reject) => {
        let query = ` Select * from TBL_SIRIM_INVOICE_MASTER Where Invoice_No IN(${data})`
        console.log("InvoiceMasterdetails \n" + query)
        mainDb.GetQueryData(query, (error, data) => {
            if (error) {
                return reject(`${error}, ${query}`)
            }
            return resolve(data)
        })
    })
}

exports.ReciptPdfInvoiceMasterdetails = (OrderNo) => {
    return new Promise((resolve, reject) => {
        let query = ` Select * from TBL_SIRIM_INVOICE_MASTER Where Order_no='${OrderNo}' `
        console.log("ReciptPdfInvoiceMasterdetails \n" + query)
        mainDb.GetQueryData(query, (error, data) => {
            if (error) {
                return reject(`${error}, ${query}`)
            }
            return resolve(data)
        })
    })
}


exports.ReciptPdfInvoiceMasterdetailsByRecipitNo = async (reciptNo) => {
    let data = ''
    if (reciptNo != '') {
        data = await sirimUtils.convertArrayToQuteString(reciptNo.split(","))
    }
    return new Promise((resolve, reject) => {
        let query = `SELECT *,(SELECT CityName FROM tbl_city  WHERE RecId=a.City_id ) AS CityName, (SELECT StateName FROM tbl_state WHERE StateId=a.State_id ) AS StateName, (SELECT CountryName FROM tbl_country WHERE CountryId=a.Country_id ) AS CountryName from tbl_sirim_invoice_master AS a where a.Receipt_no IN (${data})`
        console.log("ReciptPdfInvoiceMasterdetails \n" + query)
        mainDb.GetQueryData(query, (error, data) => {
            if (error) {
                return reject(`${error}, ${query}`)
            }
            return resolve(data)
        })
    })
}


exports.GetSingleInvoiceData = (invoiceNo) => {
    return new Promise((resolve, reject) => {
        let query = `SELECT * FROM  TBL_SIRIM_INVOICE_MASTER MASTER, TBL_SIRIM_INVOICE_DETAILS INVDETLS WHERE INVDETLS.INVOICE_MASTER_ID =MASTER.ID AND MASTER.INVOICE_NO= '${invoiceNo}' `
        console.log("GetSingleInvoiceData \n" + query)
        mainDb.GetQueryData(query, (error, data) => {
            if (error) {
                return reject(`${error}, ${query}`)
            }
            //console.log(query)
            return resolve(data)
        })
    })
}


exports.InvoiceMasterdetailsByQuotationNo = (QuotationNo, CustomerId) => {

    return new Promise((resolve, reject) => {
        let query = ` Select * from TBL_SIRIM_INVOICE_MASTER Where Quotation_no='${QuotationNo}' AND Customer_id='${CustomerId}' `

        console.log("InvoiceMasterdetailsByQuotationNo \n" + query)

        mainDb.GetQueryData(query, (error, data) => {
            if (error) {
                return reject(`${error}, ${query}`)

            }
            //console.log(query)

            return resolve(data)
        })
    })
}


exports.PDFContacts = async (quotationNo, invoiceNo, MasterInvoiceNo) => {

    let resObj = {};

    console.log("invoiceNo---->" + JSON.stringify(invoiceNo));
    console.log("MasterInvoiceNo---->" + JSON.stringify(MasterInvoiceNo));
    console.log("quotationNo---->" + JSON.stringify(quotationNo));

    if (invoiceNo) {

        query = ` select Customer_id from tbl_sirim_Invoice_Master where  Invoice_no = '${invoiceNo}'`

        let CustomerId = await mainDb.executeQuery(query);

        console.log("IDD--" + JSON.stringify(CustomerId));
        let CID = CustomerId[0].Customer_id;
        console.log("IDD--" + JSON.stringify(CID));

        let query2 = `select CustId from tbl_customer where CustCode='${CID}'`
        console.log("query2=-=" + query2)

        let CUSTID = await mainDb.executeQuery(query2);

        let CUSTIDs = CUSTID[0].CustId

        let query3 = ` Select * from tbl_contact where CustId = '${CUSTIDs}'`
        console.log("query3---" + query3)
        resObj = await mainDb.executeQuery(query3);
        console.log("contact--" + JSON.stringify(resObj));

    } else if (quotationNo) {

        query = ` select Customer_id from tbl_sirim_Invoice_Master where  Quotation_no = '${quotationNo}'`

        let CustomerId = await mainDb.executeQuery(query);

        console.log("IDD--" + JSON.stringify(CustomerId));
        let CID = CustomerId[0].Customer_id;
        console.log("IDD--" + JSON.stringify(CID));

        let query2 = `select CustId from tbl_customer where CustCode='${CID}'`

        let CUSTID = await mainDb.executeQuery(query2);

        let CUSTIDs = CUSTID[0].CustId

        let query3 = ` Select * from tbl_contact where CustId = '${CUSTIDs}'`

        resObj = await mainDb.executeQuery(query3);
        console.log("contact--" + JSON.stringify(resObj));

    } else if (MasterInvoiceNo) {

        query = ` select Customer_id from tbl_sirim_Invoice_Master where  MasterInvoiceNo = '${MasterInvoiceNo}'`

        let CustomerId = await mainDb.executeQuery(query);

        console.log("IDD--" + JSON.stringify(CustomerId));
        let CID = CustomerId[0].Customer_id;
        console.log("IDD--" + JSON.stringify(CID));

        let query2 = `select CustId from tbl_customer where CustCode='${CID}'`

        let CUSTID = await mainDb.executeQuery(query2);

        let CUSTIDs = CUSTID[0].CustId

        let query3 = ` Select * from tbl_contact where CustId = '${CUSTIDs}'`

        resObj = await mainDb.executeQuery(query3);
        console.log("contact--" + JSON.stringify(resObj));

    }

    // let query2 = `select CustId from tbl_customer where CustCode='${CustomerId}'`

    // let CUSTID = await mainDb.executeQuery(query2);

    // let CUSTIDs = CUSTID[0].CustId

    // let query3 = ` Select * from tbl_contact where CustId = '${CUSTIDs}'`

    // resObj = await mainDb.executeQuery(query3);
    // console.log("contact" + JSON.stringify(resObj.contact));
    return resObj;

}


exports.Address = async (InvoiceMAsterpdf) => {


    let Data = InvoiceMAsterpdf[0];

    let stateId = Data.State_id;
    let cityId = Data.City_id;
    let countryId = Data.Country_id;

    console.log("S- " + JSON.stringify(stateId));

    let resObj = {};



    if (stateId !== null && stateId !== "N/A") {

        let query = ` SELECT StateName FROM tbl_state  where StateId = '${stateId}'`
        console.log("" + query)
        resObj.State = await mainDb.executeQuery(query);

    } else {
        resObj.State = '';
    }

    if (cityId !== null && cityId !== "N/A") {

        let query1 = ` SELECT CityName FROM tbl_city   where RecId = '${cityId}'`
        console.log("" + query1)
        resObj.City = await mainDb.executeQuery(query1);
    } else {
        resObj.City = '';
    }

    if (countryId !== null && countryId !== "N/A") {

        let query3 = `SELECT CountryName  FROM tbl_country   where CountryId = '${countryId}'`
        console.log("" + query3)
        resObj.Country = await mainDb.executeQuery(query3);
    } else {
        resObj.Country = '';
    }

    console.log("ressb---- " + JSON.stringify(resObj))
    return resObj;


}


exports.InvoiceDetailsItemList = async (QuotationNo, CustomerId) => {

    let resObj = {};
    let master;

    let query = ` Select id,File_no,License_no,Expiry_date,Job_date from TBL_SIRIM_INVOICE_MASTER Where Quotation_no='${QuotationNo}' AND Customer_id='${CustomerId}' `

    console.log("InvoiceMasterdetailsByQuotationNo \n" + query)

    resObj.master = await mainDb.executeQuery(query);
    console.log("Id \n" + JSON.stringify(resObj.master))
    console.log("Id \n" + JSON.stringify(resObj.master[0]))
    console.log("Id a \n" + JSON.stringify(resObj.master[0].id))


    let ID = resObj.master[0].id;
    let query1 = `SELECT * from tbl_sirim_Invoice_Details where Invoice_master_id = '${ID}'`

    resObj.Details = await mainDb.executeQuery(query1);

    console.log("resObj-->" + JSON.stringify(resObj));

    return resObj;





}



exports.InvoiceMasterdetailsByMasterInvoiceNo = (MasterInvoiceNo) => {

    return new Promise((resolve, reject) => {
        let query = ` Select * from TBL_SIRIM_INVOICE_MASTER Where MasterInvoiceNo='${MasterInvoiceNo}'`

        console.log(query)

        mainDb.GetQueryData(query, (error, data) => {
            if (error) {
                return reject(`${error}, ${query}`)

            }
            //console.log(query)

            return resolve(data)
        })
    })
}


exports.get_createdby_emailid = (created_by_name) => {

    return new Promise((resolve, reject) => {
        let query = `select emailAddr from tbl_user where username='${created_by_name}' `

        console.log("get_createdby_emailid ==> " + query)

        console.log(query)

        mainDb.GetQueryData(query, (error, data) => {
            if (error) {
                return reject(`${error}, ${query}`)

            }
            //console.log(query)

            return resolve(data)
        })
    })
}


exports.getQuaotationData = async (request, userData, SecId) => {



    let query = `select * from tbl_sirim_Invoice_Master where (Invoice_no is null OR Invoice_no ='') AND Status = 0 `

    // if (request && request.startDate && request.endDate && request.startDate != '' && request.endDate != '') {
    //     query += ` AND invoice_date between '${request.startDate}' AND '${request.endDate}' `
    // }
    if (request && request.company && request.company != null && request.company != '') {
        query += ` AND Company_name LIKE '%${request.company}%' `
    }

    query += ` AND SecId = '${SecId}' `

    console.log(query)
    return await mainDb.executeQuery(query);
}



exports.getUserDerails = async (userId) => {
    let query_userDetails = `select * from tbl_user where UserName='${userId}'`;

    return await mainDb.executeQuery(query_userDetails);
}



exports.checkCurrentAndPrevYearInvoice = async (invoiceNo) => {

    let data = await sirimUtils.convertArrayToQuteString(invoiceNo.split(","))

    return new Promise((resolve, reject) => {
        let query = ` SELECT * from tbl_sirim_invoice_master WHERE Invoice_date between DATEADD(year,-2,GETDATE()) and DATEADD(year,-1,GETDATE()) and  Invoice_no IN(${data})`
        console.log("InvoiceMasterdetails \n" + query)
        mainDb.GetQueryData(query, (error, data) => {
            if (error) {
                return reject(`${error}, ${query}`)
            }
            return resolve(data)
        })
    })
}




exports.PENDING_INVOICES = (userName) => {

    return new Promise((resolve, reject) => {
        let query = `
        SELECT  * FROM TBL_SIRIM_INVOICE WHERE EMAIL='${userName}';`
        mainDb.GetQueryData(query, (error, data) => {
            if (error) {
                return reject(`${error}, ${query}`)
            }
            //console.log(query)

            return resolve(data)
        })
    })
}



exports.RemainderDate = async (invoiceNo, badDeptStatus, RemainderName) => {

    return new Promise((resolve, reject) => {
        let query = `select * from tbl_sirim_bad_dept_history where Invoice_no='${invoiceNo}' and Bad_dept_status='${badDeptStatus}' And RemainderName='${RemainderName}'`
        mainDb.GetQueryData(query, (error, data) => {
            if (error) {
                return reject(`${error}, ${query}`)
            }
            //console.log(query)

            return resolve(data)
        })
    })
}


exports.getOEName = async (Invoice_no) => {

    let resObj = {};

    // let query = `select * from tbl_sirim_bad_dept_history where Invoice_no IN (${Invoice_no}) AND RemainderName ='Operation Executive Approved Cancel Invoice' order by id desc`;

    let query = `SELECT his.Created_date,u.FullName,his.Created_by FROM tbl_user u
    INNER JOIN tbl_sirim_bad_dept_history his ON his.Created_by=u.username  AND
    his.Invoice_no IN (${Invoice_no}) AND his.RemainderName ='Operation Executive Approved Cancel Invoice'  order by id desc;`;

    resObj = await mainDb.executeQuery(query);

    return resObj;
}



exports.getHeadName = async (Invoice_no) => {

    let resObj = {};

    // let query = `select * from tbl_sirim_bad_dept_history where Invoice_no IN (${Invoice_no}) AND RemainderName ='Head Approved Cancel Invoice' order by id desc`;
    let query = `SELECT his.Created_date,u.FullName,his.Created_by FROM tbl_user u
    INNER JOIN tbl_sirim_bad_dept_history his ON his.Created_by=u.username  AND
    his.Invoice_no IN (${Invoice_no}) AND his.RemainderName ='Head Approved Cancel Invoice'  order by id desc`

    resObj = await mainDb.executeQuery(query);

    return resObj;
}

exports.getSectionClerkUsernameByRemainder = async (Invoice_no, RemainderName) => {
    let data = await sirimUtils.convertArrayToQuteString(Invoice_no.split(","))
    let resObj = {};
    let query = `select * from tbl_sirim_bad_dept_history where Invoice_no IN (${data}) AND RemainderName ='${RemainderName}' order by id desc`;
    console.log("getSectionClerkUsernameByRemainder\n" + query)
    resObj = await mainDb.executeQuery(query);
    return resObj;
}

exports.getSectionClerkEmailidByusername = async (username) => {
    let resObj = {};
    let query = `select * from tbl_user where UserName='${username}'`;
    console.log("getSectionClerkEmailidByusername\n" + query)
    resObj = await mainDb.executeQuery(query);
    return resObj;
}


exports.getInternalUserEmailidByRole = async (role) => {
    let resObj = {};
    let query = ` SELECT  DISTINCT a.UserId,a.EmailAddr FROM tbl_user a JOIN tbl_user_roles b  ON a.UserId=b.UserId  WHERE (b.Role='${role}' OR  a.Role='${role}')`;
    console.log("getSectionClerkEmailidByusername\n" + query)
    resObj = await mainDb.executeQuery(query);
    return resObj;
}

exports.getSCData = async (Invoice_no) => {


    let resObj = {};

    // let query = `select * from tbl_sirim_bad_dept_history where Invoice_no IN (${Invoice_no}) AND RemainderName ='SC Rise Cancel Invoice' order by id desc`;
    let query = `SELECT his.Created_date,u.FullName,his.Created_by FROM tbl_user u
    INNER JOIN tbl_sirim_bad_dept_history his ON his.Created_by=u.username  AND
    his.Invoice_no IN (${Invoice_no}) AND his.RemainderName ='SC Rise Cancel Invoice'  order by id desc`

    resObj = await mainDb.executeQuery(query);

    return resObj;


}
