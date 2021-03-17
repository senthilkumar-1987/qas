

let sectorRepository = require('../../repositories/CommonRepository/GetAllSectorRepo');
let responseDto = require('../../config/ResponseDto')
let constants = require('../../config/Constants');



let loadSector = async (req,res) => {
    let obj = {};
    try{
      
        let resultSector = await sectorRepository.LOAD_ALL_SECTOR().catch((e) => {
            console.log(e);
       
     
        });
       // console.log(resultSector)
        return res.json(new responseDto(constants.STATUS_SUCCESS, '', resultSector));
    }
    catch(err){
        console.log(err);
        return res.json(new responseDto('', constants.STATUS_FAIL, err));
    }
}

let loadInformation = async (req,res) => {
    let obj = {};
    try{
      
        let resultInformation = await sectorRepository.LOAD_ALL_INFORMATION().catch((e) => {
           
            console.log(e);
       
     
        });
      //  console.log(resultInformation)
        return res.json(new responseDto(constants.STATUS_SUCCESS, '', resultInformation));
    }
    catch(err){
        console.log(err);
        return res.json(new responseDto('', constants.STATUS_FAIL, err));
    }
}


module.exports={
loadSector,loadInformation
}