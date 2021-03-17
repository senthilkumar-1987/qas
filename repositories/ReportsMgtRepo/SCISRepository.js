const mainDb = require('../MainDb');
const sirimUtils = require('./SirimUtils');

exports.getProductList = async (sessionObj, req, res) => {

    let resObj = {};

    let query = "Select Distinct (ProdName) from tbl_lib_prod order by ProdName asc";

    resObj = await mainDb.executeQuery(query);

    return resObj;

};

exports.getAepReportList = async (sessionObj, req, res) => {

    let resObj = {};

    let StandardId = req.body.StandardId;
    let AuditorId = req.body.AuditorId;

    let query = `SELECT dd.FullName,dd.StandardCode,dd.CompLevel,dd.ProdName,dd.SicCode FROM (SELECT DISTINCT u.FullName, s.StandardCode,s.StandardId,(SELECT MAX(CompLevel) FROM tbl_aud_eval a2 WHERE a2.StandardId=s.StandardId AND a2.AuditorId=u.UserId) CompLevel, p.ProdName,p.ProdId, sd.SicCode,a.AuditorId FROM tbl_user u LEFT JOIN tbl_aud_eval a ON u.UserId=a.AuditorId , tbl_lib_standard s, tbl_prod_standard ps, tbl_lib_prod p, tbl_prod_sic pc, tbl_sic_desc sd WHERE a.StandardId=s.StandardId AND a.CompLevel > 0 AND ps.LibStandardId=a.StandardId AND ps.LibProdId=p.ProdId AND ps.LibProdId=pc.LibProdId AND pc.SicId=sd.SicId ) AS dd WHERE dd.StandardId IN (${StandardId}) AND dd.AuditorId IN (${AuditorId})`;

    resObj = await mainDb.executeQuery(query);

    return resObj;

};

exports.getAuditiorList = async (sessionObj, req, res) => {

    let resObj = {};

    let query = `select distinct u.FullName,a.AuditorId From tbl_user u,tbl_aud_eval a where a.AuditorId=u.UserId`;

    resObj = await mainDb.executeQuery(query);

    return resObj;

};

// exports.getAuditiorListBySectionServicesRepo = async (sessionObj, req, res) => {

//     let resObj = {};

//     let section_id = req.body.section_id;

//     let query = `select distinct u.FullName,a.AuditorId From tbl_user u,tbl_aud_eval a where a.AuditorId=u.UserId AND u.SecId  IN(${section_id})`;

//     resObj = await mainDb.executeQuery(query);

//     return resObj;

// };

exports.getAuditiorListBySectionServicesRepo = async (sessionObj, req, res) => {

    let resObj = {};

    let section_id = req.body.section_id;

    let query = `select distinct u.FullName,a.AuditorId From tbl_user u,tbl_aud_eval a where a.AuditorId=u.UserId AND u.SecId  IN(${section_id}) order by u.FullName asc`;

    resObj = await mainDb.executeQuery(query);

    return resObj;

};

exports.getStandardList = async (sessionObj, req, res) => {

    let resObj = {};

    let ProdId = await sirimUtils.convertArrayToQuteString(req.body.productId);

    console.log(ProdId);

    let query = `Select distinct s.StandardId, s.StandardCode,p.ProdId,p.ProdName from tbl_lib_standard s,tbl_lib_prod p, tbl_prod_standard t where t.LibProdId=p.ProdId and t.LibStandardId=s.StandardId and s.StandardId <> 1146`;

    if (ProdId) {
        query += `  AND p.ProdName IN (${ProdId})`
        // query += "  AND p.ProdId='726'"
    }

    query += ` Order by s.StandardCode ASC`

    resObj = await mainDb.executeQuery(query);

    return resObj;

};


exports.getISSonQuatationRepo = async (sessionObj, req, res) => {

    let resObj = {};

    let Sectorname = await sirimUtils.convertArrayToQuteString(req.body.sectorName);

    let month = await sirimUtils.convertArrayToQuteString(req.body.month);
    let year = await sirimUtils.convertArrayToQuteString(req.body.year);

    console.log(">>>>" + month)


    let query = `select *,[G.L File Assignment] as GLFileAssignment,[A.U.D/P.O Submit Costing For Approval 1] as AUDPOSubmitCostingForApproval1 from tbl_IssuedQuotation tio WHERE 
    tio.SectorName IN(${Sectorname}) AND 
    DATEPART(MONTH, convert(DATETIME, tio.QuotePrintDate, 103)) IN(${month}) AND
    DATEPART(YEAR, convert(DATETIME, tio.QuotePrintDate, 103)) IN(${year});`

    console.log(query)

    resObj.reportList = await mainDb.executeQuery(query);

    query = `SELECT (cast(SUM(tio."Status C") as FLOAT) / CAST ((COUNT(tio.FileNo)) AS FLOAT)) * 100 AS qcp ,
    (cast(SUM(tio."Status NC") as FLOAT) / CAST ((COUNT(tio.FileNo)) AS FLOAT)) * 100 AS qncp,
    
     (cast(SUM(IIF(tio.QuotationType ='New Standard' AND tio."Status" ='C', 1, 0)) as FLOAT) / CAST ((COUNT(tio.FileNo)) AS FLOAT)) * 100 AS qnscp,
    (cast(SUM(IIF(tio.QuotationType ='New Standard' AND tio."Status" ='NC', 1, 0)) as FLOAT) / CAST ((COUNT(tio.FileNo)) AS FLOAT)) * 100 AS qnsncp,
    
    (cast(SUM(IIF(tio.QuotationType ='Existing Standard' AND tio."Status" ='C', 1, 0)) as FLOAT) / CAST ((COUNT(tio.FileNo)) AS FLOAT)) * 100 AS qecp,
    (cast(SUM(IIF(tio.QuotationType ='Existing Standard' AND tio."Status" ='NC', 1, 0)) as FLOAT) / CAST ((COUNT(tio.FileNo)) AS FLOAT)) * 100 AS qencp
     
   from tbl_IssuedQuotation tio WHERE 
       tio.SectorName IN(${Sectorname}) AND 
       DATEPART(MONTH, convert(DATETIME, tio.QuotePrintDate, 103)) IN(${month}) AND
       DATEPART(YEAR, convert(DATETIME, tio.QuotePrintDate, 103)) IN(${year});`



    resObj.percentageData = await mainDb.executeQuery(query);


    return resObj;
}

exports.getAepBySectorReportRepo = async (sessionObj, req, res) => {

    let resObj = {};


    let sectionName = req.body.section_name;
    let auditor = await sirimUtils.convertArrayToQuteString(req.body.auditor);


    let query = `select distinct u.FullName,t.SectorName,u.SecId,s.StandardCode,
    (Select MAX(CompLevel) from tbl_aud_eval ae where ae.AuditorId=u.UserId and ae.StandardId=s.StandardId and status = '1') CL,c.SicCode
    From tbl_user u,tbl_lib_standard s,tbl_aud_eval a,tbl_sic_desc c,tbl_sector_type t where
    a.AuditorId=u.UserId and a.StandardId=s.StandardId and
    a.SicId=c.SicId and u.SecId=t.SecId AND u.FullName IN(${auditor}) AND t.SecId IN(${sectionName})
    order by u.FullName asc, s.StandardCode`

    console.log(query);

    resObj = await mainDb.executeQuery(query);

    return resObj;
}

exports.getISSInvoiceRepo = async (sessionObj, req, res) => {

    let resObj = {};

    let Sectorname = await sirimUtils.convertArrayToQuteString(req.body.sectorName);
    let month = await sirimUtils.convertArrayToQuteString(req.body.month);
    let year = await sirimUtils.convertArrayToQuteString(req.body.year);

    let query = `Select FileNo as 'File No', FileId, CompType, Country As CountryCode, CompName, FullName, AuditDate as 'Audit Date', CostingSheet as 'Costing Sheet', JobDay, JobDayStatus, JobDayStatusCCnt as 'JobDayStatusC Cnt', JobDayStatusNCCnt as 'JobDayStatusNC Cnt', SectorName, InvoiceNo as 'Invoice No',HeadApproval as 'Head Approval', InvoiceDate as 'Invoice Date', HeadDay, HeadDayStatus, HeadDayStatusCCnt as 'HeadDayStatusC Cnt',HeadDayStatusNCCnt as 'HeadDayStatusNC Cnt', Wfid, SecId,(select Code from tbl_licensee_type WHERE  RecId  In (select LicenseeType from tbl_file where FileId  = iss.FileId) )as LicenseeType From SCIS_LIVE.dbo.tbl_ISSInvoiceReport iss WHERE SectorName IN (${Sectorname}) AND DATEPART(MONTH, convert(DATETIME, InvoiceDate, 103)) IN(${month}) AND DATEPART(YEAR, convert(DATETIME, InvoiceDate, 103)) IN(${year});    `


    console.log(query)
    resObj.reportList = await mainDb.executeQuery(query);

    query = `Select 
    (cast(sum(iss.JobDayStatusCCnt) as FLOAT) / cast(count(iss.FileNo) as FLOAT)) * 100  as acp, 
(cast(sum(iss.JobDayStatusNCCnt) as FLOAT) / cast(count(iss.FileNo) as FLOAT)) * 100  as ancp,

(cast(sum(iss.HeadDayStatusCCnt) as FLOAT) / cast(count(iss.FileNo) as FLOAT)) * 100  as hcp, 
(cast(sum(iss.HeadDayStatusNCCnt) as FLOAT) / cast(count(iss.FileNo) as FLOAT)) * 100  as hncp,

(cast(SUM(IIF(iss.Country = 1 AND iss.HeadDayStatus = 'C', 1, 0)) as FLOAT) / cast(SUM(iss.HeadDayStatusCCnt) as FLOAT) * cast(SUM(iss.HeadDayStatusCCnt) as FLOAT) /  cast(count(iss.FileNo) as FLOAT)) * 100 AS lcp,
(cast(SUM(IIF(iss.Country = 1 AND iss.HeadDayStatus != 'C', 1, 0)) as FLOAT) / cast(SUM(iss.HeadDayStatusCCnt) as FLOAT) * cast(SUM(iss.HeadDayStatusNCCnt) as FLOAT) /  cast(count(iss.FileNo) as FLOAT)) * 100 AS lncp,

(cast(SUM(IIF(iss.Country != 1 AND iss.HeadDayStatus = 'C', 1, 0)) as FLOAT) / cast(SUM(iss.HeadDayStatusCCnt) as FLOAT) * cast(SUM(iss.HeadDayStatusCCnt) as FLOAT) /  cast(count(iss.FileNo) as FLOAT)) * 100 AS ocp,
(cast(SUM(IIF(iss.Country != 1 AND iss.HeadDayStatus != 'C', 1, 0)) as FLOAT) / cast(SUM(iss.HeadDayStatusCCnt) as FLOAT) * cast(SUM(iss.HeadDayStatusNCCnt) as FLOAT) /  cast(count(iss.FileNo) as FLOAT)) * 100 AS oncp
    From tbl_ISSInvoiceReport iss WHERE SectorName IN (${Sectorname}) AND DATEPART(MONTH, convert(DATETIME, InvoiceDate, 103)) IN(${month}) AND DATEPART(YEAR, convert(DATETIME, InvoiceDate, 103)) IN(${year});    `

    resObj.percentageData = await mainDb.executeQuery(query);

    return resObj;
}

exports.getQuotationReportListRepo = async (sessionObj, req, res) => {

    let resObj = {};

    let schemeName = await sirimUtils.convertArrayToQuteString(req.body.schemeName);
    let Sectorname = await sirimUtils.convertArrayToQuteString(req.body.sectorName);
    let licenseeType = await sirimUtils.convertArrayToQuteString(req.body.licenseeType);
    let status = await sirimUtils.convertArrayToQuteString(req.body.status);

    let month = await sirimUtils.convertArrayToQuteString(req.body.month);
    let year = await sirimUtils.convertArrayToQuteString(req.body.year);

    let query = `select * from dbo.tbl_IssuedQuotation t WHERE 
    SchemeName IN(${schemeName}) 
    AND SectorName IN(${Sectorname}) 
    AND Code IN(${licenseeType}) 
    AND [Payment Status] IN (${status}) 
    AND DATEPART(MONTH, convert(DATETIME, [Date Issued], 103)) IN(${month}) 
    AND DATEPART(YEAR, convert(DATETIME, [Date Issued], 103)) IN(${year});
    `

    resObj = await mainDb.executeQuery(query);

    return resObj;
}

exports.getMonthRepo = async (sessionObj, req, res) => {

    let resObj = {};

    let query = `WITH Month AS (
  SELECT RIGHT('00'+convert(varchar(2),1),2) [Month]
   union all
   SELECT RIGHT('00'+ convert(varchar(2),convert(int,[month])+1),2) FROM Month WHERE [Month] between 01 and 11
  )
    SELECT * FROM Month union select convert(varchar(10),'<Empty>')`

    resObj = await mainDb.executeQuery(query);

    return resObj;

}



exports.getYearRepo = async (sessionObj, req, res) => {

    let resObj = {};

    let query = `WITH Year
    AS
    (
    SELECT convert(varchar(4),2001) [Year]
    UNION ALL
    SELECT convert(varchar(4),convert(int,[Year] + 1)) FROM Year WHERE [Year] between 2000 and 2030
    )
    SELECT * FROM Year
    union 
    select convert(varchar(10),'<Empty>')`

    resObj = await mainDb.executeQuery(query)

    return resObj;
}



exports.getSectorRepo = async (sessionObj, req, res) => {

    let resObj = {};

    let query = `Select * from tbl_sector_type where SecId in (1,2,3,4,5,13,15,16) order by SectorName`

    resObj = await mainDb.executeQuery(query);

    return resObj;

}

exports.getSectorRepoEcis = async (sessionObj, req, res) => {

    let resObj = {};

    let query = `Select * from tbl_sector_type where SecId in (3,15,16) order by SectorName`

    resObj = await mainDb.executeQuery(query);

    return resObj;

}

