const mainDb = require('../MainDb');

exports.getCustReport = async (req, res) => {
    console.log("getCustReport Request\n" + JSON.stringify(req.body))
    let fromDate = req.body.fromDate;
    let toDate = req.body.toDate;
    let query = "";

    // query = "select * from tbl_sirim_users"; 
    query = `select * from tbl_sirim_customers customer `
    if (fromDate && toDate) {
        let fromDatetime = fromDate + " 00:00:00"
        let toDatetime = toDate + " 23:59:59"
        query += " where customer.created_date between '" + fromDatetime + "' AND '" + toDatetime + "'"
    }
    if (req.body.companyName && req.body.companyName != '') {

        if (fromDate && toDate && fromDate != null && fromDate != '' && toDate != null && toDate != '') {
            query += ` AND customer.company_name LIKE '%${req.body.companyName}%' `
        } else {
            query += ` WHERE customer.company_name LIKE '%${req.body.companyName}%' `
        }
    }
    if (req.body.Status && req.body.Status != '') {
        if (fromDate && toDate && fromDate != null && fromDate != '' && toDate != null && toDate != '') {
            query += " AND customer.cpa_status = '" + req.body.Status + "'"
        } else {
            if (req.body.companyName && req.body.companyName != null && req.body.companyName != '') {
                query += " AND customer.cpa_status = '" + req.body.Status + "'"
            } else {
                query += " WHERE customer.cpa_status = '" + req.body.Status + "'"
            }

        }
    }
    query += " ORDER BY register_id DESC"

    console.log("query getCustReport\n" + query)

    let response = await mainDb.executeQuery(query);

    return response;

};


exports.getCustDetailsReport = async (registerId) => {
    console.log("getCustDetailsReport Request\n" + JSON.stringify(registerId))
    let query = "";
    query = `select * from tbl_sirim_customers customer, tbl_sirim_customers_address address, tbl_sirim_customers_contact contact where 
    customer.register_Id=${registerId} AND address.register_Id =${registerId} AND address.addr_id=contact.addr_id`
    console.log("query getCustDetailsReport \n" + query)

    let response = await mainDb.executeQuery(query);

    return response;

};

// exports.get_customer_activity_report = async (req, res) => {

//     let fromDate = req.body.fromDate;
//     let toDate = req.body.toDate;
//     let companyname = req.body.companyname;
//     let userid = req.body.userid
//     let query = "";

//     let resObj = {};

//     query = "select * from tbl_sirim_customer_audit_log";

//     if (fromDate && toDate) {
//         query += " where created_date between '" + fromDate + "' AND '" + toDate + "'"
//     }

//     resObj = await mainDb.executeQuery(query);

//     return resObj;

// };

// exports.get_customer_activity_report = async (req, res) => {
//     console.log(JSON.stringify(req.body))
//     let fromDate = req.body.fromDate;
//     let toDate = req.body.toDate;
//     let coustomername = req.body.coustomername;
//     let user_id = req.body.userid;

//     let query = "";

//     let resObj = {};

//     query = `select * from tbl_sirim_customer_audit_log where created_date between '${fromDate}' AND '${toDate}' AND customer_name ='${coustomername}'  `;

//     if (user_id !== "") {
//         query += ` And user_name ='${user_id}'`
//     }


//     console.log(query)
//     resObj = await mainDb.executeQuery(query);

//     return resObj;

// };

