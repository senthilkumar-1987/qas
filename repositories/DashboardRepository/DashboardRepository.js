mainDb = require('../MainDb');
const sirimUtils = require('../ReportsMgtRepo/SirimUtils')

exports.getCount = async (sessionObj, req, res) => {

    let resObj = {};

    let CustCode = sessionObj.custId;

    console.log("CustCode---->" + CustCode);

    let query = `select CustId from tbl_customer where CustCode='${CustCode}'`

    resObj = await mainDb.executeQuery(query);

    console.log("---->" + JSON.stringify(resObj));

    let CustID = resObj[0].CustId;
    // let CustID = '15976'

    console.log("CustID" + CustID);

    query = `select COUNT(distinct f.FileId) as TotalofFiles
from tbl_file f, tbl_task_list t, tbl_workflow w, tbl_master_link m, tbl_product p
where f.custid='${CustID}' and f.FileId=t.FileId and t.WfId=w.WfId
and f.Status= '1' and f.FileStatus=4 and w.AppType='NewApplication'
and t.Status in (1,3) and t.TaskName <> 'Monitor Payment(temp)'
and m.RecId=f.AppId and p.ProdId=m.ProdId`

    resObj = await mainDb.executeQuery(query);

    console.log(">>>>getCount " + JSON.stringify(resObj));
    console.log("TotalofFiles==>" + resObj[0].TotalofFiles)

    return resObj;

}



exports.getCertificationDetails = async (sessionObj, req, res) => {

    let resObj = {};
    // let CustID = sessionObj.custId;
    // console.log(CustID);


    let CustCode = sessionObj.custId;

    console.log("CustCode---->" + CustCode);

    let query = `select CustId from tbl_customer where CustCode='${CustCode}'`

    resObj = await mainDb.executeQuery(query);

    console.log("---->" + JSON.stringify(resObj));

    let CustID = resObj[0].CustId;

    // let CustID = '15976'
    console.log("CustID" + CustID);



    query = ` select distinct a.* from (
        select f.FileNo, s.SchemeName as 'Scheme', p.ProdName as 'Product', dbo.fnStandardByProductID(m.ProdId) as 'Standard',
        ap.UndertakeDate as 'ApplicationDate', ap.UndertakeName as 'AppliedBy', u.FullName as 'ProjectOfficer', 
        REPLACE(t.Taskname,'(Amendment)','') as 'Status'
        From tbl_file f
        inner join tbl_task_list t on f.FileId=t.FileId 
        inner join tbl_workflow w on t.WfId=w.WfId
        inner join tbl_master_link m on m.RecId=f.AppId 
        inner join tbl_product p on p.ProdId=m.ProdId
        inner join tbl_scheme_type s on s.SchemeId=f.SchemeId
        inner join tbl_app_gen g on g.AppId=m.AppId
        inner join tbl_app_pci ap on ap.AppId=g.RefId
        inner join tbl_user u on u.UserId=m.OfficerId
        where f.custid='${CustID}'
        and f.Status= '1' and f.FileStatus=4 and w.AppType='NewApplication' 
        and t.Status in (1,3) and t.TaskName <> 'Monitor Payment(temp)'
        and m.Status='1' and p.Status='1'
        union
        select f.FileNo, s.SchemeName as 'Scheme', p.ProdName as 'Product', dbo.fnStandardByProductID(m.ProdId) as 'Standard',
        ap.UndertakeDate as 'Application Date', ap.UndertakeName as 'Applied By', u.FullName as 'Project Officer',
        REPLACE(t.Taskname,'(Amendment)','') as 'Status'
        From tbl_file f
        inner join tbl_task_list t on f.FileId=t.FileId 
        inner join tbl_master_link m on m.RecId=f.AppId 
        inner join tbl_product p on p.ProdId=m.ProdId
        inner join tbl_scheme_type s on s.SchemeId=f.SchemeId
        inner join tbl_app_gen g on g.AppId=m.AppId
        inner join tbl_app_pci ap on ap.AppId=g.RefId
        inner join tbl_user u on u.UserId=m.OfficerId
        where f.custid='${CustID}' 
        and f.Status= '1' and f.FileStatus=4  
        and t.TaskName in ('New Application','New Application(Draft)','Acceptance of File')
        and t.Status in (1,3)
        and m.Status='1' and p.Status='1'
        ) a
        order by a.FileNo`

    console.log("\n" + query + "\n")
    resObj = await mainDb.executeQuery(query);

    return resObj;

}



