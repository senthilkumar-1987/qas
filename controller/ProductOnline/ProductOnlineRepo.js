const mainDb = require('../../repositories/MainDb');




exports.Scheme = async () => {


    let resObj = {};

    let query = `select SchemeId, SchemeName from tbl_scheme_type
    where SchemeName in ('Product Certification','Product Listing','Eco Labelling',
    'Modular Co-ordination Verification','Fire Listing')`

    resObj = await mainDb.executeQuery(query);

    return resObj;


}



exports.Standard = async () => {


    let resObj = {};

    let query = `SELECT StandardId, StandardCode
        FROM tbl_lib_standard
        WHERE StandardCode NOT IN ('40 ISO','bs4449','60335-2-9','&nbsp;','astm a 500','ms')
        ORDER BY StandardCode`

    resObj = await mainDb.executeQuery(query);

    return resObj;


}





exports.Country = async () => {


    let resObj = {};

    let query = `SELECT CountryId, CountryName
        FROM tbl_country
        WHERE Status='1' AND CountryName NOT IN ('-', 'N/A')
        ORDER BY CountryName`

    resObj = await mainDb.executeQuery(query);

    return resObj;


}




exports.State = async (CountryId) => {


    let resObj = {};

    let query = `SELECT StateId, StateName
        FROM tbl_state st
        inner join tbl_country ct on st.CountryId=ct.CountryId
        WHERE st.Status='1' and ct.CountryId = ${CountryId}
        ORDER BY StateName`

    resObj = await mainDb.executeQuery(query);

    return resObj;


}


exports.Status = async () => {


    let resObj = {};

    let query = `SELECT RecId, [Description] as Status
        from tbl_file_status
        where [Description] in ('Certified','Suspended')`

    resObj = await mainDb.executeQuery(query);

    return resObj;


}



exports.SearchCriteria = async (req, res) => {

    let resObj = {};

    let SchemeId = req.body.SchemeId
    let CompName = req.body.CompName
    let StandardId = req.body.StandardId
    let Year = req.body.Year
    let FileStatus = req.body.FileStatus
    let CountryId = req.body.CountryId
    let StateId = req.body.StateId
    let ProdName = req.body.Product



    let query = `SELECT cust.CompName,cr.CountryName,cert.CertNo,prod.ProdName,dbo.fnStANDardByProductID(prod.ProdId) as 'Standard'
    FROM SCIS_LIVE.dbo.tbl_file f
    Inner Join SCIS_LIVE.dbo.tbl_master_link ml on f.appid=ml.recid
    Inner Join SCIS_LIVE.dbo.tbl_master_addr ma on ma.MasRecId=ml.RecId
    inner Join SCIS_LIVE.dbo.tbl_address addr on addr.AddrId=ma.AddrId
    inner join SCIS_LIVE.dbo.tbl_customer cust on cust.CustId=ml.CustId
    inner join SCIS_LIVE.dbo.tbl_cert cert on cert.CertId=ml.certid
    inner join SCIS_LIVE.dbo.tbl_scheme_type sch on sch.SchemeId=f.SchemeId
    inner join SCIS_LIVE.dbo.tbl_product prod on prod.prodid=ml.prodid
    inner join SCIS_LIVE.dbo.tbl_file_status fs on fs.RecId=f.FileStatus
    inner join SCIS_LIVE.dbo.tbl_state st on st.StateId=addr.StateCode
    inner join SCIS_LIVE.dbo.tbl_country cr on cr.CountryId=addr.CountryCode
    inner Join SCIS_LIVE.dbo.tbl_licensee_type lt on lt.RecId=f.LicenseeType
    WHERE ma.CompType='L'
    AND ml.Status='1'
    AND ma.Status='1'
    AND f.Status='1'
    AND prod.status='1'
    AND cust.status='1'
    AND cert.status='1'
    AND (f.FileStatus='1' or f.FileStatus='2')
    And F.FileId NOT IN (Select f.fileid From tbl_file f, tbl_recomm_certification rc, tbl_workflow wf
    Where f.fileid = rc.fileid
    and f.filestatus = '1'
    and rc.Status = 'R'
    and rc.PendingCP = 'C'
    and rc.WfId = wf.WfId
    and wf.AppType = 'NewApplication')
    And DATEDIFF(Day,Cert.ExpiryDate,GETDATE()) <= 180
    `


    if (SchemeId !== null && SchemeId !== "") {

        query += ` and sch.SchemeId = ${SchemeId}`

    }
    if (CompName != null && CompName !== "") {
        query += ` cust.CompName LIKE '%@${CompName}%'`
    }


    if (StandardId != null && StandardId !== "") {

        query += ` and prod.ProdId in (
    SELECT  a.ProdId
    from tbl_standard a, tbl_lib_standard b
    where a.StandardId=b.StandardId and b.StandardId=${StandardId} and a.Status='1'
    )`


    }

    if (Year != null && Year !== "") {

        query += ` and YEAR(f.CertifiedDate) = ${Year}`
    }


    if (FileStatus != null && FileStatus !== "") {

        query += ` and f.FileStatus = ${FileStatus} `

    }


    if (CountryId != null && CountryId !== "") {

        query += ` and cr.CountryId = ${CountryId} `

    }

    if (StateId != null && StateId !== "") {

        query += ` and st.StateId = ${StateId}`
    }

    if (ProdName != null && ProdName !== "") {

        query += ` and prod.ProdName LIKE '%@${ProdName}%'`

    }

    query += `order by f.FileNo`

    console.log("Product online >>>>" + query)
    resObj = await mainDb.executeQuery(query);

    return resObj;


}