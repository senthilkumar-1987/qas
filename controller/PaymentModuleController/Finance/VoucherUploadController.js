let voucherLogic = require('../../../repositories/PaymentRepository/Finance/VoucherUploadLogic');
var multiparty = require('multiparty');
let responseDto = require('../../../config/ResponseDto')
var constants = require('../../../config/PaymentConstants');
var inputPattern = require('../../../inputPattern');
var xlstojson = require("xls-to-json-lc");
var xlsxtojson = require("xlsx-to-json-lc");
var Excel = require('exceljs');
var multer = require('multer');

let Voucher_File_info = async (req, res) => {
    try {
        // console.log('kkk');
        //  console.log("seess" +voucherNo);
        let resultVoucherDetails = await voucherLogic.getVoucherDetaisls();
        return res.json(new responseDto(constants.STATUS_SUCCESS, '', resultVoucherDetails));

    }
    catch (err) {
        console.log(err);
        return res.json(new responseDto(constants.STATUS_FAIL, err, ''))
    }
}


exports.readExcel = async (req) => {

    let res = {};

    var form = new multiparty.Form();

    form.parse(req, function (err, fields, files) {
        console.log(files.file[0].path);
        var file = files.file[0].path

        return file;
    })


}


const promisifyUpload = (req, res) => new Promise((resolve, reject) => {


    var rows = [];
    var rowdataVoucher = [];
    let responseObj = {};
    var totalRow = [];
    var form = new multiparty.Form();
    let manBval = false;
    var rowdataCustCode = [];
    form.parse(req, function async(err, fields, files) {
        console.log(files.file[0].path);
        var file = files.file[0].path
        //console.log(files.originalFilename);
        var workbook = new Excel.Workbook();

        try {


            workbook.xlsx.readFile(file)
                .then(function async() {
                    var worksheet = workbook.getWorksheet(1);
                    console.log('------------- actualRowCount: ' + worksheet.actualRowCount);
                    console.log('------------ rowCount: ' + worksheet.rowCount);
                    console.log('------------ columnCount: ' + worksheet.columnCount);
                    let rowCount = worksheet.actualRowCount - 1;
                    console.log(rowCount)
                    responseObj.rowCount = rowCount
                    let voucherInfoId = voucherLogic.Save_vouche_Info(file, "Finance", files.file[0].originalFilename, rowCount)

                    worksheet.eachRow({ includeEmpty: false }, async function async(row, rowNumber) {
                        var rowdata = [];


                        if (rowNumber !== 1) {
                            rows.push(row.values);
                            // console.log("row values" + JSON.stringify(row.values) + " rowNumber " + rowNumber)


                            row.eachCell({ includeEmpty: false }, function async(cell, colNumber) {
                                //console.log("cell value"+cell.value);
                                //   if(cu)
                                if (cell.value == null || cell.value == '') {

                                    return res.json(new responseDto(constants.STATUS_FAIL, 'All Fields are Mandatory', ''));

                                }
                                rowdata.push(cell.value);
                            });
                            rowdataVoucher.push(rowdata[0]);
                            //console.log("rowdata  ====>" + JSON.stringify(rowdata))
                            // console.log("rowdata[0]  ====>" + JSON.stringify(rowdata[0]))
                            rowdataCustCode.push(rowdata[6]);

                        }
                        totalRow.push(rowdata);
                    })


                    return resolve([totalRow, rowdataVoucher, rowdataCustCode]);

                    // .catch((e) => {
                    //     console.log(e)
                    //     return res.json(new responseDto(" one", e, '')); //Error
                    // });

                })

            // .catch((e) => {
            //     console.log(e)

            //     return res.json(new responseDto(" one", e, ''));
            // });


        } catch (error) {
            console.log(error);
            return res.json(new responseDto(constants.STATUS_FAIL, error, ''));
        }
        finally {

        }
    });


});


