let ViewContactDetailsLogic = require('../../repositories/CustomersRepository/ViewContactDetailsLogic')

let Load_Contact_Details_By_registerId = async (req,res) => {
  
    try{

     // console.log(req.query);
       var  addressId=req.query.addressId;
        let ResultContDetails = await ViewContactDetailsLogic.Load_Contact_Details(addressId)
      .catch((e) => {
            console.log(e);
       
        });
       
       
        res.json(ResultContDetails);
    }
    catch(err){
        console.log(err);
        res.json({error:err});
    }
}

module.exports={
    Load_Contact_Details_By_registerId
}