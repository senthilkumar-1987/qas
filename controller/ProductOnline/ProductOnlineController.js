const responseDto = require('../../config/ResponseDto')
let constants = require('../../config/Constants')
let ProductService= require('../ProductOnline/ProductOnlineService')




exports.SchemeDropDown=async(req,res)=>
{
    try {
        let responseDto=await ProductService.Get_SchemeDropDownList(req,res);
        return res.json(responseDto);
    }
    catch (err) {
        console.log(err);
        return res.json(new responseDto(constants.STATUS_FAIL, err, ''))
    }
}





exports.StandardDropDownList=async(req,res)=>
{
    try {
        let responseDto=await ProductService.Get_StandardDropDownList(req,res);
        return res.json(responseDto);
    }
    catch (err) {
        console.log(err);
        return res.json(new responseDto(constants.STATUS_FAIL, err, ''))
    }
}





exports.CountryDropDownList=async(req,res)=>
{
    try {
        let responseDto=await ProductService.Get_CountryDropDownList(req,res);
        return res.json(responseDto);
    }
    catch (err) {
        console.log(err);
        return res.json(new responseDto(constants.STATUS_FAIL, err, ''))
    }
}





exports.StateDropDownList=async(req,res)=>
{
    try {
        let responseDto=await ProductService.Get_StateDropDownList(req,res);
        return res.json(responseDto);
    }
    catch (err) {
        console.log(err);
        return res.json(new responseDto(constants.STATUS_FAIL, err, ''))
    }
}



exports.StatusDropDownList=async(req,res)=>
{
    try {
        let responseDto=await ProductService.Get_StatusDropDownList(req,res);
        return res.json(responseDto);
    }
    catch (err) {
        console.log(err);
        return res.json(new responseDto(constants.STATUS_FAIL, err, ''))
    }
}





exports.SearchData_ProductOnline=async(req,res)=>
{
    try {
        let responseDto=await ProductService.Get_SearchDetailsList(req,res);
        return res.json(responseDto);
    }
    catch (err) {
        console.log(err);
        return res.json(new responseDto(constants.STATUS_FAIL, err, ''))
    }
}