const mainDb = require('../../MainDb');
const moment = require('moment');
const MessageFormat = require('messageformat');
const mf = new MessageFormat('en');

var fs = require('fs');
exports.GENERATE_VOUCHER = async (excelDatas) => {

    console.log("excelDatas " + JSON.stringify(excelDatas));
    return new Promise((resolve, reject) => {


        // console.log(moment(excelDatas[2]).format('YYYY-MM-DD'))
        /*    
         let query = `INSERT INTO TBL_SIRIM_Vouchers(voucher_no,voucher_amount,expiry_date)
                   values (${voucherDetails});` */

        // var query = `INSERT INTO TBL_SIRIM_Vouchers (voucher_no, voucher_amount, expiry_date,invoice_no.invoice_id,user_id,status,created_by,
        // created_date,modified_by,modified_date,effective_from_date,effective_to_date,issued_date,issued_to,issued_by) VALUES ('${excelDatas[0]}',
        //     '${excelDatas[1]}','${moment(excelDatas[2]).format('YYYY-MM-DD')}',null,null,'Valid','finance',getdate(),null,null,null,null,'${moment(excelDatas[3]).format('YYYY-MM-DD')}','${excelDatas[5] === undefined ? '' : excelDatas[5]}','${excelDatas[4]}')`;
        var query = `INSERT INTO TBL_SIRIM_Vouchers (voucher_no, voucher_amount, expiry_date,invoice_no.invoice_id,user_id,status,created_by,
            created_date,modified_by,modified_date,effective_from_date,effective_to_date,issued_date,issued_to,issued_by) VALUES ('${excelDatas[0]}',
                '${excelDatas[1]}','${moment(excelDatas[2], ['DD-MM-YYYY']).format('YYYY-MM-DD')}',null,null,'Valid','finance',getdate(),null,null,null,null,'${moment(excelDatas[3], ['DD-MM-YYYY']).format('YYYY-MM-DD')}','${excelDatas[5] === undefined ? '' : excelDatas[5]}','${excelDatas[4]}')`;
        console.log(query)

        mainDb.InsertandReturnID(query, (error, data) => {
            if (error) {
                return reject(`${error}, ${query}`)
            }
            // console.log(query);
            return resolve(data)
        })

    });
}
exports.Save_vouche_Info = (voucherDetails, userName, fileName, rowCount) => {
    // return new Promise((resolve, reject) => {

    var query = `INSERT INTO tbl_sirim_voucher_file_info (File_name, File_Path, No_of_rows,Uploaded_by,Upload_date) VALUES ('${fileName}','${voucherDetails}',${rowCount},'${userName}',getdate())`;
    //var  params= voucherDetails;
    mainDb.executeUpdateQuery(query)
    //     mainDb.InsertandReturnID(query, (error, data) => {
    //         if (error) {
    //             return reject(`${error}, ${query}`)
    //         }
    //         // console.log(query);
    //         return resolve(data)
    //     })

    // });
}


exports.getVoucherDetaisls = () => {

    var query = `select * from tbl_sirim_voucher_file_info `;
    return new Promise((resolve, reject) => {
        mainDb.GetQueryData(query, (error, data) => {
            if (error) {
                return reject(`${error}, ${query}`)
            }
            return resolve(data)
        })
    })


}


// LoadVoucherDetails
// Viewparticularvoucher

exports.LoadVoucherDetails = () => {
    var query = `select * from tbl_sirim_vouchers where status NOT IN ('pending_verification','Deleted') `;
    // console.log(query)
    return new Promise((resolve, reject) => {
        mainDb.GetQueryData(query, (error, data) => {
            if (error) {
                return reject(`${error},${query}`)
            }
            return resolve(data)
        })
    })

}


exports.Viewparticularvoucher = (viewvoucher) => {
    var query = `select * from tbl_sirim_vouchers`
    // console.log(query)
    return new Promise((resolve, reject) => {
        mainDb.GetQueryData(query, (error, data) => {
            if (error) {
                return reject(`${error},${query}`)
            }
            return resolve(data)
        })
    })
}

exports.DeleteParticularVoucher = async (deleteVoucher, userData) => {
    // let query = ` DELETE FROM tbl_sirim_vouchers WHERE  id='${deleteVoucher.id}' `
    console.log(deleteVoucher.id)
    let userdat = userData.username;
    // console.log("userData\n" + JSON.stringify(userData))
    let query = `UPDATE  tbl_sirim_vouchers SET status='Deleted',modified_by='${userdat}',modified_date=GETDATE() WHERE id='${deleteVoucher.id}'`

    return await mainDb.executeQuery(query);


}


exports.UpdateParticularVoucher = async (updateVoucher, userData) => {

    let userdat = userData.username;
    console.log("userdataupdate====>" + JSON.stringify(userdat))
    console.log("updateVoucher====>" + JSON.stringify(updateVoucher))
    let query = `UPDATE  tbl_sirim_vouchers SET  issued_to='${updateVoucher.issuedto}',  status='${updateVoucher.status}',modified_by='${userdat}',modified_date=GETDATE(),
        used_date =getdate() where  id='${updateVoucher.id}' `

    console.log(query)

    return await mainDb.executeQuery(query);
}

exports.getVoucher = async () => {
    var query = `select voucher_no from tbl_sirim_vouchers`
    return await mainDb.executeQuery(query);
}

// exports.insertVoucher = async (excelDatas, userDatas) => {

//     var query = `INSERT INTO TBL_SIRIM_Vouchers (voucher_no, voucher_amount, expiry_date,invoice_no,invoice_id,user_id,status,created_by,
//         created_date,modified_by,modified_date,effective_from_date,effective_to_date,issued_date,issued_to,issued_by,cust_code) VALUES (${excelDatas[0]},
//         ${excelDatas[1]},'${moment(excelDatas[2]).format('YYYY-MM-DD')}',null,null,null,'Valid','${userDatas.username}',getdate(),'${userDatas.username}',null,null,null,'${moment(excelDatas[3]).format('YYYY-MM-DD')}','${excelDatas[5] === undefined ? '' : excelDatas[5]}','${excelDatas[4]}','${excelDatas[6]}')`;

//     console.log(query)

//     return await mainDb.executeQuery(query);
// }

exports.insertVoucher = async (excelDatas, userDatas) => {

    var query = `INSERT INTO TBL_SIRIM_Vouchers (voucher_no, voucher_amount, expiry_date,invoice_no,invoice_id,user_id,status,created_by,
        created_date,modified_by,modified_date,effective_from_date,effective_to_date,issued_date,issued_to,issued_by,cust_code) VALUES ('${excelDatas[0]}',
        ${excelDatas[1]},'${moment(excelDatas[2], ['DD-MM-YYYY']).format('YYYY-MM-DD') === 'Invalid date' ? "" : moment(excelDatas[2], ['DD-MM-YYYY']).format('YYYY-MM-DD')}',null,null,null,'Valid','${userDatas.username}',getdate(),'${userDatas.username}',null,null,null,'${moment(excelDatas[3], ['DD-MM-YYYY']).format('YYYY-MM-DD') === 'Invalid date' ? "" : moment(excelDatas[3], ['DD-MM-YYYY']).format('YYYY-MM-DD')}','${excelDatas[5] === undefined ? '' : excelDatas[5]}','${excelDatas[4]}','${excelDatas[6]}')`;

    console.log("insertVoucher" + query)

    return await mainDb.executeQuery(query);
}

exports.getCustCode = async () => {
    let query = `SELECT Custcode FROM tbl_customer WHERE   Status In ('1','3')  AND Custcode!='' `
    console.log(query)


    return await mainDb.executeQuery(query);
}