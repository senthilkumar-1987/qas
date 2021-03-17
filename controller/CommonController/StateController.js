let stateRepository = require('../../repositories/CommonRepository/StateLogic');


let loadStateDetailsByCountryId = async (req,res) => {
    let obj = {};
    try{
        let stateArrObj = [];
       let countryId=req.query.countryId;
       //console.log("countryId"+countryId)
        let resultStates = await stateRepository.Load_States_ByCountyId(countryId).catch((e) => {
            console.log(e);
        });
        let stateObj = {
            value: 'select',
            label: 'Select State--'
        };
        stateArrObj.push(stateObj);
      // console.log(JSON.stringify(resultStates));
        for(let x in resultStates){
            let stateObj = {
                value: resultStates[x].VALUE,
                label: resultStates[x].LABEL
            };
            stateArrObj.push(stateObj);
        }
        obj.stateLists = stateArrObj;

        res.json(obj);
    }
    catch(err){
        console.log(err);
        res.json({error:err});
    }
}

module.exports={
    loadStateDetailsByCountryId
}