exports.getIssonIssueLicenseRenewalReportListRepo = async (sessionObj, req, res) => {

    let resObj = {};

    let sectorName = await sirimUtils.convertArrayToQuteString(req.body.sectorName);

    let month = await sirimUtils.convertArrayToQuteString(req.body.month);
    let year = await sirimUtils.convertArrayToQuteString(req.body.year);

    console.log(sectorName)

    let query = `select 
    distinct
    f.FileNo 'File No'
    ,f.FileId
    ,U.Fullname
    ,c.compName 'Company Name'
    ,lt.Code
    ,st.SectorName
    ,p.ProdName 'Product'
    ,dbo.fnStandardByProductID(ml.prodid) 'Standard'
    ,wf.wfid
    ,f.FileId
    ,convert(varchar(15),tl1.CreatedDate,103) as RenewalFeePayment 
    ,convert(varchar(15),wfts2.ActionDate,103) as PORecommend 
    ,convert(varchar(15),wfts3.ActionDate,103) as GLSupport
    ,convert(varchar(15),wfts4.ActionDate,103) as PrintLicence 
    ,dbo.fnpublicholidays(tl1.CreatedDate,wfts4.ActionDate) 'Days'
    ,case when dbo.fnpublicholidays(tl1.CreatedDate,wfts4.ActionDate)  > 10 then 'NC' else 'C' End 'Status' 
    ,case when dbo.fnpublicholidays(tl1.CreatedDate,wfts4.ActionDate)  > 10 then 1 else 0 End 'Status NC' 
    ,case when dbo.fnpublicholidays(tl1.CreatedDate,wfts4.ActionDate)  <= 10 then 1 else 0 End 'Status C' 
    from 
    tbl_file f
    ,tbl_master_link ml
    ,tbl_customer c
    ,tbl_product p
    ,tbl_lib_prod lp
    ,tbl_sector_type st
    ,tbl_licensee_type lt
    ,tbl_workflow wf
    left join (select wfid,max(CreatedDate) as CreatedDate from tbl_task_list where TaskName = 'Monitor Payment' and status='2' GROUP BY WfId) tl1 on wf.WfId=tl1.WfId 
    left join (select wfid,max(ActionDate) as ActionDate from tbl_workflow_trans where WfState like '%P.O%' and status='1' GROUP BY WfId) wfts2 on wfts2.WfId=wf.WfId 
    left join (select wfid,max(ActionDate) as ActionDate from tbl_workflow_trans where WfState = 'G.L Approval' and status='1' GROUP BY WfId) wfts3 on wfts3.WfId=wf.WfId 
    left join (select wfid,max(ActionDate) as ActionDate from tbl_workflow_trans where WfState = 'Release Licence To Client' and status='1' GROUP BY WfId) wfts4 on wfts4.WfId=wf.WfId 
    
    ,tbl_user U
    where 
    f.AppId=ml.RecId
    and f.Status=1
    and ml.custid=c.CustId
    and ml.Status=1
    and ml.ProdId=p.ProdId
    and p.LibProdId=lp.ProdId
    and f.SecId=st.SecId
    and lt.RecId=f.LicenseeType
    and wf.FileId=ml.FileId 
    and wf.AppType='Renewal'
    and wf.FileId is not null
    and wf.WfId=wfts2.WfId
    and u.UserId=ml.OfficerId
    and st.SecId in (1,2,3,4,5,7,13,15,16)

    AND st.SectorName IN (${sectorName})
    
    AND MONTH(tl1.CreatedDate) IN (${month})
    
    AND YEAR(tl1.CreatedDate) IN(${year})
    
    order by FileNo
    `
    console.log(query)

    resObj.reportList = await mainDb.executeQuery(query);

    query = `SELECT (cast(SUM(StatusC) as FLOAT) / CAST ((COUNT(FileNo)) AS FLOAT)) * 100 AS isscp,
    (cast(SUM(StatusNC) as FLOAT) / CAST ((COUNT(FileNo)) AS FLOAT)) * 100 AS issncp from
    (select 
distinct
f.FileNo 'FileNo'
,f.FileId
,U.Fullname
,c.compName 'Company Name'
,lt.Code
,st.SectorName
,p.ProdName 'Product'
,dbo.fnStandardByProductID(ml.prodid) 'Standard'
,wf.wfid
,convert(varchar(15),tl1.CreatedDate,103) as RenewalFeePayment 
,convert(varchar(15),wfts2.ActionDate,103) as PORecommend 
,convert(varchar(15),wfts3.ActionDate,103) as GLSupport
,convert(varchar(15),wfts4.ActionDate,103) as PrintLicence 
,dbo.fnpublicholidays(tl1.CreatedDate,wfts4.ActionDate) 'Days'
,case when dbo.fnpublicholidays(tl1.CreatedDate,wfts4.ActionDate)  > 10 then 'NC' else 'C' End 'Status' 
,case when dbo.fnpublicholidays(tl1.CreatedDate,wfts4.ActionDate)  > 10 then 1 else 0 End 'StatusNC' 
,case when dbo.fnpublicholidays(tl1.CreatedDate,wfts4.ActionDate)  <= 10 then 1 else 0 End 'StatusC' 
from 
tbl_file f
,tbl_master_link ml
,tbl_customer c
,tbl_product p
,tbl_lib_prod lp
,tbl_sector_type st
,tbl_licensee_type lt
,tbl_workflow wf
left join (select wfid,max(CreatedDate) as CreatedDate from tbl_task_list where TaskName = 'Monitor Payment' and status='2' GROUP BY WfId) tl1 on wf.WfId=tl1.WfId 
left join (select wfid,max(ActionDate) as ActionDate from tbl_workflow_trans where WfState like '%P.O%' and status='1' GROUP BY WfId) wfts2 on wfts2.WfId=wf.WfId 
left join (select wfid,max(ActionDate) as ActionDate from tbl_workflow_trans where WfState = 'G.L Approval' and status='1' GROUP BY WfId) wfts3 on wfts3.WfId=wf.WfId 
left join (select wfid,max(ActionDate) as ActionDate from tbl_workflow_trans where WfState = 'Release Licence To Client' and status='1' GROUP BY WfId) wfts4 on wfts4.WfId=wf.WfId 

,tbl_user U
where 
f.AppId=ml.RecId
and f.Status=1
and ml.custid=c.CustId
and ml.Status=1
and ml.ProdId=p.ProdId
and p.LibProdId=lp.ProdId
and f.SecId=st.SecId
and lt.RecId=f.LicenseeType
and wf.FileId=ml.FileId 
and wf.AppType='Renewal'
and wf.FileId is not null
and wf.WfId=wfts2.WfId
and u.UserId=ml.OfficerId
and st.SecId in (1,2,3,4,5,7,13,15,16)

AND st.SectorName IN (${sectorName})
    
AND MONTH(tl1.CreatedDate) IN (${month})

AND YEAR(tl1.CreatedDate) IN(${year})
    
) a`;


    console.log(query)

    resObj.percentageData = await mainDb.executeQuery(query);

    return resObj;

}


exports.getAccrediationRepo = async (sessionObj, req, res) => {

    let resObj = {};

    let query = `Select * From tbl_lib_standard A, tbl_standard_accreditation B
    Where A.StandardId = B.LibStandId 
    And B.AccrId = 1
    And A.Status = 1
    And B.Status = 1
    And A.StandardId <> 1146
    Order by A.StandardCode asc`

    resObj = await mainDb.executeQuery(query);

    return resObj;

}

exports.getISSonRecommendationReportListRepo = async (sessionObj, req, res) => {

    let resObj = {};

    let sectorName = await sirimUtils.convertArrayToQuteString(req.body.sectorName);
    let month = await sirimUtils.convertArrayToQuteString(req.body.month);
    let year = await sirimUtils.convertArrayToQuteString(req.body.year);

    let query = `select

    distinct
    
    f.FileNo 'File No'
    
    ,U.Fullname
    
    ,c.compName 'Company Name'
    
    ,lt.Code
    
    ,st.SectorName
    
    ,st.SecId
    
    ,p.ProdName 'Product'
    
    ,dbo.fnStandardByProductID(ml.prodid) 'Standard'
    
    ,wf.wfid
    
    ,f.FileId
    
    ,convert(varchar(15),j.ModifiedDate,103) as ConductInitialAudit
    
    ,convert(varchar(15),ncr.ClosedDate,103) as NCRClosure
    
    ,convert(varchar(15),ttr.CreatedDate,103) as ReportDate
    
    ,convert(varchar(15),ttr.CpApproveddate,103) as Recomdate
    
    ,dbo.fnpublicholidays((SELECT Max(maxDate) FROM (VALUES (j.ModifiedDate), (ncr.ClosedDate), (ttr.CreatedDate)) AS value(maxDate)),wft.ActionDate) 'Days'
    
    ,case when dbo.fnpublicholidays((SELECT Max(maxDate) FROM (VALUES (j.ModifiedDate), (ncr.ClosedDate), (ttr.CreatedDate)) AS value(maxDate)),wft.ActionDate) > 30 then 'NC' else 'C' End 'Status'
    
    ,case when dbo.fnpublicholidays((SELECT Max(maxDate) FROM (VALUES (j.ModifiedDate), (ncr.ClosedDate), (ttr.CreatedDate)) AS value(maxDate)),wft.ActionDate) > 30 then 1 else 0 End 'Status NC'
    
    ,case when dbo.fnpublicholidays((SELECT Max(maxDate) FROM (VALUES (j.ModifiedDate), (ncr.ClosedDate), (ttr.CreatedDate)) AS value(maxDate)),wft.ActionDate) <= 30 then 1 else 0 End 'Status C'
    
    from
    
    tbl_file f
    
    left join tbl_cert_rpt ttr on ttr.FileId=f.FileId
    
    and ttr.CreatedDate=(select min(CreatedDate) from tbl_cert_rpt where FileId=f.FileId)
    
    ,tbl_master_link ml
    
    ,tbl_customer c
    
    ,tbl_product p
    
    ,tbl_lib_prod lp
    
    ,tbl_sector_type st
    
    ,tbl_licensee_type lt
    
    ,tbl_workflow wf
    
    left join tbl_workflow_trans wft on wft.WfState='G.L Support' and wft.WfId=wf.WfId
    
    left join (select wfid,max(ActionDate) as ActionDate from tbl_workflow_trans where WfState='G.L Support' GROUP BY WfId) wfts on wft.ActionDate=wfts.ActionDate
    
    ,tbl_job j
    
    left join tbl_ncr ncr on ncr.FileId=j.FileId and j.JobId=ncr.JobId
    
    and ncr.NcrId=(select MAX(NcrId) from tbl_ncr where FileId=ncr.FileId)
    
    ,tbl_audit_rpt ar
    
    ,tbl_insp_plan ip
    
    ,tbl_user U
    
    where
    
    f.AppId=ml.RecId
    
    and f.Status=1
    
    and ml.custid=c.CustId
    
    and ml.Status=1
    
    and ml.ProdId=p.ProdId
    
    and p.LibProdId=lp.ProdId
    
    and f.SecId=st.SecId
    
    and lt.RecId=f.LicenseeType
    
    and wf.FileId=ml.FileId
    
    and wf.AppType='NewApplication'
    
    and wf.FileId is not null
    
    and wft.WfId=wfts.WfId
    
    and wf.wfid=ip.wfid
    
    and j.FileId = wf.FileId
    
    and j.JobId=ar.JobId
    
    and j.JobId=(select MAX(JobId) from tbl_job  where JobId=j.JobId)
    
    and ip.PlanId=(select MAX(PlanId) from tbl_insp_plan ips where ips.WfId=wf.WfId)
    
    and ip.PlanId=j.PlanId
    
    and u.UserId=ml.OfficerId
    
    and st.SecId in (1,2,3,4,5,7,13,15,16)    
    
    AND st.SectorName IN (${sectorName})
    
    AND MONTH(ttr.CpApproveddate) IN (${month})
    
    AND YEAR(ttr.CpApproveddate) IN (${year})   
    
    order by FileNo`

    resObj.reportList = await mainDb.executeQuery(query);


    query = `SELECT (cast(SUM(StatusC) as FLOAT) / CAST ((COUNT(FileNo)) AS FLOAT)) * 100 AS isscp,
    (cast(SUM(StatusNC) as FLOAT) / CAST ((COUNT(FileNo)) AS FLOAT)) * 100 AS issncp from
    (select 
distinct
f.FileNo 'FileNo'
,U.Fullname
,c.compName 'Company Name'
,lt.Code
,st.SectorName
,st.SecId
,p.ProdName 'Product'
,dbo.fnStandardByProductID(ml.prodid) 'Standard'
,wf.wfid
,f.FileId
,convert(varchar(15),j.ModifiedDate,103) as ConductInitialAudit
,convert(varchar(15),ncr.ClosedDate,103) as NCRClosure
,convert(varchar(15),ttr.CreatedDate,103) as ReportDate
,convert(varchar(15),ttr.CpApproveddate,103) as Recomdate
,dbo.fnpublicholidays((SELECT Max(maxDate) FROM (VALUES (j.ModifiedDate), (ncr.ClosedDate), (ttr.CreatedDate)) AS value(maxDate)),wft.ActionDate) 'Days'
,case when dbo.fnpublicholidays((SELECT Max(maxDate) FROM (VALUES (j.ModifiedDate), (ncr.ClosedDate), (ttr.CreatedDate)) AS value(maxDate)),wft.ActionDate) > 30 then 'NC' else 'C' End 'Status' 
,case when dbo.fnpublicholidays((SELECT Max(maxDate) FROM (VALUES (j.ModifiedDate), (ncr.ClosedDate), (ttr.CreatedDate)) AS value(maxDate)),wft.ActionDate) > 30 then 1 else 0 End 'StatusNC' 
,case when dbo.fnpublicholidays((SELECT Max(maxDate) FROM (VALUES (j.ModifiedDate), (ncr.ClosedDate), (ttr.CreatedDate)) AS value(maxDate)),wft.ActionDate) <= 30 then 1 else 0 End 'StatusC' 
from 
tbl_file f
left join tbl_cert_rpt ttr on ttr.FileId=f.FileId 
and ttr.CreatedDate=(select min(CreatedDate) from tbl_cert_rpt where FileId=f.FileId)
,tbl_master_link ml
,tbl_customer c
,tbl_product p
,tbl_lib_prod lp
,tbl_sector_type st
,tbl_licensee_type lt
,tbl_workflow wf
left join tbl_workflow_trans wft on wft.WfState='G.L Support' and wft.WfId=wf.WfId 
left join (select wfid,max(ActionDate) as ActionDate from tbl_workflow_trans where WfState='G.L Support' GROUP BY WfId) wfts on wft.ActionDate=wfts.ActionDate
,tbl_job j 
left join tbl_ncr ncr on ncr.FileId=j.FileId and j.JobId=ncr.JobId
and ncr.NcrId=(select MAX(NcrId) from tbl_ncr where FileId=ncr.FileId)
,tbl_audit_rpt ar
,tbl_insp_plan ip
,tbl_user U
where 
f.AppId=ml.RecId
and f.Status=1
and ml.custid=c.CustId
and ml.Status=1
and ml.ProdId=p.ProdId
and p.LibProdId=lp.ProdId
and f.SecId=st.SecId
and lt.RecId=f.LicenseeType
and wf.FileId=ml.FileId 
and wf.AppType='NewApplication'
and wf.FileId is not null
and wft.WfId=wfts.WfId
and wf.wfid=ip.wfid
and j.FileId = wf.FileId
and j.JobId=ar.JobId
and j.JobId=(select MAX(JobId) from tbl_job  where JobId=j.JobId)
and ip.PlanId=(select MAX(PlanId) from tbl_insp_plan ips where ips.WfId=wf.WfId)
and ip.PlanId=j.PlanId
and u.UserId=ml.OfficerId
and st.SecId in (1,2,3,4,5,7,13,15,16)

AND st.SectorName IN (${sectorName})
    
AND MONTH(ttr.CpApproveddate) IN (${month})

AND YEAR(ttr.CpApproveddate) IN (${year})   

) a 
`;


    resObj.percentageData = await mainDb.executeQuery(query);

    return resObj;

}

