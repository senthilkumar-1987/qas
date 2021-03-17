let resetPasswordRepository = require('../../repositories/CommonRepository/FirstLoginResetPasswordLogic');
let resetPassword= async (req,res) => {
  
    try{
       
  var loginCredentials=req.body;

        let ResultRegDetails = await resetPasswordRepository.Update_Reset_Password(loginCredentials).catch((e) => {
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
    resetPassword
}