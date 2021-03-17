let CurrentYearInvoices = require('../../../repositories/PaymentRepository/SectionClerk/CurrentYearInvoices');
let PreviousYearInvoices = require('../../../repositories/PaymentRepository/SectionClerk/PreviousYearInvoices');
let responseDto = require('../../../config/ResponseDto')
var constants = require('../../../config/PaymentConstants');
;


let CurrentYear_Invoices = async (req, res) => {
    let usedata = req.userData;
    console.log(JSON.stringify(usedata))
    let status = req.query.status;
    try {
        let userRoles = usedata.roleId;
        let RoleNames = [];
        for (let index = 0; index < userRoles.length; index++) {
            const element = userRoles[index];
            RoleNames.push(element.role)
        }
        console.log("RoleNames \n" + JSON.stringify(RoleNames))
        if (RoleNames && RoleNames != '' && RoleNames.includes('Clerk')) {
            console.log("true")
            status = "null,'',0,1,2,3,4,5,6";

        }

        let resultCurrentYearInvoices = await CurrentYearInvoices.get_bad_dept_invoices_curret_year(status);
        return res.json(new responseDto(constants.STATUS_SUCCESS, '', resultCurrentYearInvoices));

    }
    catch (err) {
        console.log(err);
        return res.json(new responseDto('', constants.STATUS_FAIL, err));
    }
}


letupdatBadDeptStatus = async (req, res) => {
    try {

        let resultCurrentYearInvoices = await CurrentYearInvoices.get_bad_dept_invoices_curret_year();
        return res.json(new responseDto(constants.STATUS_SUCCESS, '', resultCurrentYearInvoices));

    }
    catch (err) {
        console.log(err);
        return res.json(new responseDto('', constants.STATUS_FAIL, err));
    }
}


let getSingleInvoiceDetails = async (req, res) => {
    try {
        // console.log(req.query);

        let resultInvoiceDetails = await CurrentYearInvoices.getsingleInvoices(req.query.InvoiceNo);
        return res.json(new responseDto(constants.STATUS_SUCCESS, '', resultInvoiceDetails));

    }
    catch (err) {
        console.log(err);
        return res.json(new responseDto('', constants.STATUS_FAIL, err));
    }
}

let Previous_YearInvoices = async (req, res) => {
    let usedata = req.userData;
    console.log(JSON.stringify(usedata))
    let status = req.query.status;
    try {
        console.log(req.query)

        let userRoles = usedata.roleId;
        let RoleNames = [];
        for (let index = 0; index < userRoles.length; index++) {
            const element = userRoles[index];
            RoleNames.push(element.role)
        }
        if (RoleNames && RoleNames != '' && RoleNames.includes('Clerk')) {
            status = "null,'',0,1,2,3,4,5,6";
        }

        let resultPreviousYearInvoices = await PreviousYearInvoices.GET_BAD_DEPT_INVOICES_PREVIOUS_YEAR(status);
        console.log(resultPreviousYearInvoices)
        return res.json(new responseDto(constants.STATUS_SUCCESS, '', resultPreviousYearInvoices));

    }
    catch (err) {
        console.log(err);
        return res.json(new responseDto('', constants.STATUS_FAIL, err));
    }
}

module.exports = {
    CurrentYear_Invoices, Previous_YearInvoices, getSingleInvoiceDetails
}