exports.get_customer_activity_report = async (req, res) => {
    console.log(JSON.stringify(req.body))
    let fromDate = req.body.fromDate;
    let toDate = req.body.toDate;
    let coustomername = req.body.coustomername;
    let user_id = req.body.userid;
    let query = "";
    let query1 = `SELECT cust_code from tbl_sirim_customers tsc where company_name = '${coustomername}' `
    console.log(query1)
    let data = await mainDb.executeQuery(query1);
    let resObj = {};
    let fromDates = fromDate + ' 00:00:00.000';
    let toDates = toDate + ' 23:59:59.999'
    query = `select * from tbl_sirim_customer_audit_log where created_date  BETWEEN '${fromDates}' AND '${toDates}' `;
    // console.log("data>>>" + JSON.stringify(data))

    if (data !== null && data.length > 0) {
        query += ` AND cust_id ='${data[0].cust_code}' `
    } else {
        query += ` AND company_name ='${coustomername}'`
    }
    if (user_id !== null && user_id !== "") {
        query += ` And user_name ='${user_id}' `;
    }
    console.log("Customer Activity select\n" + query)
    resObj = await mainDb.executeQuery(query);

    return resObj;

};

// exports.get_customer_payment_due_history = async (req, res) => {
//     console.log("get_customer_payment_due_history\n" + JSON.stringify(req.body))

//     let fromDate = req.body.fromDate;
//     let toDate = req.body.toDate;

//     let resObj = {};

//     let query = `select * from tbl_sirim_Invoice_Master`;


//     if (!req.body.invoiceNo && req.body.invoiceNo === '' && !req.body.Status && req.body.Status === ''
//         && !req.body.companyName && req.body.companyName === '' && !fromDate && !toDate) {

//         query = "select * from tbl_sirim_Invoice_Master where status=1 ";

//     }

//     if (req.body.Status === '') {

//         query += " where status IN ('0','1','2','3') ";

//     }

//     if (req.body.Status && req.body.Status != '') {
//         query += " where status=" + req.body.Status + " ";
//     }

//     if (fromDate && toDate) {
//         query += "AND  created_date between '" + fromDate + "' AND '" + toDate + "'"
//     }

//     if (req.body.companyName && req.body.companyName != '') {
//         query += "AND Company_name like ('%" + req.body.companyName + "%')"
//     }

//     if (req.body.invoiceNo && req.body.invoiceNo != '') {
//         query += "AND Invoice_no = '" + req.body.invoiceNo + "'"
//     }


//     console.log("query \n" + query)
//     resObj = await mainDb.executeQuery(query);

//     return resObj;

// };
exports.get_customer_payment_due_history = async (req, res) => {


    let resObj = {};
    let fromDate = req.body.fromDate;
    let toDate = req.body.toDate;
    let CompanyName = req.body.companyName;
    let Status = req.body.Status;
    let InvoiceNumber = req.body.invoiceNo;

    console.log("started---" + JSON.stringify(InvoiceNumber));
    let query = `Select * from tbl_sirim_Invoice_Master where Status NOT IN ('',0,3,6,7,10) AND status is not null  `
    if (fromDate && toDate !== '') {
        fromDate = fromDate + ' 00:00:00';;
        toDate = toDate + ' 23:59:59';
        query += ` AND Invoice_date BETWEEN '${fromDate}' AND '${toDate}' `;


        if (CompanyName !== '') {

            query += ` AND  Company_name  like '%${CompanyName}%'`

        }

        if (Status !== '') {


            query += ` AND Status IN  (${Status})`
        }

        if (InvoiceNumber !== '') {

            query += ` AND Invoice_no = '${InvoiceNumber}`
        }

        console.log("S---check" + query);


    } else if (CompanyName !== '') {

        query += ` AND Company_name  like '%${CompanyName}%'`



        if (Status !== '') {

            query += ` AND Status IN (${Status})`
        }

        if (InvoiceNumber !== '') {

            query += ` AND Invoice_no = '${InvoiceNumber}'`
        }

    } else if (Status !== '') {


        query += ` AND Status IN (${Status})`

        if (InvoiceNumber !== '') {

            query += ` AND Invoice_no = '${InvoiceNumber}'`
        }



    } else if (InvoiceNumber !== '') {

        query += ` AND Invoice_no = '${InvoiceNumber}'`


    }

    console.log("queryYYY----" + query);

    resObj = await mainDb.executeQuery(query);

    return resObj;
}