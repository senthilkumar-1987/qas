const authJwt = require('./verifyJwtToken');
const confirmMailController = require('../controller/Customers/MailConfirmation');
const paymentReportsController = require('../controller/PaymentModuleController/Finance/PaymentReportsController');
const voucherController = require('../controller/PaymentModuleController/Finance/ViewVoucherDetails');
const vocherUploadController = require('../controller/PaymentModuleController/Finance/VoucherUploadController');
const getVoucherDetailsController = require('../controller/PaymentModuleController/Customers/GetVoucherDetailsController');
const OfflinePayments = require('../controller/PaymentModuleController/OfflinePayments/OfflinePaymentController');
const OnlinePayments = require('../controller/PaymentModuleController/OnlinePayments/OnlinePaymentController');
const viewInvoices = require('../controller/PaymentModuleController/Customers/ViewInvoices');
const receiptPDFController = require('../controller/PDFController/receiptPDFController');
const BadDeptInvoiceController = require('../controller/PaymentModuleController/SectionClerk/BadDeptInvoices');
const updateBadDeptStatusController = require('../controller/PaymentModuleController/SectionClerk/UpdateInvoicesBadDept');
const invoiceController = require('../controller/PaymentModuleController/InvoiceController');
const cityController = require('../controller/CommonController/CityController');
const companyTypeController = require('../controller/CommonController/CompanyTypeController');
const countryController = require('../controller/CommonController/CountryController');
const DashBoardController = require('../controller/Customers/CPADashboardController');
const replyEnqController = require('../controller/Customers/CPAEnquiryRepliesController');
const cpaStatusController = require('../controller/Customers/CpaStatusActionController');
const newCustomerRegistrationController = require('../controller/Customers/NewCustomerRegistrationController');
const licenseViewController = require('../controller/Customers/LicensesViewController');
const exsistingCustomerValidation = require('../controller/Customers/ExsistingCustomerValidation');
const fileUploadController = require('../controller/CommonController/FileUploadController')
const fileController = require('../controller/Customers/GetFileAndLicenseController');
const forgetpasswordController = require('../controller/Customers/forgetpasswordController');
const getAllMyDetailsController = require('../controller/Customers/GetMyDatasController');
const licensesController = require('../controller/Customers/GetLicenseDetailsController');
const loginHistoryController = require('../controller/Customers/LoginHistoryController');
const loginController = require('../controller/LoginController');
const messageController = require('../controller/Customers/MessageServiceController');
const viewEnquiryController = require('../controller/Customers/ViewEnquiryController');
const exsistingCustomerRegistration = require('../controller/Customers/ExsistingCustomerRegistration');
const newEnquiryRaisngController = require('../controller/Customers/NewEnquiryRaisngController');
const newParamTypeController = require('../controller/Customers/NewParamTypeController');
const orgTypeController = require('../controller/CommonController/OrgTypeController');
const reportController = require('../controller/ReportController/ReportController');
const responseDto = require('../config/ResponseDto');
let constants = require('../config/Constants');
const resetPasswordController = require('../controller/CommonController/ResetPasswordController');
const schmesController = require('../controller/CommonController/SchmesController');
const secretQuestionController = require('../controller/CommonController/SecretQuestionController');
const sectorController = require('../controller/CommonController/SectorController');
const showAllEnquiresController = require('../controller/Customers/ShowAllEnquiresController');
const stateController = require('../controller/CommonController/StateController');
const messageServiceController = require('../controller/Customers/MessageServiceController');
const updateEnquiyStatusController = require('../controller/Customers/UpdateEnquiyStatusController');
const viewContactDetailsController = require('../controller/Customers/ViewContactDetailsController');
const viewCustomerRegistrationController = require('../controller/Customers/ViewCustomerRegistrationController');
const getMyProfileDetails = require('../controller/Customers/GetMyProfileDetails');
const sysController = require('../controller/SystemIntegration/SysController')
const BankdetialsController = require('../controller/Bankcode/BankcodeController')
const SysIntegration = require('../controller/SystemIntegration/SysIntegration')
const ProductOnline = require('../controller/ProductOnline/ProductOnlineController')



