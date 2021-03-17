const MMSDb = require('../../config/MMSDbConfig');
const sirimUtils = require('./SirimUtils');


exports.getBudgetAnalysisYearListRepo = async (sessionObj, req, res) => {

    let resObj = {};

    let query = `SELECT DISTINCT ProgramYear FROM tbl_mss_Program where status = 7`;

    resObj = await MMSDb.executeQuery(query);

    return resObj;

};

exports.getBudgetAnalysisReportListRepo = async (sessionObj, req, res) => {

    let resObj = {};

    let year = req.body.year;

    let query = `SELECT  ProgramCode, BSource, BudgetTotal, SpendTotal, ProgramYear FROM  tbl_mss_program where status = 7 and flag = 1
    AND ProgramYear=${year}`;

    resObj = await MMSDb.executeQuery(query);

    return resObj;

};

exports.getMarketSurveilanceDetailsYearListRepo = async (sessionObj, req, res) => {

    let resObj = {};

    let query = `SELECT DISTINCT YEAR(SampDate) AS SampYear FROM  tbl_mss_sampling ORDER BY SampYear`;

    resObj = await MMSDb.executeQuery(query);

    return resObj;

};

exports.getBudgetSourceListRepo = async (sessionObj, req, res) => {

    let resObj = {};

    let query = `SELECT  CodeID, Description FROM tbl_mss_code_master WHERE  (Type = 'BUDGET')`;

    resObj = await MMSDb.executeQuery(query);

    return resObj;

};

exports.getMarketSurveilanceDetailsListRepo = async (sessionObj, req, res) => {

    let resObj = {};

    let year = req.body.year;
    let budget_source = req.body.budget_source;

    let query = `SELECT * FROM (SELECT     tbl_mss_sampling.ReferenceNo, tbl_mss_sampling.SampDate, tbl_mss_sampling.Createdby, tbl_mss_sampling.ProdCatgID, tbl_mss_sampling.ProdCatgDesc,
                              tbl_mss_sampling.ProdBrand, tbl_mss_verification.VerificationNo, tbl_mss_code_master_1.Description AS Verification_Comply,       
                              tbl_mss_verification.Remark AS Verification_Remark, tbl_mss_testing.TestRptNo, tbl_mss_testing.TestRptDate, tbl_mss_code_master.Description AS Test_Result,        
                              tbl_mss_testing.TestRespone, tbl_mss_testing.RiskCatg, tbl_mss_testing.Consequences, tbl_mss_testing.Remark AS Test_Remark,       
                              tbl_mss_action_taken_1.Action AS Samp_Action, tbl_mss_action_taken.Action AS Test_Action, tbl_mss_code_master_1.Description, tbl_mss_program.BSource        
        FROM         tbl_mss_sampling INNER JOIN        
                              tbl_mss_schedule ON tbl_mss_sampling.ScheduleID = tbl_mss_schedule.ScheduleID INNER JOIN
        tbl_mss_program ON tbl_mss_schedule.ProgramID = tbl_mss_program.ProgramID LEFT OUTER JOIN
                                      tbl_mss_verification ON tbl_mss_sampling.SamplingID = tbl_mss_verification.SamplingID AND tbl_mss_sampling.Status = 9 AND tbl_mss_verification.Status = 9 AND
                              tbl_mss_sampling.Flag = 1 AND tbl_mss_verification.Flag = 1 LEFT OUTER JOIN
                              tbl_mss_testing ON tbl_mss_sampling.SamplingID = tbl_mss_testing.SamplingID AND tbl_mss_sampling.Status = 9 AND tbl_mss_testing.Status = 9 AND
                              tbl_mss_sampling.Flag = 1 AND tbl_mss_testing.Flag = 1 LEFT OUTER JOIN
                              tbl_mss_code_master AS tbl_mss_code_master_1 ON tbl_mss_verification.Comply = tbl_mss_code_master_1.CodeID AND        
                              tbl_mss_code_master_1.Type = 'COMPLYSTATUS' LEFT OUTER JOIN
                              tbl_mss_code_master AS tbl_mss_code_master ON tbl_mss_testing.TestResult = tbl_mss_code_master_1.CodeID AND
                              tbl_mss_code_master.Type = 'COMPLYSTATUS' LEFT OUTER JOIN        
                              tbl_mss_action_taken AS tbl_mss_action_taken_1 ON tbl_mss_sampling.SamplingID = tbl_mss_action_taken_1.SamplingID LEFT OUTER JOIN
        
        
        
                              tbl_mss_action_taken AS tbl_mss_action_taken ON tbl_mss_testing.TestingID = tbl_mss_action_taken.TestingID ) dd WHERE 
        
        YEAR(dd.SampDate) = ${year}
        
        AND dd.BSource = '${budget_source}'
        
        `;

    resObj = await MMSDb.executeQuery(query);

    return resObj;

};

