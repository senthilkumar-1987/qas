const mainDb = require('../MainDb');
const logger = require('../../logger');

//Load all files

// exports.Load_all_files = async (custCode) => {


//     let query = `select  * from tbl_file where status=1 `
//     let custId = await this.getCustId(custCode);
//     if (custId != null && custId.length > 0) {
//         console.log(JSON.stringify(custId))

//         let arr = []

//         for (let index = 0; index < custId.length; index++) {
//             var element = custId[index].CustId;
//             arr.push(element)


//         }
//         console.log(JSON.stringify(arr))

//         query += ` and CustId IN (${arr})`;

//     } else if (custCode != null) {

//         query += ` and CustId =(${custCode})`;

//     }
//     console.log("Query" + query)
//     let data = await mainDb.executeQuery(query);

//     return data;

// }

exports.Load_all_files = async (custCode) => {


    let data = {}

if(custCode!==''&&custCode!==null){
    let custId = await this.getCustId(custCode).catch((err) => {
      console.log(err)
    })


    if (custId!==''&&custId !== null && custId.length > 0) {
        console.log('if')
        console.log(JSON.stringify(custId))

        let query = `select  * from tbl_file where status=1` 

        let arr = []

        for (let index = 0; index < custId.length; index++) {
            var element = custId[index].CustId;
            arr.push(element)

        }
        console.log(JSON.stringify(arr))

        query += ` and CustId IN (${arr})`;


        console.log("Query>>>" + query)
        data = await mainDb.executeQuery(query);

    }
}
    return data;

}

exports.Load_License_No_By_FileNo = (fileId) => {
    console.log(fileId);
    return new Promise((resolve, reject) => {
        let query = `select * from tbl_cert where FileId='${fileId}' AND Status=1`
        console.log(query)
        mainDb.GetQueryData(query, (error, data) => {
            if (error) {
                return reject(`${error}, ${query}`)
            }
            // console.log(data);
            return resolve(data)
        })
    })
}
exports.getCustId = async (custCode) => {

    let query = `select CustId from tbl_customer where CustCode='${custCode}'`;
    console.log(query)
    let data = await mainDb.executeQuery(query);
    return data;
}

exports.PoFileId = async (UserId) => {

    let query = `select distinct f.FileNo, f.FileId, c.CertNo as LicenceNo, f.CertifiedDate, c.ExpiryDate, fs.Description as FileStatus,
    sc.SchemeName,
    st.SectorName,
    cu.CompName,
    '' as Product,
    '' as Standard,
    gl.FullName as GroupLeader
    From
    tbl_iss_inspector_review i
    join tbl_user u on
    i.ModifiedBy = u.UserId
    join tbl_file f on
    i.FileId = f.FileId
    join tbl_file_status fs on
    f.FileStatus = fs.RecId
    join tbl_scheme_type sc on
    f.SchemeId = sc.SchemeId
    join tbl_customer cu on
    cu.CustId = f.CustId
    join tbl_sector_type st on
    st.SecId = f.SecId
    join tbl_user gl on
    gl.UserId = f.GrpLeaderId
    left join tbl_cert c on
    c.FileId = f.FileId
    where
    i.ModifiedBy = ${UserId}
    UNION
    select
    f.FileNo,m.FileId as FileId,
    c.CertNo as LicenceNo,
    case
    when f.SchemeId = 12 then c.StartDate
    else f.CertifiedDate end as CertifiedDate,
    c.ExpiryDate,
    fs.Description as FileStatus,
    sc.SchemeName,
    st.SectorName,
    cu.CompName,
    ISNULL(p.ProdName,
    '') as Product,
    CASE WHEN p.ProdId is not null then dbo.fnStandardByProductID(p.ProdId)
    else '' end as Standard,
    ISNULL(gl.FullName,
    '') as GroupLeader
    From
    tbl_file f
    join tbl_master_link m on
    m.RecId = f.AppId
    join tbl_user u on
    m.OfficerId = u.UserId
    join tbl_file_status fs on
    f.FileStatus = fs.RecId
    join tbl_scheme_type sc on
    f.SchemeId = sc.SchemeId
    join tbl_sector_type st on
    st.SecId = f.SecId
    join tbl_customer cu on
    cu.CustId = f.CustId
    left join tbl_product p on
    p.ProdId = m.ProdId
    left join tbl_cert c on
    c.FileId = f.FileId
    left join tbl_user gl on
    gl.UserId = f.GrpLeaderId
    where
    m.OfficerId =${UserId}`;
    console.log(query)
    let data = await mainDb.executeQuery(query);
    return data;
}


// const mainDb = require('../MainDb');
// const logger = require('../../logger');

// //Load all files
// exports.Load_all_files = (custId) => { //custCode
//     // logger.info(custId)
//     return new Promise((resolve, reject) => {
//         let query = `select  * from tbl_file where status=1 `
//         if (custId && custId != null && custId != '') {
//             query += ` and CustId='${custId}'`;
//         } else {
//             // query += " and CustId=''";
//         }
//         // query += `  ORDER BY FileId DESC offset 0 rows fetch next 5 rows only;`;
//         logger.info("Load_all_files query " + query)
//         mainDb.GetQueryData(query, (error, data) => {
//             if (error) {
//                 return reject(`${error}, ${query}`)
//             }
//             // logger.info(data.length);
//             return resolve(data)
//         })
//     })
// }

// exports.Load_License_No_By_FileNo = (fileId) => {
//     console.log(fileId);
//     return new Promise((resolve, reject) => {
//         let query = `select * from tbl_cert where FileId='${fileId}' AND Status=1`
//         mainDb.GetQueryData(query, (error, data) => {
//             if (error) {
//                 return reject(`${error}, ${query}`)
//             }
//             // console.log(data);
//             return resolve(data)
//         })
//     })
// }