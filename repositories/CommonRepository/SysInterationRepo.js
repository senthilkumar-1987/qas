const mainDb = require('../MainDb');


exports.SearchCriteria2 = async (inputData) => {

    let resObj = {};

    let userName = inputData.userName;
    let password = inputData.password;
    let SchemeName = inputData.Scheme;
    let CompName = inputData.companyName;
    let ProdName = inputData.Product;
    let StandardName = inputData.standard;
    let Year = inputData.Year;
    let FileStatus = inputData.Status;
    let CountryName = inputData.Country;
    let StateName = inputData.State;
    // let scheme  = inputData.LicenceNo;
    let Brand = inputData.Brand;

    // console.log("INputData-->" + JSON.stringify(inputData));




    if (userName != null && password != null) {
        // status = 1

        let query = `Select * from tbl_sirim_api_credentials where username = '${userName}' AND password='${password}' AND status='1' `
        console.log("q--->" + query);

        resObj = await mainDb.executeQuery(query);




        query = `select SchemeId from tbl_scheme_type
where SchemeName='${SchemeName}'`;

        resObj = await mainDb.executeQuery(query);
        let SchemeId = resObj[0].SchemeId;

        query = `SELECT StandardId
FROM tbl_lib_standard
WHERE StandardCode='${StandardName}'`;

        resObj = await mainDb.executeQuery(query);
        let StandardId = resObj[0].StandardId;

        query = `SELECT CountryId
FROM tbl_country
WHERE Status='1' AND CountryName='${CountryName}'`

        resObj = await mainDb.executeQuery(query);

        let CountryId = resObj[0].CountryId;


        query = `select StateId from tbl_state where StateName='${StateName}' and CountryId='${CountryId}'`

        resObj = await mainDb.executeQuery(query);

        let StateId = resObj[0].StateId;


        if (resObj.length > 0) {


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
And DATEDIFF(Day,Cert.ExpiryDate, GETDATE()) <= 180`




            if (SchemeId != null) {
                query += `and sch.SchemeId = '${SchemeId}'`

            }


            if (CompName != null) {
                query += `and  cust.CompName LIKE '%${CompName}%'`
            }





            if (StandardId != null) {

                query += `and prod.ProdId in (
SELECT  a.ProdId
from tbl_standard a, tbl_lib_standard b
where a.StandardId=b.StandardId and b.StandardId='${StandardId}' and a.Status='1'
)`


            }


            if (Brand != null) {

                query += `and prod.ProdId in (

SELECT  pd.ProdId

from tbl_product_detail pd where pd.Status='1' and pd.Brand='${Brand}')`


            }


            if (Year != null) {

                query += `and YEAR(f.CertifiedDate) = '${Year}'`
            }


            if (FileStatus != null) {

                query += `and f.FileStatus = '${FileStatus}' `

            }




            if (CountryId != null) {

                query += `and cr.CountryId = '${CountryId}' `

            }




            if (StateId != null) {

                query += `and st.StateId = '${StateId}'`
            }

            if (ProdName != null) {

                query += `and prod.ProdName LIKE '%${ProdName}%'`

            }

            query += ` order by f.FileNo`


            resObj = await mainDb.executeQuery(query);

            console.log("Final------>>>>" + query);

            return resObj;


        }


        // Execute query
    } else {

        resObj.Message = "Invalid Credentials"

    }

    return resObj;

}