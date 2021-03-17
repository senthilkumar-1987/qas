let viewMyProfile = require('../../repositories/CustomersRepository/GetMyprofileLogic');
const Cryptr = require('../../config/encrypt.decrypt.service')
const responseDto = require('../../config/ResponseDto')
const constants = require('../../config/Constants')


let GetMyprofileDetails = async (req, res) => {

    try {
        console.log(req.body.userName)
        let ResultRegDetails = await viewMyProfile.viewMyProfile(req.body.userName).catch((e) => {
            console.log(e);
        });
        res.json(ResultRegDetails);
    }
    catch (err) {
        console.log(err);
        res.json({ error: err });
    }
}




let UPDATE_MY_DETAILS = async (req, res) => {
    let obj = {};

    let myDatas = req.body;

    //console.log(myDatas); existingPassword
    let responceData = await viewMyProfile.viewMyProfile(myDatas.userName).catch((e) => {
        console.log(e);
        return res.json(new responseDto(constants.STATUS_FAIL, constants.STATUS_FAIL, ""));
    });;

    if (responceData && responceData.length > 0) {
        // console.log("responceData =>\n" + JSON.stringify(responceData))
        let data = responceData[0];
        let currentPassword = Cryptr.decryptedText(data.password);
        let UICurrentPassword = myDatas.existingPassword;
        // var temppass = Cryptr.decryptedText(userData[0].password);
        // console.log("currentPassword " + currentPassword)
        // console.log("UICurrentPassword " + UICurrentPassword)

        if (currentPassword === UICurrentPassword) {
            let resultDatas = await viewMyProfile.Update_MY_DETAILS(myDatas).catch((e) => {
                console.log(e);
            });
            // console.log("resultDatas " + JSON.stringify(resultDatas))
            if (resultDatas && resultDatas > 0) {
                return res.json(new responseDto(constants.STATUS_SUCCESS, "", ""));
            } else {
                return res.json(new responseDto(constants.STATUS_FAIL, "", ""));
            }
        } else {
            // console.log("" + currentPassword)
            // console.log("" + UICurrentPassword)
            return res.json(new responseDto(constants.STATUS_FAIL, "InvalidExistingPassword", ""));
        }
    } else {
        return res.json(new responseDto(constants.STATUS_FAIL, constants.STATUS_FAIL, ""));
    }

}

module.exports = {
    GetMyprofileDetails, UPDATE_MY_DETAILS
}