exports.changeRequestCount = async (sessionObj, req, res) => {

    let resObj = {};
    // let CustID = sessionObj.custId;


    let CustCode = sessionObj.custId;

    console.log("CustCode---->" + CustCode);

    let query = `select CustId from tbl_customer where CustCode='${CustCode}'`

    resObj = await mainDb.executeQuery(query);

    console.log("---->" + JSON.stringify(resObj));

    let CustID = resObj[0].CustId;

    // let CustID = '15976'

    console.log("CustID" + CustID);





    query = `select COUNT(z.WfId) as CRCount from (
select distinct t.WfId
from tbl_chg_req cr, tbl_file f, tbl_task_list t
where cr.FileId=f.FileId and f.FileId=t.FileId and cr.WfId=t.WfId and cr.WfId is not null and cr.WfId > 0 and t.Status in (1,3)
and f.CustId='${CustID}'
union
select distinct t1.WfId
from tbl_task_list t1, tbl_workflow w
where t1.WfId in (
select t.WfId from tbl_task_list t, tbl_workflow w, tbl_chg_address ca, tbl_address a, tbl_chg_req cr
where t.WfId=w.WfId and t.AppId=ca.ReqId and ca.OldAddressId=a.AddrId
and w.AppType='Initial CR Company  Name/Address' and t.TaskName='Change Request Company Details (Review)'
and cr.ReqId=ca.ReqId and cr.WfId is null
and a.CustId='${CustID}'
) and t1.WfId=w.WfId and t1.Status in (1,3)
union
select distinct t1.WfId
from tbl_task_list t1, tbl_workflow w
where t1.WfId in (
select distinct t.WfId from tbl_task_list t, tbl_workflow w, tbl_chg_customer cc, tbl_chg_req cr
where t.WfId=w.WfId and t.AppId=cc.ReqId
and w.AppType='Initial CR Company  Name/Address' and t.TaskName='Change Request Company Details (Review)'
and cr.ReqId=cc.ReqId and cr.WfId is null
and cc.OldCustId='${CustID}'
) and t1.WfId=w.WfId and t1.Status in (1,3)
union
select distinct r.ChildId
From tbl_task_list t, tbl_workflow w, tbl_workflow_rel r, tbl_file f, tbl_chg_req cr
where t.WfId=r.ChildId and r.ChildId=w.WfId and w.AppType='Costing Sheet' and f.FileId=t.FileId and cr.WfId=r.ParentId
and t.Status in (1,3) and f.CustId='${CustID}'
) z`

    resObj = await mainDb.executeQuery(query);

    return resObj;

}




