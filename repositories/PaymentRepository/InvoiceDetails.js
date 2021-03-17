const mainDb = require('../MainDb');
const logger = require('../../logger');
const sirimUtils = require('../ReportsMgtRepo/SirimUtils');

exports.Load_Invoice_Details = async (userData) => {

    let responceObject = {};
    let userId = userData.username;
    let roleId = userData.roleId;
    let RoleNames = [];
    for (let index = 0; index < roleId.length; index++) {
        const element = roleId[index];
        RoleNames.push(element.role)
    }

    let query_userDetails = `select * from tbl_user where UserName='${userId}'`;

    let userDetails = await mainDb.executeQuery(query_userDetails);

    console.log("userDetails\n" + JSON.stringify(userDetails));

    let query1 = `SELECT * FROM TBL_SIRIM_INVOICE_MASTER WHERE (INVOICE_NO IS NULL OR INVOICE_NO ='') AND Status = 0`

    if (RoleNames.includes('Clerk')) {
        query1 += ` AND SecId = '${userDetails[0].SecId}' `
    }

    let listOfFreshInoiceData = await mainDb.executeQuery(query1);

    let listOfInvoiceData = await this.listOfGeneratedInvoice('', userData);
    responceObject.FreshInvoiceData = listOfFreshInoiceData;
    responceObject.listOfInvoiceData = listOfInvoiceData;

    return responceObject;
}


