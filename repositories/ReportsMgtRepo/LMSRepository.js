const LmsDb = require('../../config/LMSDbConfig');
const sirimUtils = require('./SirimUtils');



exports.getPriceList = async (sessionObj, req, res) => {

    let resObj = {};

    let query = `select distinct  Price from tbl_lms_Label_Price  where Price !='0.0100' order by Price`;

    resObj = await LmsDb.executeQuery(query);

    return resObj;

};


exports.getBranchList = async (sessionObj, req, res) => {

    let resObj = {};

    let query = `select distinct LabelBranch from tbl_lms_Label_Application where LabelBranch <> '' order by LabelBranch  DESC`;

    resObj = await LmsDb.executeQuery(query);

    return resObj;

};




exports.getLableTypeList = async (sessionObj, req, res) => {

    let resObj = {};

    let query = `select distinct   LabelCode from  tbl_lms_Label_Application where LabelCode <> ''  order by LabelCode`;

    resObj = await LmsDb.executeQuery(query);

    return resObj;

};



exports.getLableIncomeReportList = async (sessionObj, req, res) => {

    let resObj = {};

    let query = `

    select format(ApplicationDate,'MM/yyyy') date,Year(ApplicationDate) year,Month(ApplicationDate) month,MonthName,LabelDesc,LabelCatg,LabelCode,Source,LabelBranch,sum(Income) Income,sum(MonthlyQty) MonthlyQty,Price ,sum(Income) Total
    from 
    (SELECT  tbl_lms_Label_Application.ApplicationDate,
        YEAR(tbl_lms_Label_Application.ApplicationDate) AS Year,
           MONTH(tbl_lms_Label_Application.ApplicationDate)AS Month,  
        DAY(tbl_lms_Label_Application.ApplicationDate) as Date,
        { fn MONTHNAME(tbl_lms_Label_Application.ApplicationDate) } AS MonthName,
        tbl_lms_Label_Master.LabelCatg, tbl_lms_Label_Master.LabelDesc,  
        tbl_lms_Label_Application.LabelCode,
        SUM(tbl_lms_Label_Application.LabelQty) AS MonthlyQty,  
        SUM(tbl_lms_Label_Application.LabelQty * tbl_lms_Label_Application.Price) AS Income,
        tbl_lms_Label_Master.Source   ,tbl_lms_Label_Application.LabelBranch   ,
        tbl_lms_Label_Price.Price  
      
        FROM  
        tbl_lms_Label_Application
      LEFT OUTER JOIN   tbl_lms_Label_Master ON tbl_lms_Label_Application.LabelCode = tbl_lms_Label_Master.LabelCode
      LEFT OUTER JOIN tbl_lms_Label_Price on tbl_lms_Label_Master.LabelCode=tbl_lms_Label_Price.LabelCode
      and cast(tbl_lms_Label_Application.ProdID as varchar(50))=CAST(tbl_lms_Label_Price.ProdID as varchar(50))
      and tbl_lms_Label_Price.Status=7
      and tbl_lms_label_price.Flag=1 WHERE (tbl_lms_Label_Application.Flag = 1) AND (tbl_lms_Label_Application.Status=10)
      AND (tbl_lms_Label_Application.PaymentStatus in(3,2))
      and tbl_lms_Label_Application.LabelBranch in ('HQ')   
      and tbl_lms_Label_Price.Price in (0.1000)
      and tbl_lms_Label_Application.LabelCode  in ('E1')
      and  tbl_lms_Label_Application.ApplicationDate between '2016-04-01' and '2020-04-09' 
      GROUP BY  YEAR(tbl_lms_Label_Application.ApplicationDate), MONTH(tbl_lms_Label_Application.ApplicationDate), { fn MONTHNAME(tbl_lms_Label_Application.ApplicationDate)
                               },tbl_lms_Label_Application.ApplicationDate,  tbl_lms_Label_Application.LabelCode, tbl_lms_Label_Application.LabelBranch ,
      tbl_lms_Label_Master.LabelCatg, tbl_lms_Label_Master.LabelDesc, tbl_lms_Label_Master.Source,
      tbl_lms_Label_Price.Price) checktable group by format(ApplicationDate,'MM/yyyy'),Year(ApplicationDate),Month(ApplicationDate),MonthName,LabelDesc,LabelCatg,LabelCode,Source,LabelBranch ,Price
      
      
      
      `;

    resObj = await LmsDb.executeQuery(query);

    return resObj;

};




