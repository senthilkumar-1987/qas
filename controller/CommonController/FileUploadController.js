let fileattachRepository = require('../../repositories/CommonRepository/GetFileAttachRepo');
let responseDto = require('../../config/ResponseDto');
let constants = require('../../config/Constants');


let loadImage = async (req, res) => {

    // loadImage
    let obj = {};
    console.log("ID : " + JSON.stringify(req.body))
    try {
        let fileAttachment = await fileattachRepository.LOAD_UPLOADED_FILE(req.body.enquiryId).catch((e) => {
            console.log(e);

        });
        // console.log(JSON.stringify(fileAttachment))
        return res.json(new responseDto(constants.STATUS_SUCCESS, '', fileAttachment));
    }
    catch (err) {
        console.log(err);
        return res.json(new responseDto('', constants.STATUS_FAIL, err));
    }


}

module.exports = {
    loadImage
}