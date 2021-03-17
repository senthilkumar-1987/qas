let cityRepository = require('../../repositories/CommonRepository/CityLogic');

let loadCityDetailsByStateId= async (req,res) => {
    let responseObj = {};
    try{
        let cityArrObj = [];
        let stateId=req.query.stateId;
       
        let resultCities = await cityRepository.Load_City_Details_ByState_Id(stateId).catch((e) => {
            responseObj.message=e
            return res.json(responseObj);
        });
        let cityObj = {
            value: 'select',
            label: 'Select City--'
        };
        cityArrObj.push(cityObj);
       // console.log(JSON.stringify(ResultCountry));
        for(let x in resultCities){
            let cityObj = {
                value: resultCities[x].VALUE,
                label: resultCities[x].LABEL
            };
            cityArrObj.push(cityObj);
        }
        responseObj.citiesList = cityArrObj;

        res.json(responseObj);
    }
    catch(err){
        responseObj.message=err
        return res.json(responseObj);
    }
}

module.exports={
    loadCityDetailsByStateId
}