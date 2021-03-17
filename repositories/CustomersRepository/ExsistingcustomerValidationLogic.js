const mainDb = require('../MainDb');

//Load All Cities
exports.Load_Exsisting_Customer_Details = (ExsistingCustomDetails) => {
    var email = ExsistingCustomDetails.email

    var custId = ExsistingCustomDetails.custId;

    // console.log(custId);
    var companyName = ExsistingCustomDetails.companyName;

    let query = `SELECT cust.custcode,companyType.Description,cust.compname,cust.comproc,cust.Type As TYPE,cn.contactname,cust.OrgType,
    cn.MobileNo,cn.FaxNo,cn.EmailAddr,cn.Designation,cn.AddrId,addr.address1,addr.address2,addr.address3,addr.postcode,addr.City,addr.StateCode,addr.CountryCode,addr.Division,
    tbcity.cityname ,state.statename,country.countryname ,orgtype.OrgName
    FROM tbl_customer cust,tbl_org_type orgtype,tbl_comp_type companyType,tbl_contact cn,tbl_Address addr,tbl_city tbcity,tbl_Country country,
    tbl_state state where cust.CompRoc='${custId}' AND cust.compname='${companyName}'AND cn.custid=cust.custid AND cn.AddrId=addr.AddrId 
    AND addr.city=tbcity.recid AND state.stateid=addr.statecode AND addr.countrycode=country.countryid and orgtype.OrgCode=cust.orgType 
    and companyType.CompType=cust.Type and cust.status=1 AND cn.status=1`
    console.log(query)
    return new Promise((resolve, reject) => {
        mainDb.GetQueryData(query, (error, data) => {
            if (error) {
                return reject(`${error}, ${query}`)
            }
            // console.log(data)
            return resolve(data)
        })
    })

}