exports.getTeamList = async (sessionObj, req, res) => {

    let resObj = {};

    let query = `SELECT DISTINCT Source FROM tbl_lms_Label_Master`;

    resObj = await LmsDb.executeQuery(query);

    return resObj;

};




exports.getYearList = async (sessionObj, req, res) => {

    let resObj = {};

    let query = `SELECT distinct
    YEAR(tbl_lms_Label_Release_Hdr.ReleaseDate) AS Year
 FROM         tbl_lms_Label_Release_Hdr INNER JOIN
                       tbl_lms_Label_Release_Dtl ON tbl_lms_Label_Release_Hdr.ReleaseNo = tbl_lms_Label_Release_Dtl.ReleaseNo LEFT OUTER JOIN
                       tbl_lms_Label_Stock ON tbl_lms_Label_Release_Dtl.LabelCode = tbl_lms_Label_Stock.LabelCode LEFT OUTER JOIN
                       tbl_lms_Label_Master ON tbl_lms_Label_Stock.LabelCode = tbl_lms_Label_Master.LabelCode LEFT OUTER JOIN
                       tbl_lms_Label_Catg ON tbl_lms_Label_Master.LabelCatg = tbl_lms_Label_Catg.LabelCatg
 WHERE     (tbl_lms_Label_Release_Hdr.Flag = 1) AND (tbl_lms_Label_Release_Dtl.Flag = 1) AND (tbl_lms_Label_Release_Hdr.Status = 13 OR
                       tbl_lms_Label_Release_Hdr.Status = 16)
 GROUP BY YEAR(tbl_lms_Label_Release_Hdr.ReleaseDate), MONTH(tbl_lms_Label_Release_Hdr.ReleaseDate), { fn MONTHNAME(tbl_lms_Label_Release_Hdr.ReleaseDate)
                       }, tbl_lms_Label_Catg.LabelCatg, tbl_lms_Label_Catg.LabelCatgDesc, tbl_lms_Label_Release_Dtl.LabelCode, tbl_lms_Label_Master.Source`;

    resObj = await LmsDb.executeQuery(query);

    return resObj;

};



exports.getBranchListInssuance = async (sessionObj, req, res) => {

    let resObj = {};

    let query = `select distinct BranchID from tbl_lms_Label_Release_Hdr`
    resObj = await LmsDb.executeQuery(query);

    return resObj;

};



exports.getLabelCodeListInssuance = async (sessionObj, req, res) => {

    let resObj = {};

    let query = `select distinct  LabelCode from tbl_lms_Label_Application where LabelCode <> '' order by LabelCode Asc`
    resObj = await LmsDb.executeQuery(query);

    return resObj;

};



