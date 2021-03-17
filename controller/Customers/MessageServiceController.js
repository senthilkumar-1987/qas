let messageServiceLogic = require('../../repositories/CustomersRepository/MessageServiceLogic')
let constants = require('../../config/Constants');
let enquiryDetails = async (req, res) => {
    let responseObj = {};

    try {

        let enquiryDetails = req.body


        let enquirySequence = await messageServiceLogic.Get_Customer_Enquiry_Seq_Value().catch((e) => {
            //enqSequence =enquirySequence;

            responseObj.message = e
            return res.json(enquirySequence);

        });

        let messageSequence = await messageServiceLogic.Get_Customer_Message_Seq_Value().catch((e) => {


            responseObj.message = e
            return res.json(messageSequence);

        });

        let resultenquiry = await messageServiceLogic.Insert_Enquiry_details(enquirySequence, messageSequence, enquiryDetails).catch((e) => {
            responseObj.message = constants.STATUS_SUCCESS
            
            return res.json(constants.STATUS_SUCCESS);

        });


        res.json(constants.STATUS_SUCCESS);
    }

    catch (e) {
        console.log(e);
        res.json({ error: e });
    }

}

let updateEnquiryDetails = async (req, res) => {
    let responseObj = {};

    try {
        let enquirySequence = await messageServiceLogic.Get_Customer_Enquiry_Seq_Value().catch((e) => {
            //enqSequence =enquirySequence;

            responseObj.message = e
            return res.json(responseObj);
        })
           let msgupdateDetails = req.body;
           console.log(msgupdateDetails);
        let resultupdatemessageDetails = await messageServiceLogic.UPDATE_Enquiry_details(enquirySequence,msgupdateDetails).catch((e) => {
            //enqSequence =enquirySequence;

            console.log('e --> '+e);

            responseObj.message = e
            return res.json(responseObj);

        });




        res.json(responseObj);
    }

    catch (e) {
        console.log(e);
        res.json({ error: e });
    }

}






let messageDetails = async (req, res) => {
    let responseObj = {};
    try {
        let msgDetails = req.query.messageId;
  
        let resultupdatemessageDetails = await messageServiceLogic.Get_Message_Details_ByMsgId(msgDetails).catch((e) => {
          
            responseObj.message = e
          
        });

        return res.json(resultupdatemessageDetails); 
    }

    catch (e) {
        console.log(e);
        res.json({ error: e });
    }

}
module.exports = {
    enquiryDetails, messageDetails, updateEnquiryDetails
}