exports.listOfGeneratedInvoice = async (request, userData) => {
    console.log("request \n" + JSON.stringify(request))

    let userId = userData.username;
    let roleId = userData.roleId;
    let RoleNames = [];
    for (let index = 0; index < roleId.length; index++) {
        const element = roleId[index];
        RoleNames.push(element.role)
    }
    let query_userDetails = `select * from tbl_user where UserName='${userId}'`;

    let userDetails = await mainDb.executeQuery(query_userDetails);

    console.log(JSON.stringify(userDetails));

    let querySecId1 = 'AND';
    let querySecId2 = 'AND';
    let querySecId3 = '';
    if (RoleNames.includes('Clerk')) {
        querySecId1 = ` AND bd.SecId = '${userDetails[0].SecId}' AND `
        querySecId2 = ` AND SecId = '${userDetails[0].SecId}' AND `
        querySecId3 = ` b.SecId = '${userDetails[0].SecId}' AND `
    }


    let query2 = `SELECT
    Currency,(SELECT SUM(bd.Sub_total)
    FROM tbl_sirim_invoice_master bd
    WHERE bd.MasterInvoiceNo=master.MasterInvoiceNo  ${querySecId1}  status NOT IN(0)) AS Sub_total,
    (SELECT SUM(bd.Sub_total_rm)
    FROM tbl_sirim_invoice_master bd
    WHERE bd.MasterInvoiceNo=master.MasterInvoiceNo ${querySecId1} status NOT IN(0) )AS Sub_total_rm,
    stuff( (select ', ' + cast(Invoice_no as varchar(max)) from tbl_sirim_invoice_master t 
    where t.MasterInvoiceNo=master.MasterInvoiceNo  for xml path ('')), 1, 1, '' ) AS Invoice_no,
    stuff( (select ', ' + cast(Quotation_no as varchar(max)) from tbl_sirim_invoice_master t 
    where t.MasterInvoiceNo=master.MasterInvoiceNo  for xml path ('')), 1, 1, '' ) AS Quotation_no,
    stuff( (select ', ' + cast(File_no as varchar(max)) from tbl_sirim_invoice_master t 
    where t.MasterInvoiceNo=master.MasterInvoiceNo for xml path ('')), 1, 1, '')AS File_no,
    stuff( (select ', ' + cast(License_no as varchar(max)) from tbl_sirim_invoice_master t 
    where t.MasterInvoiceNo=master.MasterInvoiceNo for xml path ('')), 1, 1, '')AS License_no,
    MasterInvoiceNo,CAST(invoice_date AS DATE) AS invoice_date ,Bad_debt_status,Order_no,Company_name ,Customer_id,Status
    FROM tbl_sirim_invoice_master master
    WHERE MasterInvoiceNo!='' ${querySecId2} status NOT IN(0) GROUP BY MasterInvoiceNo,Currency,
    CAST(Invoice_date AS DATE),Bad_debt_status,Quotation_no,Order_no,Company_name,Customer_id,Status
    UNION
    SELECT  Currency,Sub_total,Sub_total_rm,Invoice_no,Quotation_no,File_no,License_no,MasterInvoiceNo,
    CAST(invoice_date AS DATE) AS invoice_date,Bad_debt_status,Order_no,Company_name,Customer_id,Status FROM TBL_SIRIM_INVOICE_Master b  
    WHERE ${querySecId3}  status NOT IN (0) AND (b.MasterInvoiceNo='' OR b.MasterInvoiceNo IS NULL OR b.MasterInvoiceNo='NULL') 
    ORDER BY Invoice_date`


    let com = request.company;
    let companyQuery1 = ` bd.Company_name LIKE '%${request.company}%' AND `
    let companyQuery2 = ` Company_name LIKE '%${request.company}%' AND `
    let companyQuery3 = ` b.Company_name LIKE '%${request.company}%' AND `

    if (request && request.company && request.company != null && request.company != '') {
        query2 = `SELECT
        Currency,(SELECT SUM(bd.Sub_total)
        FROM tbl_sirim_invoice_master bd
        WHERE bd.MasterInvoiceNo=master.MasterInvoiceNo  ${querySecId1} ${companyQuery1}  status NOT IN(0)) AS Sub_total,
        (SELECT SUM(bd.Sub_total_rm)
        FROM tbl_sirim_invoice_master bd
        WHERE bd.MasterInvoiceNo=master.MasterInvoiceNo ${querySecId1} ${companyQuery1} status NOT IN(0) )AS Sub_total_rm,
        stuff( (select ', ' + cast(Invoice_no as varchar(max)) from tbl_sirim_invoice_master t 
        where t.MasterInvoiceNo=master.MasterInvoiceNo  for xml path ('')), 1, 1, '' ) AS Invoice_no,
        stuff( (select ', ' + cast(Quotation_no as varchar(max)) from tbl_sirim_invoice_master t 
        where t.MasterInvoiceNo=master.MasterInvoiceNo  for xml path ('')), 1, 1, '' ) AS Quotation_no,
        stuff( (select ', ' + cast(File_no as varchar(max)) from tbl_sirim_invoice_master t 
        where t.MasterInvoiceNo=master.MasterInvoiceNo for xml path ('')), 1, 1, '')AS File_no,
        stuff( (select ', ' + cast(License_no as varchar(max)) from tbl_sirim_invoice_master t 
        where t.MasterInvoiceNo=master.MasterInvoiceNo for xml path ('')), 1, 1, '')AS License_no,
        MasterInvoiceNo,CAST(invoice_date AS DATE) AS invoice_date ,Bad_debt_status,Order_no,Company_name ,Customer_id,Status
        FROM tbl_sirim_invoice_master master
        WHERE MasterInvoiceNo!='' ${querySecId2} ${companyQuery2} status NOT IN(0) GROUP BY MasterInvoiceNo,Currency,
        CAST(Invoice_date AS DATE),Bad_debt_status,Quotation_no,Order_no,Company_name,Customer_id,Status
        UNION
        SELECT  Currency,Sub_total,Sub_total_rm,Invoice_no,Quotation_no,File_no,License_no,MasterInvoiceNo,
        CAST(invoice_date AS DATE) AS invoice_date,Bad_debt_status,Order_no,Company_name,Customer_id,Status FROM TBL_SIRIM_INVOICE_Master b  
        WHERE ${querySecId3} ${companyQuery3} status NOT IN (0) AND (b.MasterInvoiceNo='' OR b.MasterInvoiceNo IS NULL OR b.MasterInvoiceNo='NULL') 
        ORDER BY Invoice_date`
    }
    console.log("listofinv\n\n" + query2)






    // let query2 = `SELECT * FROM TBL_SIRIM_INVOICE_MASTER WHERE (INVOICE_NO IS NOT NULL OR INVOICE_NO !='') AND STATUS = 1 `
    // if (request && request.company && request.company != null && request.company != '') {
    //     query2 += ` AND Company_name LIKE '%${request.company}%' `
    // }
    // if (RoleNames.includes('Clerk')) {
    //     query2 += ` AND SecId = '${userDetails[0].SecId}' `
    // }
    // query2 += ` ORDER BY Invoice_no DESC`

    let listOfInvoiceData = await mainDb.executeQuery(query2);

    console.log(query2);
    return listOfInvoiceData;
}

