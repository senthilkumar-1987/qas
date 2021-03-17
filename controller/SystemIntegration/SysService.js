let responseDto = require('../../config/ResponseDto')
const sysrepo=require("../SystemIntegration/SysRepo");
var generator = require('generate-password');
let constants = require('../../config/Constants')
exports.APISave=async(req,res)=>
{
    try
    {
        let inputData=req.body;
        let userData=req.userData;
        let apiObj=await sysrepo.getAPIDetails(inputData);
        console.log("apiObj"+apiObj.length)
        if(apiObj.length>0)
        {
            return new responseDto(constants.STATUS_FAIL, 'Credentials Already Exist for this User', '');
        }
        var autoGeneratePassword = generator.generate({
            length: 8,
            numbers: true
        });
        inputData.password=autoGeneratePassword;
        await sysrepo.saveAPIDetails(inputData,userData);
        return new responseDto(constants.STATUS_SUCCESS, '', 'API Credentials Created Successfully');
    }
    catch(err)
    {
        console.log(err);
        return new responseDto(constants.STATUS_FAIL, 'Try After Some time', '');
    }
}
exports.getAllAPI=async(req,res)=>
{
    try
    {
        let userData=req.userData;
        
        let apiObj=await sysrepo.getAllAPI(userData);
        return new responseDto(constants.STATUS_SUCCESS, '', apiObj);
    }
    catch(err)
    {
        console.log(err);
        return new responseDto(constants.STATUS_FAIL, 'Try After Some time', '');
    }
}
exports.updateAPIDetails=async(req,res)=>
{
    try
    {
        let userData=req.userData;
        let username=req.body.username;
        let status= req.body.status;
        let apiObj=await sysrepo.UpdateAPIDetaislStatus(username,status,userData);
        return new responseDto(constants.STATUS_SUCCESS, '', 'Successfully Updated');
    }
    catch(err)
    {
        console.log(err);
        return new responseDto(constants.STATUS_FAIL, 'Try After Some time', '');
    }
}