exports.changeRequestDetails = async (sessionObj, req, res) => {

    let resObj = {};

    let CustCode = sessionObj.custId;

    console.log("CustCode---->" + CustCode);

    let query = `select CustId from tbl_customer where CustCode='${CustCode}'`

    resObj = await mainDb.executeQuery(query);

    console.log("---->" + JSON.stringify(resObj));

    let CustID = resObj[0].CustId;

    // let CustID = '15976'
    console.log("CustID" + CustID);


    // let query1 = `select custId from tbl_customer where CustCode = '${CustID}'`;

    // resObj = await mainDb.executeQuery(query1);


    // console.log("1--->" + JSON.stringify(resObj));


    // let tempArry = [];
    // for (let index = 0; index < resObj.length; index++) {
    //     const element = resObj[index];

    //     console.log("Iteration" + element.custId);

    //     tempArry.push(element.custId)

    // }

    // console.log("cc---->" + JSON.stringify(tempArry))



    query = `select  distinct cr.ReqId, f.FileNo, ISNULL(ct.CertNo, '') as 'LicenceNo',
case when cr.ChgType = 'OTHEREXPIRY' then 'Change Request Expiry Date'
when cr.ChgType = 'PROD' then 'Change Request Certificate Details'
when cr.ChgType = 'Standard' then 'Change Of Standard'
when cr.ChgType IN ('ADDRESS','CUSTOMER','CUSTOMERADDRESS') then 'Change Request Company Address'
when cr.ChgType = 'OWNER' then 'Change Request Transfer Ownership'
when cr.ChgType IN ('ChgExtPeriod','GES Extension') then 'Change Request Extension Period'
when cr.ChgType = 'OTHEREXPIRY' then 'Change Expiry Period'
when cr.ChgType = 'OTHERSURVFREQ' then 'Change Request Surveillance Frequency'
else cr.ChgType end as 'CRType',
REPLACE(t.Taskname,'(Amendment)','') as 'Status',
cr.CreatedDate as 'DateRaised'
from tbl_chg_req cr
join tbl_file f on cr.FileId=f.FileId
join tbl_task_list t on f.FileId=t.FileId
left join tbl_cert ct on ct.FileId=f.FileId
where cr.WfId=t.WfId and cr.WfId is not null and cr.WfId > 0 and t.Status in (1,3)
and f.CustId IN ('${CustID}')
union
select case when t1.EventId IS NOT NULL then t1.EventId else t1.AppId end as 'ReqId',
'' As FileNo, '' As 'LicenceNo', 'Initial CR Company Name/Address' as 'CRType',
REPLACE(t1.Taskname,'(Amendment)','') as 'Status', w.CreatedDate as 'DateRaised'
from tbl_task_list t1, tbl_workflow w
where t1.WfId in (
select t.WfId from tbl_task_list t, tbl_workflow w, tbl_chg_address ca, tbl_address a, tbl_chg_req cr
where t.WfId=w.WfId and t.AppId=ca.ReqId and ca.OldAddressId=a.AddrId
and w.AppType='Initial CR Company  Name/Address' and t.TaskName='Change Request Company Details (Review)'
and cr.ReqId=ca.ReqId and cr.WfId is null
and a.CustId IN ('${CustID}')
) and t1.WfId=w.WfId and t1.Status in (1,3)
union
select case when t1.EventId IS NOT NULL then t1.EventId else t1.AppId end as 'ReqId',
'' As FileNo, '' as 'LicenNo', 'Initial CR Company Name/Address' as 'CRType',
REPLACE(t1.Taskname,'(Amendment)','') as 'Status', w.CreatedDate as 'DateRaised'
from tbl_task_list t1, tbl_workflow w
where t1.WfId in (
select distinct t.WfId from tbl_task_list t, tbl_workflow w, tbl_chg_customer cc, tbl_chg_req cr
where t.WfId=w.WfId and t.AppId=cc.ReqId
and w.AppType='Initial CR Company  Name/Address' and t.TaskName='Change Request Company Details (Review)'
and cr.ReqId=cc.ReqId and cr.WfId is null
and cc.OldCustId IN ('${CustID}')
) and t1.WfId=w.WfId and t1.Status in (1,3)
union
select distinct cr.ReqId, FileNo, ISNULL(ct.CertNo, '') as 'LicenceNo',
case when cr.ChgType = 'OTHEREXPIRY' then 'Change Request Expiry Date'
when cr.ChgType = 'PROD' then 'Change Request Certificate Details'
when cr.ChgType = 'Standard' then 'Change Of Standard'
when cr.ChgType IN ('ADDRESS','CUSTOMER','CUSTOMERADDRESS') then 'Change Request Company Address'
when cr.ChgType = 'OWNER' then 'Change Request Transfer Ownership'
when cr.ChgType IN ('ChgExtPeriod','GES Extension') then 'Change Request Extension Period'
when cr.ChgType = 'OTHEREXPIRY' then 'Change Expiry Period'
when cr.ChgType = 'OTHERSURVFREQ' then 'Change Request Surveillance Frequency'
else cr.ChgType end as 'CRType',
REPLACE(t.Taskname,'(Amendment)','') as 'Status',
(select CreatedDate from tbl_workflow where WfId=cr.Wfid) as 'DateRaised'
From tbl_task_list t
join tbl_workflow_rel r on t.WfId=r.ChildId
join tbl_workflow w on r.ChildId=w.WfId
join tbl_file f on f.FileId=t.FileId
join tbl_chg_req cr on cr.WfId=r.ParentId
left join tbl_cert ct on f.FileId=ct.FileId
where w.AppType='Costing Sheet' and t.Status in (1,3) and f.CustId IN ('${CustID}')
order by 'DateRaised', f.FileNo`

    console.log("Q--->\n" + query);

    resObj = await mainDb.executeQuery(query);

    console.log("resultt--->" + resObj);

    return resObj;

}




