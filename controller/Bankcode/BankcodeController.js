const responseDto = require('../../config/ResponseDto')
let constants = require('../../config/Constants')
var BankcodeService=require('../Bankcode/BankService')



exports.createNewBankCode = async (req, res) => {
    try {
        let responseDto = await BankcodeService.BankCodeAPISave(req, res);
        return res.json(responseDto);
    }
    catch (err) {
        console.log(err);
        return res.json(new responseDto(constants.STATUS_FAIL, err, ''))
    }
}

exports.getAllBankCode=async(req,res)=>
{
    try {
        let responseDto=await BankcodeService.getAllBankCodedetails(req,res);
        return res.json(responseDto);
    }
    catch (err) {
        console.log(err);
        return res.json(new responseDto(constants.STATUS_FAIL, err, ''))
    }
}






exports.updateBankCode=async(req,res)=>
{
    try {
        let responseDto=await BankcodeService.updateBankCodeDetails(req,res);
        return res.json(responseDto);
    }
    catch (err) {
        console.log(err);
        return res.json(new responseDto(constants.STATUS_FAIL, err, ''))
    }
}