exports.getIssonIssueInvoiceAfterCPReportListRepo = async (sessionObj, req, res) => {

    let resObj = {};

    let sectorName = await sirimUtils.convertArrayToQuteString(req.body.sectorName);
    let month = await sirimUtils.convertArrayToQuteString(req.body.month);
    let year = await sirimUtils.convertArrayToQuteString(req.body.year);

    let query = `select

    distinct
    
    f.FileNo 'File No'
    
    ,U.Fullname
    
    ,c.compName 'Company Name'
    
    ,lt.Code
    
    ,st.SectorName
    
    ,p.ProdName 'Product'
    
    ,dbo.fnStandardByProductID(ml.prodid) 'Standard'
    
    ,wf.wfid
    
    ,f.FileId
    
    ,convert(varchar(15),wfts.ActionDate,103) as CPApproval
    
    ,convert(varchar(15),tl.ModifiedDate,103) as CostingSubmit
    
    ,convert(varchar(15),tl1.CreatedDate,103) as InvPrintDate
    
    ,dbo.fnpublicholidays(wfts.ActionDate,tl1.CreatedDate) 'Days'
    
    ,case when dbo.fnpublicholidays(wfts.ActionDate,tl1.CreatedDate)  > 2 then 'NC' else 'C' End 'Status'
    
    ,case when dbo.fnpublicholidays(wfts.ActionDate,tl1.CreatedDate)  > 2 then 1 else 0 End 'Status NC'
    
    ,case when dbo.fnpublicholidays(wfts.ActionDate,tl1.CreatedDate)  <= 2 then 1 else 0 End 'Status C'
    
    from
    
    tbl_file f
    
    ,tbl_master_link ml
    
    ,tbl_customer c
    
    ,tbl_product p
    
    ,tbl_lib_prod lp
    
    ,tbl_sector_type st
    
    ,tbl_licensee_type lt
    
    ,tbl_workflow wf
    
    left join (select wfid,max(ActionDate) as ActionDate from tbl_workflow_trans where WfState='C.P Approval' GROUP BY WfId) wfts on wfts.WfId=wf.WfId
    
    left join (select wfid,max(ModifiedDate) as ModifiedDate from tbl_task_list where TaskName like 'Costing Sheet - Prepare Annual Fee%' GROUP BY WfId) tl on wf.WfId=tl.WfId
    
    left join (select wfid,max(CreatedDate) as CreatedDate from tbl_task_list where TaskName = 'Monitor Payment' GROUP BY WfId) tl1 on wf.WfId=tl1.WfId
    
    ,tbl_user U
    
    where
    
    f.AppId=ml.RecId
    
    and f.Status=1
    
    and ml.custid=c.CustId
    
    and ml.Status=1
    
    and ml.ProdId=p.ProdId
    
    and p.LibProdId=lp.ProdId
    
    and f.SecId=st.SecId
    
    and lt.RecId=f.LicenseeType
    
    and wf.FileId=ml.FileId
    
    and wf.AppType='NewApplication'
    
    and wf.FileId is not null
    
    and wf.WfId=wfts.WfId
    
    and u.UserId=ml.OfficerId
    
    and st.SecId in (1,2,3,4,5,7,13,15,16)
    
    
    
    AND st.SectorName IN (${sectorName})
    
    AND MONTH(wfts.ActionDate) IN (${month})
    
    AND YEAR(wfts.ActionDate) IN (${year})
    
    
    
    order by FileNo
    `

    resObj.reportList = await mainDb.executeQuery(query);

    query = `SELECT (cast(SUM(StatusC) as FLOAT) / CAST ((COUNT(FileNo)) AS FLOAT)) * 100 AS isscp,
    (cast(SUM(StatusNC) as FLOAT) / CAST ((COUNT(FileNo)) AS FLOAT)) * 100 AS issncp from
    (select 
distinct
f.FileNo 'FileNo'
,U.Fullname
,c.compName 'Company Name'
,lt.Code
,st.SectorName
,p.ProdName 'Product'
,dbo.fnStandardByProductID(ml.prodid) 'Standard'
,wf.wfid
,f.FileId
,convert(varchar(15),wfts.ActionDate,103) as CPApproval
,convert(varchar(15),tl.ModifiedDate,103) as CostingSubmit 
,convert(varchar(15),tl1.CreatedDate,103) as InvPrintDate 
,dbo.fnpublicholidays(wfts.ActionDate,tl1.CreatedDate) 'Days'
,case when dbo.fnpublicholidays(wfts.ActionDate,tl1.CreatedDate)  > 2 then 'NC' else 'C' End 'Status' 
,case when dbo.fnpublicholidays(wfts.ActionDate,tl1.CreatedDate)  > 2 then 1 else 0 End 'StatusNC' 
,case when dbo.fnpublicholidays(wfts.ActionDate,tl1.CreatedDate)  <= 2 then 1 else 0 End 'StatusC' 
from 
tbl_file f
,tbl_master_link ml
,tbl_customer c
,tbl_product p
,tbl_lib_prod lp
,tbl_sector_type st
,tbl_licensee_type lt
,tbl_workflow wf
left join (select wfid,max(ActionDate) as ActionDate from tbl_workflow_trans where WfState='C.P Approval' GROUP BY WfId) wfts on wfts.WfId=wf.WfId 
left join (select wfid,max(ModifiedDate) as ModifiedDate from tbl_task_list where TaskName like 'Costing Sheet - Prepare Annual Fee%' GROUP BY WfId) tl on wf.WfId=tl.WfId 
left join (select wfid,max(CreatedDate) as CreatedDate from tbl_task_list where TaskName = 'Monitor Payment' GROUP BY WfId) tl1 on wf.WfId=tl1.WfId 
,tbl_user U
where 
f.AppId=ml.RecId
and f.Status=1
and ml.custid=c.CustId
and ml.Status=1
and ml.ProdId=p.ProdId
and p.LibProdId=lp.ProdId
and f.SecId=st.SecId
and lt.RecId=f.LicenseeType
and wf.FileId=ml.FileId 
and wf.AppType='NewApplication'
and wf.FileId is not null
and wf.WfId=wfts.WfId
and u.UserId=ml.OfficerId
and st.SecId in (1,2,3,4,5,7,13,15,16)

AND st.SectorName IN (${sectorName})
    
AND MONTH(wfts.ActionDate) IN (${month})

AND YEAR(wfts.ActionDate) IN (${year})

) a`;

    resObj.percentageData = await mainDb.executeQuery(query);

    return resObj;

}

exports.getIssonIssueLicenseAfterCPReportListRepo = async (sessionObj, req, res) => {

    let resObj = {};

    let sectorName = await sirimUtils.convertArrayToQuteString(req.body.sectorName);
    let month = await sirimUtils.convertArrayToQuteString(req.body.month);
    let year = await sirimUtils.convertArrayToQuteString(req.body.year);

    let query = `select

    distinct
    
    f.FileNo 'File No'
    
    ,U.Fullname
    
    ,c.compName 'Company Name'
    
    ,lt.Code
    
    ,st.SectorName
    
    ,p.ProdName 'Product'
    
    ,dbo.fnStandardByProductID(ml.prodid) 'Standard'
    
    ,wf.wfid
    
    ,f.FileId
    
    ,convert(varchar(15),wfts1.ActionDate,103) as AnnualFeePayment
    
    ,convert(varchar(15),wfts.ActionDate,103) as PrintLicence
    
    ,dbo.fnpublicholidays(wfts1.ActionDate,wfts.ActionDate) 'Days'
    
    ,case when dbo.fnpublicholidays(wfts1.ActionDate,wfts.ActionDate)  > 1 then 'NC' else 'C' End 'Status'
    
    ,case when dbo.fnpublicholidays(wfts1.ActionDate,wfts.ActionDate)  > 1 then 1 else 0 End 'Status NC'
    
    ,case when dbo.fnpublicholidays(wfts1.ActionDate,wfts.ActionDate)  <= 1 then 1 else 0 End 'Status C'
    
    from
    
    tbl_file f
    
    ,tbl_master_link ml
    
    ,tbl_customer c
    
    ,tbl_product p
    
    ,tbl_lib_prod lp
    
    ,tbl_sector_type st
    
    ,tbl_licensee_type lt
    
    ,tbl_workflow wf
    
    left join (select wfid,max(ActionDate) as ActionDate from tbl_workflow_trans where WfState like 'S.C Certificate or Licence Issuance%' GROUP BY WfId) wfts on wfts.WfId=wf.WfId
    
    left join (select wfid,max(ActionDate) as ActionDate from tbl_workflow_trans where WfState like 'S.C Monitor Payment%' GROUP BY WfId) wfts1 on wfts1.WfId=wf.WfId
    
    ,tbl_user U
    
    where
    
    f.AppId=ml.RecId
    
    and f.Status=1
    
    and ml.custid=c.CustId
    
    and ml.Status=1
    
    and ml.ProdId=p.ProdId
    
    and p.LibProdId=lp.ProdId
    
    and f.SecId=st.SecId
    
    and lt.RecId=f.LicenseeType
    
    and wf.FileId=ml.FileId
    
    and wf.AppType='NewApplication'
    
    and wf.FileId is not null
    
    and wf.WfId=wfts.WfId
    
    and u.UserId=ml.OfficerId
    
    and st.SecId in (1,2,3,4,5,7,13,15,16)
    
    
    
    AND st.SectorName IN (${sectorName})
    
    AND MONTH(wfts1.ActionDate) IN (${month})
    
    AND YEAR(wfts1.ActionDate) IN (${year})
    
    
    
    order by FileNo
    `

    resObj.reportList = await mainDb.executeQuery(query);

    query = `SELECT (cast(SUM(StatusC) as FLOAT) / CAST ((COUNT(FileNo)) AS FLOAT)) * 100 AS isscp,
    (cast(SUM(StatusNC) as FLOAT) / CAST ((COUNT(FileNo)) AS FLOAT)) * 100 AS issncp from
    (select 
distinct
f.FileNo 'FileNo'
,U.Fullname
,c.compName 'Company Name'
,lt.Code
,st.SectorName
,p.ProdName 'Product'
,dbo.fnStandardByProductID(ml.prodid) 'Standard'
,wf.wfid
,f.FileId
,convert(varchar(15),wfts1.ActionDate,103) as AnnualFeePayment 
,convert(varchar(15),wfts.ActionDate,103) as PrintLicence 
,dbo.fnpublicholidays(wfts1.ActionDate,wfts.ActionDate) 'Days'
,case when dbo.fnpublicholidays(wfts1.ActionDate,wfts.ActionDate)  > 1 then 'NC' else 'C' End 'Status' 
,case when dbo.fnpublicholidays(wfts1.ActionDate,wfts.ActionDate)  > 1 then 1 else 0 End 'StatusNC' 
,case when dbo.fnpublicholidays(wfts1.ActionDate,wfts.ActionDate)  <= 1 then 1 else 0 End 'StatusC' 
from 
tbl_file f
,tbl_master_link ml
,tbl_customer c
,tbl_product p
,tbl_lib_prod lp
,tbl_sector_type st
,tbl_licensee_type lt
,tbl_workflow wf
left join (select wfid,max(ActionDate) as ActionDate from tbl_workflow_trans where WfState like 'S.C Certificate or Licence Issuance%' GROUP BY WfId) wfts on wfts.WfId=wf.WfId 
left join (select wfid,max(ActionDate) as ActionDate from tbl_workflow_trans where WfState like 'S.C Monitor Payment%' GROUP BY WfId) wfts1 on wfts1.WfId=wf.WfId 
,tbl_user U
where 
f.AppId=ml.RecId
and f.Status=1
and ml.custid=c.CustId
and ml.Status=1
and ml.ProdId=p.ProdId
and p.LibProdId=lp.ProdId
and f.SecId=st.SecId
and lt.RecId=f.LicenseeType
and wf.FileId=ml.FileId 
and wf.AppType='NewApplication'
and wf.FileId is not null
and wf.WfId=wfts.WfId
and u.UserId=ml.OfficerId
and st.SecId in (1,2,3,4,5,7,13,15,16)

AND st.SectorName IN (${sectorName})
    
AND MONTH(wfts1.ActionDate) IN (${month})

AND YEAR(wfts1.ActionDate) IN (${year})
    
)a    

`;

    resObj.percentageData = await mainDb.executeQuery(query);

    return resObj;

}

