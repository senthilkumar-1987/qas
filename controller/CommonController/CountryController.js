let countryRepository = require('../../repositories/CommonRepository/CountryLogic');
let constants = require('../../config/Constants');

let loadCountyDetails = async (req,res) => {
    let responseObj = {};
    try{
        let countryArrObj = [];
       
        let ResultCountry = await countryRepository.Load_All_Country().catch((e) => {
            responseObj.status=constants.STATUS_FAIL
            responseObj.messaage=e
            return res.json(responseObj);
        });
        let myDtCountry = {
            value: 'select',
            label: 'Select Country--'
        };
        countryArrObj.push(myDtCountry);
       // console.log(JSON.stringify(ResultCountry));
        for(let x in ResultCountry){
            let myDtCountry = {
                value: ResultCountry[x].VALUE,
                label: ResultCountry[x].LABEL
            };
            countryArrObj.push(myDtCountry);
        }
        responseObj.countryLists = countryArrObj;
        responseObj.status=constants.STATUS_SUCCESS

        res.json(responseObj);
    }
    catch(err){
        console.log(err);
        responseObj.status=constants.STATUS_FAIL
        responseObj.messaage=err;
       return res.json(responseObj);
    }
}

module.exports={
    loadCountyDetails
}