exports.MaintenanceCount = async (sessionObj, req, res) => {



    let resObj = {};
    // let CustID = sessionObj.custId;


    let CustCode = sessionObj.custId;

    console.log("CustCode---->" + CustCode);

    let query = `select CustId from tbl_customer where CustCode='${CustCode}'`

    resObj = await mainDb.executeQuery(query);

    console.log("---->" + JSON.stringify(resObj));

    let CustID = resObj[0].CustId;

    // let CustID = '15976'

    console.log("CustID" + CustID);


    query = `select COUNT(distinct f.FileId) as 'FileCount' 
    From  tbl_file f
    join tbl_task_list t on t.FileId=f.FileId
    join tbl_master_link m on m.RecId=f.AppId
    join tbl_user u on u.UserId=m.OfficerId
    join tbl_workflow w on w.WfId=t.WfId and f.FileId=w.FileId
    where t.Status in (1,3) and w.AppType in ('Renewal','Renewal-GE') and f.CustId=${CustID}`;


    console.log('query-----' + query);
    resObj = await mainDb.executeQuery(query);

    return resObj;


}


exports.MaintenanceDetails = async (sessionObj, req, res) => {


    let resObj = {};

    let CustCode = sessionObj.custId;

    console.log("CustCode--M ---->" + CustCode);

    let query = `select CustId from tbl_customer where CustCode='${CustCode}'`

    resObj = await mainDb.executeQuery(query);

    console.log("---->" + JSON.stringify(resObj));

    let CustID = resObj[0].CustId;

    // let CustID = '15976'
    console.log("CustID" + CustID);


    query = `select distinct f.FileNo, c.CertNo as 'Licence No', s.SchemeName as 'Scheme', ISNULL(p.ProdName,'') as 'Product',
    CASE WHEN m.ProdId is not null THEN dbo.fnStandardByProductID(m.ProdId) else '' end as 'Standard',
    w.CreatedDate as 'ApplicationDate', (select FullName from tbl_user where UserId=w.CreatedBy) as 'AppliedBy',
    u.FullName as 'ProjectOfficer', 'In Progress' as 'Status'
    From  tbl_file f
    join tbl_scheme_type s on s.SchemeId=f.SchemeId
    join tbl_cert c on c.FileId=f.FileId
    join tbl_task_list t on t.FileId=f.FileId
    join tbl_master_link m on m.RecId=f.AppId
    join tbl_user u on u.UserId=m.OfficerId
    join tbl_workflow w on w.WfId=t.WfId and f.FileId=w.FileId
    join tbl_recomm_cert_renewal r on r.WfId=t.WfId and r.FileId=t.FileId
    left join tbl_product p on p.ProdId=m.ProdId
    where t.Status in (1,3) and w.AppType in ('Renewal','Renewal-GE') and f.CustId='${CustID}'
    union
    select distinct f.FileNo, c.CertNo as 'Licence No', s.SchemeName as 'Scheme', ISNULL(p.ProdName,'') as 'Product',
    CASE WHEN m.ProdId is not null THEN dbo.fnStandardByProductID(m.ProdId) else '' end as 'Standard',
    w.CreatedDate as 'Application Date', (select FullName from tbl_user where UserId=w.CreatedBy) as 'Applied By',
    u.FullName as 'Project Officer', 'In Progress' as 'Status'
    From  tbl_file f
    join tbl_scheme_type s on s.SchemeId=f.SchemeId
    join tbl_cert c on c.FileId=f.FileId
    join tbl_task_list t on t.FileId=f.FileId
    join tbl_master_link m on m.RecId=f.AppId
    join tbl_user u on u.UserId=m.OfficerId
    join tbl_workflow w on w.WfId=t.WfId and f.FileId=w.FileId
    left join tbl_product p on p.ProdId=m.ProdId
    where t.Status in (1,3) and w.AppType in ('Renewal','Renewal-GE') and f.CustId='${CustID}'
    and not exists (select 1 from tbl_recomm_cert_renewal where WfId=t.WfId and FileId=t.FileId)`

    resObj = await mainDb.executeQuery(query);
    console.log('q--M--->' + query);
    return resObj;


}




