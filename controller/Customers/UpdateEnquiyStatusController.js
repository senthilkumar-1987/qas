let updatenquirylogic = require('../../repositories/CustomersRepository/CPAEnquiresStatus')


let responseDto = require('../../config/ResponseDto')


var constants = require('../../config/PaymentConstants');

let Upadte_Enquiry_Details = async (req,res) => {
  
    try{

  var data=req.body;

        let resultEnqDetails = await updatenquirylogic.UPDATE_ENQUIRY_RAISING(data.currentEnqId,data.checkboxRespond,data.remarks)
     
       
       
        return res.json(new responseDto(constants.STATUS_SUCCESS, '', resultEnqDetails));
    }
    catch(err){
        console.log(err);
        return res.json(new responseDto('', constants.STATUS_FAIL, err));
    }
}

module.exports={
    Upadte_Enquiry_Details
}