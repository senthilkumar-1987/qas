let SCISRepo = require('../../repositories/ReportsMgtRepo/SCISRepository');

const responseDto = require('../../config/ResponseDto');
let constants = require('../../config/Constants');

exports.getProductListService = async (req, res) => {

    try {

        let sessionObj = req.userData;
        let resObj = await SCISRepo.getProductList(sessionObj, req, res);
        return res.json(new responseDto(constants.STATUS_SUCCESS, '', resObj));
    } catch (err) {
        console.log('Error ', err);
        return res.json(new responseDto(constants.STATUS_FAIL, err, ''));
    }

}

exports.getAepReportListService = async (req, res) => {

    try {

        let sessionObj = req.userData;
        let resObj = await SCISRepo.getAepReportList(sessionObj, req, res);
        return res.json(new responseDto(constants.STATUS_SUCCESS, '', resObj));
    } catch (err) {
        console.log('Error ', err);
        return res.json(new responseDto(constants.STATUS_FAIL, err, ''));
    }

}

exports.getAuditiorListService = async (req, res) => {

    try {

        let sessionObj = req.userData;
        let resObj = await SCISRepo.getAuditiorList(sessionObj, req, res);
        return res.json(new responseDto(constants.STATUS_SUCCESS, '', resObj));
    } catch (err) {
        console.log('Error ', err);
        return res.json(new responseDto(constants.STATUS_FAIL, err, ''));
    }

}

exports.getStandardListService = async (req, res) => {

    try {

        let sessionObj = req.userData;
        let resObj = await SCISRepo.getStandardList(sessionObj, req, res);
        return res.json(new responseDto(constants.STATUS_SUCCESS, '', resObj));
    } catch (err) {
        console.log('Error ', err);
        return res.json(new responseDto(constants.STATUS_FAIL, err, ''));
    }

}


exports.getISSonQuatationReportServices = async (req, res) => {
    try {
        let sessionObj = req.userData;
        let resObj = await SCISRepo.getISSonQuatationRepo(sessionObj, req, res);
        return res.json(new responseDto(constants.STATUS_SUCCESS, '', resObj))

    } catch (error) {
        return res.json(new responseDto(constants.STATUS_FAIL, error, ''));
    }

}

exports.getISSInvoiceReportServices = async (req, res) => {
    try {
        let sessionObj = req.userData;
        let resObj = await SCISRepo.getISSInvoiceRepo(sessionObj, req, res);
        return res.json(new responseDto(constants.STATUS_SUCCESS, '', resObj))

    } catch (error) {
        return res.json(new responseDto(constants.STATUS_FAIL, error, ''));
    }

}

exports.getQuotationReportListServices = async (req, res) => {
    try {
        let sessionObj = req.userData;
        let resObj = await SCISRepo.getQuotationReportListRepo(sessionObj, req, res);
        return res.json(new responseDto(constants.STATUS_SUCCESS, '', resObj))

    } catch (error) {
        return res.json(new responseDto(constants.STATUS_FAIL, error, ''));
    }

}



exports.getMonthServices = async (req, res) => {
    try {
        let sessionObj = req.userData;
        let resObj = await SCISRepo.getMonthRepo(sessionObj, req, res);
        return res.json(new responseDto(constants.STATUS_SUCCESS, '', resObj))

    } catch (error) {
        return res.json(new responseDto(constants.STATUS_FAIL, error, ''));
    }

}


exports.getYearServices = async (req, res) => {
    try {
        let sessionObj = req.userData;
        let resObj = await SCISRepo.getYearRepo(sessionObj, req, res);
        return res.json(new responseDto(constants.STATUS_SUCCESS, '', resObj))

    } catch (error) {
        return res.json(new responseDto(constants.STATUS_FAIL, error, ''));
    }

}


exports.getSectorServices = async (req, res) => {
    try {
        let sessionObj = req.userData;
        let resObj = await SCISRepo.getSectorRepo(sessionObj, req, res);
        return res.json(new responseDto(constants.STATUS_SUCCESS, '', resObj))

    } catch (error) {
        return res.json(new responseDto(constants.STATUS_FAIL, error, ''));
    }

}