exports.MasterInvoiceDetailPage = async (req, res) => {


    let resObj = {};
    let InputData = req.body;
    let TempArray = [];
    let QuotationNo = await sirimUtils.convertArrayToQuteString(InputData.QuotationNo);

    let Secid = InputData.SecId;

    // let query = ` Select * from TBL_SIRIM_INVOICE_MASTER Where Quotation_no IN (${QuotationNo}) AND Secid='${Secid}' `

    let query = `Select * from  tbl_sirim_Invoice_Master Master INNER JOIN  tbl_city  city ON city.RecId =Master.City_id
    INNER JOIN  tbl_state  state ON state.StateId =Master.State_id  
    INNER JOIN  tbl_country  country ON country.CountryId =Master.Country_id where Master.Quotation_no IN (${QuotationNo}) AND Master.Secid='${Secid}' `

    console.log("MasterInvoiceDetailPage>" + query)

    resObj = mainDb.executeQuery(query);

    return resObj


}





// mainDb = require('../MainDb');


// exports.getCount = async (sessionObj, req, res) => {

//     let resObj = {};

//     let CustID = sessionObj.custId;

//     let query = `select COUNT(distinct f.FileId) as TotalofFiles
//     from tbl_file f, tbl_task_list t, tbl_workflow w, tbl_master_link m, tbl_product p
//     where f.custid=${CustID} and f.FileId=t.FileId and t.WfId=w.WfId
//     and f.Status= '1' and f.FileStatus=4 and w.AppType='NewApplication'
//     and t.Status in (1,3) and t.TaskName <> 'Monitor Payment(temp)'
//     and m.RecId=f.AppId and p.ProdId=m.ProdId`

//     resObj = await mainDb.executeQuery(query);

//     console.log(resObj);

//     return resObj;

// }



// exports.getCertificationDetails = async (sessionObj, req, res) => {

//     let resObj = {};
//     let CustID = sessionObj.custId;
//     console.log(CustID);


//     let query = `select distinct a.* from (
//     select f.FileId, f.FileNo, s.SchemeName, ap.UndertakeDate as 'AppliedOn', ap.UndertakeName as 'AppliedBy',
//     p.ProdName as 'Product', dbo.fnStandardByProductID(m.ProdId) as 'Standard',
//     REPLACE(t.Taskname,'(Amendment)','') as 'Status', t.TaskId
//     From tbl_file f
//     inner join tbl_task_list t on f.FileId=t.FileId
//     inner join tbl_workflow w on t.WfId=w.WfId
//     inner join tbl_master_link m on m.RecId=f.AppId
//     inner join tbl_product p on p.ProdId=m.ProdId
//     inner join tbl_scheme_type s on s.SchemeId=f.SchemeId
//     inner join tbl_app_gen g on g.AppId=m.AppId
//     inner join tbl_app_pci ap on ap.AppId=g.RefId
//     where f.custid=${CustID}
//     and f.Status= '1' and f.FileStatus=4 and w.AppType='NewApplication'
//     and t.Status in (1,3) and t.TaskName <> 'Monitor Payment(temp)'
//     and m.Status='1' and p.Status='1'
//     union
//     select f.FileId, f.FileNo, s.SchemeName, ap.UndertakeDate as 'AppliedOn', ap.UndertakeName as 'AppliedBy',
//     p.ProdName as 'Product', dbo.fnStandardByProductID(m.ProdId) as 'Standard',
//     REPLACE(t.Taskname,'(Amendment)','') as 'Status', t.TaskId
//     From tbl_file f
//     inner join tbl_task_list t on f.FileId=t.FileId
//     inner join tbl_master_link m on m.RecId=f.AppId
//     inner join tbl_product p on p.ProdId=m.ProdId
//     inner join tbl_scheme_type s on s.SchemeId=f.SchemeId
//     inner join tbl_app_gen g on g.AppId=m.AppId
//     inner join tbl_app_pci ap on ap.AppId=g.RefId
//     where f.custid=${CustID}
//     and f.Status= '1' and f.FileStatus=4
//     and t.TaskName in ('New Application','New Application(Draft)','Acceptance of File')
//     and t.Status in (1,3)
//     and m.Status='1' and p.Status='1'
//     ) a
//     order by a.FileNo`

