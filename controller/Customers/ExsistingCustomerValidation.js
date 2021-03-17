let ExsisitingcustomerRepository = require('../../repositories/CustomersRepository/ExsistingcustomerValidationLogic');

let loadCustomerDetails = async (req,res) => {
  
    try{
        let customerDetails = await ExsisitingcustomerRepository.Load_Exsisting_Customer_Details(req.body).catch((e) => {
            console.log(e);
       
        });
        res.json(customerDetails);
    }
    catch(err){
        console.log(err);
        res.json({error:err});
    }
}

module.exports={
    loadCustomerDetails
}