exports.getSectorServicesICCS = async (req, res) => {
    try {
        let sessionObj = req.userData;
        let resObj = await SCISRepo.getSectorRepoICCS(sessionObj, req, res);
        return res.json(new responseDto(constants.STATUS_SUCCESS, '', resObj))

    } catch (error) {
        return res.json(new responseDto(constants.STATUS_FAIL, error, ''));
    }

}


exports.getSectorServicesEcis = async (req, res) => {
    try {
        let sessionObj = req.userData;
        let resObj = await SCISRepo.getSectorRepoEcis(sessionObj, req, res);
        return res.json(new responseDto(constants.STATUS_SUCCESS, '', resObj))

    } catch (error) {
        return res.json(new responseDto(constants.STATUS_FAIL, error, ''));
    }

}

exports.getAccrediationServices = async (req, res) => {
    try {
        let sessionObj = req.userData;
        let resObj = await SCISRepo.getAccrediationRepo(sessionObj, req, res);
        return res.json(new responseDto(constants.STATUS_SUCCESS, '', resObj))

    } catch (error) {
        return res.json(new responseDto(constants.STATUS_FAIL, error, ''));
    }

}

exports.getAccreditationReportServices = async (req, res) => {
    try {
        let sessionObj = req.userData;
        let resObj = await SCISRepo.getAccreditationReportRepo(sessionObj, req, res);
        return res.json(new responseDto(constants.STATUS_SUCCESS, '', resObj))

    } catch (error) {
        return res.json(new responseDto(constants.STATUS_FAIL, error, ''));
    }

}

exports.getSchemeNameListServices = async (req, res) => {
    try {
        let sessionObj = req.userData;
        let resObj = await SCISRepo.getSchemeNameListRepo(sessionObj, req, res);
        return res.json(new responseDto(constants.STATUS_SUCCESS, '', resObj))

    } catch (error) {
        return res.json(new responseDto(constants.STATUS_FAIL, error, ''));
    }

}


exports.getLicenseeTypeListServices = async (req, res) => {
    try {
        let sessionObj = req.userData;
        let resObj = await SCISRepo.getLicenseeTypeListRepo(sessionObj, req, res);
        return res.json(new responseDto(constants.STATUS_SUCCESS, '', resObj))

    } catch (error) {
        return res.json(new responseDto(constants.STATUS_FAIL, error, ''));
    }

}



exports.getTightenSurvellanceServices = async (req, res) => {
    try {
        let sessionObj = req.userData;
        let resObj = await SCISRepo.getTihtenSurvellanceRepo(sessionObj, req, res);
        return res.json(new responseDto(constants.STATUS_SUCCESS, '', resObj))

    } catch (error) {
        return res.json(new responseDto(constants.STATUS_FAIL, error, ''));
    }

}


exports.getFileInfoSectorListServices = async (req, res) => {
    try {
        let sessionObj = req.userData;
        let resObj = await SCISRepo.getFileInfoSectorListRepo(sessionObj, req, res);
        return res.json(new responseDto(constants.STATUS_SUCCESS, '', resObj))

    } catch (error) {
        return res.json(new responseDto(constants.STATUS_FAIL, error, ''));
    }

}


exports.getFileInfoPreviewServices = async (req, res) => {
    try {
        let sessionObj = req.userData;
        let resObj = await SCISRepo.getFileInfoPreviewReportRepo(sessionObj, req, res);
        return res.json(new responseDto(constants.STATUS_SUCCESS, '', resObj))

    } catch (error) {
        return res.json(new responseDto(constants.STATUS_FAIL, error, ''));
    }

}



exports.getNewApplicationSectorServices = async (req, res) => {
    try {
        let sessionObj = req.userData;
        let resObj = await SCISRepo.getNewApplicationSectorReportRepo(sessionObj, req, res);
        return res.json(new responseDto(constants.STATUS_SUCCESS, '', resObj))

    } catch (error) {
        return res.json(new responseDto(constants.STATUS_FAIL, error, ''));
    }

}

exports.getNewApplicationPreviewServices = async (req, res) => {
    try {
        let sessionObj = req.userData;
        let resObj = await SCISRepo.getNewApplicationPreviewReportRepo(sessionObj, req, res);
        return res.json(new responseDto(constants.STATUS_SUCCESS, '', resObj))

    } catch (error) {
        return res.json(new responseDto(constants.STATUS_FAIL, error, ''));
    }

}