exports.getInssuanceReport = async (sessionObj, req, res) => {

    let resObj = {};

    let query = `SELECT
	YEAR(tbl_lms_Label_Release_Hdr.ReleaseDate) AS Year,
	MONTH(tbl_lms_Label_Release_Hdr.ReleaseDate) AS Month,
	{ fn MONTHNAME(tbl_lms_Label_Release_Hdr.ReleaseDate) } AS MonthName,
	tbl_lms_Label_Catg.LabelCatg,
	tbl_lms_Label_Catg.LabelCatgDesc,
	tbl_lms_Label_Release_Dtl.LabelCode,
	SUM(tbl_lms_Label_Release_Dtl.Qty) AS MonthlyQty,
	tbl_lms_Label_Master.Source ,
    tbl_lms_Label_Release_Hdr.BranchID,
    SUM(tbl_lms_Label_Release_Dtl.Qty) AS Total
FROM
	tbl_lms_Label_Release_Hdr
INNER JOIN tbl_lms_Label_Release_Dtl ON
	tbl_lms_Label_Release_Hdr.ReleaseNo = tbl_lms_Label_Release_Dtl.ReleaseNo
LEFT OUTER JOIN tbl_lms_Label_Stock ON
	tbl_lms_Label_Release_Dtl.LabelCode = tbl_lms_Label_Stock.LabelCode
LEFT OUTER JOIN tbl_lms_Label_Master ON
	tbl_lms_Label_Stock.LabelCode = tbl_lms_Label_Master.LabelCode
LEFT OUTER JOIN tbl_lms_Label_Catg ON
	tbl_lms_Label_Master.LabelCatg = tbl_lms_Label_Catg.LabelCatg
WHERE
	(tbl_lms_Label_Release_Hdr.Flag = 1)
	AND (tbl_lms_Label_Release_Dtl.Flag = 1)
	AND (tbl_lms_Label_Release_Hdr.Status = 13
	OR tbl_lms_Label_Release_Hdr.Status = 16)
	AND tbl_lms_Label_Master.Source = 'SCIS'
	--Pass Parameter
	AND YEAR(tbl_lms_Label_Release_Hdr.ReleaseDate) = 2015
	--Pass Parameter
	AND tbl_lms_Label_Release_Hdr.BranchID = 'HQ'
	--Pass Parameter
	AND { fn MONTHNAME(tbl_lms_Label_Release_Hdr.ReleaseDate)} = 'February'
	--Pass Parameter
	AND tbl_lms_Label_Release_Dtl.LabelCode = 'A1'
	--Pass Parameter               

	GROUP BY YEAR(tbl_lms_Label_Release_Hdr.ReleaseDate),
	MONTH(tbl_lms_Label_Release_Hdr.ReleaseDate),
	{ fn MONTHNAME(tbl_lms_Label_Release_Hdr.ReleaseDate) },
	tbl_lms_Label_Catg.LabelCatg,
	tbl_lms_Label_Catg.LabelCatgDesc,
	tbl_lms_Label_Release_Dtl.LabelCode,
	tbl_lms_Label_Master.Source,
	tbl_lms_Label_Release_Hdr.BranchID
`
    resObj = await LmsDb.executeQuery(query);

    return resObj;

};



exports.getApplicationSummaryLabelType = async (sessionObj, req, res) => {

    let resObj = {};

    let query = `select distinct LabelCode   from  tbl_lms_Label_Assign_Dtl where LabelCode  <> ''`
    resObj = await LmsDb.executeQuery(query);

    return resObj;

};





exports.getApplicationSummaryBranch = async (sessionObj, req, res) => {

    let resObj = {};

    let query = `select distinct LabelBranch   from tbl_lms_Label_Application where LabelBranch <> '' order by LabelBranch  DESC`
    resObj = await LmsDb.executeQuery(query);

    return resObj;

};




exports.getInspectionTeamList = async (sessionObj, req, res) => {

    let resObj = {};

    let query = `SELECT DISTINCT Source FROM tbl_lms_Label_Master`
    resObj = await LmsDb.executeQuery(query);

    return resObj;

};

exports.getInspectionYearList = async (sessionObj, req, res) => {

    let resObj = {};

    let query = `SELECT DISTINCT YEAR(InspDate) AS Year FROM tbl_lms_Label_Insp_Hdr ORDER BY Year
    `
    resObj = await LmsDb.executeQuery(query);

    return resObj;

};


exports.getInspectionMonthList = async (sessionObj, req, res) => {

    let resObj = {};

    let query = `SELECT number, DATENAME(MONTH, '2012-' + CAST(number as varchar(2)) + '-1') month  FROM master..spt_values WHERE Type = 'P' and number between 1 and 12 ORDER BY Number
    `
    resObj = await LmsDb.executeQuery(query);

    return resObj;

};


exports.getInspectionDayList = async (sessionObj, req, res) => {

    let resObj = {};

    let query = `WITH nums AS  (SELECT 1 AS value UNION ALL SELECT value + 1 AS value  FROM nums  WHERE nums.value <= 30) SELECT * FROM nums
    `
    resObj = await LmsDb.executeQuery(query);

    return resObj;

};



