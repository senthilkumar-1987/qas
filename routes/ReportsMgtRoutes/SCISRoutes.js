module.exports = function (app) {

    require('./LMSRoutes')(app);

    require('./MMSRoutes')(app);

    const SCISController = require('../../controller/ReportsMgtController/SCISController');

    const authJwt = require('../verifyJwtToken');

    app.post('/api/getProductList', [authJwt.verifyToken], (req, res) => {

        SCISController.getProductListService(req, res);

    });

    app.post('/api/getAepReportList', [authJwt.verifyToken], (req, res) => {

        SCISController.getAepReportListService(req, res);

    });

    app.post('/api/getAuditiorList', [authJwt.verifyToken], (req, res) => {

        SCISController.getAuditiorListService(req, res);

    });

    app.post('/api/getStandardList', [authJwt.verifyToken], (req, res) => {

        SCISController.getStandardListService(req, res);

    });

    app.post('/api/getISSonQuatationReport', [authJwt.verifyToken], (req, res) => {

        SCISController.getISSonQuatationReportServices(req, res);

    });

    app.post('/api/getISSInvoiceReport', [authJwt.verifyToken], (req, res) => {

        SCISController.getISSInvoiceReportServices(req, res);

    });


    app.post('/api/getmonth', [authJwt.verifyToken], (req, res) => {

        SCISController.getMonthServices(req, res);

    });


    app.post('/api/getyear', [authJwt.verifyToken], (req, res) => {

        SCISController.getYearServices(req, res);

    });

    app.post('/api/getSector', [authJwt.verifyToken], (req, res) => {

        SCISController.getSectorServices(req, res);

    });

    app.post('/api/getICCS', [authJwt.verifyToken], (req, res) => {
        console.log("ssssss---------")
        SCISController.getSectorServicesICCS(req, res);

    });


    app.post('/api/getSectorEcis', [authJwt.verifyToken], (req, res) => {

        SCISController.getSectorServicesEcis(req, res);

    });

    app.post('/api/getAccreditationStandardList', [authJwt.verifyToken], (req, res) => {

        SCISController.getAccrediationServices(req, res);

    });

    app.post('/api/getAccreditationReportList', [authJwt.verifyToken], (req, res) => {

        SCISController.getAccreditationReportServices(req, res);

    });

    app.post('/api/getSchemeNameList', [authJwt.verifyToken], (req, res) => {

        SCISController.getSchemeNameListServices(req, res);

    });

    app.post('/api/getLicenseeTypeList', [authJwt.verifyToken], (req, res) => {

        SCISController.getLicenseeTypeListServices(req, res);

    });


    app.post('/api/getTightenSurvellanceReport', [authJwt.verifyToken], (req, res) => {

        SCISController.getTightenSurvellanceServices(req, res);

    });

    app.post('/api/getFileInfoSectorList', [authJwt.verifyToken], (req, res) => {

        SCISController.getFileInfoSectorListServices(req, res);

    });


    app.post('/api/getFileInfoPreviewReport', [authJwt.verifyToken], (req, res) => {

        SCISController.getFileInfoPreviewServices(req, res);

    });

    
    app.post('/api/getNewApplicationMonitoringSectorList', [authJwt.verifyToken], (req, res) => {

        SCISController.getNewApplicationSectorServices(req, res);

    });


    app.post('/api/getNewApplicationPreviewReport', [authJwt.verifyToken], (req, res) => {

        SCISController.getNewApplicationPreviewServices(req, res);

    });
    
   
    app.post('/api/getYearCPList', [authJwt.verifyToken], (req, res) => {

        SCISController.getYearCPListServices(req, res);

    });
   
   
    app.post('/api/getQuotationReportList', [authJwt.verifyToken], (req, res) => {

        SCISController.getQuotationReportListServices(req, res);

    });

   
    app.post('/api/getAepBySectorReport', [authJwt.verifyToken], (req, res) => {

        SCISController.getAepBySectorReportServices(req, res);

    });
   
    app.post('/api/getDateOfCPList', [authJwt.verifyToken], (req, res) => {

        SCISController.getDateOfCPListServices(req, res);

    });
   
    app.post('/api/getCP_PO_List', [authJwt.verifyToken], (req, res) => {

        SCISController.getCP_PO_ListServices(req, res);

    });
   
    app.post('/api/getCPDecisionList', [authJwt.verifyToken], (req, res) => {

        SCISController.getCPDecisionListServices(req, res);

    });
   
    app.post('/api/getCPTerminationReportList', [authJwt.verifyToken], (req, res) => {

        SCISController.getCPTerminationReportListServices(req, res);

    });
   
    app.post('/api/getGECompanyList', [authJwt.verifyToken], (req, res) => {

        SCISController.getGECompanyListServices(req, res);

    });
   
    app.post('/api/getGEProjectOfficerList', [authJwt.verifyToken], (req, res) => {

        SCISController.getGEProjectOfficerListServices(req, res);

    });
   
    app.post('/api/getGEAppReportList', [authJwt.verifyToken], (req, res) => {

        SCISController.getGEAppReportListServices(req, res);

    });
   
    app.post('/api/getAudiUtilReportList', [authJwt.verifyToken], (req, res) => {

        SCISController.getAudiUtilReportListServices(req, res);

    });
   
    app.post('/api/getAudiUtilECISReportList', [authJwt.verifyToken], (req, res) => {

        SCISController.getAudiUtilECISReportListServices(req, res);

    });
   
    app.post('/api/getAudiUtilICCSReportList', [authJwt.verifyToken], (req, res) => {

        SCISController.getAudiUtilICCSReportListServices(req, res);

    });
   
    app.post('/api/getIssonIssueLicenseRenewalReportList', [authJwt.verifyToken], (req, res) => {

        SCISController.getIssonIssueLicenseRenewalReportListServices(req, res);

    });
   
    app.post('/api/getIssonIssueLicenseAfterCPReportList', [authJwt.verifyToken], (req, res) => {

        SCISController.getIssonIssueLicenseAfterCPReportListServices(req, res);

    });
   
    app.post('/api/getIssonIssueInvoiceAfterCPReportList', [authJwt.verifyToken], (req, res) => {

        SCISController.getIssonIssueInvoiceAfterCPReportListServices(req, res);

    });
   
    app.post('/api/getISSonRecommendationReportList', [authJwt.verifyToken], (req, res) => {

        SCISController.getISSonRecommendationReportListServices(req, res);

    });
   
    app.post('/api/getISSonPerformanceInitialAuditReportList', [authJwt.verifyToken], (req, res) => {

        SCISController.getISSonPerformanceInitialAuditReportListServices(req, res);

    });
   
    app.post('/api/getISSonAcceptanceLetterReportList', [authJwt.verifyToken], (req, res) => {

        SCISController.getISSonAcceptanceLetterReportListServices(req, res);

    });
   
    app.post('/api/getISSonIssueInvoiceRenewalReportList', [authJwt.verifyToken], (req, res) => {

        SCISController.getISSonIssueInvoiceRenewalReportListServices(req, res);

    });
   
    app.post('/api/getAuditiorListBySection', [authJwt.verifyToken], (req, res) => {

        SCISController.getAuditiorListBySectionServices(req, res);

    });

    
}