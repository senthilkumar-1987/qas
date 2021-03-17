let constants = require('../../config/Constants')
let responseDto = require('../../config/ResponseDto')
let ProductRepo =require('../ProductOnline/ProductOnlineRepo')






exports.Get_SchemeDropDownList=async(req,res)=>
{
    try
    {
       
        
        let apiObj=await ProductRepo.Scheme();
        return new responseDto(constants.STATUS_SUCCESS, '', apiObj);
    }
    catch(err)
    {
        console.log(err);
        return new responseDto(constants.STATUS_FAIL,'' ,err);
    }
}




exports.Get_StandardDropDownList=async(req,res)=>
{
    try
    {
       
        
        let apiObj=await ProductRepo.Standard();
        return new responseDto(constants.STATUS_SUCCESS, '', apiObj);
    }
    catch(err)
    {
        console.log(err);
        return new responseDto(constants.STATUS_FAIL,'' ,err);
    }
}




exports.Get_CountryDropDownList=async(req,res)=>
{
    try
    {
        let apiObj=await ProductRepo.Country();
        return new responseDto(constants.STATUS_SUCCESS, '', apiObj);
    }
    catch(err)
    {
        console.log(err);
        return new responseDto(constants.STATUS_FAIL,'' ,err);
    }
}




exports.Get_StateDropDownList=async(req,res)=>
{
    try
    {
let CountryId = req.body.CountryId

        let apiObj=await ProductRepo.State(CountryId);
        return new responseDto(constants.STATUS_SUCCESS, '', apiObj);
    }
    catch(err)
    {
        console.log(err);
        return new responseDto(constants.STATUS_FAIL,'' ,err);
    }
}




exports.Get_StatusDropDownList=async(req,res)=>
{
    try
    {
        let apiObj=await ProductRepo.Status();
        return new responseDto(constants.STATUS_SUCCESS, '', apiObj);
    }
    catch(err)
    {
        console.log(err);
        return new responseDto(constants.STATUS_FAIL,'' ,err);
    }
}


exports.Get_SearchDetailsList=async(req,res)=>
{
    try
    {
        let apiObj=await ProductRepo.SearchCriteria(req,res);
        return new responseDto(constants.STATUS_SUCCESS, '', apiObj);
    }
    catch(err)
    {
        console.log(err);
        return new responseDto(constants.STATUS_FAIL,'' ,err);
    }
}