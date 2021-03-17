let enquiryController = require('../../repositories/CustomersRepository/NewEnquiryRaisningRepo');
let responseDto = require('../../config/ResponseDto')
var constants = require('../../config/PaymentConstants');
var multiparty = require('multiparty');
var fs = require('fs');

let saveEnquiryDetails = async (req, res) => {
    let responseObj = {};
    try {

        let enqDetails = req.body;
        let requstObj = {};
        let resultEnqDetails;
        let fileData;
        var form = new multiparty.Form();
        let resultEnqId = await enquiryController.Get_Enquiry_Seq_Value()
        var enquiryId = resultEnqId + 'ENQ'
        console.log("enquiryId\n" + enquiryId)
        form.parse(req, async function async(err, fields, files) {

            if(files.file !== undefined ){

            console.log("File Name : \n" + files.file[0].originalFilename);
            fileData = fs.readFileSync(files.file[0].path).toString('base64');

            console.log("files.file[0].path \n" + files.file[0].path);
            console.log("File Name : \n" + files.file[0].originalFilename);
            }

            //console.log(fields.state);
            // requstObj.file=fields.state;
            requstObj.InformationOther = fields.InformationOther === null || fields.InformationOther === undefined ? '' : fields.InformationOther;
            requstObj.information = fields.information;
            requstObj.userName = fields.userName;
            requstObj.scheme = fields.scheme;
            requstObj.schemeName = fields.schemeName;
            requstObj.sectorName = fields.sectorName;
            requstObj.sector = fields.sector;
            requstObj.informationName = fields.informationName;
            requstObj.comments = fields.comments;
            requstObj.product = fields.product;
            requstObj.enquiry = fields.enquiry;
            requstObj.companyName = fields.companyName;
            requstObj.standard = fields.standard;
            requstObj.sectorOther = fields.sectorOther;
            requstObj.schemeOther = fields.schemeOther;
            requstObj.file = fields.fileData;
            requstObj.fileName = files.file !== undefined ? files.file[0].originalFilename : '';

            // let enqDetailsFile = req.file;;
            // console.log("enqDetailsFile " + enqDetails)
            console.log("requstObj \n test\n" + JSON.stringify(fields.companyName));

            // let resultEnqDetails = await enquiryController.NEW_ENQUIRY_RAISING_SAVE(enqDetails, enquiryId,)
            resultEnqDetails = await enquiryController.NEW_ENQUIRY_RAISING_SAVE(requstObj, enquiryId, fileData, fields.companyName)

        });


        return res.json(new responseDto(constants.STATUS_SUCCESS, '', resultEnqDetails));
    }

    catch (e) {
        // console.log("asjkdk")
        console.log(e);
        return res.json(new responseDto('', constants.STATUS_FAIL, e));
    }

}

let GetMyEnquiryDetails = async (req, res) => {

    try {
        //console.log(req.body)
        let resultEnqDetails = await enquiryController.LOAD_ENQ_DETAILS(req.body.userName, req.body.enquiryType, req.body.limit).catch((e) => {
            console.log(e);
        });
        return res.json(new responseDto(constants.STATUS_SUCCESS, '', resultEnqDetails));
    }
    catch (err) {
        console.log(err);
        return res.json(new responseDto('', constants.STATUS_FAIL, err));
    }
}

module.exports = {
    saveEnquiryDetails, GetMyEnquiryDetails
}