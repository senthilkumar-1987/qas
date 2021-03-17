let loginhistoryLogic = require('../../repositories/CustomersRepository/LoginHistoryLogic')
let constants = require('../../config/Constants')
let logger = require('../../logger')
const responseDto = require('../../config/ResponseDto')

let saveloginhistory = async (req, res) => {
    let responseObj = {};
    try {

        let historyData = req.body;
        let userDates = req.userData;
        logger.info("logger UserData \n" + JSON.stringify(userDates))

        let resultRegseq = await loginhistoryLogic.INSERT_LOGIN_HISTORY(historyData).catch((e) => {
            responseObj.message = e
            // return res.json(responseObj);
            return res.json(new responseDto(constants.STATUS_FAIL, e, ''))
        });


        return res.json(new responseDto(constants.STATUS_SUCCESS, '', resultRegseq))
        // res.json(resultRegseq);
    }

    catch (e) {
        console.log(e);
        // res.json({ e });
        return res.json(new responseDto(constants.STATUS_FAIL, e, ''))

    }

}


let getLastLoginHistory = async (req, res) => {
    let responseObj = {};
    try {

        let historyData = req.body;

        let resultRegseq = await loginhistoryLogic.GET_LAST_LOGIN_HISTORY(historyData).catch((e) => {
            responseObj.message = e
            // return res.json(responseObj);
            return res.json(new responseDto(constants.STATUS_FAIL, e, ''))

        });

        return res.json(new responseDto(constants.STATUS_SUCCESS, '', resultRegseq))
        // res.json(resultRegseq);
    }

    catch (e) {
        console.log(e);
        return res.json(new responseDto(constants.STATUS_FAIL, e, ''))
    }

}

module.exports = {
    saveloginhistory, getLastLoginHistory
}