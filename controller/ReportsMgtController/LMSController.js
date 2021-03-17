let LmsRepo = require('../../repositories/ReportsMgtRepo/LMSRepository');

const responseDto = require('../../config/ResponseDto');
let constants = require('../../config/Constants');



exports.getPriceListService = async (req, res) => {

    try {

        let sessionObj = req.userData;
        let resObj = await LmsRepo.getPriceList(sessionObj, req, res);
        return res.json(new responseDto(constants.STATUS_SUCCESS, '', resObj));
    } catch (err) {
        console.log('Error ', err);
        return res.json(new responseDto(constants.STATUS_FAIL, err, ''));
    }

}


exports.getBranchListService = async (req, res) => {

    try {

        let sessionObj = req.userData;
        let resObj = await LmsRepo.getBranchList(sessionObj, req, res);
        return res.json(new responseDto(constants.STATUS_SUCCESS, '', resObj));
    } catch (err) {
        console.log('Error ', err);
        return res.json(new responseDto(constants.STATUS_FAIL, err, ''));
    }

}




exports.getLableTypeListService = async (req, res) => {

    try {

        let sessionObj = req.userData;
        let resObj = await LmsRepo.getLableTypeList(sessionObj, req, res);
        return res.json(new responseDto(constants.STATUS_SUCCESS, '', resObj));
    } catch (err) {
        console.log('Error ', err);
        return res.json(new responseDto(constants.STATUS_FAIL, err, ''));
    }

}



exports.getLableIncomeReportListService = async (req, res) => {

    try {

        let sessionObj = req.userData;
        let resObj = await LmsRepo.getLableIncomeReportList(sessionObj, req, res);
        return res.json(new responseDto(constants.STATUS_SUCCESS, '', resObj));
    } catch (err) {
        console.log('Error ', err);
        return res.json(new responseDto(constants.STATUS_FAIL, err, ''));
    }

}



exports.getTeamListService = async (req, res) => {

    try {

        let sessionObj = req.userData;
        let resObj = await LmsRepo.getTeamList(sessionObj, req, res);
        return res.json(new responseDto(constants.STATUS_SUCCESS, '', resObj));
    } catch (err) {
        console.log('Error ', err);
        return res.json(new responseDto(constants.STATUS_FAIL, err, ''));
    }

}





exports.getYearListService = async (req, res) => {

    try {

        let sessionObj = req.userData;
        let resObj = await LmsRepo.getYearList(sessionObj, req, res);
        return res.json(new responseDto(constants.STATUS_SUCCESS, '', resObj));
    } catch (err) {
        console.log('Error ', err);
        return res.json(new responseDto(constants.STATUS_FAIL, err, ''));
    }

}





exports.getBranchListInssuanceService = async (req, res) => {

    try {

        let sessionObj = req.userData;
        let resObj = await LmsRepo.getBranchListInssuance(sessionObj, req, res);
        return res.json(new responseDto(constants.STATUS_SUCCESS, '', resObj));
    } catch (err) {
        console.log('Error ', err);
        return res.json(new responseDto(constants.STATUS_FAIL, err, ''));
    }

}




exports.getLabelCodeListInssuanceService = async (req, res) => {

    try {

        let sessionObj = req.userData;
        let resObj = await LmsRepo.getLabelCodeListInssuance(sessionObj, req, res);
        return res.json(new responseDto(constants.STATUS_SUCCESS, '', resObj));
    } catch (err) {
        console.log('Error ', err);
        return res.json(new responseDto(constants.STATUS_FAIL, err, ''));
    }

}





exports.getInssuanceReportService = async (req, res) => {

    try {

        let sessionObj = req.userData;
        let resObj = await LmsRepo.getInssuanceReport(sessionObj, req, res);
        return res.json(new responseDto(constants.STATUS_SUCCESS, '', resObj));
    } catch (err) {
        console.log('Error ', err);
        return res.json(new responseDto(constants.STATUS_FAIL, err, ''));
    }

}