exports.getAccreditationReportRepo = async (sessionObj, req, res) => {

    let resObj = {};

    // let standardName = "'" + req.body.standardname.join("','") + "'";
    let standardName = await sirimUtils.convertArrayToQuteString(req.body.standardname);
    let month = await sirimUtils.convertArrayToQuteString(req.body.month);
    let year = await sirimUtils.convertArrayToQuteString(req.body.year);

    console.log(standardName);

    let query = `SELECT siccode,standardcode,filecount,filecountbyyear,fmonth,fyear,compcount,compcountbyyear,cmonth,cyear,ifilecount,
    ifcountbyyear,ifmonth,ifyear from
    (Select ISNULL(C.StandardCode, D.StandardCode) As StandardCode,
    ISNULL(C.SicCode, D.SicCode) As SicCode,
    ISNULL(FileCount, '') As FileCount,
    ISNULL(FileCountByYear, '') As FileCountByYear,
    ISNULL(FMonth, IFMonth) As FMonth,
    ISNULL(FYear, IFYear) As FYear,
    ISNULL(CompCount,'') As CompCount,
    ISNULL(CompCountByYear, '') As CompCountByYear,
    ISNULL(CMonth, IFMonth) As CMonth,
    ISNULL(CYear, IFYear) As CYear,
    ISNULL(IFileCount, '') As IFileCount,
    ISNULL(IFCountByYear, '') As IFCountByYear,
    ISNULL(IFMonth, FMonth) As IFMonth,
    ISNULL(IFYear, FYear) As IFYear
    FROM (
    SELECT A.StandardCode, A.SicCode, FileCount, FileCountByYear, FMonth, FYear, CompCount, CompCountByYear, CMonth, CYear
    FROM (
    Select Distinct StandardCode, SicCode, FileCount, FileCountByYear, FMonth, FYear
    From tbl_rpt_Accreditation
    Where FYear = FYear --FYear
    And FMonth = FMonth
    and StandardCode=StandardCode
    ) A, (
    Select Distinct StandardCode, SicCode, CompCount, CompCountByYear, CMonth, CYear
    From tbl_rpt_Accreditation
    Where CYear = CYear --CYear
    And CMonth = CMonth ) B --CMonth
    Where A.StandardCode = B.StandardCode
    And A.SicCode = B.SicCode
    ) C
    FULL OUTER JOIN
    (
    Select Distinct StandardCode, SicCode, IFileCount, IFCountByYear, IFMonth, IFYear
    From tbl_rpt_Accreditation
    Where IFYear = IFYear -- IFYear
    And IFMonth = IFMonth --IFMonth
    and StandardCode=StandardCode
    ) D ON C.StandardCode = D.StandardCode AND C.FYear = D.IFYear AND C.FMonth = D.IFMonth) e
    WHERE standardcode IN (${standardName}) 
    AND fyear IN (${year})
    AND cyear IN(${year}) 
    AND ifmonth IN(${month}) 
    AND cmonth IN(${month})`

    console.log(query);

    resObj = await mainDb.executeQuery(query);

    return resObj;

}

exports.getTihtenSurvellanceRepo = async (sessionObj, req, res) => {

    let resObj = {};

    let query = `select cr.CertNo as 'Licence No',f.FileNo as 'File No',c.CompName as 'Company',
    p.ProdName as 'Product',dbo.fnBrandByProductID(m.ProdId) as 'Brand',
    dbo.fnStandardByProductID(m.ProdId) as 'Standard',
     FORMAT(th.CPApproveDate, 'dd/MM/yyyy','af') as 'CPApproveDate' ,
     FORMAT( DateAdd(M,coalesce(th.TightenSurvPeriod,0),th.CPApproveDate), 'dd/MM/yyyy','af')  as 'End Date'
    from tbl_file f,tbl_cert cr,tbl_customer c,tbl_product p,
    tbl_master_link m--,tbl_susp_smo sm
    JOIN  tbl_tighten_surv_rpt th
    ON m.fileId = th.FileId
    where f.AppId=m.RecId and p.ProdId=m.ProdId and c.CustId=m.CustId and cr.CertId=m.CertId
    and f.FileStatus='1' and f.SubStatus ='3'
    and th.Status='1'
    `

    resObj = await mainDb.executeQuery(query);

    return resObj;

}

exports.getFileInfoSectorListRepo = async (sessionObj, req, res) => {

    let resObj = {};

    let query = `Select * from tbl_sector_type where Status=1 AND type in ('ECIS','ICCS1','ICCS2') order by SectorName`

    resObj = await mainDb.executeQuery(query);

    return resObj;

}


exports.getFileInfoPreviewReportRepo = async (sessionObj, req, res) => {

    let resObj = {};

    let sectorName = await sirimUtils.convertArrayToQuteString(req.body.sectorName);

    let query = `
    IF OBJECT_ID('tempdb..#temp') IS NOT NULL DROP TABLE #temp
    
    select * into #temp
    from(
    
    SELECT DISTINCT f.FileNo 'File No',f.PrevFileNo,c.compName 'Company Name',U.FULLNAME 'Officer',
    dc.ProdName 'Product',
    dbo.fnStandardByProductID(m.prodid) 'Standard',cc.CertNo 'Licence No',CONVERT(VARCHAR(10), cc.ExpiryDate, 103) 'ExpiryDate'
    ,sc.SchemeName 'Scheme',fs.Description 'Status',case when f.LabelLicencing='1' then 'Yes' else 'No' end 'Licencing Programme',
    CONVERT(VARCHAR(10), cc.StartDate, 103)'StartDate',st.SectorName,lt.Code,crpt.SurveilFreq,f.FileStatus,rt2.Country ,rt2.State
    --fahrul add on 2/3/2017
    
    --,dc.CategoryDesc AS TreasureCategory
    --,dc.RegName AS RelatedAgency
    
    ,dbo.fnCategoryDescByProductID(m.prodid) AS TreasureCategory
    ,dbo.fnRelatedAgencyByProductID(m.prodid) AS RelatedAgency
    
    --,f.AppId--,fr.EndDate
    --,dc.ProdId
    --,f.FileId
    --,fr.RecommType
    
    --Jules modified 2017-11-09 to cater for extended suspension
    --,CASE WHEN f.FileStatus=2 THEN fr.EndDate ELSE null END AS SusEndDate
    ,CASE
    WHEN f.FileStatus=2 AND EXISTS (Select top 1 * from tbl_chg_ext_period where FileId=f.FileId)
    THEN (select top 1 DATEADD(DAY,-1,( DATEADD(MONTH,e.ExtenstionPeriod, fr.EndDate)))
    From tbl_file_recomm fr, tbl_chg_ext_period e
    where fr.FileId=e.FileId and e.ExtensionType='Suspension'
    and fr.FileId = f.FileId)
    WHEN f.FileStatus=2
    THEN fr.EndDate
    ELSE null END AS SusEndDate
    --End modification 2017-11-09
    
    ,CASE WHEN tl.TaskName='Prepare Acceptance Letter' AND fs.Description='Pre-Certification' THEN tl.CreatedDate ELSE NULL END AS PreCertAcceptDate
    --,tl.TaskName
    --end fahrul add
    from
    tbl_file f left join tbl_licensee_type lt on lt.RecId = f.LicenseeType
    LEFT JOIN dbo.tbl_file_recomm fr ON fr.FileId = f.FileId AND fr.RecommType='Suspension' --fahrul add on 2/3/2017
    LEFT JOIN dbo.tbl_task_list tl ON tl.FileId = f.FileId AND tl.TaskName='Prepare Acceptance Letter'--AND tl.AppId = f.AppId--fahrul add on 2/3/2017
    ,tbl_regulatory_type rt2
    ,tbl_customer c
    
    ,tbl_user u
    --fahrul add on 2/3/2017
    --,(SELECT aa.CategoryDesc,p.ProdName,p.ProdId FROM tbl_product p LEFT JOIN  (SELECT DISTINCT pc.LibProdId,pc.CatId,pc.Status,pc2.CategoryCode,pc2.CategoryDesc FROM tbl_prod_cat pc INNER JOIN tbl_product_cat pc2 ON pc2.CatId = pc.CatId WHERE pc.Status=1) aa ON aa.LibProdId = p.LibProdId) dc
    ,tbl_master_link m left join tbl_cert cc on cc.CertId=m.CertId left join tbl_cert_rpt crpt on crpt.FileId=m.FileId
    AND crpt.RptId = (select max(RptId) from tbl_cert_rpt cr where cr.fileid=m.FileId and cr.Status=1)
    AND crpt.Status=1 --and m.ProdId=crpt.ProdId
    left join
    (SELECT dd.ProdId,dd.ProdName,dd.CategoryDesc,dd.RegName FROM dbo.tbl_standard s LEFT JOIN
    ---->8/6/2017
    (SELECT DISTINCT a1.ProdName,a1.ProdId,a2.StandardId,a1.CategoryDesc,a3.RegulatoryId,a3.RegName FROM
    (SELECT aa.CategoryDesc,p.ProdName,p.ProdId
    FROM tbl_product p LEFT JOIN
    (SELECT DISTINCT pc.LibProdId,pc.CatId,pc.Status,pc2.CategoryCode,pc2.CategoryDesc
    FROM tbl_prod_cat pc INNER JOIN tbl_product_cat pc2
    ON pc2.CatId = pc.CatId WHERE pc.Status=1) aa ON aa.LibProdId = p.LibProdId ) a1 INNER JOIN tbl_standard a2 ON a2.ProdId = a1.ProdId
    LEFT JOIN (SELECT rs1.LibStandId,rs1.RegulatoryId,rt2.RegName FROM tbl_regulatory_standard rs1 INNER JOIN dbo.tbl_regulatory_type rt2 ON rt2.RecId = rs1.RegulatoryId) a3
    ON a3.LibStandId=a2.StandardId) dd ON s.ProdId=dd.ProdId and s.StandardId = dd.StandardId ) dc on m.ProdId=dc.ProdId
    -------->8/6/2017
    --,tbl_regulatory_standard rs
    --,tbl_regulatory_type rt
    --end add
    ,tbl_scheme_type sc
    ,tbl_file_status fs
    ,tbl_sector_type st
    where
    f.AppId=m.recid
    and M.CustId= c.CustId
    and m.OfficerId=u.UserId
    --and m.ProdId=dc.ProdId
    and f.SchemeId=sc.SchemeId
    and f.FileStatus=fs.RecId
    and f.SecId=st.SecId
    and f.Status='1'
    and m.Status=1
    AND st.SectorName IN(${sectorName})
    
    ) as a
    
    select * from ( select *, row_number() over(partition by [File No],PrevFileNo,[Company Name],Officer,Product,Standard,[Licence No],[ExpiryDate],Scheme,Status,[Licencing Programme],StartDate,SectorName,code,SurveilFreq,FileStatus,TreasureCategory/*,RelatedAgency*/,PreCertAcceptDate order by SusEndDate desc) as rn from #temp) t
    where t.rn = 1
    order by [Company Name]
    `
    console.log(">>>>" + query);
    resObj = await mainDb.executeQuery(query);

    return resObj;

}


exports.getNewApplicationSectorReportRepo = async (sessionObj, req, res) => {

    let resObj = {};

    let query = `Select * from tbl_sector_type where SecId in (1,2,3,4,5,7,13,15,16) order by SectorName`

    resObj = await mainDb.executeQuery(query);

    return resObj;

}


exports.getNewApplicationPreviewReportRepo = async (sessionObj, req, res) => {

    let resObj = {};

    let sectorName = await sirimUtils.convertArrayToQuteString(req.body.sectorName);

    let query = `select distinct f.FileId, c.CompName, f.FileNo,convert(varchar(15),t1.CreatedDate,103) As 'Date Registered',
    lp.ProdName, dbo.fnStANDardByProductID(p.ProdId) As 'Standard Code',
    ISNULL(convert(varchar(15),t2.CreatedDate,103),'') As 'Date Assigned',
    u.FullName,
    s.SectorName,s.SecId, 
    CASE q.InvStatus 
    WHEN 'PAID' THEN 'PAID'
    WHEN 'CANCEL' THEN 'CANCEL'
    ELSE ISNULL(Convert(Varchar(10),Q.QuotePrintDate,103),'')
    END AS 'QuotePrintDate',
    fs.Description as 'Filestatus',
    ISNULL(CONVERT(varchar(15),o.StartDate,103),'')  As 'Inspection Date',
    ISNULL(CONVERT(VARCHAR(10),[dbo].[fnGetAcceptancefiledetails](F.FileId),103),'') As 'Date Acceptance'
    from tbl_file f
    join tbl_master_link m on f.AppId=m.RecId
    join tbl_customer c on f.CustId=c.CustId
    join tbl_sector_type s on s.SecId=f.SecId
    join tbl_product p on p.ProdId=m.ProdId
    join tbl_lib_prod lp on lp.ProdId=p.LibProdId
    join tbl_user u on u.UserId=m.OfficerId
    join tbl_file_status fs on fs.RecId=f.FileStatus
    join tbl_task_list t1 on t1.TaskId = (select top 1 TaskId from tbl_task_list where taskname='New Application' and AppId=m.RecId) 
    left join tbl_task_list t2 on t2.TaskId = (select top 1 TaskId from tbl_task_list where taskname='Document Check List' and FileId=f.FileId and AssignTo=m.OfficerId) 
    left join tbl_task_list t3 on t3.TaskId = (select top 1 TaskId from tbl_task_list where taskname='Prepare Quotation/Invoice - New Application 1' and FileId=f.FileId) 
    left join tbl_quotation q on q.CostId=t3.AppId
    LEFT JOIN (SELECT Max(JobId) As JobId, FileId FROM dbo.tbl_job WHERE JobTypeId = 1 Group by FileId) n ON n.FileId = f.FileId 
    LEFT JOIN dbo.tbl_job_item o ON n.JobId = o.JobId
    where f.SecId in (1,2,3,4,5,7,13,15,16) and f.FileStatus = '4'

    AND s.SectorName IN(${sectorName})

    order by s.SectorName, f.FileNo
    
    `

    resObj = await mainDb.executeQuery(query);

    return resObj;

}



exports.getYearCPReportRepo = async (sessionObj, req, res) => {

    let resObj = {};

    let query = `select distinct  DATEPART(year,CreatedDate) as 'Year'  from tbl_mom_item order by DATEPART(year,CreatedDate)`

    resObj = await mainDb.executeQuery(query);

    return resObj;

}

exports.getDateOfCPListRepo = async (sessionObj, req, res) => {

    let resObj = {};

    let year = req.body.year;

    let query = `Select convert(varchar(15),CreatedDate,103) as 'CP_Date',DATEPART(year,CreatedDate) as 'Year' From tbl_mom where MoMType = 'C'
    AND DATEPART(year,CreatedDate) IN( ${year} )   Order by CreatedDate Desc`

    resObj = await mainDb.executeQuery(query);

    return resObj;

}