exports.getQuotationData = async (request) => {
    let QuotationData;
    try {
        let data = await sirimUtils.convertArrayToQuteString(request.QuotationNo.split(","))
        /* let query = `SELECT MASTER.*, jb.JobNo As JobNo FROM TBL_SIRIM_INVOICE_MASTER MASTER ,tbl_job jb WHERE CONVERT(varchar, jb.JobId) =CONVERT(varchar, MASTER.job_id) AND MASTER.QUOTATION_NO ='${request.QuotationNo}' AND MASTER.STATUS='${request.Status}' AND MASTER.COMPAny_name='${request.Company}'` */
        let query = `SELECT MASTER.* FROM TBL_SIRIM_INVOICE_MASTER MASTER WHERE MASTER.QUOTATION_NO  IN (${data}) AND MASTER.STATUS='${request.Status}' AND MASTER.COMPAny_name='${request.Company}'`
        console.log("kalaa" + query);
        QuotationData = await mainDb.executeQuery(query);

    } catch (error) {
        console.log("error\n" + error);
    }

    return QuotationData;
}
//getQuotationDataDetails
// exports.getQuotationDataDetails = async (invoieMaster) => {
//     //let query = `SELECT * FROM TBL_SIRIM_INVOICE_DETAILS INVDETAILS  WHERE INVDETAILS.Id =${invoieMaster[0].Id}`
//     console.log("ID-- " + JSON.stringify(invoieMaster))
//     let query = `SELECT * FROM TBL_SIRIM_INVOICE_DETAILS INVDETAILS  WHERE Invoice_master_id =${invoieMaster[0].Id}`
//     console.log("getQuotationDataDetails\n" + query)
//     let QuotationData = await mainDb.executeQuery(query);

//     console.log(query);
//     return QuotationData;
// }

exports.getQuotationDataDetails = async (invoieMaster) => {
    //let query = `SELECT * FROM TBL_SIRIM_INVOICE_DETAILS INVDETAILS  WHERE INVDETAILS.Id =${invoieMaster[0].Id}`
    console.log("ID-- " + JSON.stringify(invoieMaster))

    let query;

    if (invoieMaster[0].MasterInvoiceNo !== null && invoieMaster[0].MasterInvoiceNo !== "") {
        let temp = []
        for (let index = 0; index < invoieMaster.length; index++) {
            const element = invoieMaster[index].Id;
            temp.push(element)

            query = `SELECT * FROM TBL_SIRIM_INVOICE_DETAILS INVDETAILS  WHERE Invoice_master_id In (${temp})`
        }

    }
    else {

        query = `SELECT * FROM TBL_SIRIM_INVOICE_DETAILS INVDETAILS  WHERE Invoice_master_id =${invoieMaster[0].Id}`


    }
    console.log("getQuotationDataDetails\n" + query)
    let QuotationData = await mainDb.executeQuery(query);

    console.log(query);
    return QuotationData;
}