//     console.log("\n" + query + "\n")
//     resObj = await mainDb.executeQuery(query);

//     return resObj;

// }



// exports.changeRequestCount = async (sessionObj, req, res) => {

//     let resObj = {};
//     let CustID = sessionObj.custId;

//     let query = `select COUNT(z.WfId) as CRCount from (
//     select distinct t.WfId
//     from tbl_chg_req cr, tbl_file f, tbl_task_list t
//     where cr.FileId=f.FileId and f.FileId=t.FileId and cr.WfId=t.WfId and cr.WfId is not null and cr.WfId > 0 and t.Status in (1,3)
//     and f.CustId=${CustID}
//     union
//     select distinct t1.WfId
//     from tbl_task_list t1, tbl_workflow w
//     where t1.WfId in (
//     select t.WfId from tbl_task_list t, tbl_workflow w, tbl_chg_address ca, tbl_address a, tbl_chg_req cr
//     where t.WfId=w.WfId and t.AppId=ca.ReqId and ca.OldAddressId=a.AddrId
//     and w.AppType='Initial CR Company  Name/Address' and t.TaskName='Change Request Company Details (Review)'
//     and cr.ReqId=ca.ReqId and cr.WfId is null
//     and a.CustId=${CustID}
//     ) and t1.WfId=w.WfId and t1.Status in (1,3)
//     union
//     select distinct t1.WfId
//     from tbl_task_list t1, tbl_workflow w
//     where t1.WfId in (
//     select distinct t.WfId from tbl_task_list t, tbl_workflow w, tbl_chg_customer cc, tbl_chg_req cr
//     where t.WfId=w.WfId and t.AppId=cc.ReqId
//     and w.AppType='Initial CR Company  Name/Address' and t.TaskName='Change Request Company Details (Review)'
//     and cr.ReqId=cc.ReqId and cr.WfId is null
//     and cc.OldCustId=${CustID}
//     ) and t1.WfId=w.WfId and t1.Status in (1,3)
//     union
//     select distinct r.ChildId
//     From tbl_task_list t, tbl_workflow w, tbl_workflow_rel r, tbl_file f, tbl_chg_req cr
//     where t.WfId=r.ChildId and r.ChildId=w.WfId and w.AppType='Costing Sheet' and f.FileId=t.FileId and cr.WfId=r.ParentId
//     and t.Status in (1,3) and f.CustId=${CustID}
//     ) z`

//     resObj = await mainDb.executeQuery(query);

//     return resObj;

// }




// exports.changeRequestDetails = async (sessionObj, req, res) => {

//     let resObj = {};

//     let CustID = sessionObj.custId;

//     console.log("" + CustID);

//     let query1 = `select custId from tbl_customer where CustCode = '${CustID}'`;

//     resObj = await mainDb.executeQuery(query1);


//     console.log("1--->" + JSON.stringify(resObj));


//     let tempArry = []
//     for (let index = 0; index < resObj.length; index++) {
//         const element = resObj[index];

//         console.log("Iteration" + element.custId);

//         tempArry.push(element.custId)

//     }

//     console.log("cc---->" + JSON.stringify(tempArry))



