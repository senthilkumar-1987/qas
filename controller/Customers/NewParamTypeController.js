let ParamTypesLogic = require('../../repositories/CustomersRepository/NewParamTypeFormLogic')
let responseDto = require('../../config/ResponseDto')
let BadDebitRepo = require('../../CronScheduler/BadDebtRepository')
var constants = require('../../config/PaymentConstants');

let SaveparamType = async (req, res) => {
    let responseObj = {};

    // try {
    let paramTypeData = req.body;
    console.log("paramTypeData ==>" + JSON.stringify(paramTypeData))
    let paramType = paramTypeData.paramtype;
    let resultRegseq = null;

    try {
        let latestRecord = await ParamTypesLogic.FindExistingRecord(paramType);
        console.log("latestRecord ==> " + JSON.stringify(latestRecord))

        if (latestRecord && latestRecord != null && latestRecord.length > 0) {
            let paramType = await ParamTypesLogic.updateMaintanceRecords(paramTypeData)
            resultRegseq = await ParamTypesLogic.Insert_New_ParamType(paramTypeData)
        } else {
            resultRegseq = await ParamTypesLogic.Insert_New_ParamType(paramTypeData)
        }

        console.log("resultRegseq==> " + resultRegseq)

        if (resultRegseq != null && resultRegseq > 0) {
            return res.json(new responseDto(constants.STATUS_SUCCESS, '', "SUCCESS"));
        } else {
            return res.json(new responseDto(constants.STATUS_FAIL, '', "FAILED"));
        }

    } catch (e) {
        return res.json(new responseDto(constants.STATUS_FAIL, '', e));
    }

}

let LoadParamDetails = async (req, res) => {
    try {
        let resultParamdetails = await ParamTypesLogic.LoadParamType();
        //console.log(resultParamdetails)
        return res.json(new responseDto(constants.STATUS_SUCCESS, '', resultParamdetails));

    } catch (error) {
        return res.json(new responseDto('', constants.STATUS_FAIL, error));
    }
}





let SaveRemainder = async (req, res) => {
    console.log("SaveRemainder" + JSON.stringify(req.body))

    var data = req.body
    try {
        let SaveRemainderobj = await ParamTypesLogic.SaveRemainder(data);

        return res.json(new responseDto(constants.STATUS_SUCCESS, '', SaveRemainderobj));

    } catch (error) {
        return res.json(new responseDto('', constants.STATUS_FAIL, error));
    }


}


let getDebtReminderList = async (req, res) => {


    try {
        let getDebtReminderList = await BadDebitRepo.remaindersList();

        return res.json(new responseDto(constants.STATUS_SUCCESS, '', getDebtReminderList));

    } catch (error) {
        return res.json(new responseDto('', constants.STATUS_FAIL, error));
    }


}






module.exports = {
    SaveparamType, LoadParamDetails, SaveRemainder, getDebtReminderList,
}