// exports.insertInvoiceNo = async (request, invoiceNo, userData) => {
//     console.log(JSON.stringify(userData))
//     let query = `UPDATE TBL_SIRIM_INVOICE_MASTER SET INVOICE_NO='${invoiceNo}', INVOICE_DATE = GETDATE(), STATUS='1', Remarks='${request.remarks === undefined ? '' : request.remarks}',Customer_id='${request.billTo}',Modified_date=GETDATE(),Modified_By='${userData.username}',
//     Manufacturer_address1 ='${request.address1}', Manufacturer_address2 = '${request.address2}', Manufacturer_address3 = '${request.address3}',Country_id='${request.countryCode}',State_id='${request.stateCode}',City_id='${request.cityCode}',Postcode='${request.postCode}',po_no='${request.poNo}',Prepared_by='${userData.contactPerson}', BillToAgency='${request.AgencyCode}'
//     WHERE Id=${request.Id} AND QUOTATION_NO='${request.QuotationNo}'`
//     logger.info("insertInvoiceNo " + query)
//     let responce = await mainDb.executeUpdateQuery(query);
//     logger.info("insertInvoiceNo Responce12 " + JSON.stringify(responce))
//     return responce;
// }
exports.insertInvoiceNo = async (request, invoiceNo, userData) => {
    console.log(JSON.stringify(userData))
    let query = `UPDATE TBL_SIRIM_INVOICE_MASTER SET INVOICE_NO='${invoiceNo}', INVOICE_DATE = GETDATE(), STATUS='1', Remarks='${request.remarks === undefined ? '' : request.remarks}',Manufacturer_name='${request.billTo}',Modified_date=GETDATE(),Modified_By='${userData.username}',
    Manufacturer_address1 ='${request.address1}', Manufacturer_address2 = '${request.address2}', Manufacturer_address3 = '${request.address3}',Country_id='${request.countryCode}',State_id='${request.stateCode}',City_id='${request.cityCode}',Postcode='${request.postCode}',po_no='${request.poNo}',Prepared_by='${userData.contactPerson}', BillToAgency='${request.AgencyCode}'
    WHERE Id=${request.Id} AND QUOTATION_NO='${request.QuotationNo}'`
    logger.info("insertInvoiceNo " + query)
    let responce = await mainDb.executeUpdateQuery(query);
    logger.info("insertInvoiceNo Responce12 " + JSON.stringify(responce))
    return responce;
}

exports.insertMasterInvoiceNo = async (request, invoiceNo, masterinvoiceNo, userData, commanInvoiceData) => {
    console.log("commanInvoiceDatacommanInvoiceData \n" + JSON.stringify(commanInvoiceData))
    // let query = `UPDATE TBL_SIRIM_INVOICE_MASTER SET INVOICE_NO='${invoiceNo}', INVOICE_DATE = GETDATE(), STATUS='1', MASTERINVOICENO ='${masterinvoiceNo}',
    // Modified_date=GETDATE(),Modified_By='${userData.username}',Prepared_by='${userData.contactPerson}' WHERE Id=${request.Id}`

    let query = `UPDATE TBL_SIRIM_INVOICE_MASTER SET INVOICE_NO='${invoiceNo}', INVOICE_DATE = GETDATE(), STATUS='1',MASTERINVOICENO ='${masterinvoiceNo}',
    Internal_remark='${commanInvoiceData.remarks === undefined ? '' : commanInvoiceData.remarks}',Manufacturer_name='${commanInvoiceData.billto}',Modified_date=GETDATE(),Modified_By='${userData.username}',
    Manufacturer_address1 ='${commanInvoiceData.addressline1}', Manufacturer_address2 = '${commanInvoiceData.addresline2}', Manufacturer_address3 = '${commanInvoiceData.addresline3}',
    Country_id='${commanInvoiceData.Country_id}',State_id='${commanInvoiceData.State_id}',City_id='${commanInvoiceData.City_id}',Postcode='${commanInvoiceData.postcode}',po_no='${commanInvoiceData.poNo}',
    Prepared_by='${userData.contactPerson}', BillToAgency='${commanInvoiceData.billtoagency}',Remarks='${commanInvoiceData.invoiceremarks}'
    WHERE Id=${request.Id} AND QUOTATION_NO='${request.Quotation_no}'`

    logger.info("insertMasterInvoiceNo " + query)
    let responce = await mainDb.executeUpdateQuery(query);
    logger.info("insertMasterInvoiceNo Responce " + JSON.stringify(responce))
    return responce;
}