//     let query = `select  distinct cr.ReqId, f.FileNo, ISNULL(ct.CertNo, '') as 'LicenceNo',
//     case when cr.ChgType = 'OTHEREXPIRY' then 'Change Request Expiry Date'
//     when cr.ChgType = 'PROD' then 'Change Request Certificate Details'
//     when cr.ChgType = 'Standard' then 'Change Of Standard'
//     when cr.ChgType IN ('ADDRESS','CUSTOMER','CUSTOMERADDRESS') then 'Change Request Company Address'
//     when cr.ChgType = 'OWNER' then 'Change Request Transfer Ownership'
//     when cr.ChgType IN ('ChgExtPeriod','GES Extension') then 'Change Request Extension Period'
//     when cr.ChgType = 'OTHEREXPIRY' then 'Change Expiry Period'
//     when cr.ChgType = 'OTHERSURVFREQ' then 'Change Request Surveillance Frequency'
//     else cr.ChgType end as 'CRType',
//     REPLACE(t.Taskname,'(Amendment)','') as 'Status',
//     cr.CreatedDate as 'DateRaised'
//     from tbl_chg_req cr
//     join tbl_file f on cr.FileId=f.FileId
//     join tbl_task_list t on f.FileId=t.FileId
//     left join tbl_cert ct on ct.FileId=f.FileId
//     where cr.WfId=t.WfId and cr.WfId is not null and cr.WfId > 0 and t.Status in (1,3)
//     and f.CustId IN (${tempArry})
//     union
//     select case when t1.EventId IS NOT NULL then t1.EventId else t1.AppId end as 'ReqId',
//     '' As FileNo, '' As 'LicenceNo', 'Initial CR Company Name/Address' as 'CRType',
//     REPLACE(t1.Taskname,'(Amendment)','') as 'Status', w.CreatedDate as 'DateRaised'
//     from tbl_task_list t1, tbl_workflow w
//     where t1.WfId in (
//     select t.WfId from tbl_task_list t, tbl_workflow w, tbl_chg_address ca, tbl_address a, tbl_chg_req cr
//     where t.WfId=w.WfId and t.AppId=ca.ReqId and ca.OldAddressId=a.AddrId
//     and w.AppType='Initial CR Company  Name/Address' and t.TaskName='Change Request Company Details (Review)'
//     and cr.ReqId=ca.ReqId and cr.WfId is null
//     and a.CustId IN (${tempArry})
//     ) and t1.WfId=w.WfId and t1.Status in (1,3)
//     union
//     select case when t1.EventId IS NOT NULL then t1.EventId else t1.AppId end as 'ReqId',
//     '' As FileNo, '' as 'LicenNo', 'Initial CR Company Name/Address' as 'CRType',
//     REPLACE(t1.Taskname,'(Amendment)','') as 'Status', w.CreatedDate as 'DateRaised'
//     from tbl_task_list t1, tbl_workflow w
//     where t1.WfId in (
//     select distinct t.WfId from tbl_task_list t, tbl_workflow w, tbl_chg_customer cc, tbl_chg_req cr
//     where t.WfId=w.WfId and t.AppId=cc.ReqId
//     and w.AppType='Initial CR Company  Name/Address' and t.TaskName='Change Request Company Details (Review)'
//     and cr.ReqId=cc.ReqId and cr.WfId is null
//     and cc.OldCustId IN (${tempArry})
//     ) and t1.WfId=w.WfId and t1.Status in (1,3)
//     union
//     select distinct cr.ReqId, FileNo, ISNULL(ct.CertNo, '') as 'LicenceNo',
//     case when cr.ChgType = 'OTHEREXPIRY' then 'Change Request Expiry Date'
//     when cr.ChgType = 'PROD' then 'Change Request Certificate Details'
//     when cr.ChgType = 'Standard' then 'Change Of Standard'
//     when cr.ChgType IN ('ADDRESS','CUSTOMER','CUSTOMERADDRESS') then 'Change Request Company Address'
//     when cr.ChgType = 'OWNER' then 'Change Request Transfer Ownership'
//     when cr.ChgType IN ('ChgExtPeriod','GES Extension') then 'Change Request Extension Period'
//     when cr.ChgType = 'OTHEREXPIRY' then 'Change Expiry Period'
//     when cr.ChgType = 'OTHERSURVFREQ' then 'Change Request Surveillance Frequency'
//     else cr.ChgType end as 'CRType',
//     REPLACE(t.Taskname,'(Amendment)','') as 'Status',
//     (select CreatedDate from tbl_workflow where WfId=cr.Wfid) as 'DateRaised'
//     From tbl_task_list t
//     join tbl_workflow_rel r on t.WfId=r.ChildId
//     join tbl_workflow w on r.ChildId=w.WfId
//     join tbl_file f on f.FileId=t.FileId
//     join tbl_chg_req cr on cr.WfId=r.ParentId
//     left join tbl_cert ct on f.FileId=ct.FileId
//     where w.AppType='Costing Sheet' and t.Status in (1,3) and f.CustId IN (${tempArry})
//     order by 'DateRaised', f.FileNo`

//     console.log("Q--->\n" + query);

//     resObj = await mainDb.executeQuery(query);

//     console.log("resultt--->" + resObj);

//     return resObj;

// }