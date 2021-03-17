let constants = require('./../../config/Constants')
let SysInterationRepo = require('./../../repositories/CommonRepository/SysInterationRepo')
let responseDto = require('../../config/ResponseDto')
let logger = require('../../logger')


exports.SystemIntegrationSearchCriteria = async (req, res) => {

    try {

        let sessionObj = req.userData;
        let inputData = req.body;
        let resObj = await SysInterationRepo.SearchCriteria2(inputData);
        return res.json(new responseDto(constants.STATUS_SUCCESS, '', resObj));
    } catch (err) {
        console.log('Error ', err);
        return res.json(new responseDto(constants.STATUS_FAIL, err, ''));
    }

}