async function quotationDetails() {

    let quotationDetails = `
    SELECT  costing.CostId,cust.CompName,costing.FileId,costing.JobId,costing.BillTo,costing.Remark,costing.GrandTotal,costing.CreatedDate,costing.JobTrend,costing.CreditTerm,
    costingdesc.ItemDesc,costingdesc.ModuleCode,costingdesc.UnitCost,costingdesc.UnitRate,
    costingitem.OthItemDesc,costingitem.ItemRate,costingitem.ManHour,costingitem.ItemTotal,costingitem.GSTAmount,
    quotation.QuoteNo,quotation.Total,quotation.InvAmount,tblfile.FileNo,costingdesc.ItemDesc,costingdesc.InvoiceDesc,currency.Currency
    FROM tbl_costing costing INNER JOIN tbl_costing_item costingitem ON costing.CostId=costingitem.CostId INNER JOIN tbl_costing_desc costingdesc ON costingitem.ItemType=costingdesc.RecId INNER JOIN tbl_quotation quotation ON (quotation.CostId=costing.CostId AND quotation.InvStatus='POSTED') INNER JOIN tbl_file tblfile ON(tblfile.FileId=costing.FileId) INNER JOIN tbl_currency_rates currency  ON(currency.RecId=costing.CurrencyId) INNER JOIN tbl_customer cust ON(cust.CustId=quotation.CustId) WHERE costing.Status='1'`

    let responseData = await mainDb.excuteSelectQuery(quotationDetails);
    // console.log(responseData)
    return responseData;
}
exports.Load_Invoice_Details_ById = (QuotationDetails) => {
    var QuotationId = QuotationDetails.QuotationId;

    return new Promise((resolve, reject) => {
        let query = `
        SELECT  costing.CostId,cust.CompName,costing.FileId,costing.JobId,costing.BillTo,costing.Remark,costing.GrandTotal,costing.CreatedDate,costing.JobTrend,costing.CreditTerm,
        quotation.QuoteNo,quotation.Total,quotation.InvAmount,tblfile.FileNo,currency.Currency,addr.address1,addr.address2,addr.address3,cn.ContactName,cn.Emailaddr,        costingdesc.ItemDesc,costingdesc.ModuleCode,costingdesc.UnitCost,costingdesc.UnitRate,
        costingitem.OthItemDesc,costingitem.ItemRate,costingitem.ManHour,costingitem.ItemTotal,costingitem.GSTAmount
        FROM tbl_costing costing
        INNER JOIN  tbl_costing_item costingitem ON costing.CostId=costingitem.CostId
        INNER JOIN tbl_costing_desc costingdesc ON costingitem.ItemType=costingdesc.RecId
        INNER JOIN tbl_quotation quotation ON (quotation.CostId=costing.CostId AND quotation.InvStatus='POSTED')
        INNER JOIN tbl_file tblfile ON(tblfile.FileId=costing.FileId)
        INNER JOIN tbl_currency_rates currency ON(currency.RecId=costing.CurrencyId)
        INNER JOIN tbl_customer cust ON(cust.CustId=quotation.CustId)
        INNER JOIN tbl_address addr ON(addr.addrId=quotation.AddrId)
        INNER JOIN tbl_contact cn ON(cn.ContactId=quotation.ContactId)
        WHERE quotation.QuoteNo='${QuotationId}'`
        mainDb.GetQueryData(query, (error, data) => {
            if (error) {
                return reject(`${error}, ${query}`)
            }


            return resolve(data)
        })
    })
}