exports.getYearCPListServices = async (req, res) => {
    try {
        let sessionObj = req.userData;
        let resObj = await SCISRepo.getYearCPReportRepo(sessionObj, req, res);
        return res.json(new responseDto(constants.STATUS_SUCCESS, '', resObj))

    } catch (error) {
        return res.json(new responseDto(constants.STATUS_FAIL, error, ''));
    }

}

exports.getAepBySectorReportServices = async (req, res) => {
    try {
        let sessionObj = req.userData;
        let resObj = await SCISRepo.getAepBySectorReportRepo(sessionObj, req, res);
        return res.json(new responseDto(constants.STATUS_SUCCESS, '', resObj))

    } catch (error) {
        return res.json(new responseDto(constants.STATUS_FAIL, error, ''));
    }

}

exports.getDateOfCPListServices = async (req, res) => {
    try {
        let sessionObj = req.userData;
        let resObj = await SCISRepo.getDateOfCPListRepo(sessionObj, req, res);
        return res.json(new responseDto(constants.STATUS_SUCCESS, '', resObj))

    } catch (error) {
        return res.json(new responseDto(constants.STATUS_FAIL, error, ''));
    }

}

exports.getCP_PO_ListServices = async (req, res) => {
    try {
        let sessionObj = req.userData;
        let resObj = await SCISRepo.getCP_PO_ListRepo(sessionObj, req, res);
        return res.json(new responseDto(constants.STATUS_SUCCESS, '', resObj))

    } catch (error) {
        return res.json(new responseDto(constants.STATUS_FAIL, error, ''));
    }

}

exports.getCPDecisionListServices = async (req, res) => {
    try {
        let sessionObj = req.userData;
        let resObj = await SCISRepo.getCPDecisionListRepo(sessionObj, req, res);
        return res.json(new responseDto(constants.STATUS_SUCCESS, '', resObj))

    } catch (error) {
        return res.json(new responseDto(constants.STATUS_FAIL, error, ''));
    }

}

exports.getCPTerminationReportListServices = async (req, res) => {
    try {
        let sessionObj = req.userData;
        let resObj = await SCISRepo.getCPTerminationReportListRepo(sessionObj, req, res);
        return res.json(new responseDto(constants.STATUS_SUCCESS, '', resObj))

    } catch (error) {
        return res.json(new responseDto(constants.STATUS_FAIL, error, ''));
    }

}

exports.getGECompanyListServices = async (req, res) => {
    try {
        let sessionObj = req.userData;
        let resObj = await SCISRepo.getGECompanyListRepo(sessionObj, req, res);
        return res.json(new responseDto(constants.STATUS_SUCCESS, '', resObj))

    } catch (error) {
        return res.json(new responseDto(constants.STATUS_FAIL, error, ''));
    }

}

exports.getGEProjectOfficerListServices = async (req, res) => {
    try {
        let sessionObj = req.userData;
        let resObj = await SCISRepo.getGEProjectOfficerListRepo(sessionObj, req, res);
        return res.json(new responseDto(constants.STATUS_SUCCESS, '', resObj))

    } catch (error) {
        return res.json(new responseDto(constants.STATUS_FAIL, error, ''));
    }

}

exports.getGEAppReportListServices = async (req, res) => {
    try {
        let sessionObj = req.userData;
        let resObj = await SCISRepo.getGEAppReportListRepo(sessionObj, req, res);
        return res.json(new responseDto(constants.STATUS_SUCCESS, '', resObj))

    } catch (error) {
        return res.json(new responseDto(constants.STATUS_FAIL, error, ''));
    }

}


exports.getAudiUtilReportListServices = async (req, res) => {
    try {
        let sessionObj = req.userData;
        let resObj = await SCISRepo.getAudiUtilReportListRepo(sessionObj, req, res);
        return res.json(new responseDto(constants.STATUS_SUCCESS, '', resObj))

    } catch (error) {
        return res.json(new responseDto(constants.STATUS_FAIL, error, ''));
    }

}

