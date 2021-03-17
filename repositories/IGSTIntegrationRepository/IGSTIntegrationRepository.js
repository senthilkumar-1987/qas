
const mainDb = require('../MainDb');
var xml2js = require('xml2js');
var moment = require('moment');
const { query } = require('winston');

exports.requestRegisterApplication = async (InvoiceNo) => {
    // console.log("InvoiceNo ==> " + InvoiceNo)
    return new Promise((resolve, reject) => {
        let query = `select 
        master.Customer_id AS CostId, master.Customer_id AS customerID, '' AS applicationDescription, 
        CASE WHEN master.MasterInvoiceNo IS NOT null THEN 'B' ELSE 'N' END AS applicationMode, 
        master.Manufacturer_address1 AS billingaddress1, master.Manufacturer_address2 AS billingaddress2, 
        master.Manufacturer_address3 AS billingaddress3, city.CityName AS City, 'K' AS company, states.StateName AS state, 
        country.CountryName, master.Invoice_type AS creditterm,master.igst_txn_no as gstid, master.Currency AS currency, master.Customer_name AS Customer_name, 
        '1' AS customerType, users.Email AS Email, master.File_no AS fileNo,  CAST('0.00' as DECIMAL(10,2)) AS foriegntotalAmount, 
        CAST('0.00' as DECIMAL(10,2)) AS foriegntotalDiscount, CAST('0.00' as DECIMAL(10,2)) AS foriegntotalGST, master.PostCode AS postcode, master.Order_no AS referenceNo,
        '' AS scopeofService, '' AS sector_type, 'ESCS' AS siteID, 
        CAST((master.sub_total_rm) as DECIMAL(10,2)) AS totalAmount, 
        CAST((master.GrandTotal-master.FinalAmt) as DECIMAL(10,2)) AS totalDiscount, master.Company_name AS CompanyName, users.UserName AS username, 
        master.sector_type_unitCode AS sectionCode
        from tbl_sirim_Invoice_Master master
        INNER JOIN tbl_city city ON (city.RecId=master.City_id  AND city.Status=1)
        INNER JOIN tbl_state states ON (states.StateId=master.State_id  AND states.Status=1)
        INNER JOIN tbl_country country ON (country.CountryId=master.Country_id AND country.Status=1)
        INNER JOIN tbl_sirim_users users ON (users.username=master.User_name AND users.Status='Active')
        where master.Invoice_no = '${InvoiceNo}'`

        console.log("requestRegisterApplication query == >" + query);

        mainDb.GetQueryData(query, (error, data) => {
            if (error) {
                return reject(`${error}, ${query}`)
            }
            return resolve(data)
        })
    })
}


exports.requestRegisterApplicationTotalAmt = (CostId) => {

    return new Promise((resolve, reject) => {
        let query = `SELECT CAST(SUM(GrandTotal) as DECIMAL(10,2)),CAST(SUM(DiscountTotal) as DECIMAL(10,2)),CAST(SUM(FinalAmt) as DECIMAL(10,2)) FROM tbl_costing WHERE CostId=${CostId}`
        mainDb.GetQueryData(query, (error, data) => {
            if (error) {
                return reject(`${error}, ${query}`)
            }
            return resolve(data)
        })
    })
}

exports.requestRegisterApplicationGSTAmt = (InvoiceNo) => {

    return new Promise((resolve, reject) => {
        // let query = `SELECT SUM(ITEMTOTAL) AS ITEMTOTAL,SUM(GSTAMOUNT) AS GSTAMOUNT FROM tbl_costing_item WHERE CostId='${costId}';`
        let query = `select sum(master.sub_total_rm) AS totalAmount, (master.GrandTotal-master.FinalAmt) AS totalDiscount from tbl_sirim_Invoice_Master master where master.Invoice_no ='${InvoiceNo}' group by master.Invoice_no,master.sub_total_rm ,master.GrandTotal,master.FinalAmt`;
        console.log('requestRegisterApplicationGSTAmt query \n' + query)
        mainDb.GetQueryData(query, (error, data) => {
            if (error) {
                return reject(`${error}, ${query}`)
            }
            return resolve(data)
        })
    })
}


exports.getInvoiceMasterDetails = (invoiceNo) => {

    return new Promise((resolve, reject) => {
        let query = `SELECT * FROM TBL_SIRIM_INVOICE_MASTER WHERE INVOICE_NO='${invoiceNo}' `
        mainDb.GetQueryData(query, (error, data) => {
            if (error) {
                return reject(`${error}, ${query}`)
            }
            return resolve(data)
        })
    })
}