exports.getQoutationDataByOrderNumber = async (data) => {
    console.log("data \n" + JSON.stringify(data))
    let query = `SELECT * FROM TBL_SIRIM_INVOICE_MASTER master  WHERE master.Order_no ='${data.orderNo}'`
    console.log(query);
    let QuotationData = await mainDb.excuteSelectQuery(query);
    return QuotationData;
}


exports.GetInvoiceDataByInvoiceNo = async (InvoiceNo) => {
    console.log("InvoiceNo \n" + JSON.stringify(InvoiceNo))
    let query = `SELECT * FROM TBL_SIRIM_INVOICE_MASTER master  WHERE master.Invoice_no ='${InvoiceNo}' And Status in (1,5)`
    console.log(query);
    let QuotationData = await mainDb.excuteSelectQuery(query);
    return QuotationData;
}
exports.GetMasterInvoiceDataByMasterInvoiceNo = async (MasterInvoiceNo) => {
    console.log("MasterInvoiceNo \n" + JSON.stringify(MasterInvoiceNo))
    let query = `SELECT * FROM TBL_SIRIM_INVOICE_MASTER master  WHERE master.MasterInvoiceNo ='${MasterInvoiceNo}' And Status in (1,5)`
    console.log(query);
    let QuotationData = await mainDb.excuteSelectQuery(query);
    return QuotationData;
}


exports.GetShemaType = async (QuotationNo) => {
    let query = `select * from tbl_scheme_type where SchemeId in (select secId from tbl_file where fileId in (select file_id from tbl_sirim_invoice_master where Quotation_no = '${QuotationNo}'))`
    console.log(query)
    let GetShemaTypevalue = await mainDb.executeQuery(query);
    return GetShemaTypevalue
}

exports.CheckFI = async (QuotationNo) => {
    console.log("CheckFI>>>>>")
    let query = `select * from tbl_agency where custCode in (select custCode from tbl_customer where custId in (select custId from tbl_file where fileId in (select file_id from tbl_sirim_invoice_master where Quotation_no='${QuotationNo}')))`
    // let query = `select * from tbl_agency where custCode='11000965'`
    let CheckFIdata = await mainDb.executeQuery(query);
    return CheckFIdata

}

exports.getSeccode = async (QuotationNo) => {

    let query = `select Sector_type_unitcode,Invoice_type from tbl_sirim_invoice_master where Quotation_no ='${QuotationNo}'`
    console.log(query)
    let secCode = await mainDb.executeQuery(query);
    return secCode

}


exports.getSeccodewithMasterInvNo = async (QuotationNo) => {

    let data = await sirimUtils.convertArrayToQuteString(QuotationNo.split(","))

    let query = `select Sector_type_unitcode,Invoice_type from tbl_sirim_invoice_master where Quotation_no IN (${data})`
    console.log(query)
    let secCode = await mainDb.executeQuery(query);
    return secCode

}

