let enquiryServiceLogic = require('../../repositories/CustomersRepository/CPAEnquiesReplyLogic')

let  enquiryReplyDetails= async (req, res) => {
    let responseObj = {};
   
    try{
      
       let enquiryDetails=req.body
   
       let replyDetails = await enquiryServiceLogic.CPA_ENQUIRES_REPLY(enquiryDetails).catch((e) => {
    
        responseObj.message=e
        return res.json(replyDetails);

    });

    
      
       
        res.json("sucess");
    }
   
    catch(e){
        console.log(e);
        res.json({error:e});
    }
   
}

module.exports = {
    enquiryReplyDetails
}