// let currentDate = moment().format('YYYY-MM-DD HH:mm:ss');
// moment((${responce.requestTime})).format('DD/MM/YYYY HH:mm:ss')
// ${responce.requestTime}
exports.insertIGSTIntegrstionResponce = (responce, InvoiceNo, responseCode, applicationID, responseMessage, igstId) => {
    console.log("insertIGSTIntegrstionResponce ==> " + InvoiceNo + " " + JSON.stringify(responce));
    let reqdate = moment(responce.requestTime).format('YYYY-MM-DD hh:mm:ss')
    let resdate = moment(responce.responseTime).format('YYYY-MM-DD hh:mm:ss')
    let req = JSON.stringify(responce.request);
    let res = JSON.stringify(responce.response);
    var builder = new xml2js.Builder();
    let recipNo = null;
    if (responce.serviceType == 'generateGeneralPaymentInfoResponse') {
        recipNo = responce.return.receiptNo;
    }
    var requestXML = builder.buildObject(req);
    var responceXML = builder.buildObject(res);

    responceXML = responceXML.replace(/'/g, '"');

    console.log("responceXML \n" + JSON.stringify(responceXML));
    let query = `INSERT INTO tbl_sirim_igst_req_res(service_type,webService_url,request_xml,response_xml,ResponceCode,request_datetime,response_datetime,quotationNo,invoiceNo,applicationID,responseMessage,ReceiptNo,requestJSON,igst_txn_no) VALUES('${responce.serviceType}','${responce.serviceUrl}',
    '${requestXML}','${responceXML}','${responseCode === undefined ? '' : responseCode}','${reqdate}','${resdate}',NULl,'${InvoiceNo}','${applicationID === undefined ? '' : applicationID}','${responseMessage === undefined ? '' : responseMessage}','${recipNo}','${req}','${igstId}')`
    console.log("\n\ntbl_sirim_igst_req_res Query ==> \n" + query + "\n\n")
    return new Promise((resolve, reject) => {
        mainDb.InsertUpdateDeleteData(query, (error, data) => {
            if (error) {
                console.log("error" + error)
                return reject(`${error}, ${query}`)
            }
            return resolve(data);
        })
    });
}


exports.getdataInvoiceMaster = (InvoiceNo) => {

    return new Promise((resolve, reject) => {
        let query = `SELECT IVM.*,ICD.Detailcode FROM TBL_SIRIM_INVOICE_MASTER IVM INNER JOIN tbl_Incomecode_detail ICD ON ( IVM.incomeDetailCodeId=ICD.DetailId AND ICD.Status=1) WHERE IVM.Invoice_no='${InvoiceNo}'`
        console.log('getdataInvoiceMaster \n' + query)
        mainDb.GetQueryData(query, (error, data) => {
            if (error) {
                return reject(`${error}, ${query}`)
            }
            return resolve(data)
        })
    })
}

exports.getInvoiceMasterItemData = (invoiceMasterData) => {
    // console.log("invoiceMasterData " + JSON.stringify(invoiceMasterData))
    // console.log("invoiceMasterData " + JSON.stringify(invoiceMasterData[0].Id))    ${invoiceMasterData[0].Id}
    return new Promise((resolve, reject) => {
        let query = `SELECT * FROM tbl_sirim_Invoice_Details  WHERE Invoice_master_id=${invoiceMasterData[0].Id} `
        mainDb.GetQueryData(query, (error, data) => {
            if (error) {
                return reject(`${error}, ${query}`)
            }
            return resolve(data)
        })
    })
}


exports.getPaymentDetailsCHEQUE = async (invoiceMasterData) => {
    return new Promise((resolve, reject) => {
        let query = `SELECT * FROM tbl_sirim_chq_details WHERE TBL_SIRIM_INV_ID='${invoiceMasterData[0].Id}' `
        console.log(query)
        mainDb.GetQueryData(query, (error, data) => {
            if (error) {
                return reject(`${error}, ${query}`)
            }
            return resolve(data)
        })
    })
}

exports.getigstDetails = async (invoiceNo) => {
    return new Promise((resolve, reject) => {
        let query = `select * from tbl_sirim_igst_req_res where invoiceNo='${invoiceNo}' order by id desc `
        // console.log(query)
        mainDb.GetQueryData(query, (error, data) => {
            if (error) {
                return reject(`${error}, ${query}`)
            }
            return resolve(data)
        })
    })
}

exports.getBankCodeDetails = async (invoiceMasterData) => {

    let Query = `select * from tbl_sirim_bank_code where Pay_type = '${invoiceMasterData.Payment_type}'`;
    console.log('getBankCodeDetails\n' + Query)
    return await mainDb.executeQuery(Query);

}