exports.InsertInvoiceMasterData = async (InvoiceNo, MasterData, SecId, UnitCode) => {
    let query1 = `select max(id+1) as id from tbl_sirim_Invoice_Master`

    let iddata = await mainDb.executeQuery(query1)
    console.log("iddata" + JSON.stringify(iddata))

    let query = '';
    if (MasterData.foreignCurrency === 'Y') {
        query = `insert into tbl_sirim_Invoice_Master (id,
            Customer_id, Customer_name, User_name, Company_name ,Manufacturer_name ,Manufacturer_address1 ,Manufacturer_address2 ,Manufacturer_address3 ,City_id ,State_id
            ,Address_Id ,Country_id ,File_no ,Product, Foreign_currency ,Invoice_no,Sub_total ,Gst_amount ,Total_amount ,Sub_total_rm ,Gst_amount_rm ,Total_amount_rm ,
            Invoice_date ,Prepared_by ,Remarks ,Status ,Job_date ,Expiry_date ,Completion_date ,License_no ,Invoice_type ,Currency
            ,Bad_debt_status ,Postcode ,Sector_type_unitcode ,Created_by ,Created_date ,SecId,Quotation_no,internal_Remark,Exchange_rate) 
            OUTPUT INSERTED.Id values (${iddata[0].id},
            '${(MasterData.customerId).trim()}','${MasterData.customerName}','${MasterData.userName}','${MasterData.billTo}','${MasterData.billTo}','${MasterData.address1}','${MasterData.address2}','${MasterData.address3}','${MasterData.cityId}','${MasterData.stateId}',
            '${MasterData.AddrId}','${MasterData.countryId}','${MasterData.InvoiceDetails[0].FileNo}','${MasterData.product}','${MasterData.foreignCurrency}','${InvoiceNo}', '${MasterData.GrantTotal}','${MasterData.GstAmount}','${MasterData.SubAmount}', '${MasterData.GrantTotal_rm}','${MasterData.GstAmount_rm}','${MasterData.SubAmount_rm}',
            GETDATE(),'${MasterData.PreparedBy}', '${MasterData.invoiceRemark}','1',${MasterData.jobDate === '' ? null : "'" + MasterData.jobDate + "'"},${MasterData.experyDate === '' ? null : "'" + MasterData.experyDate + "'"},'${MasterData.completionDate}','${MasterData.InvoiceDetails[0].LicenseNo}','${MasterData.invoicetype}','${MasterData.currency}',
            '0','${MasterData.postCode}','${UnitCode}','${MasterData.PreparedBy}',GETDATE(),'${SecId}','${MasterData.quotationNo}','${MasterData.remarks}','${MasterData.exchangeRate}')`
    } else {
        query = `insert into tbl_sirim_Invoice_Master (id,
            Customer_id, Customer_name, User_name, Company_name ,Manufacturer_name ,Manufacturer_address1 ,Manufacturer_address2 ,Manufacturer_address3 ,City_id ,State_id
            ,Address_Id ,Country_id ,File_no ,Product, Foreign_currency ,Invoice_no,Sub_total ,Gst_amount ,Total_amount ,Sub_total_rm ,Gst_amount_rm ,Total_amount_rm ,
            Invoice_date ,Prepared_by ,Remarks ,Status ,Job_date ,Expiry_date ,Completion_date ,License_no ,Invoice_type ,Currency
            ,Bad_debt_status ,Postcode ,Sector_type_unitcode ,Created_by ,Created_date ,SecId,Quotation_no,internal_Remark,Exchange_rate) 
            OUTPUT INSERTED.Id values (${iddata[0].id},
            '${(MasterData.customerId).trim()}','${MasterData.billTo}','${MasterData.userName}','${MasterData.billTo}','${MasterData.billTo}','${MasterData.address1}','${MasterData.address2}','${MasterData.address3}','${MasterData.cityId}','${MasterData.stateId}',
            '${MasterData.AddrId}','${MasterData.countryId}','${MasterData.InvoiceDetails[0].FileNo}','${MasterData.product}','${MasterData.foreignCurrency}','${InvoiceNo}','0.00','0.00','0.00', '${MasterData.GrantTotal_rm}','${MasterData.GstAmount_rm}','${MasterData.SubAmount_rm}',
            GETDATE(),'${MasterData.PreparedBy}', '${MasterData.invoiceRemark}','1',${MasterData.jobDate === '' ? null : "'" + MasterData.jobDate + "'"},${MasterData.experyDate === '' ? null : "'" + MasterData.experyDate + "'"},'${MasterData.completionDate}','${MasterData.InvoiceDetails[0].LicenseNo}','${MasterData.invoicetype}','${MasterData.currency}',
            '0','${MasterData.postCode}','${UnitCode}','${MasterData.PreparedBy}',GETDATE(),'${SecId}','${MasterData.quotationNo}','${MasterData.remarks}','${MasterData.exchangeRate}')`
    }



    console.log(query)

    let CheckFIdata = await mainDb.InsertandReturnID(query)
    return CheckFIdata

}