exports.getCP_PO_ListRepo = async (sessionObj, req, res) => {

    let resObj = {};

    let sector = await sirimUtils.convertArrayToQuteString(req.body.sector);

    let query = `select  distinct u.FullName , s.SectorName, s.SecId,u.Section   from tbl_user as U
    inner join tbl_sector_type as S on u.Section=s.Type 
    where u.Section in('ICCS1','ECIS','ICCS2')
    and u.Role <> '' and u.Role !='-' and  u.Role in('Auditor','AUDITOR','Group Leader','Lead Auditor','Trainee Auditor')
    AND s.SectorName IN (${sector})
    and s.SectorName not in('GREEN ENGINE','INSPECTION GROUP','ENGINEERING INSPECTION GROUP')
    order by  s.SectorName`

    resObj = await mainDb.executeQuery(query);

    return resObj;

}

exports.getCPDecisionListRepo = async (sessionObj, req, res) => {

    let resObj = {};

    let query = `select distinct  Result as 'CP_Descion' from tbl_mom_item where Result like '%Approve%'`

    resObj = await mainDb.executeQuery(query);

    return resObj;

}

exports.getCPTerminationReportListRepo = async (sessionObj, req, res) => {

    let resObj = {};

    let year = req.body.year;
    let dateofCP = await sirimUtils.convertArrayToQuteString(req.body.dateofCP);
    let sector = await sirimUtils.convertArrayToQuteString(req.body.sector);
    let po = await sirimUtils.convertArrayToQuteString(req.body.po);
    let cpDecision = await sirimUtils.convertArrayToQuteString(req.body.cpDecision);

    let query = `Select distinct
    DATEPART (year,tm.CreatedDate) as 'Year',
  convert(varchar(15),tm.CreatedDate,103)  as 'Date Of CP',
  st.SectorName As 'Group',
      u.Role ,
  c.compName 'Company Name', 
  f.FileNo 'File No',
  u.FullName As 'Project Officer',	
  lp.ProdName As 'Scope Of Registration',
  dbo.fnStandardByProductID(m.prodid) As 'Standard',

  COALESCE(NULLIF(tm.Remark, ''),'N/A') as 'Remark',
  tm.Result ,
  tm1.MoMNo ,
  fs.Description As 'Status',
  fr.TerminationType  as  'Type of Termination',
  '' as 'Date Of Termination'
from tbl_file f,
  tbl_customer c ,
  tbl_master_link m,
  tbl_user u,
  tbl_product p,
  tbl_cert cc,
  tbl_scheme_type sc,
  tbl_file_status fs,
  tbl_sector_type st,
  tbl_mom_item tm,
  tbl_lib_prod lp,
  tbl_file_recomm fr,
  tbl_mom as tm1
where f.appid=m.recid 
and M.CustId= c.CustId 
and m.OfficerId=u.UserId 
and m.ProdId=p.ProdId 
and cc.FileId=f.FileId 
and f.SchemeId=sc.SchemeId 
and f.FileId=tm.FileId 
and f.FileStatus=fs.RecId 
and f.SecId=st.SecId  
and f.Status='1' 
and m.status=1 
and tm.AppType ='Termination'
----and f.FileStatus=3  
And p.LibProdId = lp.ProdId
and f.FileId=fr.FileId 
and tm1.MomId=tm.MomId  
and fr.RecommType='Termination'
and tm.Result not in ('Reject','Noted')
---and tm.Result not in ('Noted')

AND DATEPART (year,tm.CreatedDate) IN(${year})

AND convert(varchar(15),tm.CreatedDate,103) IN(${dateofCP})

AND st.SectorName IN(${sector})

AND u.FullName IN(${po})

AND tm.Result IN (${cpDecision})

order by c.CompName asc
    `

    resObj = await mainDb.executeQuery(query);

    return resObj;

}



exports.getGECompanyListRepo = async (sessionObj, req, res) => {

    let resObj = {};

    let query = `select distinct li.LicCompName as CompName from tbl_ges_new_app_lic li`

    resObj = await mainDb.executeQuery(query);

    return resObj;

}


exports.getSchemeNameListRepo = async (sessionObj, req, res) => {

    let resObj = {};

    let query = `SELECT * FROM tbl_scheme_type tst WHERE tst."Type" = 'PCI' `

    resObj = await mainDb.executeQuery(query);

    return resObj;

}

exports.getLicenseeTypeListRepo = async (sessionObj, req, res) => {

    let resObj = {};

    let query = `SELECT * FROM tbl_licensee_type`

    resObj = await mainDb.executeQuery(query);

    return resObj;

}
exports.getAudiUtilReportListRepo = async (sessionObj, req, res) => {

    let resObj = {};

    let fromDate = req.body.fromDate;
    let toDate = req.body.toDate;
    let sectorName = await sirimUtils.convertArrayToQuteString(req.body.sectorName);

    let query = `select u.FullName,s.SectorName, UPPER(a.role) AS role 
    ,SUM(a.NewLicence) as NewLicence
    ,Format(SUM(a.Surveillance),'N2') As Surveillance
    ,Format(SUM(a.InitialAudit),'N2') as InitialAudit
    ,Format(SUM(a.ChangeRequest),'N2') as ChangeRequest
    ,Format(SUM(a.Verification),'N2') as Verification
    ,Format(SUM(a.Consignment),'N2') as Consignment
    ,Format(SUM(a.GEConsignment),'N2') as GEConsignment
    ,Format(SUM(a.GECertification),'N2') as GECertification
    ,Format(SUM(a.CB),'N2') as CB
    ,Format(SUM(a.BatchCert),'N2') as BatchCert
    ,Format(SUM(a.BatchVer),'N2') as BatchVer
    ,Format(SUM(a.ForeignInsp),'N2') as ForeignInsp
    ,Format((ISNULL(SUM(a.NewLicence),0)+ISNULL(SUM(a.Surveillance),0)+ISNULL(SUM(a.InitialAudit),0)+ISNULL(SUM(a.ChangeRequest),0)+ISNULL(SUM(a.Verification),0)+ISNULL(SUM(a.Consignment),0)+ISNULL(SUM(a.GEConsignment),0)+ISNULL(SUM(a.GECertification),0)+ISNULL(SUM(a.CB),0)+ISNULL(SUM(a.BatchCert),0)+ISNULL(SUM(a.BatchVer),0)+ISNULL(SUM(a.ForeignInsp),0)),'N2')as Total
    from tbl_AudUtilizationReport as a inner join tbl_user as u on a.UserId=u.UserId inner join tbl_sector_type s on a.SecId=s.SecId
    where a.Role in ('Group Leader', 'Auditor', 'Lead Auditor', 'Trainee Auditor','Consignment Officer','Senior Technical Inspector','Technical Inspection',
    'TECHNICAL INSPECTOR','Trainee Technical Inspector') 
    AND ((a.NewLicenceDate >='${fromDate}' AND a.NewLicenceDate <='${toDate}')
    or (a.SurveillanceDate >='${fromDate}' AND a.SurveillanceDate <='${toDate}')
    or (a.InitialAuditDate >='${fromDate}' AND a.InitialAuditDate <='${toDate}')
    or (a.ChangeRequestDate >='${fromDate}' AND a.ChangeRequestDate <='${toDate}')
    or (a.VerificationDate >='${fromDate}' AND a.VerificationDate <='${toDate}')
    or (a.ConsignmentDate >='${fromDate}' AND a.ConsignmentDate <='${toDate}')
    or (a.GEConsignmentDate >='${fromDate}' AND a.GEConsignmentDate <='${toDate}')
    or (a.GECertificationDate >='${fromDate}' AND a.GECertificationDate <='${toDate}')
    or (a.CBDate >='${fromDate}' AND a.CBDate <='${toDate}')
    or (a.BatchCertDate >='${fromDate}' AND a.BatchCertDate <='${toDate}')
    or (a.BatchVerDate >='${fromDate}' AND a.BatchVerDate <='${toDate}')
    or (a.ForeignInspDate >='${fromDate}' AND a.ForeignInspDate <='${toDate}'))
    and s.Type in ('ICCS1','ICCS2','ECIS')
    AND s.SectorName IN (${sectorName})
    group by  u.FullName, a.Role,s.SectorName 
    order by s.SectorName , a.Role, u.FullName `


    console.log(query)

    resObj = await mainDb.executeQuery(query);

    return resObj;

}


exports.getAudiUtilECISReportListRepo = async (sessionObj, req, res) => {

    let resObj = {};

    let fromDate = req.body.fromDate;
    let toDate = req.body.toDate;
    let sectorName = await sirimUtils.convertArrayToQuteString(req.body.sectorName);


    let query = `SELECT UserId, FullName, SectorName, role, SectorCode, ProdTarget, 
	ISNULL(NewLicence, 0) AS NewLicence, 
	ISNULL(LSurveillance, 0) As LSurveillance, ISNULL(FSurveillance, 0) As FSurveillance, ISNULL(LInitialAudit, 0) As LInitialAudit, 
	ISNULL(FInitialAudit, 0) As FInitialAudit, ISNULL(Verification, 0) AS Verification, ISNULL(ChangeRequest, 0) As ChangeRequest,
	ISNULL(LabelLicensing, 0) As LabelLicensing, 	
	(ISNULL(LSurveillance, 0) + ISNULL(FSurveillance, 0) + ISNULL(LInitialAudit, 0) + 
	ISNULL(FInitialAudit, 0) + ISNULL(Verification, 0) + ISNULL(ChangeRequest, 0) + ISNULL(LabelLicensing, 0)) As NoofAudit,
	CASE 
	WHEN (ISNULL(LSurveillance, 0) + ISNULL(FSurveillance, 0) + ISNULL(LInitialAudit, 0) + 
	ISNULL(FInitialAudit, 0) + ISNULL(Verification, 0) + ISNULL(ChangeRequest, 0) + ISNULL(LabelLicensing, 0)) = 0 
	THEN 0
	ELSE 
	CAST(ROUND((ISNULL((ISNULL((ISNULL(LSurveillance, 0) + ISNULL(FSurveillance, 0) + ISNULL(LInitialAudit, 0) + 
	ISNULL(FInitialAudit, 0) + ISNULL(Verification, 0) + ISNULL(ChangeRequest, 0) + ISNULL(LabelLicensing, 0)),0) / ISNULL(ProdTarget,0)),0) * 100),2) As Numeric(36,2))
	END As AudUtiRate,	
	ISNULL(ProdTotAmount,0) As ProdTotAmount, ISNULL(FITarget,0) As FITarget, ISNULL(CSA,0) As CSA, ISNULL(CSAIFE,0) As CSAIFE,
	ISNULL(VDE,0) As VDE, ISNULL(VDEPL,0) As VDEPL, ISNULL(SJET,0) As SJET, ISNULL(SJETOS,0) As SJETOS, ISNULL(JETPSE,0) As JETPSE,
	ISNULL(JETPSEOS,0) As JETPSEOS, ISNULL(JQA,0) As JQA, ISNULL(JQAOS,0) As JQAOS, ISNULL(KTL,0) As KTL, ISNULL(KTLPL,0) AS KTLPL,
	ISNULL(DEKRAKEMA,0) AS DEKRAKEMA, ISNULL(DEKRAOS,0) As DEKRAOS, ISNULL(DEKRAKEMAPL,0) As DEKRAKEMAPL, ISNULL(NEMKO,0) As NEMKO,
	ISNULL(SGSFIMKO,0) As SGSFIMKO, ISNULL(SEMKO,0) As SEMKO, ISNULL(LCIE,0) As LCIE, ISNULL(OVE,0) As OVE, ISNULL(SEV,0) AS SEV,
	ISNULL(SEVOS,0) As SEVOS, ISNULL(SASORouteA,0) As SASORouteA, ISNULL(SASORouteC,0) As SASORouteC, ISNULL(CQC,0) As CQC, 
	ISNULL(CQCOS,0) As CQCOS, ISNULL(SGSCEBEC,0) As SGSCEBEC, ISNULL(IRAM,0) As IRAM, ISNULL(IRAMOS,0) AS IRAMOS,
	ISNULL(SAVEFI,0) As SAVEFI, ISNULL(TNB,0) As TNB, ISNULL(FITotAmount, 0) As FITotAmount
From (
	--PROD CERT
	SELECT U.UserId, u.FullName, s.SectorName, UPPER(a.role) AS role, s.SectorCode, ut.Target As ProdTarget 
		,SUM(a.NewLicence) AS NewLicence
		,SUM(a.LSurveillance) AS LSurveillance
		,SUM(a.FSurveillance) AS FSurveillance
		,SUM(a.LInitialAudit) AS LInitialAudit
		,SUM(a.FInitialAudit) AS FInitialAudit
		,SUM(a.Verification) AS Verification
		,SUM(a.ChangeRequest) AS ChangeRequest
		,SUM(a.LabelLicensing) AS LabelLicensing
		,SUM(a.ProdTotAmount) AS ProdTotAmount
		,0.0 AS FITarget
		,0.0 AS CSA
		,0.0 AS CSAIFE
		,0.0 AS VDE
		,0.0 AS VDEPL
		,0.0 AS SJET
		,0.0 AS SJETOS
		,0.0 AS JETPSE
		,0.0 AS JETPSEOS
		,0.0 AS JQA
		,0.0 AS JQAOS
		,0.0 AS KTL
		,0.0 AS KTLPL
		,0.0 AS DEKRAKEMA
		,0.0 AS DEKRAOS
		,0.0 AS DEKRAKEMAPL
		,0.0 AS NEMKO
		,0.0 AS SGSFIMKO
		,0.0 AS SEMKO
		,0.0 AS LCIE
		,0.0 AS OVE
		,0.0 AS SEV
		,0.0 AS SEVOS
		,0.0 AS SASORouteA
		,0.0 AS SASORouteC
		,0.0 AS CQC
		,0.0 AS CQCOS
		,0.0 AS SGSCEBEC
		,0.0 AS IRAM
		,0.0 AS IRAMOS
		,0.0 AS SAVEFI
		,0.0 AS TNB
		,0.0 AS FITotAmount

	FROM tbl_AudUtilizationReportECIS AS a
	INNER JOIN tbl_user u ON a.UserId = u.UserId 
	INNER JOIN tbl_sector_type S ON a.SecId = s.SecId
	INNER JOIN tbl_utlTarget UT ON a.UserId = ut.UserId AND ut.SchemeId = 8
	INNER JOIN tbl_file F ON a.FileId = f.FileId 
			           
	WHERE F.SchemeId <> 13
	AND ((a.NewLicenceDate >='${fromDate}' AND a.NewLicenceDate <='${toDate}')
	or (a.SurveillanceDate >='${fromDate}' AND a.SurveillanceDate <='${toDate}')
	or (a.InitialAuditDate >='${fromDate}' AND a.InitialAuditDate <='${toDate}')
	or (a.ChangeRequestDate >='${fromDate}' AND a.ChangeRequestDate <='${toDate}')
	or (a.VerificationDate >='${fromDate}' AND a.VerificationDate <='${toDate}')
	or (a.LabelLicensingDate >='${fromDate}' AND a.LabelLicensingDate <='${toDate}')
	or (a.FIInspecDate >='${fromDate}' AND a.FIInspecDate <='${toDate}'))
	AND f.SecId IN (3, 15, 16)
	AND s.SectorName IN (${sectorName})
	GROUP BY U.UserId, u.FullName, a.Role, s.SectorName, s.SectorCode, ut.Target 

	UNION
	
	--FI
	SELECT U.UserId, u.FullName, s.SectorName, UPPER(a.role) AS role, s.SectorCode, 0.0 AS ProdTarget 
		,0.0 AS NewLicence
		,0.0 AS LSurveillance
		,0.0 AS FSurveillance
		,0.0 AS LInitialAudit
		,0.0 AS FInitialAudit
		,0.0 AS Verification
		,0.0 AS ChangeRequest
		,0.0 AS LabelLicensing
		,0.0 AS ProdTotAmount
		,ut.Target AS FITarget
		,SUM(a.CSA) AS CSA
		,SUM(a.CSAIFE) AS CSAIFE
		,SUM(a.VDE) AS VDE
		,SUM(a.VDEPL) AS VDEPL
		,SUM(a.SJET) AS SJET
		,SUM(a.SJETOS) AS SJETOS
		,SUM(a.JETPSE) AS JETPSE
		,SUM(a.JETPSEOS) AS JETPSEOS
		,SUM(a.JQA) AS JQA
		,SUM(a.JQAOS) AS JQAOS
		,SUM(a.KTL) AS KTL
		,SUM(a.KTLPL) AS KTLPL
		,SUM(a.DEKRAKEMA) AS DEKRAKEMA
		,SUM(a.DEKRAOS) AS DEKRAOS
		,SUM(a.DEKRAKEMAPL) AS DEKRAKEMAPL
		,SUM(a.NEMKO) AS NEMKO
		,SUM(a.SGSFIMKO) AS SGSFIMKO
		,SUM(a.SEMKO)AS SEMKO
		,SUM(a.LCIE) AS LCIE
		,SUM(a.OVE) AS OVE
		,SUM(a.SEV) AS SEV
		,SUM(a.SEVOS) AS SEVOS
		,SUM(a.SASORouteA) AS SASORouteA
		,SUM(a.SASORouteC) AS SASORouteC
		,SUM(a.CQC) AS CQC
		,SUM(a.CQCOS) AS CQCOS
		,SUM(a.SGSCEBEC) AS SGSCEBEC
		,SUM(a.IRAM) AS IRAM
		,SUM(a.IRAMOS) AS IRAMOS
		,SUM(a.[SAVE]) AS SAVEFI
		,SUM(a.TNB) AS TNB
		,SUM(a.FITotAmount) AS FITotAmount
		
	FROM tbl_AudUtilizationReportECIS AS a
	INNER JOIN tbl_user u ON a.UserId = u.UserId 
	INNER JOIN tbl_sector_type s ON a.SecId = s.SecId
	INNER JOIN tbl_utlTarget ut ON a.UserId = ut.UserId AND ut.SchemeId = 12
	INNER JOIN tbl_file F ON a.FileId = f.FileId 
				           
	WHERE F.SchemeId = 13 
	AND ((a.NewLicenceDate >='${fromDate}' AND a.NewLicenceDate <='${toDate}')
	or (a.SurveillanceDate >='${fromDate}' AND a.SurveillanceDate <='${toDate}')
	or (a.InitialAuditDate >='${fromDate}' AND a.InitialAuditDate <='${toDate}')
	or (a.ChangeRequestDate >='${fromDate}' AND a.ChangeRequestDate <='${toDate}')
	or (a.VerificationDate >='${fromDate}' AND a.VerificationDate <='${toDate}')
	or (a.LabelLicensingDate >='${fromDate}' AND a.LabelLicensingDate <='${toDate}')
	or (a.FIInspecDate >='${fromDate}' AND a.FIInspecDate <='${toDate}'))
	--AND f.SecId IN (3, 15, 16)
	AND s.SectorName IN (${sectorName})
	GROUP BY U.UserId, u.FullName, a.Role, s.SectorName, s.SectorCode, ut.Target 
) A
ORDER BY UserId, SectorName, Role, FullName`

    resObj = await mainDb.executeQuery(query);

    return resObj;

}


