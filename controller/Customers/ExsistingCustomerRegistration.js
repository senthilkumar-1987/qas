let newCustomerRegistrationLogic = require('../../repositories/CustomersRepository/NewCustomerRegistrationLogic')
let exsistingCustomer = require('../../repositories/CustomersRepository/NewCustomerExsistingLogic')
var constants = require('../../config/Constants');
let saveExsistingCustomerDetails = async (req, res) => {
    let responseObj = {};
    console.log("saveExsistingCustomerDetails IN")

    try {

        let resultRegseq = await newCustomerRegistrationLogic.Get_Customer_Registration_Seq_Value().catch((e) => {
            responseObj.message = e
            if (e) {
                responseObj.error = e
            }
            return res.json(constants.STATUS_FAIL);
        });


        let customerData = req.body;
        let resultRegDetails = await exsistingCustomer.Insert_New_Customer_Registration(customerData, resultRegseq).catch((e) => {
            responseObj.message = e

            if (e) {
                responseObj.error = e
            }
            return res.json(constants.STATUS_FAIL);
        });

        var customerArr = customerData.customerDetails;

        console.log("saveExsistingCustomerDetails")
        customerArr.forEach(async customerData => {
            let resultRegAddrseq = await newCustomerRegistrationLogic.Get_Customer_Registration_Address_Seq_Value()
            let resultAddressDetails = await exsistingCustomer.Insert_New_Customer_Address(customerData, resultRegDetails, resultRegAddrseq).catch((e) => {
                responseObj.message = e
                console.log(e)
                if (e) {
                    responseObj.error = e
                }
            })
            let resultRegContseq = await newCustomerRegistrationLogic.Get_Customer_Registration_Contact_Seq_Value()
            let resultContactDetails = await exsistingCustomer.Insert_New_Customer_Contact(customerData, resultRegAddrseq, resultRegContseq).catch((e) => {
                responseObj.message = e
                console.log(e)
                if (e) {
                    responseObj.error = e
                }
            })

        })
        // var action = "Register"
        // let logEntry = await newCustomerRegistrationLogic.logAudit(resultRegseq, customerData.companyName, action).catch((e) => {

        //     responseObj.message = e

        //     if(e){
        //         responseObj.error=e   
        //     }
        // });
        return res.json(constants.STATUS_SUCCESS);
    }
    catch (e) {
        console.log(e);
        //    res.json({ error: e });
        return res.json(constants.STATUS_FAIL);
    }

}

module.exports = {
    saveExsistingCustomerDetails
}