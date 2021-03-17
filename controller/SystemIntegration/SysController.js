var sysservice=require("../SystemIntegration/SysService")
const responseDto = require('../../config/ResponseDto')
let constants = require('../../config/Constants')

exports.createAPICredentials=async(req,res)=>
{
    try {
        let responseDto=await sysservice.APISave(req,res);
        return res.json(responseDto);
    }
    catch (err) {
        console.log(err);
        return res.json(new responseDto(constants.STATUS_FAIL, err, ''))
    }
}
exports.getAllAPI=async(req,res)=>
{
    try {
        let responseDto=await sysservice.getAllAPI(req,res);
        return res.json(responseDto);
    }
    catch (err) {
        console.log(err);
        return res.json(new responseDto(constants.STATUS_FAIL, err, ''))
    }
}

exports.updateAPI=async(req,res)=>
{
    try {
        let responseDto=await sysservice.updateAPIDetails(req,res);
        return res.json(responseDto);
    }
    catch (err) {
        console.log(err);
        return res.json(new responseDto(constants.STATUS_FAIL, err, ''))
    }
}