exports.getInspectionReportList = async (sessionObj, req, res) => {

    let resObj = {};

    let monthvalue = req.body.monthname;
    let yearvalue = req.body.year;
    let dayvalue = req.body.day;

    let Team = await sirimUtils.convertArrayToQuteString(req.body.team);

    let month = [...monthvalue];
    let year = [...yearvalue];
    let day = [...dayvalue];


    console.log(">>>" + JSON.stringify(month))


    let InsDateArray = []

    for (let i = 0; i < year.length; i++) {
        const Year = year[i];
        for (let j = 0; j < month.length; j++) {
            // const MonthName = month[j];
            let MonthNumber = month[j];
            for (let k = 0; k < day.length; k++) {
                const Day = day[k];
                let newDate = Year + '-' + MonthNumber + '-' + Day;
                console.log(newDate)
                InsDateArray.push(newDate);
            }
        }
    }
    console.log("InsDateArray\n" + JSON.stringify(InsDateArray))

    let DateArray = await sirimUtils.convertArrayToQuteString(InsDateArray)

    let query = `SELECT     tbl_lms_Label_Insp_Hdr.InspNo, tbl_lms_Label_Insp_Hdr.InspDate,
    (SELECT     FullName
    FROM          SIRIM_AUTH.dbo.tbl_user
    WHERE      (UserName = tbl_lms_Label_Insp_Hdr.CreatedBy)) AS IsnpBy, tbl_lms_Label_Insp_Dtl.LabelCode, tbl_lms_Label_Insp_Dtl.Qty, tbl_lms_Label_Insp_Hdr.Recommendation,
    tbl_lms_Label_Insp_Dtl.SerialNoFrom, tbl_lms_Label_Insp_Dtl.SerialNoTo, tbl_lms_Label_Rec_Dtl.SerialNoFrom AS RecSerialNoFrom, tbl_lms_Label_Rec_Dtl.SerialNoTo AS RecSerialNoTo,
    tbl_lms_Label_Rec_Dtl.Qty AS RecQty, tbl_lms_Req_Dtl.SerialNoFrom AS ReqSerialNoFrom, tbl_lms_Req_Dtl.SerialNoTo AS ReqSerialNoTo, tbl_lms_Req_Dtl.Qty AS ReqQty
    ,tbl_lms_Label_Master.Source,
    YEAR(tbl_lms_Label_Insp_Hdr.InspDate) AS Year,
    { fn MONTHNAME(tbl_lms_Label_Insp_Hdr.InspDate) } AS MonthName,
    Day(tbl_lms_Label_Insp_Hdr.InspDate) as Day
    FROM         tbl_user AS tbl_user_1 RIGHT OUTER JOIN
    tbl_lms_Label_Rec_Dtl INNER JOIN
    tbl_lms_Label_Rec_Hdr ON tbl_lms_Label_Rec_Dtl.DocNo = tbl_lms_Label_Rec_Hdr.DocNo
    AND tbl_lms_Label_Rec_Dtl.BranchID = tbl_lms_Label_Rec_Hdr.BranchID INNER JOIN
    tbl_lms_Req_Hdr INNER JOIN
    tbl_lms_Req_Dtl ON tbl_lms_Req_Hdr.BranchID = tbl_lms_Req_Dtl.BranchID AND tbl_lms_Req_Hdr.DocNo = tbl_lms_Req_Dtl.DocNo
    ON
    tbl_lms_Label_Rec_Hdr.BranchID = tbl_lms_Req_Dtl.BranchID AND tbl_lms_Label_Rec_Hdr.RecNo = tbl_lms_Req_Dtl.DocNo
    AND dbo.udf_GetNumeric(tbl_lms_Label_Rec_Dtl.SerialNoFrom)
    >= dbo.udf_GetNumeric(tbl_lms_Req_Dtl.SerialNoFrom)
    AND dbo.udf_GetNumeric(tbl_lms_Label_Rec_Dtl.SerialNoTo) <= dbo.udf_GetNumeric(tbl_lms_Req_Dtl.SerialNoTo) AND
    REPLACE(tbl_lms_Label_Rec_Dtl.SerialNoFrom,
    dbo.udf_GetNumeric(tbl_lms_Label_Rec_Dtl.SerialNoFrom), '') = REPLACE(tbl_lms_Req_Dtl.SerialNoFrom,
    dbo.udf_GetNumeric(tbl_lms_Req_Dtl.SerialNoFrom), '') AND tbl_lms_Label_Rec_Dtl.LabelCode = tbl_lms_Req_Dtl.LabelCode
    INNER JOIN
    tbl_lms_Label_Insp_Hdr ON tbl_lms_Label_Rec_Dtl.BranchID = tbl_lms_Label_Insp_Hdr.BranchID
    AND tbl_lms_Label_Rec_Dtl.DocNo = tbl_lms_Label_Insp_Hdr.RecDocNo LEFT OUTER JOIN
    tbl_lms_Label_Insp_Dtl ON tbl_lms_Label_Rec_Dtl.LabelCode = tbl_lms_Label_Insp_Dtl.LabelCode
    AND tbl_lms_Label_Insp_Hdr.BranchID = tbl_lms_Label_Insp_Dtl.BranchID AND
    tbl_lms_Label_Insp_Hdr.InspNo = tbl_lms_Label_Insp_Dtl.InspNo
    ON tbl_user_1.UserID = tbl_lms_Label_Insp_Hdr.CreatedBy INNER JOIN
    tbl_lms_Label_Master on tbl_lms_Label_Insp_Dtl.LabelCode=tbl_lms_Label_Master.LabelCode AND tbl_lms_Label_Master.Source IN (${Team})
    WHERE     (tbl_lms_Label_Insp_Hdr.Flag = 1) AND (tbl_lms_Label_Insp_Dtl.Flag = 1) AND (tbl_lms_Label_Insp_Hdr.Status = 7)
    AND (tbl_lms_Label_Insp_Dtl.Type = 'I')
    AND tbl_lms_Label_Insp_Hdr.InspDate IN (${DateArray})`






    resObj = await LmsDb.executeQuery(query);

    return resObj;

};






