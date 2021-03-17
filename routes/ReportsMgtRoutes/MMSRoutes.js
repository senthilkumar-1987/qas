module.exports = function (app) {

    const MMSController = require('../../controller/ReportsMgtController/MMSController');

    const authJwt = require('../verifyJwtToken');

    app.post('/api/getBudgetAnalysisYearList', [authJwt.verifyToken], (req, res) => {

        MMSController.getBudgetAnalysisYearListService(req, res);

    });

    app.post('/api/getBudgetAnalysisReportList', [authJwt.verifyToken], (req, res) => {

        MMSController.getBudgetAnalysisReportListService(req, res);

    });

    app.post('/api/getMarketSurveilanceDetailsYearList', [authJwt.verifyToken], (req, res) => {

        MMSController.getMarketSurveilanceDetailsYearListService(req, res);

    });

    app.post('/api/getBudgetSourceList', [authJwt.verifyToken], (req, res) => {

        MMSController.getBudgetSourceListService(req, res);

    });

    app.post('/api/getMarketSurveilanceDetailsList', [authJwt.verifyToken], (req, res) => {

        MMSController.getMarketSurveilanceDetailsListService(req, res);

    });

    app.post('/api/getMarketSamplingScheduleYearList', [authJwt.verifyToken], (req, res) => {

        MMSController.getMarketSamplingScheduleYearListService(req, res);

    });

    app.post('/api/getMarketSamplingScheduleReportList', [authJwt.verifyToken], (req, res) => {

        MMSController.getMarketSamplingScheduleReportListService(req, res);

    });

}