let constants = require('../../config/Constants')
let responseDto = require('../../config/ResponseDto')
const BankRepo = require('../Bankcode/BankRepo')


exports.getAllBankCodedetails = async (req, res) => {
    try {
        let userData = req.userData;

        let apiObj = await BankRepo.getAllAllBankCode(userData);
        return new responseDto(constants.STATUS_SUCCESS, '', apiObj);
    }
    catch (err) {
        console.log(err);
        return new responseDto(constants.STATUS_FAIL, 'Try After Some time', '');
    }
}



// exports.BankCodeAPISave = async (req, res) => {
//     try {
//         let inputData = req.body;
//         let userData = req.userData;
//         await BankRepo.BankCodeSave(inputData, userData);

//         return new responseDto(constants.STATUS_SUCCESS, '', 'Credentials Created Successfully');
//     }
//     catch (err) {
//         console.log(err);
//         return new responseDto(constants.STATUS_FAIL, 'Try After Some time', '');
//     }
// }

exports.BankCodeAPISave = async (req, res) => {
    try {
        let inputData = req.body;
        let userData = req.userData;
        let checkpaytype = await BankRepo.checkpaytype(inputData)
        if (checkpaytype && checkpaytype != null && checkpaytype.length <= 0) {
            let insertdata = await BankRepo.BankCodeSave(inputData, userData);
            // if (insertdata.length < 0) {
            //     return new responseDto(constants.STATUS_SUCCESS, '', "Credentials Created Successfully");
            // } else {
            //     return new responseDto(constants.STATUS_FAIL, 'Try After Some time', '');
            // }
            if (insertdata[0] > 0) {
                return new responseDto(constants.STATUS_SUCCESS, "", 'Credentials Created Successfully');
            } else {
                return new responseDto(constants.STATUS_FAIL, '', 'Try After Some time');
            }
        } else {
            return new responseDto(constants.STATUS_FAIL, '', "Pay Type ALready Exisit");
        }
    } catch (err) {
        console.log(err);
        return new responseDto(constants.STATUS_FAIL, 'Try After Some time', '');
    }
}


exports.updateBankCodeDetails = async (req, res) => {
    try {
        let userData = req.userData;
        let Id = req.body.id;
        let status = req.body.status;
        let apiObj = await BankRepo.updateBankCodeDetails(Id, status, userData);
        return new responseDto(constants.STATUS_SUCCESS, '', 'Successfully Updated');
    }
    catch (err) {
        console.log(err);
        return new responseDto(constants.STATUS_FAIL, 'Try After Some time', '');
    }
}