exports.getLabelTransferReport = async (sessionObj, req, res) => {

    let resObj = {};

    let query = `SELECT     tbl_lms_Trans_Hdr.TransNo, tbl_lms_Trans_Hdr.BranchID, tbl_lms_Trans_Hdr.Dest, tbl_lms_Trans_Dtl.LabelCode, tbl_lms_Trans_Dtl.SerialNoFrom,
    tbl_lms_Trans_Dtl.SerialNoTo, tbl_lms_Trans_Hdr.TransBy, tbl_user.UserName, tbl_lms_Trans_Hdr.TransDate, tbl_lms_Trans_Hdr.Status,
    tbl_lms_code_master.Description, tbl_lms_Label_Rec_Hdr.ReceivingDate,tbl_lms_Label_Master.Source
FROM         tbl_lms_Trans_Hdr INNER JOIN
    tbl_lms_Trans_Dtl ON tbl_lms_Trans_Hdr.BranchID = tbl_lms_Trans_Dtl.BranchID AND
    tbl_lms_Trans_Hdr.TransNo = tbl_lms_Trans_Dtl.TransNo LEFT OUTER JOIN
    tbl_user ON tbl_lms_Trans_Hdr.TransBy = tbl_user.UserName LEFT OUTER JOIN
    tbl_lms_code_master ON tbl_lms_Trans_Hdr.Status = tbl_lms_code_master.CodeID LEFT OUTER JOIN
    tbl_lms_Label_Rec_Hdr ON tbl_lms_Trans_Hdr.Dest = tbl_lms_Label_Rec_Hdr.BranchID AND
    tbl_lms_Trans_Hdr.TransNo = tbl_lms_Label_Rec_Hdr.RecNo INNER JOIN
    tbl_lms_Label_Master on tbl_lms_Trans_Dtl.LabelCode=tbl_lms_Label_Master.LabelCode
WHERE     (tbl_lms_Trans_Hdr.Flag = 1) AND (tbl_lms_Trans_Dtl.Flag = 1) AND (tbl_lms_Trans_Hdr.Status = 13 OR
    tbl_lms_Trans_Hdr.Status = 16) AND (tbl_lms_Label_Rec_Hdr.DocType = 'T') AND (tbl_lms_code_master.Type = 'APPSTAT')`
    resObj = await LmsDb.executeQuery(query);

    return resObj;

};