let uploadVoucher = async (req, res) => {

    let ErrorObj = {};
    let userDatas = req.userData;


    const [totalRow, rowdataVoucher, rowdataCustCode] = await promisifyUpload(req, res)


    console.log("dd" + totalRow.length);

    var workbook = new Excel.Workbook();

    // await workbook.xlsx.readFile(files.file[0].path);


    // var worksheet = workbook.getWorksheet(1);
    // console.log('------------- actualRowCount: ' + worksheet.actualRowCount);


    // worksheet.eac


    let dbVoucherArray = await this.getDbdata();
    let bVal = rowdataVoucher.filter(e => dbVoucherArray.includes(e))
    // let bVal = await voucherLogic.checkVoucherExists(rowdataVoucher);

    console.log("dbVoucherArray>>>>" + JSON.stringify(dbVoucherArray))
    console.log("rowdataVoucher>>>>" + JSON.stringify(rowdataVoucher))


    console.log("bVal>>>>" + JSON.stringify(bVal))

    let bValArrayDup = await this.checkArrayDuplicate(rowdataVoucher);
    if (bValArrayDup) {
        return res.json(new responseDto(constants.STATUS_FAIL, 'File have Duplicate Voucher No', ''));
    }
    if (bVal.length != 0) {
        return res.json(new responseDto(constants.STATUS_FAIL, 'The following Voucher No already availabe in Database:' + bVal, ''));
    }

    console.log("totalRow>>>>" + JSON.stringify(totalRow))

    let custcodeCheck = await this.checkCustCode(rowdataCustCode);
    console.log("custcodeCheck \n" + JSON.stringify(custcodeCheck))
    if (custcodeCheck.length != 0) {
        return res.json(new responseDto(constants.STATUS_FAIL, 'The following Customers are Invalid Customer or deactivated:' + custcodeCheck, ''));
    }

    // let resObj = await this.insertData(req, res, totalRow);
    let resObj;
    let checkcodition;
    for (let index = 1; index < totalRow.length; index++) {
        const element = totalRow[index];
        console.log("element>>" + JSON.stringify(element))
        console.log("element[2]" + element[1])
        var amount = parseFloat(element[1])
        console.log(amount)

        if (element.length === 7 && amount > 0.00) {

            console.log("element inside if >>" + JSON.stringify(element))
            checkcodition = true

        } else {
            checkcodition = false
            return res.json(new responseDto(constants.STATUS_FAIL, 'Please Enter Valid Data', ''));
        }

    }
    if (checkcodition === true) {
        resObj = await this.insertData(req, res, totalRow);

    }

    if (resObj != null) {
        let respString = "Total Row: " + rowdataVoucher.length + "  Success Count: " + resObj.successCount + " Failure Count: " + resObj.failureCount;
        return res.json(new responseDto(constants.STATUS_SUCCESS, respString, ''));
    }
    // if(resObj == ''){

    // }


}



let Load_Voucher_Uploaded = async (req, res) => {
    let responseObj = {};

    let loadvoucher = req.body

    try {


        let resultvoucheruploaded = await voucherLogic.LoadVoucherDetails();
        return res.json(new responseDto(constants.STATUS_SUCCESS, '', resultvoucheruploaded))

    } catch (error) {
        return res.json(new responseDto(constants.STATUS_FAIL, error, ''))
    }
}


let View_Uploaded_Voucher_Details = async (req, res) => {
    let responseObj = {};

    try {
        let viewvoucher = req.body
        console.log("viewvoucher ====>" + JSON.stringify(viewvoucher))
        let viewuploadedvoucherdetails = await voucherLogic.Viewparticularvoucher(viewvoucher);

        console.log("viewuploadedvoucherdetails ===>" + JSON.stringify(viewuploadedvoucherdetails))
        return res.json(new responseDto(constants.STATUS_SUCCESS, '', viewuploadedvoucherdetails))

    } catch (error) {
        return res.json(new responseDto(constants.STATUS_FAIL, error, ''))
    }

}

let Delete_Uploaded_Vouchers = async (req, res) => {
    let responseObj = {}

    try {
        let deleteVoucher = req.body;
        let userDatas = req.userData;
        console.log("deleteVoucher ===>" + JSON.stringify(userDatas))
        let DeleteUploadedVouchers = await voucherLogic.DeleteParticularVoucher(deleteVoucher, userDatas);

        return res.json(new responseDto(constants.STATUS_SUCCESS, '', DeleteUploadedVouchers))


    } catch (error) {
        console.log(error)
        return res.json(new responseDto(constants.STATUS_FAIL, error, ''))

    }
}


let Update_Uploaded_Vouchers = async (req, res) => {
    let responseObj = {}

    try {
        let updateVoucher = req.body;
        let userDatas = req.userData;
        console.log("updateVoucher ===>" + JSON.stringify(updateVoucher))
        let UpdateUploadedVouchers = await voucherLogic.UpdateParticularVoucher(updateVoucher, userDatas);

        return res.json(new responseDto(constants.STATUS_SUCCESS, '', UpdateUploadedVouchers))


    } catch (error) {
        return res.json(new responseDto(constants.STATUS_FAIL, error, ''))

    }
}



