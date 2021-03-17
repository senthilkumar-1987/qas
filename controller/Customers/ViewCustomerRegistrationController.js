
let viewRegisterRepository = require('../../repositories/CustomersRepository/ViewRegisterLogic');
let viewRegisterDetails = require('../../repositories/CustomersRepository/UpdateRegisterLogic');
let loadRegDetails = async (req,res) => {
  
    try{
       
        let ResultRegDetails = await viewRegisterRepository.Load_Pending_Reg_Details().catch((e) => {
            console.log(e);
        });
       res.json(ResultRegDetails);
    }
    catch(err){
        console.log(err);
        res.json({error:err});
    }
}
let singleCustomDetails = async (req,res) => {
  
    try{

    //  console.log(req.query.countryId);
       var  registerId=req.query.registerId;
        let ResultRegDetails = await viewRegisterDetails.Load_Reg_Details(registerId)
      .catch((e) => {
            console.log(e);
       
        });
       
       
        res.json(ResultRegDetails);
    }
    catch(err){
        console.log(err);
        res.json({error:err});
    }
}
module.exports={
    loadRegDetails,singleCustomDetails
}