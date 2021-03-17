const SCISRepo = require('../../config/SCISDbConfig');

exports.getCancelledInvoiceList = async (req, res) => {

    let query = `select * from tbl_sirim_Invoice_Master where Bad_debt_status = 10 AND status = 6 `;

    if (req.body.fromDate && req.body.toDate) {
        query += ` and CAST(Invoice_date AS DATE) between '${req.body.fromDate}' AND '${req.body.toDate}' `
    }
    console.log(query)

    return await SCISRepo.executeQuery(query);

}