let schemeRepository = require('../../repositories/CommonRepository/GetAllschemes');
let sectorRepository = require('../../repositories/CommonRepository/GetAllSectorRepo');
let responseDto = require('../../config/ResponseDto')
let constants = require('../../config/Constants');






let loadSchemes = async (req,res) => {
    let obj = {};
    try{
       
        let resultSchemes = await schemeRepository.LOAD_ALL_SCHEMES().catch((e) => {
           // console.log(resultSchemes);
        });

        return res.json(new responseDto(constants.STATUS_SUCCESS, '', resultSchemes));
    }
    catch(err){
        console.log(err);
        return res.json(new responseDto('', constants.STATUS_FAIL, err));
    }
}








module.exports={
    loadSchemes
}