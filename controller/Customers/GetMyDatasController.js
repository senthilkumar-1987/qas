let viewMyProfile = require('../../repositories/CustomersRepository/GetAllmyDetails');


let GetMyDetails = async (req,res) => {
  
    try{
       console.log(req.body.userName)
        let ResultRegDetails = await viewMyProfile.getMyDatasByUserName(req.body.userName).catch((e) => {
            console.log(e);
        });
      //  console.log(ResultRegDetails);
       res.json(ResultRegDetails);
    }
    catch(err){
        console.log(err);
        res.json({error:err});
    }
}

module.exports={
    GetMyDetails   
}