exports.getApplicationSummaryReport = async (sessionObj, req, res) => {

    let resObj = {};
    
    
    let fromDate=req.body.fromDate
    let toDate=req.body.toDate
    let Branch=await sirimUtils.convertArrayToQuteString(req.body.branch)
    let labelType=await sirimUtils.convertArrayToQuteString(req.body.LabelType)
    // let invoiced=await sirimUtils.convertArrayToQuteString(req.body.invoiced)
    
    let query = `SELECT SCIS_LIVE.dbo.tbl_quotation.QuoteId,
    tbl_lms_Label_Application.ApplicationNo,
    tbl_lms_Label_Application.ApplicationDate,
    tbl_lms_Label_Application.ApplicantName,
    tbl_lms_Label_Assign_Dtl.SerialNoFrom,
    tbl_lms_Label_Assign_Dtl.SerialNoTo,
    SCIS_LIVE.dbo.tbl_quotation.InvNo,
    tbl_lms_Label_Assign_Dtl.LabelCode,
    SCIS_LIVE.dbo.tbl_quotation.InvAmount,
    tbl_lms_costing_sheet_Dtl.UnitPrice,
    tbl_lms_costing_sheet_Dtl.Qty,
    tbl_lms_costing_sheet_Dtl.Total,
    SCIS_LIVE.dbo.tbl_quotation.ReceiptNo,
    tbl_lms_Label_Application.ApplicationSource,
    tbl_lms_costing_sheet_Dtl.Total as 'WithoutGST',
    tbl_lms_costing_sheet_Dtl.GSTAmount,
    tbl_lms_costing_sheet_Dtl.Total+tbl_lms_costing_sheet_Dtl.GSTAmount as 'withGSt',
    convert(varchar(15),tbl_lms_Label_Assign_Hdr.AssignDate,103) As 'AssignDate' ,
    tbl_lms_Label_Application.LabelBranch as 'Branch' ,
    tbl_lms_Label_Application.Product as 'Type Of Product',
    tbl_lms_Label_Application.LicenseNo,
    convert(varchar(15),tbl_lms_Label_Assign_Dtl.CreatedDate ,103)   As 'CreatedDate' FROM
    tbl_lms_Label_Application
    INNER JOIN tbl_lms_Label_Assign_Hdr ON tbl_lms_Label_Application.ApplicationID = tbl_lms_Label_Assign_Hdr.ApplicationID
    INNER JOIN tbl_lms_Label_Assign_Dtl ON tbl_lms_Label_Assign_Hdr.AssignNo = tbl_lms_Label_Assign_Dtl.AssignNo
    INNER JOIN tbl_lms_costing_sheet_Hdr ON tbl_lms_Label_Assign_Hdr.ApplicationNo = tbl_lms_costing_sheet_Hdr.RefDocNo
    INNER JOIN tbl_lms_costing_sheet_Dtl ON tbl_lms_costing_sheet_Hdr.CostingSheetID = tbl_lms_costing_sheet_Dtl.CostingSheetID
    AND tbl_lms_Label_Assign_Dtl.Qty = tbl_lms_costing_sheet_Dtl.Qty
    LEFT OUTER JOIN tbl_lms_Label_Release_Hdr ON tbl_lms_Label_Application.ApplicationID = tbl_lms_Label_Release_Hdr.ApplicationID
    LEFT OUTER JOIN SCIS_LIVE.dbo.tbl_quotation ON SCIS_LIVE.dbo.tbl_quotation.QuoteId = tbl_lms_costing_sheet_Hdr.SCISQID
    where tbl_lms_Label_Assign_Hdr.AssignDate BETWEEN ('${fromDate}') AND ('${toDate}') AND tbl_lms_Label_Assign_Dtl.LabelCode in(${labelType})
    AND  tbl_lms_Label_Application.LabelBranch in(${Branch})`
    
    console.log(query)
    
    resObj = await LmsDb.executeQuery(query);
    
    return resObj;
    
    };
    




