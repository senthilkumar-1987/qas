module.exports = function (app) {

    const LMSController = require('../../controller/ReportsMgtController/LMSController');

    const authJwt = require('../verifyJwtToken');


    app.post('/api/getPriceList', [authJwt.verifyToken], (req, res) => {

        LMSController.getPriceListService(req, res);

    });


    app.post('/api/getBranchList', [authJwt.verifyToken], (req, res) => {

        LMSController.getBranchListService(req, res);

    });


    app.post('/api/getLableTypeList', [authJwt.verifyToken], (req, res) => {

        LMSController.getLableTypeListService(req, res);

    });


    app.post('/api/getLableIncomeReportList', [authJwt.verifyToken], (req, res) => {

        LMSController.getLableIncomeReportListService(req, res);

    });



    
    app.post('/api/getTeamList', [authJwt.verifyToken], (req, res) => {

        LMSController.getTeamListService(req, res);

    });


    app.post('/api/getYearList', [authJwt.verifyToken], (req, res) => {

        LMSController.getYearListService(req, res);

    });


    app.post('/api/getYearList', [authJwt.verifyToken], (req, res) => {

        LMSController.getYearListService(req, res);

    });


    

    app.post('/api/getBranchListInssuanc', [authJwt.verifyToken], (req, res) => {

        LMSController.getBranchListInssuanceService(req, res);

    });

    




    app.post('/api/getLabelCodeListInssuance', [authJwt.verifyToken], (req, res) => {

        LMSController.getLabelCodeListInssuanceService(req, res);

    });


    
    app.post('/api/getInssuanceReport', [authJwt.verifyToken], (req, res) => {

        LMSController.getInssuanceReportService(req, res);

    });




    app.post('/api/getApplicationSummaryLabelType', [authJwt.verifyToken], (req, res) => {

        LMSController.getApplicationSummaryLabelTypeService(req, res);

    });



    app.post('/api/getApplicationSummaryBranch', [authJwt.verifyToken], (req, res) => {

        LMSController.getApplicationSummaryBranchService(req, res);

    });

    app.post('/api/getApplicationSummaryReport', [authJwt.verifyToken], (req, res) => {

        LMSController.getApplicationSummaryReportService(req, res);

    });



    app.post('/api/getInspectionTeamList', [authJwt.verifyToken], (req, res) => {

        LMSController.getInspectionTeamListService(req, res);

    });

    app.post('/api/getInspectionYearList', [authJwt.verifyToken], (req, res) => {

        LMSController. getInspectionYearListService(req, res);

    });
   

    
    app.post('/api/getInspectionMonthList', [authJwt.verifyToken], (req, res) => {

        LMSController. getInspectionMonthListService(req, res);

    });


    
    
    app.post('/api/getInspectionDayList', [authJwt.verifyToken], (req, res) => {

        LMSController. getInspectionDayListService(req, res);

    });


    


    app.post('/api/getInspectionReport', [authJwt.verifyToken], (req, res) => {

        LMSController. getInspectionReportListService(req, res);

    });
    

    app.post('/api/getLabelTransferReport', [authJwt.verifyToken], (req, res) => {

        LMSController.getLabelTransferReportService(req, res);

    });



    
    app.post('/api/getStockAssessmentReport', [authJwt.verifyToken], (req, res) => {

        LMSController.getStockAssessmentReportService(req, res);

    });

}