let orgTypeRepository = require('../../repositories/CommonRepository/OrgTypeLogic');
let constants = require('../../config/Constants');

let loadOrgTypeDetails = async (req,res) => {
    let responseObj = {};
    try{
        let orgTypeArrObj = [];
       
        let resultOrgTypes = await orgTypeRepository.Load_All_Org_Type_Details().catch((e) => {
            responseObj.message=e
            return res.json(responseObj);
        });
        let orgTypeObj = {
            value: 'select',
            label: '--Select OrgType--'
        };
        orgTypeArrObj.push(orgTypeObj);
     
        for(let x in resultOrgTypes){
            let orgTypeObj = {
                value: resultOrgTypes[x].VALUE,
                label: resultOrgTypes[x].LABEL
            };
            orgTypeArrObj.push(orgTypeObj);
        }
    
        responseObj.OrgTypeLists = orgTypeArrObj;
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
    loadOrgTypeDetails
}