exports.getStockAssessmentReport = async (sessionObj, req, res) => {

    let resObj = {};
    let frmdate = req.body.fromDate;
    let todate = req.body.toDate;
    let labelType = await sirimUtils.convertArrayToQuteString(req.body.LabelType)



    let query = `SELECT  tbl_lms_Req_Hdr.BranchID ,
    tbl_lms_Req_Dtl.LabelCode, tbl_lms_Req_Hdr.ApplicationNo , tbl_lms_Req_Dtl.SerialNoFrom, tbl_lms_Req_Dtl.SerialNoTo,
    tbl_lms_Req_Dtl.Qty,tbl_lms_Req_Hdr.CreatedDate,  { fn MONTHNAME(tbl_lms_Req_Hdr.CreatedDate) } AS Month,
       'Received' as 'D1'
    FROM  tbl_lms_Req_Hdr
      INNER JOIN  tbl_lms_Req_Dtl ON tbl_lms_Req_Hdr.BranchID = tbl_lms_Req_Dtl.BranchID  AND tbl_lms_Req_Hdr.DocNo = tbl_lms_Req_Dtl.DocNo
      LEFT OUTER JOIN   tbl_lms_code_master ON tbl_lms_Req_Hdr.Status = tbl_lms_code_master.CodeID
      LEFT OUTER JOIN  tbl_lms_Label_Master ON tbl_lms_Req_Dtl.LabelCode = tbl_lms_Label_Master.LabelCode
      LEFT OUTER JOIN  tbl_lms_Label_Catg ON tbl_lms_Label_Master.LabelCatg = tbl_lms_Label_Catg.LabelCatg
      LEFT OUTER JOIN  tbl_lms_Label_Rec_Hdr ON tbl_lms_Req_Hdr.DocNo = tbl_lms_Label_Rec_Hdr.RecNo WHERE     (tbl_lms_Req_Hdr.Flag = 1) AND (tbl_lms_Req_Dtl.Flag = 1)
    AND (tbl_lms_Req_Hdr.Status = 13 OR tbl_lms_Req_Hdr.Status = 15 OR tbl_lms_Req_Hdr.Status = 16)
    AND (tbl_lms_code_master.Type = 'APPSTAT') AND (tbl_lms_Label_Rec_Hdr.DocType = 'R')
    And  tbl_lms_Req_Hdr.CreatedDate between '${frmdate}' and '${todate}'  AND  tbl_lms_Req_Dtl.LabelCode In(${labelType})
    and tbl_lms_Label_Rec_Hdr.ReceivingDate = (select  MAX(ReceivingDate) from tbl_lms_Label_Rec_hdr where tbl_lms_Label_Rec_hdr.RecNo=tbl_lms_Req_Hdr.DocNo)
    union select A.BranchID,  A.LabelCode,B.ApplicationNo , A.SerialNoFrom,A.SerialNoTo ,
    Qty,convert(date,A.CreatedDate) as 'CreatedDate',DATENAME(MONTH,A.CreatedDate) as 'Month','Release' as D1 from
    tbl_lms_Label_Assign_Dtl as A
    inner join tbl_lms_Label_Assign_Hdr as B on A.AssignNo=B.AssignNo  and A.Flag=1 AND  A.LabelCode In(${labelType})
    where    A.CreatedDate between '${frmdate}' and '${todate}'
    union select  BranchID,LabelCode,'' as ApplicationNo,SerialNoFrom,SerialNoTo  ,Qty,convert(date,CreatedDate) as 'CreatedDate',DATENAME(MONTH,CreatedDate) as 'Month','Balance' as D1
    from tbl_lms_Label_Serial_Range where Flag=1 and CreatedDate between '${frmdate}' and '${todate}' and LabelCode In (${labelType})`
  
    console.log(query)
   
    resObj = await LmsDb.executeQuery(query);

    return resObj;

};