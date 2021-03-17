var fs = require('fs');
let licenseLogic = require('../../repositories/CustomersRepository/GetLicenseLogic')
let responseDto = require('../../config/ResponseDto')
let constants = require('../../config/Constants')


let LicensesJsonData = {}
const Licenses = __dirname + '/Licenses.json';
fs.readFile(Licenses, 'utf-8', (err, data) => {
    if (err) throw err
    LicensesJsonData = JSON.parse(data);
})


let getLicenseDetails = async (req, res) => {

    let responseObj = {};

    try {

        let filedetails = req.body
        let custId = req.userData.custId
        let licenceDetails="";
        let customerDetails = await licenseLogic.getCustIdByCustomerCode(custId).catch((e) => {
            console.log(e);
        
        });
       
        if (customerDetails !== null && customerDetails.length > 0) {
            console.log("customerDetails>" + JSON.stringify(customerDetails))
          
            licenceDetails = await licenseLogic.getlicenseDetails(filedetails, customerDetails[0].CustId).catch((e) => {
                console.log(e);
                return res.json(new responseDto(constants.STATUS_FAIL, '', e));
            
            });

            return res.json(new responseDto(constants.STATUS_SUCCESS, '', licenceDetails));

        }
    //return res.json(new responseDto(constants.STATUS_FAIL, '', licenceDetails));

    } catch (err) {
        console.log(err);
        return res.json(new responseDto(constants.STATUS_FAIL, '', err));
       // res.json({ error: err });
    }
}



let getAllLicenseDetails = async (req, res) => {
    let responseObj = {};

    try {
        let custId = req.body.custId
        console.log("req.body =====>" + JSON.stringify(req.body))
        let customerDetails = await licenseLogic.getCustIdByCustomerCode(custId)//05000356
        let licenceDetails = await licenseLogic.getAllLicenseDetails(customerDetails)
        return res.json(new responseDto(constants.STATUS_SUCCESS, '', licenceDetails));
        // return res.json(licenceDetails);
    } catch (err) {
        console.log(err);

        res.json(new responseDto(constants.STATUS_FAIL, err, ''));
        // res.json({ error: err });
    }
}


module.exports = {
    getLicenseDetails, getAllLicenseDetails
}