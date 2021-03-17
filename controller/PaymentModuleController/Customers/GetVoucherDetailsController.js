let voucherDetails = require('../../../repositories/PaymentRepository/Customers/GetVoucherDetailsLogic');
let responseDto = require('../../../config/ResponseDto')


var constants = require('../../../config/PaymentConstants');

let loadVoucherDetails = async (req, res) => {
    try {


        // console.log('kkk');
        let voucherNo = req.query.voucherNo
        //  console.log("seess" +voucherNo);
        let resultVoucherDetails = await voucherDetails.Load_VoucherDetails_Details_ByVoucherNo(voucherNo, req.userData);
        return res.json(new responseDto(constants.STATUS_SUCCESS, '', resultVoucherDetails));

    }
    catch (err) {
        console.log(err);
        return res.json(new responseDto('', constants.STATUS_FAIL, err));
    }
}
module.exports = {
    loadVoucherDetails
}