exports.getAudiUtilICCSReportListRepo = async (sessionObj, req, res) => {

    let resObj = {};

    let fromDate = req.body.fromDate;
    let toDate = req.body.toDate;
    let sectorName = await sirimUtils.convertArrayToQuteString(req.body.sectorName);

    let query = `SELECT UserId, FullName, SectorName, role, SectorCode, FORMAT(ProdTarget,'N2') AS ProdTarget, FORMAT(ISNULL(NewLicence, 0),'N2') AS NewLicence, FORMAT(ISNULL(LSurveillance, 0),'N2') AS LSurveillance, FORMAT(ISNULL(FSurveillance, 0),'N2') AS FSurveillance, FORMAT(ISNULL(LInitialAudit, 0),'N2') AS LInitialAudit, FORMAT(ISNULL(FInitialAudit, 0),'N2') AS FInitialAudit, FORMAT(ISNULL(Verification, 0),'N2') AS Verification, FORMAT(ISNULL(ChangeRequest, 0),'N2') AS ChangeRequest, FORMAT(ISNULL(LabelLicensing, 0),'N2') AS LabelLicensing, FORMAT((ISNULL(LSurveillance, 0) + ISNULL(FSurveillance, 0) + ISNULL(LInitialAudit, 0) + ISNULL(FInitialAudit, 0) + ISNULL(Verification, 0) + ISNULL(ChangeRequest, 0) + ISNULL(LabelLicensing, 0)),'N2') AS NoofAudit,FORMAT( CASE WHEN (ISNULL(LSurveillance, 0) + ISNULL(FSurveillance, 0) + ISNULL(LInitialAudit, 0) + ISNULL(FInitialAudit, 0) + ISNULL(Verification, 0) + ISNULL(ChangeRequest, 0) + ISNULL(LabelLicensing, 0)) = 0 THEN 0 ELSE CAST(ROUND((ISNULL((ISNULL((ISNULL(LSurveillance, 0) + ISNULL(FSurveillance, 0) + ISNULL(LInitialAudit, 0) + ISNULL(FInitialAudit, 0) + ISNULL(Verification, 0) + ISNULL(ChangeRequest, 0) + ISNULL(LabelLicensing, 0)),0) / ISNULL(ProdTarget,0)),0) * 100),2) AS NUMERIC(36,2)) END,'N2' )AS AudUtiRate,FORMAT( ISNULL(ProdTotAmount, 0),'N2') AS ProdTotAmount, FORMAT(ISNULL(GETarget, 0),'N2') AS GETarget, FORMAT(ISNULL(Consignment, 0),'N2') AS Consignment, FORMAT(ISNULL(GEConsignment, 0),'N2') AS GEConsignment, FORMAT(ISNULL(GECertification, 0),'N2') AS GECertification, FORMAT(ISNULL(BatchCert, 0),'N2') AS BatchCert,FORMAT( ISNULL(BatchVer, 0),'N2') AS BatchVer, FORMAT(ISNULL(geTotAmount, 0),'N2') AS geTotAmount, FORMAT(ISNULL(EISTarget, 0),'N2') AS EISTarget, ISNULL(EisCntInspec, 0) AS EisCntInspec, FORMAT(ISNULL(EisTotAmount, 0),'N2') AS EisTotAmount
    From (
    --PROD CERT
    SELECT U.UserId, u.FullName, s.SectorName, UPPER(a.role) AS role, s.SectorCode, ut.Target As ProdTarget
    ,SUM(a.NewLicence) AS NewLicence
    ,SUM(a.LSurveillance) AS LSurveillance
    ,SUM(a.FSurveillance) AS FSurveillance
    ,SUM(a.LInitialAudit) AS LInitialAudit
    ,SUM(a.FInitialAudit) AS FInitialAudit
    ,SUM(a.Verification) AS Verification
    ,SUM(a.ChangeRequest) AS ChangeRequest
    ,SUM(a.LabelLicensing) AS LabelLicensing
    ,SUM(a.ProdTotAmount) AS ProdTotAmount
    ,0.0 AS GETarget
    ,0.0 AS Consignment
    ,0.0 AS GEConsignment
    ,0.0 AS GECertification
    ,0.0 AS BatchCert
    ,0.0 AS BatchVer
    ,0.0 AS geTotAmount
    ,0.0 AS EISTarget
    ,0.0 AS EisCntInspec
    ,0.0 AS EisTotAmount
    
    FROM tbl_AudUtilizationReportICCS AS a
    INNER JOIN tbl_user u ON a.UserId = u.UserId
    INNER JOIN tbl_sector_type S ON a.SecId = s.SecId
    INNER JOIN tbl_utlTarget UT ON a.UserId = ut.UserId AND ut.SchemeId = 8
    INNER JOIN tbl_file F ON a.FileId = f.FileId
    
    WHERE f.SchemeId NOT IN (2,3,4,5,12,13,19)
    AND ((a.NewLicenceDate >='${fromDate}' AND a.NewLicenceDate <='${toDate}')
    or (a.SurveillanceDate >='${fromDate}' AND a.SurveillanceDate <='${toDate}')
    or (a.InitialAuditDate >='${fromDate}' AND a.InitialAuditDate <='${toDate}')
    or (a.ChangeRequestDate >='${fromDate}' AND a.ChangeRequestDate <='${toDate}')
    or (a.VerificationDate >='${fromDate}' AND a.VerificationDate <='${toDate}')
    or (a.LabelLicensingDate >='${fromDate}' AND a.LabelLicensingDate <='${toDate}')
    or (a.ConsignmentDate >='${fromDate}' AND a.ConsignmentDate <='${toDate}')
    or (a.GEConsignmentDate >='${fromDate}' AND a.GEConsignmentDate <='${toDate}')
    or (a.GECertificationDate >='${fromDate}' AND a.GECertificationDate <='${toDate}')
    or (a.BatchCertDate >='${fromDate}' AND a.BatchCertDate <='${toDate}')
    or (a.BatchVerDate >='${fromDate}' AND a.BatchVerDate <='${toDate}')
    or (a.EisInspecDate >='${fromDate}' AND a.EisInspecDate <='${toDate}'))
    AND f.SecId NOT IN (3, 15, 16)
    AND s.SectorName IN (${sectorName})
    GROUP BY U.UserId, u.FullName, a.Role, s.SectorName, s.SectorCode, ut.Target
    
    UNION
    
    --GE
    SELECT U.UserId, u.FullName, s.SectorName, UPPER(a.role) AS role, s.SectorCode, 0.0 AS ProdTarget
    ,0.0 AS NewLicence
    ,0.0 AS LSurveillance
    ,0.0 AS FSurveillance
    ,0.0 AS LInitialAudit
    ,0.0 AS FInitialAudit
    ,0.0 AS Verification
    ,0.0 AS ChangeRequest
    ,0.0 AS LabelLicensing
    ,0.0 AS ProdTotAmount
    ,ut.Target AS GETarget
    ,SUM(a.Consignment) AS Consignment
    ,SUM(a.GEConsignment) AS GEConsignment
    ,SUM(a.GECertification) AS GECertification
    ,SUM(a.BatchCert) AS BatchCert
    ,SUM(a.BatchVer) AS BatchVer
    ,SUM(a.geTotAmount) AS geTotAmount
    ,0.0 AS EISTarget
    ,0.0 AS EisCntInspec
    ,0.0 AS EisTotAmount
    
    FROM tbl_AudUtilizationReportICCS AS a
    INNER JOIN tbl_user u ON a.UserId = u.UserId
    INNER JOIN tbl_sector_type s ON a.SecId = s.SecId
    INNER JOIN tbl_utlTarget ut ON a.UserId = ut.UserId AND ut.SchemeId = 12
    INNER JOIN tbl_file F ON a.FileId = f.FileId
    
    WHERE F.SchemeId = 12
    AND ((a.NewLicenceDate >='${fromDate}' AND a.NewLicenceDate <='${toDate}')
    or (a.SurveillanceDate >='${fromDate}' AND a.SurveillanceDate <='${toDate}')
    or (a.InitialAuditDate >='${fromDate}' AND a.InitialAuditDate <='${toDate}')
    or (a.ChangeRequestDate >='${fromDate}' AND a.ChangeRequestDate <='${toDate}')
    or (a.VerificationDate >='${fromDate}' AND a.VerificationDate <='${toDate}')
    or (a.LabelLicensingDate >='${fromDate}' AND a.LabelLicensingDate <='${toDate}')
    or (a.ConsignmentDate >='${fromDate}' AND a.ConsignmentDate <='${toDate}')
    or (a.GEConsignmentDate >='${fromDate}' AND a.GEConsignmentDate <='${toDate}')
    or (a.GECertificationDate >='${fromDate}' AND a.GECertificationDate <='${toDate}')
    or (a.BatchCertDate >='${fromDate}' AND a.BatchCertDate <='${toDate}')
    or (a.BatchVerDate >='${fromDate}' AND a.BatchVerDate <='${toDate}')
    or (a.EisInspecDate >='${fromDate}' AND a.EisInspecDate <='${toDate}'))
    AND s.SectorName IN (${sectorName})
    GROUP BY U.UserId, u.FullName, a.Role, s.SectorName, s.SectorCode, ut.Target
    
    UNION
    
    --EIS
    SELECT U.UserId, u.FullName, s.SectorName, UPPER(a.role) AS role, s.SectorCode, 0.0 AS ProdTarget
    ,0.0 AS NewLicence
    ,0.0 AS LSurveillance
    ,0.0 AS FSurveillance
    ,0.0 AS LInitialAudit
    ,0.0 AS FInitialAudit
    ,0.0 AS Verification
    ,0.0 AS ChangeRequest
    ,0.0 AS LabelLicensing
    ,0.0 AS ProdTotAmount
    ,0.0 AS GETarget
    ,0.0 AS Consignment
    ,0.0 AS GEConsignment
    ,0.0 AS GECertification
    ,0.0 AS BatchCert
    ,0.0 AS BatchVer
    ,0.0 AS geTotAmount
    ,ut.Target AS EISTarget
    ,SUM(a.EisCntInspec) AS EisCntInspec
    ,SUM(a.EisTotAmount) AS EisTotAmount
    
    FROM tbl_AudUtilizationReportICCS AS a
    INNER JOIN tbl_user u ON a.UserId = u.UserId
    INNER JOIN tbl_sector_type s ON a.SecId = s.SecId
    INNER JOIN tbl_utlTarget ut ON a.UserId = ut.UserId AND ut.SchemeId = 19
    INNER JOIN tbl_file F ON a.FileId = f.FileId
    
    WHERE F.SchemeId = 19
    AND ((a.NewLicenceDate >='${fromDate}' AND a.NewLicenceDate <='${toDate}')
    or (a.SurveillanceDate >='${fromDate}' AND a.SurveillanceDate <='${toDate}')
    or (a.InitialAuditDate >='${fromDate}' AND a.InitialAuditDate <='${toDate}')
    or (a.ChangeRequestDate >='${fromDate}' AND a.ChangeRequestDate <='${toDate}')
    or (a.VerificationDate >='${fromDate}' AND a.VerificationDate <='${toDate}')
    or (a.LabelLicensingDate >='${fromDate}' AND a.LabelLicensingDate <='${toDate}')
    or (a.ConsignmentDate >='${fromDate}' AND a.ConsignmentDate <='${toDate}')
    or (a.GEConsignmentDate >='${fromDate}' AND a.GEConsignmentDate <='${toDate}')
    or (a.GECertificationDate >='${fromDate}' AND a.GECertificationDate <='${toDate}')
    or (a.BatchCertDate >='${fromDate}' AND a.BatchCertDate <='${toDate}')
    or (a.BatchVerDate >='${fromDate}' AND a.BatchVerDate <='${toDate}')
    or (a.EisInspecDate >='${fromDate}' AND a.EisInspecDate <='${toDate}'))
    AND s.SectorName IN (${sectorName})
    GROUP BY U.UserId, u.FullName, a.Role, s.SectorName, s.SectorCode, ut.Target
    ) A
    ORDER BY UserId, SectorName, Role, FullName `

    console.log(query)

    resObj = await mainDb.executeQuery(query);

    return resObj;

}


