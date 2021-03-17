let loadRegisterDetails = require('../../repositories/CustomersRepository/CPADashboardLogic')
let DashboardRepository = require('../../repositories/DashboardRepository/DashboardRepository')
let responseDto = require('../../config/ResponseDto')
var constants = require('../../config/PaymentConstants');
let invoiceRepo = require('../../repositories/PaymentRepository/InvoiceDetails');


exports.loadRegDetails = async (req, res) => {
    try {

        let status = req.query.status;

        var regDetails = await loadRegisterDetails.Load_Registration_Details(status)
        // console.log(regDetails)
        return res.json(new responseDto(constants.STATUS_SUCCESS, '', regDetails));

    }

    catch (e) {
        console.log(e);
        return res.json(new responseDto('', constants.STATUS_FAIL, e));
    }

}

exports.getCertificateCount = async (req, res) => {

    try {

        let sessionObj = req.userData;
        console.log("sessionObj--->" + JSON.stringify(sessionObj));

        let resObj = await DashboardRepository.getCount(sessionObj, req, res);

        return res.json(new responseDto(constants.STATUS_SUCCESS, '', resObj));
    } catch (err) {
        console.log('Error ', err);
        return res.json(new responseDto(constants.STATUS_FAIL, err, ''));
    }

}

exports.getCertificateDetails = async (req, res) => {

    try {

        let sessionObj = req.userData;
        let resObj = await DashboardRepository.getCertificationDetails(sessionObj, req, res);
        return res.json(new responseDto(constants.STATUS_SUCCESS, '', resObj));
    } catch (err) {
        console.log('Error ', err);
        return res.json(new responseDto(constants.STATUS_FAIL, err, ''));
    }

}


exports.changeRequestCount = async (req, res) => {

    try {

        let sessionObj = req.userData;
        let resObj = await DashboardRepository.changeRequestCount(sessionObj, req, res);
        return res.json(new responseDto(constants.STATUS_SUCCESS, '', resObj));
    } catch (err) {
        console.log('Error ', err);
        return res.json(new responseDto(constants.STATUS_FAIL, err, ''));
    }

}

exports.changeRequestDetails = async (req, res) => {

    try {

        let sessionObj = req.userData;
        let resObj = await DashboardRepository.changeRequestDetails(sessionObj, req, res);
        return res.json(new responseDto(constants.STATUS_SUCCESS, '', resObj));
    } catch (err) {
        console.log('Error ', err);
        return res.json(new responseDto(constants.STATUS_FAIL, err, ''));
    }

}


exports.MaintenanceCount = async (req, res) => {

    try {

        let sessionObj = req.userData;
        let resObj = await DashboardRepository.MaintenanceCount(sessionObj, req, res);
        return res.json(new responseDto(constants.STATUS_SUCCESS, '', resObj));
    } catch (err) {
        console.log('Error ', err);
        return res.json(new responseDto(constants.STATUS_FAIL, err, ''));
    }

}



exports.MaintenanceDetails = async (req, res) => {

    try {

        let sessionObj = req.userData;
        let resObj = await DashboardRepository.MaintenanceDetails(sessionObj, req, res);
        return res.json(new responseDto(constants.STATUS_SUCCESS, '', resObj));
    } catch (err) {
        console.log('Error ', err);
        return res.json(new responseDto(constants.STATUS_FAIL, err, ''));
    }

}

exports.MasterInvoiceDetailsPage = async (req, res) => {

    try {
        let resObj = {}
        let invoieMaster = req.body.QuotationNo

        // let sessionObj = req.userData;
        resObj.master = await DashboardRepository.MasterInvoiceDetailPage(req, res).catch((e) => {
            console.log(e);
        });



        if (invoieMaster[0] !== "") {

            let QuotationNo = invoieMaster[0]

            let getSchematype = await invoiceRepo.GetShemaType(QuotationNo).catch((e) => {
                console.log(e);
            });
            console.log("----S------>..>" + JSON.stringify(getSchematype))
            console.log("getSchematype>>" + getSchematype != [] + ' ' + JSON.stringify(getSchematype))

            if (getSchematype && getSchematype !== null && getSchematype.length > 0) {

                if (getSchematype[0].SchemeName === "Foreign Inspection") {
                    let CheckForeignInspection = await invoiceRepo.CheckFI(QuotationNo).catch((e) => {
                        console.log(e);
                    });

                    if (CheckForeignInspection.length !== 0) {

                        console.log("Agencydata>>> if")

                        resObj.Agencydata = CheckForeignInspection

                    }
                }
                else {
                    console.log("Agencydata>>> else")
                    resObj.Agencydata = null
                }
            } else {
                resObj.Agencydata = null
            }
        }


        return res.json(new responseDto(constants.STATUS_SUCCESS, '', resObj));
    } catch (err) {
        console.log('Error ', err);
        return res.json(new responseDto(constants.STATUS_FAIL, err, ''));
    }

}