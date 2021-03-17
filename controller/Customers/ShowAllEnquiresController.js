let showenquirylogic = require('../../repositories/CustomersRepository/ShowAllEnquiresRepo')


let responseDto = require('../../config/ResponseDto')


var constants = require('../../config/PaymentConstants');

let Load_All_Enquiry_Details = async (req,res) => {
  
    try{
let enquiryDetails=req.body;
  
        let resultEnqDetails = await showenquirylogic.LOAD_ENQ_DETAILS(enquiryDetails)
      .catch((e) => {
            console.log(e);
       
        });
       
       
        return res.json(new responseDto(constants.STATUS_SUCCESS, '', resultEnqDetails));
    }
    catch(err){
        console.log(err);
        return res.json(new responseDto('', constants.STATUS_FAIL, err));
    }
}

module.exports={
    Load_All_Enquiry_Details
}