exports.insertInvoiceDetailsData = async (InvoiceMasterId, InvoiceDetailsData, MasterData) => {

    let query1 = `select max(id+1) as id from tbl_sirim_invoice_details`

    let iddata = await mainDb.executeQuery(query1)
    console.log("iddata" + JSON.stringify(iddata))

    console.log("InvoiceDetailsData\n" + JSON.stringify(InvoiceDetailsData))
    let query = `INSERT INTO tbl_sirim_invoice_details(Id,
        Invoice_master_id,Item_desc,No_of_unit,Amount,Gst_amount,ManHour,Is_latest,Total_amount,Created_date,Created_by,
        Quotation_No,Audit_Fee,Product_Name,License_No,Inspector_Name,Auditor_Name,Job_No,Expiry_date,Income_code,Unit_price,Gst_Amount_Rm,Total_Amount_Rm,Type_Of_Supply
        ) Output Inserted.Id values(${iddata[0].id},${InvoiceMasterId},'${InvoiceDetailsData.Description}',${InvoiceDetailsData.noofunits},
        ${InvoiceDetailsData.SubAmount},${InvoiceDetailsData.GstAmount},
        null,1,${InvoiceDetailsData.GrantTotal},GETDATE(),'${MasterData.PreparedBy}','${MasterData.quotationNo}',null,'${MasterData.product}','${InvoiceDetailsData.LicenseNo}','','','${MasterData.jobTrend}','${MasterData.experyDate}','${InvoiceDetailsData.income_code}',${InvoiceDetailsData.unit_price},'${InvoiceDetailsData.GstAmount * MasterData.exchangeRate}','${InvoiceDetailsData.SubAmount * MasterData.exchangeRate}','${InvoiceDetailsData.type_of_supply}')`
    console.log(query)
    // let CheckFIdata = await mainDb.executeUpdateQuery(query);
    let CheckFIdata = await mainDb.InsertandReturnID(query)
    return CheckFIdata

}


exports.getSectionUnitCode = async (userName) => {

    let query = `select * from tbl_sector_type where type in (select Section from tbl_user where username='${userName}')`
    console.log(query)
    // let CheckFIdata = await mainDb.executeUpdateQuery(query);
    let CheckFIdata = await mainDb.executeQuery(query)
    return CheckFIdata

}


exports.updateIgstIdByInvoiceNo = async (InvoiceNo, IgstId) => {

    let query = `update tbl_sirim_invoice_master set igst_txn_no='${IgstId}' where Invoice_no='${InvoiceNo}'`
    console.log(query)
    // let CheckFIdata = await mainDb.executeUpdateQuery(query);
    let CheckFIdata = await mainDb.executeUpdateQuery(query)
    return CheckFIdata

}

exports.getCustcode = async (Custcode) => {

    let query = `select * from tbl_sirim_customers where cust_code = ${Custcode}`
    console.log(query)
    // let CheckFIdata = await mainDb.executeUpdateQuery(query);
    let CheckFIdata = await mainDb.executeQuery(query)
    return CheckFIdata

}


exports.getcustomerName = async (req) => {

    let query = `select contact_person_name from tbl_sirim_users where username = '${req.userName}'`
    console.log(query)
    // let CheckFIdata = await mainDb.executeUpdateQuery(query);
    let customerName = await mainDb.executeQuery(query)
    return customerName;

}