module.exports = function (app) {
    app.get('/api/users/confirmMail', function (req, res) { confirmMailController.confirmMail(req, res); });  // http://localhost:3000/api/getCountryDetails
    app.post('/api/loadpaymentTransactionsListing', [authJwt.decodeJWToken], function (req, res) { paymentReportsController.GetpaymentTransactionListing(req, res) });
    app.post('/api/summaryofpayments', [authJwt.decodeJWToken], function (req, res) { paymentReportsController.summary_of_payments(req, res) });
    app.get('/api/loadinvoicedetails', [authJwt.decodeJWToken], function (req, res) { voucherController.LoadInvoicveDetails(req, res) });
    app.get('/api/financestatusupdate', [authJwt.decodeJWToken], function (req, res) { voucherController.financestatusupdate(req, res) });
    app.get('/api/getcustomervoucherDetails', [authJwt.decodeJWToken], function (req, res) { voucherController.getcustomervoucherDetails(req, res) });
    app.post('/api/voucherUpload', [authJwt.verifyToken], function (req, res) { vocherUploadController.uploadVoucher(req, res) });
    app.get('/api/getvoucherDetails', [authJwt.verifyToken], function (req, res) { vocherUploadController.Voucher_File_info(req, res) });
    app.get('/api/getuploadedvoucherDetails', [authJwt.verifyToken], function (req, res) { vocherUploadController.Load_Voucher_Uploaded(req, res) });
    app.get('/api/viewuploadedvoucher', [authJwt.verifyToken], function (req, res) { vocherUploadController.View_Uploaded_Voucher_Details(req, res) });
    app.post('/api/deleteuploadedvoucher', [authJwt.verifyToken], function (req, res) { vocherUploadController.Delete_Uploaded_Vouchers(req, res) })
    app.post('/api/upadateuploadedvoucher', [authJwt.verifyToken], function (req, res) { vocherUploadController.Update_Uploaded_Vouchers(req, res) })
    app.get('/api/getVoucherDetailsByVoucherNumber', [authJwt.decodeJWToken], function (req, res) { getVoucherDetailsController.loadVoucherDetails(req, res) });
    app.post('/api/customervoucherverification', [authJwt.decodeJWToken], function (req, res) { OfflinePayments.voucherpaymentMode(req, res); });
    app.post('/api/offlinepayment', [authJwt.decodeJWToken], function (req, res) { OfflinePayments.submitOfflinePaymentMode(req, res); });
    app.get('/api/getofflineDetails', [authJwt.decodeJWToken], function (req, res) { OfflinePayments.getofflineDetails(req, res); });
    // app.get('/api/onlinePament',[authJwt.decodeJWToken], function (req, res) { OnlinePayments.onlinePaymentRedirect(req,res); });
    app.post('/api/saveOnlinePaymentDetailsReq', function (req, res) { OnlinePayments.saveOnlinePaymentRequests(req, res); });
    app.post('/epayment/success', function (req, res) { OnlinePayments.onlinePaymentSuccess(req, res); });
    app.post('/epayment/failed', function (req, res) { OnlinePayments.onlinePaymentFailed(req, res); });
    app.post('/api/updaterefernecno', [authJwt.decodeJWToken], function (req, res) { OfflinePayments.updateReferenceNo(req, res); });
    app.get('/api/customers/loadinvoice', [authJwt.decodeJWToken], function (req, res) { viewInvoices.loadInvoiceDetails(req, res); });
    app.get('/api/loadpendingInvoices', [authJwt.decodeJWToken], function (req, res) { viewInvoices.loadpendinginvoices(req, res); });
    app.get('/api/paidinvoices', [authJwt.decodeJWToken], function (req, res) { viewInvoices.loadpaidinvoices(req, res); });
    app.post('/api/downloadmasterpdf', [authJwt.decodeJWToken], function (req, res) { viewInvoices.downloadmasterpdf(req, res); });
    app.post('/api/receiptPDF', [authJwt.decodeJWToken], function (req, res) { receiptPDFController.downloadReceiptdf(req, res); });
    app.get('/api/getSingleInvoiceDetails', [authJwt.decodeJWToken], function (req, res) { BadDeptInvoiceController.getSingleInvoiceDetails(req, res); });
    app.post('/api/updatebaddeptstatus', [authJwt.decodeJWToken], function (req, res) { updateBadDeptStatusController.updateBadDeptStatus(req, res); });
    app.get('/api/getcurrentyear', [authJwt.decodeJWToken], function (req, res) { BadDeptInvoiceController.CurrentYear_Invoices(req, res); });
    app.get('/api/getpreviousyear', [authJwt.decodeJWToken], function (req, res) { BadDeptInvoiceController.Previous_YearInvoices(req, res); });
    app.get('/api/loadinvoice', [authJwt.decodeJWToken], function (req, res) { invoiceController.loadInvoiceDetails(req, res); });
    app.post('/api/loadinvoicebyquotationId', [authJwt.decodeJWToken], function (req, res) { invoiceController.loadInVoiceDetailsByQuotationId(req, res); });
    app.post('/api/generateinvoice', [authJwt.decodeJWToken], function (req, res) { invoiceController.generateInvoices(req, res); });
    app.post('/api/updateInvoiceNo', [authJwt.decodeJWToken], function (req, res) { invoiceController.generateInvoiceNo(req, res); });
    app.get('/api/getCityDetailsByStateId', function (req, res) { cityController.loadCityDetailsByStateId(req, res); });  // http://localhost:3000/api/getCountryDetails
    app.get('/api/getCompanyTypeDetails', function (req, res) { companyTypeController.loadCompanyTypeDetails(req, res) });  // http://localhost:3000/api/getCountryDetails
    app.get('/api/getCountryDetails', function (req, res) { countryController.loadCountyDetails(req, res); });  // http://localhost:3000/api/getCountryDetails
    app.get('/api/loadregisterDetailsbasedstatus', [authJwt.decodeJWToken], function (req, res) { DashBoardController.loadRegDetails(req, res) });
    app.post('/api/replyDetails', [authJwt.decodeJWToken], function (req, res) { replyEnqController.enquiryReplyDetails(req, res); });  // http://localhost:3000/api/getCountryDetails
    app.post('/api/updateCustomerRegistration', [authJwt.decodeJWToken], function (req, res) { cpaStatusController.cpaStatusActionByregisterId(req, res); });  // http://localhost:3000/api/getCountryDetails

    //Lets Check Urls
    app.get('/api/getAllSecretQuestions', [authJwt.verifyToken], function (req, res) { newCustomerRegistrationController.loadSecretQuestions(req, res) });  // http://localhost:3000/api/getAllSecretQuestions
    app.post('/api/checkOldPasswordValid', [authJwt.verifyToken], function (req, res) { newCustomerRegistrationController.checkPasswordEquals(req, res) });  // http://localhost:3000/api/getCountryDetails
    app.post('/api/userFirstLoginResetPassword', [authJwt.verifyToken], function (req, res) { newCustomerRegistrationController.updateFirstLoginUserResetPassword(req, res) });
    app.post('/api/getLicenceViewInfo', [authJwt.verifyToken], function (req, res) { licenseViewController.getLicenseDetails(req, res); });
    //end
    app.post('/api/getExsistingCustomerDetails', function (req, res) { exsistingCustomerValidation.loadCustomerDetails(req, res) });  // http://localhost:3000/api/getCountryDetails
    app.post('/api/GetFile', function (req, res) { fileUploadController.loadImage(req, res); });
    // app.get('/api/getCityDetailsByStateId', function (req, res) { cityController.loadCityDetailsByStateId(req,res); }); 
    app.get('/api/loadfileDetails', [authJwt.decodeJWToken], function (req, res) { fileController.fileDetails(req, res) });
    app.get('/api/loadLicenseDetails', [authJwt.decodeJWToken], function (req, res) { fileController.licenseDetails(req, res) });
    app.post('/api/forgetpassword', function (req, res) { forgetpasswordController.foregetpassword(req, res); });
    app.post('/api/GetMyDetails', [authJwt.decodeJWToken], function (req, res) { getAllMyDetailsController.GetMyDetails(req, res); });  // http://localhost:3000/api/login
    app.post('/api/getLicenseDetails', [authJwt.decodeJWToken], function (req, res) { licensesController.getLicenseDetails(req, res); });
    app.post('/api/getAllLicenseDetails', [authJwt.decodeJWToken], function (req, res) { licensesController.getAllLicenseDetails(req, res); });
    app.post('/api/loginhistory', function (req, res) { loginHistoryController.saveloginhistory(req, res) });
    app.post('/api/getlastlogin', function (req, res) { loginHistoryController.getLastLoginHistory(req, res) });
    app.post('/api/login', function (req, res) { loginController.login(req, res); });  // http://localhost:3000/api/login
    app.post('/api/enquiry', [authJwt.decodeJWToken], function (req, res) { messageController.enquiryDetails(req, res); });  // http://localhost:3000/api/getCountryDetails
    app.get('/api/messageDetails', [authJwt.decodeJWToken], function (req, res) { messageController.messageDetails(req, res); });
    app.post('/api/getmyenqDetails', function (req, res) { viewEnquiryController.loadMyEnqDetails(req, res); });  // http://localhost:3000/api/getCountryDetails
    app.post('/api/newCustomerRegistration', function (req, res) { newCustomerRegistrationController.saveCustomerDetails(req, res) });
    app.post('/api/exsistingCustomerRegistration', function (req, res) { exsistingCustomerRegistration.saveExsistingCustomerDetails(req, res) });
    app.post('/api/checkDuplicateEmail', function (req, res) { newCustomerRegistrationController.checkDuplicateEmail(req, res) });
    app.post('/api/newenquiryRaising', [authJwt.verifyToken], function (req, res) { newEnquiryRaisngController.saveEnquiryDetails(req, res); });
    app.post('/api/getmyenquires', [authJwt.verifyToken], function (req, res) { newEnquiryRaisngController.GetMyEnquiryDetails(req, res); });
    app.post('/api/newparamtype', [authJwt.decodeJWToken], function (req, res) { newParamTypeController.SaveparamType(req, res) })
    app.post('/api/getparamdetails', [authJwt.decodeJWToken], function (req, res) { newParamTypeController.LoadParamDetails(req, res) })
    app.post('/api/dbtRemaindersubmit', [authJwt.decodeJWToken], function (req, res) { newParamTypeController.SaveRemainder(req, res) })
    app.get('/api/getOrgTypeDetails', function (req, res) { orgTypeController.loadOrgTypeDetails(req, res) });  // http://localhost:3000/api/getCountryDetails

    app.post('/api/getCustReport', [authJwt.verifyToken], async (req, res) => {
        let response = await reportController.getCustReport(req, res);
        return res.json(new responseDto(constants.STATUS_SUCCESS, '', response));
    });

    app.post('/api/get_customer_activity_report', [authJwt.verifyToken], async (req, res) => {
        let response = await reportController.get_customer_activity_report(req, res);
        return res.json(new responseDto(constants.STATUS_SUCCESS, '', response));
    });

    app.post('/api/get_customer_payment_due_history', [authJwt.verifyToken], async (req, res) => {
        let response = await reportController.get_customer_payment_due_history(req, res);
        return res.json(new responseDto(constants.STATUS_SUCCESS, '', response));
    });
    app.post('/api/resetpassword', function (req, res) { resetPasswordController.resetPassword(req, res) });  // http://localhost:3000/api/getCountryDetails
    app.get('/api/GetSchemas', function (req, res) { schmesController.loadSchemes(req, res); });
    app.get('/api/getsecretQuestionDetails', function (req, res) { secretQuestionController.loadsecretQuestionDetails(req, res) });  // http://localhost:3000/api/getCountryDetails
    app.get('/api/GetSectors', function (req, res) { sectorController.loadSector(req, res); });  // http://localhost:3000/api/getCountryDetails
    app.get('/api/GetInformation', function (req, res) { sectorController.loadInformation(req, res); });
    app.post('/api/getAllEnquiry', [authJwt.decodeJWToken], function (req, res) { showAllEnquiresController.Load_All_Enquiry_Details(req, res); });  // http://localhost:3000/api/getCountryDetails
    app.get('/api/getStateDetailsByCountryId', function (req, res) { stateController.loadStateDetailsByCountryId(req, res); });  // http://localhost:3000/api/getCountryDetails
    app.post('/api/updatenqDetails', [authJwt.decodeJWToken], function (req, res) { messageServiceController.updateEnquiryDetails(req, res); });  // http://localhost:3000/api/getCountryDetails
    app.post('/api/UpdateEnquiryStatusByadmin', function (req, res) { updateEnquiyStatusController.Upadte_Enquiry_Details(req, res); });  // http://localhost:3000/api/getCountryDetails
    app.get('/api/getcontactDetails', function (req, res) { viewContactDetailsController.Load_Contact_Details_By_registerId(req, res); });
    app.get('/api/getPendingRegistrationDetails', function (req, res) { viewCustomerRegistrationController.loadRegDetails(req, res); });  // http://localhost:3000/api/getCountryDetails
    app.post('/api/getenqDetails', [authJwt.decodeJWToken], function (req, res) { viewEnquiryController.loadEnqDetails(req, res); });  // http://localhost:3000/api/getCountryDetails
    app.post('/api/viewsingleRegistrationDetails', function (req, res) { viewCustomerRegistrationController.singleCustomDetails(req, res); });
    app.post('/api/GetMyProfileDetails', function (req, res) { getMyProfileDetails.GetMyprofileDetails(req, res); });
    app.post('/api/updatemydetails', function (req, res) { getMyProfileDetails.UPDATE_MY_DETAILS(req, res); });

    app.post('/api/loadQuotationData', [authJwt.decodeJWToken], function (req, res) { viewInvoices.loadQuotationData(req, res); });
    app.post('/api/listOfGeneratedInvoice', [authJwt.decodeJWToken], function (req, res) { viewInvoices.listOfGeneratedInvoice(req, res); });
    app.post('/api/getQuotationData', [authJwt.decodeJWToken], function (req, res) { viewInvoices.getQuotationData(req, res); });
    app.post('/api/generateSingileInvoice', [authJwt.decodeJWToken], function (req, res) { viewInvoices.generateSingileInvoice(req, res); });
    app.post('/api/generateMasterInvoice', [authJwt.decodeJWToken], function (req, res) { viewInvoices.generateMasterInvoice(req, res); });
    app.post('/api/qownloardSampleInvoicepdf', [authJwt.decodeJWToken], function (req, res) { viewInvoices.downloardSampleInvoicepdf(req, res); });
    app.post('/api/getQuotationDatabyOrderno', [authJwt.decodeJWToken], function (req, res) { viewInvoices.getQuotationDatabyOrderno(req, res); });
    app.get('/api/loadpendinginvoicedetails', [authJwt.decodeJWToken], function (req, res) { voucherController.getPaymentPendingDatas(req, res) });
    app.post('/api/getVoucherDetailsByTransactionNo', [authJwt.decodeJWToken], function (req, res) { voucherController.getvoucherDetailsByTransectioNo(req, res) });
    app.post('/api/getTransectionDetails', [authJwt.decodeJWToken], function (req, res) { voucherController.getTransectionDetails(req, res) });
    app.post('/api/getRejectedPayments', [authJwt.decodeJWToken], function (req, res) { voucherController.getPaymentRejectedData(req, res) });
    app.post('/api/getUserDetails', [authJwt.decodeJWToken], function (req, res) { cpaStatusController.getUserDetails(req, res) });

    app.post('/api/updateUserStatus', [authJwt.decodeJWToken], function (req, res) { cpaStatusController.updateUserStatus(req, res) });


    // viewInvoices.downloadmasterpdf(req, res);  downloardSampleInvoicepdf getVoucherDetailsByTransactionNo
    app.post('/api/getCancelledInvoiceList', [authJwt.decodeJWToken], function (req, res) { invoiceController.getCancelledInvoiceList(req, res) });
    app.post('/api/get_audit_log', [authJwt.decodeJWToken], function (req, res) { cpaStatusController.audit_log(req, res) })
    app.post('/api/createAPICredentials', [authJwt.decodeJWToken], function (req, res) { sysController.createAPICredentials(req, res); });
    app.post('/api/getAllAPIDetails', [authJwt.decodeJWToken], function (req, res) { sysController.getAllAPI(req, res); });
    app.post('/api/updateAPIDetailsStatus', [authJwt.decodeJWToken], function (req, res) { sysController.updateAPI(req, res); });

    app.post('/api/getAllBankCode', [authJwt.decodeJWToken], function (req, res) { BankdetialsController.getAllBankCode(req, res); });
    app.post('/api/SaveBankCode', [authJwt.decodeJWToken], function (req, res) { BankdetialsController.createNewBankCode(req, res); });
    app.post('/api/updateBankCode', [authJwt.decodeJWToken], function (req, res) { BankdetialsController.updateBankCode(req, res); });



    app.post('/api/custidCount', [authJwt.decodeJWToken], function (req, res) { DashBoardController.getCertificateCount(req, res); });

    app.post('/api/certificateDetails', [authJwt.decodeJWToken], function (req, res) { DashBoardController.getCertificateDetails(req, res); });

    app.post('/api/changeRequestCount', [authJwt.decodeJWToken], function (req, res) { DashBoardController.changeRequestCount(req, res); });

    app.post('/api/changeRequestDetails', [authJwt.decodeJWToken], function (req, res) { DashBoardController.changeRequestDetails(req, res); });

    app.post('/api/getInvoiceDataForManualPayment', [authJwt.decodeJWToken], function (req, res) { viewInvoices.getInvoiceData(req, res); });
    app.post('/api/ManualPaymentSearch', [authJwt.decodeJWToken], function (req, res) { viewInvoices.getMasterInvoiceData(req, res); });
    app.post('/api/PayManualPayment', [authJwt.decodeJWToken], function (req, res) { OfflinePayments.PayManualPayment(req, res); });
    app.post('/api/SearchCriteriaSI', [authJwt.decodeJWToken], function (req, res) { SysIntegration.SystemIntegrationSearchCriteria(req, res); });
    app.post('/api/getDebtReminderList', [authJwt.decodeJWToken], function (req, res) { newParamTypeController.getDebtReminderList(req, res); });
    app.get('/api/pofiledetails', [authJwt.decodeJWToken], function (req, res) { fileController.POfileDetails(req, res) });
    app.post('/api/getMessages', [authJwt.decodeJWToken], function (req, res) { viewEnquiryController.getMessages(req, res); });
    app.post('/api/generateManualInvoice', [authJwt.decodeJWToken], function (req, res) { viewInvoices.generateManualInvoice(req, res); });



    app.post('/api/StrandDropdownlist', [authJwt.decodeJWToken], function (req, res) { ProductOnline.StandardDropDownList(req, res); });
    app.post('/api/SchemaDropDownlist', [authJwt.decodeJWToken], function (req, res) { ProductOnline.SchemeDropDown(req, res); });
    app.post('/api/StateDropDownlist', [authJwt.decodeJWToken], function (req, res) { ProductOnline.StateDropDownList(req, res); });
    app.post('/api/CountryDropDownlist', [authJwt.decodeJWToken], function (req, res) { ProductOnline.CountryDropDownList(req, res); });
    app.post('/api/StatusDropDownlist', [authJwt.decodeJWToken], function (req, res) { ProductOnline.StatusDropDownList(req, res); });

    app.post('/api/Searchdataproductlist', [authJwt.decodeJWToken], function (req, res) { ProductOnline.SearchData_ProductOnline(req, res); });
    app.post('/api/checkroc', function (req, res) { newCustomerRegistrationController.check_roc(req, res); });

    app.post('/api/maintenanceCount', [authJwt.decodeJWToken], function (req, res) { DashBoardController.MaintenanceCount(req, res); });

    app.post('/api/maintenanceDetails', [authJwt.decodeJWToken], function (req, res) { DashBoardController.MaintenanceDetails(req, res); });

    app.post('/api/getCustomerList', [authJwt.decodeJWToken], function (req, res) { newCustomerRegistrationController.getCustomerList(req, res); });

    app.post('/api/getAddressDetailsByCustCode', [authJwt.decodeJWToken], function (req, res) { newCustomerRegistrationController.getAddressDetailsByCustCode(req, res); });
    app.post('/api/rePrintInvoicePDF', function (req, res) { viewInvoices.rePrintInvoicePDF(req, res); });
    app.post('/api/MasterInvoiceDetailsPage', function (req, res) { DashBoardController.MasterInvoiceDetailsPage(req, res); });
    app.post('/api/getpaymenttransaction', [authJwt.decodeJWToken], function (req, res) { paymentReportsController.GetpaymentTransactionReport(req, res) });
}