exports.getGEProjectOfficerListRepo = async (sessionObj, req, res) => {

    let resObj = {};

    let query = `select distinct u.FullName from tbl_master_link ml,tbl_user u where u.UserId=ml.OfficerId`

    resObj = await mainDb.executeQuery(query);

    return resObj;

}


exports.getISSonIssueInvoiceRenewalReportListRepo = async (sessionObj, req, res) => {

    let resObj = {};

    let month = await sirimUtils.convertArrayToQuteString(req.body.month);
    let year = await sirimUtils.convertArrayToQuteString(req.body.year);
    let sectorName = await sirimUtils.convertArrayToQuteString(req.body.sectorName);

    let query = `select 
    distinct
    f.FileNo 'File No'
    ,U.Fullname
    ,c.compName 'Company Name'
    ,lt.Code
    ,st.SectorName
    ,p.ProdName 'Product'
    ,dbo.fnStandardByProductID(ml.prodid) 'Standard'
    ,wf.wfid
    ,f.FileId
    ,convert(varchar(15),crt.ExpiryDate,103) as ExpiryDate 
    ,convert(varchar(15),tl1.CreatedDate,103) as InvPrintDate 
    ,dbo.fnpublicholidays(tl1.CreatedDate,crt.ExpiryDate) 'Days'
    ,dbo.fnpublicholidays(GETDATE(),crt.ExpiryDate) AS dateDif  --fahrul add
    ,case when dbo.fnPublicHolidays(GETDATE(),crt.ExpiryDate) >= 90 then 'C' else 'NC' end as 'Status' --fahrul add on 1/3/2017
    from 
    tbl_file f
    ,tbl_master_link ml
    ,tbl_customer c
    ,tbl_product p
    ,tbl_lib_prod lp
    ,tbl_sector_type st
    ,tbl_licensee_type lt
    ,tbl_workflow wf
    left join (select wfid,max(CreatedDate) as CreatedDate from tbl_task_list where TaskName = 'Monitor Payment' GROUP BY WfId) tl1 on wf.WfId=tl1.WfId 
    ,tbl_user U
    ,tbl_cert crt
    where 
    f.AppId=ml.RecId
    and f.Status=1
    and ml.custid=c.CustId
    and ml.Status=1
    and ml.ProdId=p.ProdId
    and p.LibProdId=lp.ProdId
    and f.SecId=st.SecId
    and lt.RecId=f.LicenseeType
    and wf.FileId=ml.FileId 
    and wf.AppType='Renewal'
    and wf.FileId is not null
    and wf.WfId=tl1.WfId
    and u.UserId=ml.OfficerId
    and crt.CertId=ml.CertId
    and st.SecId in (1,2,3,4,5,7,13,15,16)
    AND DATEDIFF(day,GETDATE(), crt.ExpiryDate) >=0  --fahrul add on 28/2/2017
    
    AND st.SectorName IN (${sectorName})
    
    AND MONTH(tl1.CreatedDate) IN(${month})
    
    AND YEAR(tl1.CreatedDate) IN(${year})
    
    order by FileNo`



    resObj.reportList = await mainDb.executeQuery(query);



    query = `SELECT (cast(SUM(IIF(Status ='C', 1, 0)) as FLOAT) / CAST ((COUNT(FileNo)) AS FLOAT)) * 100 AS isscp,
    (cast(SUM(IIF(Status ='NC', 1, 0)) as FLOAT) / CAST ((COUNT(FileNo)) AS FLOAT)) * 100 AS issncp from
    (select
    distinct
    f.FileNo 'FileNo'
    ,U.Fullname
    ,c.compName 'CompanyName'
    ,lt.Code
    ,st.SectorName
    ,p.ProdName 'Product'
    ,dbo.fnStandardByProductID(ml.prodid) 'Standard'
    ,wf.wfid
    ,f.FileId
    ,convert(varchar(15),crt.ExpiryDate,103) as ExpiryDate
    ,convert(varchar(15),tl1.CreatedDate,103) as InvPrintDate
    ,dbo.fnpublicholidays(tl1.CreatedDate,crt.ExpiryDate) 'Days'
    ,dbo.fnpublicholidays(GETDATE(),crt.ExpiryDate) AS dateDif  --fahrul add
    ,case when dbo.fnPublicHolidays(GETDATE(),crt.ExpiryDate) >= 90 then 'C' else 'NC' end as 'Status' --fahrul add on 1/3/2017
    from
    tbl_file f
    ,tbl_master_link ml
    ,tbl_customer c
    ,tbl_product p
    ,tbl_lib_prod lp
    ,tbl_sector_type st
    ,tbl_licensee_type lt
    ,tbl_workflow wf
    left join (select wfid,max(CreatedDate) as CreatedDate from tbl_task_list where TaskName = 'Monitor Payment' GROUP BY WfId) tl1 on wf.WfId=tl1.WfId
    ,tbl_user U
    ,tbl_cert crt
    where
    f.AppId=ml.RecId
    and f.Status=1
    and ml.custid=c.CustId
    and ml.Status=1
    and ml.ProdId=p.ProdId
    and p.LibProdId=lp.ProdId
    and f.SecId=st.SecId
    and lt.RecId=f.LicenseeType
    and wf.FileId=ml.FileId
    and wf.AppType='Renewal'
    and wf.FileId is not null
    and wf.WfId=tl1.WfId
    and u.UserId=ml.OfficerId
    and crt.CertId=ml.CertId
    and st.SecId in (1,2,3,4,5,7,13,15,16)
    AND DATEDIFF(day,GETDATE(), crt.ExpiryDate) >=0  --fahrul add on 28/2/2017

    AND st.SectorName IN (${sectorName})
    
    AND MONTH(tl1.CreatedDate) IN(${month})
    
    AND YEAR(tl1.CreatedDate) IN(${year})
   

    ) a`;


    console.log(query);

    resObj.percentageData = await mainDb.executeQuery(query);




    return resObj;

}


exports.getISSonAcceptanceLetterReportListRepo = async (sessionObj, req, res) => {

    let resObj = {};


    let month = await sirimUtils.convertArrayToQuteString(req.body.month);
    let year = await sirimUtils.convertArrayToQuteString(req.body.year);
    let sectorName = await sirimUtils.convertArrayToQuteString(req.body.sectorName);

    let query = `select 
    distinct
    f.FileNo 'File No'
    ,u.FullName 
    ,c.CompName as 'Company Name'
    ,lt.Code
    ,st.SectorName
    ,lp.ProdName 'Product'
    ,dbo.fnStandardByProductID(m.prodid) 'Standard'
    ,convert(varchar(15),wx.ActionDate,103) as 'Document Audit Checklist'
    ,convert(varchar(15),wfx.ActionDate,103) as 'Head Approval 2'
    ,convert(varchar(15),tl1.ModifiedDate,103) as QuotePrintDate
    ,convert(varchar(15),q.InvPayDate,103) as PaymentReceivedDate
    ,convert(varchar(15),tl.ModifiedDate,103) as PrepareAcceptanceLetter
    ,dbo.fnpublicholidays(q.InvPayDate,tl.ModifiedDate) 'Days'
    ,case when dbo.fnpublicholidays(q.InvPayDate,tl.ModifiedDate) > 7 then 'NC' else 'C' End 'Status' 
    ,case when dbo.fnpublicholidays(q.InvPayDate,tl.ModifiedDate) > 7 then 1 else 0 End 'Status NC' 
    ,case when dbo.fnpublicholidays(q.InvPayDate,tl.ModifiedDate) <= 7 then 1 else 0 End 'Status C' 
    ,wf.wfid
    from 
    tbl_file f
    left join tbl_job j on f.FileId=j.FileId and j.CreatedDate=(select MAX(CreatedDate) from tbl_job where FileId=j.FileId )
    left join tbl_job_item ji on ji.JobId=j.JobId and ji.CreatedDate=(select MAX(CreatedDate) from tbl_job_item where JobId=j.JobId)
    ,tbl_task_list tl 
    ,tbl_master_link m
    ,tbl_user u
    ,tbl_customer c
    ,tbl_licensee_type lt
    ,tbl_sector_type st
    ,tbl_product p
    ,tbl_lib_prod lp
    ,tbl_costing ct
    ,tbl_quotation q
    left join tbl_task_list tl1 
    on q.CostId=tl1.AppId  
    and tl1.TaskName like '%Prepare Quotation/Invoice - New Application%'
    ,tbl_workflow wf
    ,(select max(wft.ActionDate) as ActionDate,wft.wfid from tbl_workflow_trans wft where wft.WfState='Document Audit Checklist' group by WfId ) wx
    ,(select max(wft1.ActionDate) as ActionDate,wft1.wfid from tbl_workflow_trans wft1 where wft1.WfState='Head Approval 2' group by WfId ) wfx 
    where  
    f.AppId=m.RecId
    and f.status=1
    and f.LicenseeType=lt.RecId
    and f.SecId=st.SecId
    and m.status=1
    and m.CustId=c.CustId
    and m.ProdId=p.ProdId
    and u.UserId=ji.AuditorId
    and p.LibProdId=lp.ProdId
    and p.Status=1
    and lp.Status=1
    and wf.FileId=f.FileId
    and wf.FileId is not null
    and wf.AppType='NewApplication'
    and ct.FileId=f.FileId
    and ct.WfId=wx.wfid
    and ct.CostId=q.CostId
    and ct.GrandTotal=q.Total
    and tl1.WfId=wf.WfId
    and tl.FileId=f.FileId
    and tl.TaskName='Prepare Acceptance Letter'
    and tl.Status=2
    and wx.WfId=wf.WfId
    and wfx.WfId=wf.WfId 
    and st.SecId in (1,2,3,4,5,7,13,15,16)
    
    AND st.SectorName IN (${sectorName})
    
    AND MONTH(tl.ModifiedDate) IN(${month})
    
    AND YEAR(tl.ModifiedDate) IN(${year})
    
    order by f.FileNo`

    resObj.reportList = await mainDb.executeQuery(query);

    query = `SELECT (cast(SUM(StatusC) as FLOAT) / CAST ((COUNT(FileNo)) AS FLOAT)) * 100 AS isscp,
    (cast(SUM(StatusNC) as FLOAT) / CAST ((COUNT(FileNo)) AS FLOAT)) * 100 AS issncp from
    (select 
distinct
f.FileNo 'FileNo'
,u.FullName 
,c.CompName as 'Company Name'
,lt.Code
,st.SectorName
,lp.ProdName 'Product'
,dbo.fnStandardByProductID(m.prodid) 'Standard'
,convert(varchar(15),wx.ActionDate,103) as 'Document Audit Checklist'
,convert(varchar(15),wfx.ActionDate,103) as 'Head Approval 2'
,convert(varchar(15),tl1.ModifiedDate,103) as QuotePrintDate
,convert(varchar(15),q.InvPayDate,103) as PaymentReceivedDate
,convert(varchar(15),tl.ModifiedDate,103) as PrepareAcceptanceLetter
,dbo.fnpublicholidays(q.InvPayDate,tl.ModifiedDate) 'Days'
,case when dbo.fnpublicholidays(q.InvPayDate,tl.ModifiedDate) > 7 then 'NC' else 'C' End 'Status' 
,case when dbo.fnpublicholidays(q.InvPayDate,tl.ModifiedDate) > 7 then 1 else 0 End 'StatusNC' 
,case when dbo.fnpublicholidays(q.InvPayDate,tl.ModifiedDate) <= 7 then 1 else 0 End 'StatusC' 
,wf.wfid
from 
tbl_file f
left join tbl_job j on f.FileId=j.FileId and j.CreatedDate=(select MAX(CreatedDate) from tbl_job where FileId=j.FileId )
left join tbl_job_item ji on ji.JobId=j.JobId and ji.CreatedDate=(select MAX(CreatedDate) from tbl_job_item where JobId=j.JobId)
,tbl_task_list tl 
,tbl_master_link m
,tbl_user u
,tbl_customer c
,tbl_licensee_type lt
,tbl_sector_type st
,tbl_product p
,tbl_lib_prod lp
,tbl_costing ct
,tbl_quotation q
left join tbl_task_list tl1 
on q.CostId=tl1.AppId  
and tl1.TaskName like '%Prepare Quotation/Invoice - New Application%'
,tbl_workflow wf
,(select max(wft.ActionDate) as ActionDate,wft.wfid from tbl_workflow_trans wft where wft.WfState='Document Audit Checklist' group by WfId ) wx
,(select max(wft1.ActionDate) as ActionDate,wft1.wfid from tbl_workflow_trans wft1 where wft1.WfState='Head Approval 2' group by WfId ) wfx 
where  
f.AppId=m.RecId
and f.status=1
and f.LicenseeType=lt.RecId
and f.SecId=st.SecId
and m.status=1
and m.CustId=c.CustId
and m.ProdId=p.ProdId
and u.UserId=ji.AuditorId
and p.LibProdId=lp.ProdId
and p.Status=1
and lp.Status=1
and wf.FileId=f.FileId
and wf.FileId is not null
and wf.AppType='NewApplication'
and ct.FileId=f.FileId
and ct.WfId=wx.wfid
and ct.CostId=q.CostId
and ct.GrandTotal=q.Total
and tl1.WfId=wf.WfId
and tl.FileId=f.FileId
and tl.TaskName='Prepare Acceptance Letter'
and tl.Status=2
and wx.WfId=wf.WfId
and wfx.WfId=wf.WfId 
and st.SecId in (1,2,3,4,5,7,13,15,16)

AND st.SectorName IN (${sectorName})
    
AND MONTH(tl.ModifiedDate) IN(${month})

AND YEAR(tl.ModifiedDate) IN(${year})

) a`;

    resObj.percentageData = await mainDb.executeQuery(query);

    return resObj;

}


