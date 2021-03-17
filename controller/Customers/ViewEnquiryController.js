let viewEnquiryController = require('../../repositories/CustomersRepository/ViewEnquiryLogic');
let getpofiles = require('../../repositories/CommonRepository/GetFileAndLicenseDetails')

let loadEnqDetails = async (req, res) => {
    try {

        let enquiryDetails = req.body;
        let userData = req.userData;
        let ResultRegDetails = await viewEnquiryController.LOAD_PENDING_ENQ_DETAILS(enquiryDetails, userData).catch((e) => {
            console.log(e);

        });


        res.json(ResultRegDetails);
    }
    catch (err) {
        console.log(err);
        res.json({ error: err });
    }
}






let getMessages = async (req, res) => {
    try {
        let enquiryDetails = req.body;
        let userData = req.userData;
        let temp = []
        let userid = userData.id;
        let ResultRegDetails = '';
        console.log("enquiryDetails.fileNo\n" + enquiryDetails.fileNo)
        if (!enquiryDetails.fileNo && enquiryDetails.fileNo == "" || enquiryDetails.fileNo == null) {
            let fileno = await getpofiles.PoFileId(userid);
            console.log("fileno>>" + JSON.stringify(fileno.length))
            if (fileno !== null && fileno !== "" && fileno.length > 0) {
                for (let index = 0; index < fileno.length; index++) {
                    const element = fileno[index].FileNo;
                    temp.push(element)
                }
                console.log(JSON.stringify(temp))
                ResultRegDetails = await viewEnquiryController.getMessageOnEmptySearch(temp).catch((e) => {
                    console.log(e);
                });
            }

        } else {
            ResultRegDetails = await viewEnquiryController.getMessageSearch(enquiryDetails, userData).catch((e) => {
                console.log(e);
            });
        }
        res.json(ResultRegDetails);
    } catch (err) {
        console.log(err);
        res.json({ error: err });
    }
}

let loadMyEnqDetails = async (req, res) => {
    try {
        var userName = req.body;
        console.log("zxcvzxcv " + JSON.stringify(userName))
        let ResultRegDetails = await viewEnquiryController.LOAD_MY_ENQ_DETAILS(userName).catch((e) => {
            console.log(e);

        });


        res.json(ResultRegDetails);
    }
    catch (err) {
        console.log(err);
        res.json({ error: err });
    }
}



module.exports = {
    loadEnqDetails, loadMyEnqDetails, getMessages
}