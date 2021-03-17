let secretQuestionRepository = require('../../repositories/CommonRepository/SecretQuestionLogic');

let constants = require('../../config/Constants');

let loadsecretQuestionDetails = async (req,res) => {
    let responseObj = {};
    try{
        let secretQuestionArrObj = [];
       
        let resultsecretQuestions = await secretQuestionRepository.Get_All_Secret_Questions().catch((e) => {
            responseObj.message=e
            return res.json(responseObj);
        });
        let secretQuestionObj = {
            value: 'select',
            label: '--Select secretQuestion--'
        };
        secretQuestionArrObj.push(secretQuestionObj);
       // console.log(JSON.stringify(ResultCountry));
        for(let x in resultsecretQuestions){
            //alert("secret question")
            let secretQuestionObj = {
              
                value: resultsecretQuestions[x].VALUE,
                label: resultsecretQuestions[x].LABEL
               // alert()
            };
            secretQuestionArrObj.push(secretQuestionObj);
          //  alert(VALUE)
        }
        responseObj.secretQuestionLists = secretQuestionArrObj;
        responseObj.message=constants.STATUS_SUCCESS
        res.json(responseObj);
    }
    catch(err){
        console.log(err);
        responseObj.message=err
        return res.json(responseObj);
    }
}

module.exports={
    loadsecretQuestionDetails
}