exports.getAudiUtilECISReportListServices = async (req, res) => {
    try {
        let sessionObj = req.userData;
        let resObj = await SCISRepo.getAudiUtilECISReportListRepo(sessionObj, req, res);
        return res.json(new responseDto(constants.STATUS_SUCCESS, '', resObj))

    } catch (error) {
        return res.json(new responseDto(constants.STATUS_FAIL, error, ''));
    }

}

exports.getAudiUtilICCSReportListServices = async (req, res) => {
    try {
        let sessionObj = req.userData;
        let resObj = await SCISRepo.getAudiUtilICCSReportListRepo(sessionObj, req, res);
        return res.json(new responseDto(constants.STATUS_SUCCESS, '', resObj))

    } catch (error) {
        return res.json(new responseDto(constants.STATUS_FAIL, error, ''));
    }

}

exports.getIssonIssueLicenseRenewalReportListServices = async (req, res) => {
    try {
        let sessionObj = req.userData;
        let resObj = await SCISRepo.getIssonIssueLicenseRenewalReportListRepo(sessionObj, req, res);
        return res.json(new responseDto(constants.STATUS_SUCCESS, '', resObj))

    } catch (error) {
        return res.json(new responseDto(constants.STATUS_FAIL, error, ''));
    }

}

exports.getIssonIssueLicenseAfterCPReportListServices = async (req, res) => {
    try {
        let sessionObj = req.userData;
        let resObj = await SCISRepo.getIssonIssueLicenseAfterCPReportListRepo(sessionObj, req, res);
        return res.json(new responseDto(constants.STATUS_SUCCESS, '', resObj))

    } catch (error) {
        return res.json(new responseDto(constants.STATUS_FAIL, error, ''));
    }

}

exports.getIssonIssueInvoiceAfterCPReportListServices = async (req, res) => {
    try {
        let sessionObj = req.userData;
        let resObj = await SCISRepo.getIssonIssueInvoiceAfterCPReportListRepo(sessionObj, req, res);
        return res.json(new responseDto(constants.STATUS_SUCCESS, '', resObj))

    } catch (error) {
        return res.json(new responseDto(constants.STATUS_FAIL, error, ''));
    }

}

exports.getISSonRecommendationReportListServices = async (req, res) => {
    try {
        let sessionObj = req.userData;
        let resObj = await SCISRepo.getISSonRecommendationReportListRepo(sessionObj, req, res);
        return res.json(new responseDto(constants.STATUS_SUCCESS, '', resObj))

    } catch (error) {
        return res.json(new responseDto(constants.STATUS_FAIL, error, ''));
    }

}

exports.getISSonPerformanceInitialAuditReportListServices = async (req, res) => {
    try {
        let sessionObj = req.userData;
        let resObj = await SCISRepo.getISSonPerformanceInitialAuditReportListRepo(sessionObj, req, res);
        return res.json(new responseDto(constants.STATUS_SUCCESS, '', resObj))

    } catch (error) {
        return res.json(new responseDto(constants.STATUS_FAIL, error, ''));
    }

}


exports.getISSonAcceptanceLetterReportListServices = async (req, res) => {
    try {
        let sessionObj = req.userData;
        let resObj = await SCISRepo.getISSonAcceptanceLetterReportListRepo(sessionObj, req, res);
        return res.json(new responseDto(constants.STATUS_SUCCESS, '', resObj))

    } catch (error) {
        return res.json(new responseDto(constants.STATUS_FAIL, error, ''));
    }

}

exports.getISSonIssueInvoiceRenewalReportListServices = async (req, res) => {
    try {
        let sessionObj = req.userData;
        let resObj = await SCISRepo.getISSonIssueInvoiceRenewalReportListRepo(sessionObj, req, res);
        return res.json(new responseDto(constants.STATUS_SUCCESS, '', resObj))

    } catch (error) {
        return res.json(new responseDto(constants.STATUS_FAIL, error, ''));
    }

}

exports.getAuditiorListBySectionServices = async (req, res) => {
    try {
        let sessionObj = req.userData;
        let resObj = await SCISRepo.getAuditiorListBySectionServicesRepo(sessionObj, req, res);
        return res.json(new responseDto(constants.STATUS_SUCCESS, '', resObj))

    } catch (error) {
        return res.json(new responseDto(constants.STATUS_FAIL, error, ''));
    }

}


// getYearCPListServices