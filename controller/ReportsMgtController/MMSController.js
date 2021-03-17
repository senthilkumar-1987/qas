let MMSRepo = require('../../repositories/ReportsMgtRepo/MMSRepository');

const responseDto = require('../../config/ResponseDto');
let constants = require('../../config/Constants');

exports.getBudgetAnalysisYearListService = async (req, res) => {

    try {

        let sessionObj = req.userData;
        let resObj = await MMSRepo.getBudgetAnalysisYearListRepo(sessionObj, req, res);
        return res.json(new responseDto(constants.STATUS_SUCCESS, '', resObj));
    } catch (err) {
        console.log('Error ', err);
        return res.json(new responseDto(constants.STATUS_FAIL, err, ''));
    }

}

exports.getBudgetAnalysisReportListService = async (req, res) => {

    try {

        let sessionObj = req.userData;
        let resObj = await MMSRepo.getBudgetAnalysisReportListRepo(sessionObj, req, res);
        return res.json(new responseDto(constants.STATUS_SUCCESS, '', resObj));
    } catch (err) {
        console.log('Error ', err);
        return res.json(new responseDto(constants.STATUS_FAIL, err, ''));
    }

}

exports.getMarketSurveilanceDetailsYearListService = async (req, res) => {

    try {

        let sessionObj = req.userData;
        let resObj = await MMSRepo.getMarketSurveilanceDetailsYearListRepo(sessionObj, req, res);
        return res.json(new responseDto(constants.STATUS_SUCCESS, '', resObj));
    } catch (err) {
        console.log('Error ', err);
        return res.json(new responseDto(constants.STATUS_FAIL, err, ''));
    }

}

exports.getBudgetSourceListService = async (req, res) => {

    try {

        let sessionObj = req.userData;
        let resObj = await MMSRepo.getBudgetSourceListRepo(sessionObj, req, res);
        return res.json(new responseDto(constants.STATUS_SUCCESS, '', resObj));
    } catch (err) {
        console.log('Error ', err);
        return res.json(new responseDto(constants.STATUS_FAIL, err, ''));
    }

}

exports.getMarketSurveilanceDetailsListService = async (req, res) => {

    try {

        let sessionObj = req.userData;
        let resObj = await MMSRepo.getMarketSurveilanceDetailsListRepo(sessionObj, req, res);
        return res.json(new responseDto(constants.STATUS_SUCCESS, '', resObj));
    } catch (err) {
        console.log('Error ', err);
        return res.json(new responseDto(constants.STATUS_FAIL, err, ''));
    }

}

exports.getMarketSamplingScheduleYearListService = async (req, res) => {

    try {

        let sessionObj = req.userData;
        let resObj = await MMSRepo.getMarketSamplingScheduleYearListRepo(sessionObj, req, res);
        return res.json(new responseDto(constants.STATUS_SUCCESS, '', resObj));
    } catch (err) {
        console.log('Error ', err);
        return res.json(new responseDto(constants.STATUS_FAIL, err, ''));
    }

}

exports.getMarketSamplingScheduleReportListService = async (req, res) => {

    try {

        let sessionObj = req.userData;
        let resObj = await MMSRepo.getMarketSamplingScheduleReportListRepo(sessionObj, req, res);
        return res.json(new responseDto(constants.STATUS_SUCCESS, '', resObj));
    } catch (err) {
        console.log('Error ', err);
        return res.json(new responseDto(constants.STATUS_FAIL, err, ''));
    }

}