// Update_Uploaded_Vouchers
// Delete_Uploaded_Vouchers
// View_Uploaded_Voucher_Details
module.exports = {
    uploadVoucher, Voucher_File_info, Load_Voucher_Uploaded, View_Uploaded_Voucher_Details, Delete_Uploaded_Vouchers,
    Update_Uploaded_Vouchers
}

exports.insertData = async (req, res, rowdata) => {
    let successCount = 0;
    let failureCount = 0;
    let resObj = {};
    // console.log('rowdatalength=====>' + JSON.stringify(rowdata.length))
    try {
        console.log("rowdata.length" + JSON.stringify(rowdata));
        // console.log("rowdata.length" + rowdata.length);
        for (let i = 0; i < rowdata.length; i++) {
            let actualValue = rowdata[i];
            if (actualValue.length > 0) {
                if (actualValue[0] !== "" && actualValue[0] != null) {
                    try {
                        let userDatas = req.userData;
                        console.log("parameters=====>" + JSON.stringify(userDatas));
                        //let voucherResponse = await voucherLogic.GENERATE_VOUCHER(actualValue);
                        await voucherLogic.insertVoucher(actualValue, userDatas);
                        successCount++;
                    } catch (error) {
                        console.log(error)
                        failureCount++;
                        //return res.json(new responseDto(constants.STATUS_FAIL, error, ''));
                    }
                }
            }

        }

    } catch (error) {
        console.log(error)
        failureCount++;
        //return res.json(new responseDto(constants.STATUS_FAIL, error, ''));
    }
    resObj.successCount = successCount;
    resObj.failureCount = failureCount;
    return resObj;
}
exports.getDbdata = async () => {
    let dbVoucher = await voucherLogic.getVoucher();
    let dbVoucherArray = [];
    dbVoucher.forEach(element => {
        // dbVoucherArray.push(element.voucher_no);
        dbVoucherArray.push(parseInt(element.voucher_no));
    });

    var strArr = dbVoucherArray.map(function (e) { return e.toString() });
    return dbVoucherArray;
}

exports.checkArrayDuplicate = async (rowdataVoucher) => {
    let result = false;
    for (let i = 0; i < rowdataVoucher.length; i++) {
        console.log(rowdataVoucher[i]);
    }
    const s = new Set(rowdataVoucher);
    for (let j = 0; j < s.zize; j++) {
        console.log(s.get(i));
    }

    console.log("Array Size" + rowdataVoucher.length);
    console.log("Set Size" + s.size);
    if (rowdataVoucher.length != s.size) {
        result = true;
    }
    return result;
}

exports.checkCustCode = async (rowdataCustCode) => {

    // let dbCustCode = await voucherLogic.getCustCode(rowdataCustCode);
    let dbCustCode = await voucherLogic.getCustCode();
    let result = [];
    console.log("Cust Code length:" + dbCustCode.length);
    // let a = [];
    var a = new Set();

    // await dbCustCode.forEach(async (element) => {
    //     // a.push(element.Custcode);
    //     console.log("element\n" + JSON.stringify(element.Custcode))
    //     a.add(element.Custcode);
    // });
    for (let i = 0; i < dbCustCode.length; i++) {
        a.add(dbCustCode[i].Custcode);
    }

    console.log("Values In custcode\n")
    console.log("" + JSON.stringify(rowdataCustCode))
    console.log("" + JSON.stringify(a))
    console.log("rowdataCustCode\n" + JSON.stringify(rowdataCustCode[0]))
    for (let i = 0; i < rowdataCustCode.length; i++) {
        console.log("a.has(rowdataCustCode[i])\n" + a.has(rowdataCustCode[i]))

        if (a.has(rowdataCustCode[i]) == false) {
            if (rowdataCustCode[i] !== null && rowdataCustCode[i] !== undefined) {
                result.push(rowdataCustCode[i]);
                // console.log("rowdataCustCode[i]>>>" + rowdataCustCode[i])
                return result;
            } else {
                console.log(" Invalids : " + rowdataCustCode[i]);
            }
        } else {
            console.log(" Invalid : " + rowdataCustCode[i]);
        }
    }
    return result;
}