exports.getApplicationSummaryLabelTypeService = async (req, res) => {

    try {

        let sessionObj = req.userData;
        let resObj = await LmsRepo.getApplicationSummaryLabelType(sessionObj, req, res);
        return res.json(new responseDto(constants.STATUS_SUCCESS, '', resObj));
    } catch (err) {
        console.log('Error ', err);
        return res.json(new responseDto(constants.STATUS_FAIL, err, ''));
    }

}




exports.getApplicationSummaryBranchService = async (req, res) => {

    try {

        let sessionObj = req.userData;
        let resObj = await LmsRepo.getApplicationSummaryBranch(sessionObj, req, res);
        return res.json(new responseDto(constants.STATUS_SUCCESS, '', resObj));
    } catch (err) {
        console.log('Error ', err);
        return res.json(new responseDto(constants.STATUS_FAIL, err, ''));
    }

}




exports.getInspectionTeamListService = async (req, res) => {

    try {

        let sessionObj = req.userData;
        let resObj = await LmsRepo.getInspectionTeamList(sessionObj, req, res);
        return res.json(new responseDto(constants.STATUS_SUCCESS, '', resObj));
    } catch (err) {
        console.log('Error ', err);
        return res.json(new responseDto(constants.STATUS_FAIL, err, ''));
    }

}



exports.getInspectionYearListService = async (req, res) => {

    try {

        let sessionObj = req.userData;
        let resObj = await LmsRepo.getInspectionYearList(sessionObj, req, res);
        return res.json(new responseDto(constants.STATUS_SUCCESS, '', resObj));
    } catch (err) {
        console.log('Error ', err);
        return res.json(new responseDto(constants.STATUS_FAIL, err, ''));
    }

}




exports.getInspectionMonthListService = async (req, res) => {

    try {

        let sessionObj = req.userData;
        let resObj = await LmsRepo.getInspectionMonthList(sessionObj, req, res);
        return res.json(new responseDto(constants.STATUS_SUCCESS, '', resObj));
    } catch (err) {
        console.log('Error ', err);
        return res.json(new responseDto(constants.STATUS_FAIL, err, ''));
    }

}



exports.getInspectionDayListService = async (req, res) => {

    try {

        let sessionObj = req.userData;
        let resObj = await LmsRepo.getInspectionDayList(sessionObj, req, res);
        return res.json(new responseDto(constants.STATUS_SUCCESS, '', resObj));
    } catch (err) {
        console.log('Error ', err);
        return res.json(new responseDto(constants.STATUS_FAIL, err, ''));
    }

}




exports.getInspectionReportListService = async (req, res) => {

    try {

        let sessionObj = req.userData;
        let resObj = await LmsRepo.getInspectionReportList(sessionObj, req, res);
        return res.json(new responseDto(constants.STATUS_SUCCESS, '', resObj));
    } catch (err) {
        console.log('Error ', err);
        return res.json(new responseDto(constants.STATUS_FAIL, err, ''));
    }

}




exports.getLabelTransferReportService = async (req, res) => {

    try {

        let sessionObj = req.userData;
        let resObj = await LmsRepo.getLabelTransferReport(sessionObj, req, res);
        return res.json(new responseDto(constants.STATUS_SUCCESS, '', resObj));
    } catch (err) {
        console.log('Error ', err);
        return res.json(new responseDto(constants.STATUS_FAIL, err, ''));
    }

}




exports.getApplicationSummaryReportService = async (req, res) => {

    try {

        let sessionObj = req.userData;
        let resObj = await LmsRepo.getApplicationSummaryReport(sessionObj, req, res);
        return res.json(new responseDto(constants.STATUS_SUCCESS, '', resObj));
    } catch (err) {
        console.log('Error ', err);
        return res.json(new responseDto(constants.STATUS_FAIL, err, ''));
    }

}




exports.getStockAssessmentReportService = async (req, res) => {

    try {

        let sessionObj = req.userData;
        let resObj = await LmsRepo.getStockAssessmentReport(sessionObj, req, res);
        return res.json(new responseDto(constants.STATUS_SUCCESS, '', resObj));
    } catch (err) {
        console.log('Error ', err);
        return res.json(new responseDto(constants.STATUS_FAIL, err, ''));
    }

}