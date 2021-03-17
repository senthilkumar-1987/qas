let companyTypeRepository = require('../../repositories/CommonRepository/CompanyTypeLogic');
let constants = require('../../config/Constants');

let loadCompanyTypeDetails = async (req,res) => {
    let responseObj = {};
    try{
        let companyTypeArrObj = [];
       
        let resultCompanyTypes = await companyTypeRepository.Load_All_Company_Type_Details().catch((e) => {
            responseObj.message=e
            return res.json(responseObj);
        });
        let companyTypeObj = {
            value: 'select',
            label: '--Select CompanyType--'
        };
        companyTypeArrObj.push(companyTypeObj);
       // console.log(JSON.stringify(ResultCountry));
        for(let x in resultCompanyTypes){
            let companyTypeObj = {
                value: resultCompanyTypes[x].VALUE,
                label: resultCompanyTypes[x].LABEL
            };
            companyTypeArrObj.push(companyTypeObj);
        }
        responseObj.companyTypeLists = companyTypeArrObj;
        responseObj.message=constants.STATUS_SUCCESS
        res.json(responseObj);
    }
    catch(err){
        console.log(err);
        responseObj.message=e
        return res.json(responseObj);
    }
}

module.exports={
    loadCompanyTypeDetails
}