exports.getMarketSamplingScheduleYearListRepo = async (sessionObj, req, res) => {

    let resObj = {};

    let query = `SELECT DISTINCT YEAR(CreatedDate) AS Year FROM tbl_mss_schedule WHERE (Status = 7) Order by YEAR(CreatedDate)
        `;

    resObj = await MMSDb.executeQuery(query);

    return resObj;

};

exports.getMarketSamplingScheduleReportListRepo = async (sessionObj, req, res) => {

    let resObj = {};

    let year = req.body.year;

    let budget_source = req.body.budget_source;

    let query = `​SELECT     YEAR(tbl_mss_schedule.SchStartdate) AS Year, MONTH(tbl_mss_schedule.SchStartdate) AS Month,
    --{fn MONTHNAME(tbl_mss_schedule.SchStartdate)} AS MonthName,
    CASE {fn MONTHNAME(tbl_mss_schedule.SchStartdate)}
    WHEN 'January' THEN 'Quarter 1'
    WHEN 'February' THEN 'Quarter 1'
    WHEN 'March' THEN 'Quarter 1'
    WHEN 'April' THEN 'Quarter 2'
    WHEN 'May' THEN 'Quarter 2'
    WHEN 'June' THEN 'Quarter 2'
    WHEN 'July' THEN 'Quarter 3'
    WHEN 'August' THEN 'Quarter 3'
    WHEN 'September' THEN 'Quarter 3'
    WHEN 'October' THEN 'Quarter 4'
    WHEN 'November' THEN 'Quarter 4'
    WHEN 'December' THEN 'Quarter 4'
    END
    AS MonthName,
    tbl_mss_schedule.LabelCatg, tbl_mss_schedule.LabelCatgDesc, COUNT(tbl_mss_schedule.ScheduleID) AS Freq,
                          SIRIM_AUTH.dbo.tbl_user.FullName AS PIC, tbl_mss_schedule.ProdCatgDesc, tbl_mss_program.BSource
    FROM         tbl_mss_schedule INNER JOIN
                          tbl_mss_program ON tbl_mss_schedule.ProgramID = tbl_mss_program.ProgramID INNER JOIN
                          SIRIM_AUTH.dbo.tbl_user ON SIRIM_AUTH.dbo.tbl_user.UserName = tbl_mss_schedule.Purchaser
    WHERE     (tbl_mss_schedule.Flag = 1) AND (tbl_mss_schedule.Status = 7)
    
    AND YEAR(tbl_mss_schedule.SchStartdate) = '${year}'
    AND tbl_mss_program.BSource = '${budget_source}'

    GROUP BY YEAR(tbl_mss_schedule.SchStartdate), MONTH(tbl_mss_schedule.SchStartdate), { fn MONTHNAME(tbl_mss_schedule.SchStartdate) },
                              tbl_mss_schedule.LabelCatg, tbl_mss_schedule.LabelCatgDesc, tbl_mss_schedule.Purchaser, tbl_mss_schedule.ProdCatgDesc,
                          tbl_mss_program.BSource, SIRIM_AUTH.dbo.tbl_user.FullName
    ORDER BY Year, MONTH
    
        `;

    resObj = await MMSDb.executeQuery(query);

    return resObj;

};