exports.getISSonPerformanceInitialAuditReportListRepo = async (sessionObj, req, res) => {

    let resObj = {};

    let month = await sirimUtils.convertArrayToQuteString(req.body.month);
    let year = await sirimUtils.convertArrayToQuteString(req.body.year);
    let sectorName = await sirimUtils.convertArrayToQuteString(req.body.sectorName);

    let query = `select
    f.FileNo 'File No'
    ,u.FullName
    ,c.compName 'Company Name'
    ,lt.Code
    ,st.SectorName
    ,p.ProdName 'Product'
    ,dbo.fnStandardByProductID(m.prodid) 'Standard'
    ,convert(varchar(15),wx.ModifiedDate,103) as 'Prepare Acceptance Letter'
    ,convert(varchar(15),wx1.ModifiedDate,103) as 'Initial Inspection'
    ,convert(varchar(15),wx2.ModifiedDate,103) as 'Monitor Client Response (Audit Job)'
    ,convert(varchar(15),j.ModifiedDate,103) as ActualInitialAuditDate
    , dbo.fnPublicHolidays(wx2.ModifiedDate,j.ModifiedDate) as 'Days'
    ,case when dbo.fnPublicHolidays(wx2.ModifiedDate,j.ModifiedDate) > 30 then 'NC' else 'C' End 'Status'
    ,Case when dbo.fnPublicHolidays(wx2.ModifiedDate,j.ModifiedDate) > 30 then 1 else 0 End 'Status NCCnt'
    ,Case when dbo.fnPublicHolidays(wx2.ModifiedDate,j.ModifiedDate) <= 30 then 1 else 0 End 'Status CCnt'
    ,wf.wfid
    from 
    tbl_file f 
    ,tbl_customer c 
    ,tbl_master_link m
    ,tbl_product p
    ,tbl_sector_type st
    ,tbl_licensee_type lt
    ,tbl_workflow wf
    left join(SELECT max(ModifiedDate) as ModifiedDate,wfid FROM  dbo.tbl_task_list WHERE (TaskName ='Prepare Acceptance Letter' )	GROUP BY WfId ) wx on wx.WfId=wf.WfId
    left join(SELECT max(ModifiedDate) as ModifiedDate,wfid FROM  dbo.tbl_task_list WHERE (TaskName ='Initial Inspection' )	GROUP BY WfId ) wx1 on wx1.WfId=wf.WfId
    left join(SELECT max(ModifiedDate) as ModifiedDate,wfid FROM  dbo.tbl_task_list WHERE (TaskName ='Monitor Client Response (Audit Job)' )	GROUP BY WfId) wx2 on wx2.WfId=wf.WfId
    left join(SELECT wfid,JobId FROM  dbo.tbl_task_list tlx WHERE (TaskName ='Audit Report Pending - New Application') and JobId<>0) wx3 on wx3.WfId=wf.WfId
    ,tbl_job j
    ,tbl_user u
    where 
    f.AppId=m.recid 
    and M.CustId= c.CustId 
    and m.ProdId=p.ProdId 
    and f.SecId=st.SecId  
    and lt.RecId=f.LicenseeType 
    and wf.FileId=m.FileId
    and wf.AppType='NewApplication'
    and wf.FileId is not null
    and j.JobId=wx3.JobId
    and j.FileId = wf.FileId
    and f.Status='1' 
    and m.Status=1 
    and wf.WfId=(select MAX(WfId) from tbl_workflow wf1 where wf1.FileId=m.FileId and wf1.AppType='NewApplication')
    and u.userid=m.officerid
    and st.SecId in (1,2,3,4,5,7,13,15,16)
    
    AND st.SectorName IN (${sectorName})
    
    AND MONTH(wx.ModifiedDate) IN(${month})
    
    AND YEAR(wx.ModifiedDate) IN (${year})
    
    order by 'File No'
    `

    resObj.reportList = await mainDb.executeQuery(query);

    query = `SELECT (cast(SUM(StatusCCnt) as FLOAT) / CAST ((COUNT(FileNo)) AS FLOAT)) * 100 AS isscp,
    (cast(SUM(StatusNCCnt) as FLOAT) / CAST ((COUNT(FileNo)) AS FLOAT)) * 100 AS issncp from
    (select
f.FileNo 'FileNo'
,u.FullName
,c.compName 'Company Name'
,lt.Code
,st.SectorName
,p.ProdName 'Product'
,dbo.fnStandardByProductID(m.prodid) 'Standard'
,convert(varchar(15),wx.ModifiedDate,103) as 'Prepare Acceptance Letter'
,convert(varchar(15),wx1.ModifiedDate,103) as 'Initial Inspection'
,convert(varchar(15),wx2.ModifiedDate,103) as 'Monitor Client Response (Audit Job)'
,convert(varchar(15),j.ModifiedDate,103) as ActualInitialAuditDate
, dbo.fnPublicHolidays(wx2.ModifiedDate,j.ModifiedDate) as 'Days'
,case when dbo.fnPublicHolidays(wx2.ModifiedDate,j.ModifiedDate) > 30 then 'NC' else 'C' End 'Status'
,Case when dbo.fnPublicHolidays(wx2.ModifiedDate,j.ModifiedDate) > 30 then 1 else 0 End 'StatusNCCnt'
,Case when dbo.fnPublicHolidays(wx2.ModifiedDate,j.ModifiedDate) <= 30 then 1 else 0 End 'StatusCCnt'
,wf.wfid
from 
tbl_file f 
,tbl_customer c 
,tbl_master_link m
,tbl_product p
,tbl_sector_type st
,tbl_licensee_type lt
,tbl_workflow wf
left join(SELECT max(ModifiedDate) as ModifiedDate,wfid FROM  dbo.tbl_task_list WHERE (TaskName ='Prepare Acceptance Letter' )	GROUP BY WfId ) wx on wx.WfId=wf.WfId
left join(SELECT max(ModifiedDate) as ModifiedDate,wfid FROM  dbo.tbl_task_list WHERE (TaskName ='Initial Inspection' )	GROUP BY WfId ) wx1 on wx1.WfId=wf.WfId
left join(SELECT max(ModifiedDate) as ModifiedDate,wfid FROM  dbo.tbl_task_list WHERE (TaskName ='Monitor Client Response (Audit Job)' )	GROUP BY WfId) wx2 on wx2.WfId=wf.WfId
left join(SELECT wfid,JobId FROM  dbo.tbl_task_list tlx WHERE (TaskName ='Audit Report Pending - New Application') and JobId<>0) wx3 on wx3.WfId=wf.WfId
,tbl_job j
,tbl_user u
where 
f.AppId=m.recid 
and M.CustId= c.CustId 
and m.ProdId=p.ProdId 
and f.SecId=st.SecId  
and lt.RecId=f.LicenseeType 
and wf.FileId=m.FileId
and wf.AppType='NewApplication'
and wf.FileId is not null
and j.JobId=wx3.JobId
and j.FileId = wf.FileId
and f.Status='1' 
and m.Status=1 
and wf.WfId=(select MAX(WfId) from tbl_workflow wf1 where wf1.FileId=m.FileId and wf1.AppType='NewApplication')
and u.userid=m.officerid
and st.SecId in (1,2,3,4,5,7,13,15,16)

AND st.SectorName IN (${sectorName})
    
AND MONTH(wx.ModifiedDate) IN(${month})

AND YEAR(wx.ModifiedDate) IN (${year})

) a
`;

    resObj.percentageData = await mainDb.executeQuery(query);

    return resObj;

}

exports.getGEAppReportListRepo = async (sessionObj, req, res) => {

    let resObj = {};

    let companyName = await sirimUtils.convertArrayToQuteString(req.body.companyName);
    let projectOfficeName = await sirimUtils.convertArrayToQuteString(req.body.projectOfficer);




    let query = `Select
    wf.wfid
    ,wf.AppType,
    s.StandardCode,
    li.LicCompName as CompName
    ,f.FileNo as FileNo
    ,u.FullName as POName
    ,rp.EngineType,
    rp.VehicleType,
    rp.MarkofVehicle,
    li.MafgCompName
    ,convert(varchar(15),wx1.ActionDate,103) as AppplicationReceived
    ,convert(varchar(15),wx2.ActionDate,103) as ApplicationStart
    ,convert(varchar(15),wx3.ActionDate,103) as ApplicationVerifies
    ,convert(varchar(15),wx4.ActionDate,103) as GLAssignPO
    ,convert(varchar(15),wx5.ActionDate,103) as SCPrepareInvoice
    ,convert(varchar(15),wx6.ActionDate,103) as SCMonitorPayment
    ,convert(varchar(15),wx7.ActionDate,103) as GLSupport
    ,convert(varchar(15),wx8.ActionDate,103) as POPrepareRecommendation
    ,convert(varchar(15),wx9.ActionDate,103) as HeadApproval
    ,convert(varchar(15),wx10.ActionDate,103) as ReleaseCert
    ,convert(varchar(15),ct.ExpiryDate,103) as ExpiryDate
    From
    tbl_workflow wf
    left join (select max(actiondate) as ActionDate,wfid from tbl_workflow_trans where WfState='Application Reviews' group by wfid ) wx1 on wx1.WfId=wf.WfId
    left join (select max(actiondate) as ActionDate,wfid from tbl_workflow_trans where WfState='Application Start' group by wfid) wx2 on wx2.WfId=wf.WfId
    left join (select max(actiondate) as ActionDate,wfid from tbl_workflow_trans where WfState='Application Verifies' group by wfid) wx3 on wx3.WfId=wf.WfId
    left join (select max(actiondate) as ActionDate,wfid from tbl_workflow_trans where WfState='GL Assign PO' group by wfid) wx4 on wx4.WfId=wf.WfId
    left join (select max(actiondate) as ActionDate,wfid from tbl_workflow_trans where WfState='S.C Prepare Invoice' group by wfid) wx5 on wx5.WfId=wf.WfId
    left join (select max(actiondate) as ActionDate,wfid from tbl_workflow_trans where WfState='S.C Monitor Payment' group by wfid) wx6 on wx6.WfId=wf.WfId
    left join (select max(actiondate) as ActionDate,wfid from tbl_workflow_trans where WfState='GL Support' group by wfid) wx7 on wx7.WfId=wf.WfId
    left join (select max(actiondate) as ActionDate,wfid from tbl_workflow_trans where WfState='PO Prepare Recommendation' group by wfid) wx8 on wx8.WfId=wf.WfId
    left join (select max(actiondate) as ActionDate,wfid from tbl_workflow_trans where WfState='Head Approval' group by wfid) wx9 on wx9.WfId=wf.WfId
    left join (select max(actiondate) as ActionDate,wfid from tbl_workflow_trans where WfState='Release Certificate' group by wfid) wx10 on wx10.WfId=wf.WfId
    left join tbl_cert ct on wf.FileId=ct.FileId
    ,tbl_master_link ml
    ,tbl_app_gen ag
    ,tbl_ges_new_app_rpt rp
    ,tbl_ges_new_app_lic li
    ,tbl_file f
    ,tbl_user u,
    tbl_lib_standard s
    where
    wf.FileId=ml.FileId
    and s.StandardId =ag.RefId
    and li.RecId=ag.RefId
    and ag.AppId=ml.AppId
    and li.WfId=wf.WfId
    and li.RecId=rp.RefId
    and ml.recid=f.appid
    and ml.OfficerId=u.UserId
    and rp.Status=1
    and f.status=1
    AND li.LicCompName IN (${companyName})
    AND u.FullName IN (${projectOfficeName})
    and ml.Status=1 and wf.AppType='NewApplication-GE'`

    console.log(query)

    resObj = await mainDb.executeQuery(query);

    return resObj;

}


exports.getSectorRepoICCS = async (sessionObj, req, res) => {

    let resObj = {};

    let query = `Select * from tbl_sector_type where SecId in (1,2,4,5,7,13) order by SectorName`

    resObj = await mainDb.executeQuery(query);

    return resObj;

}