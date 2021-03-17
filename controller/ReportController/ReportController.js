let reportRepo = require('../../repositories/ReportRepository/ReportRepository');

exports.getCustReport = async (req, res) => {
    const returnObj = [];
    let responce = await reportRepo.getCustReport(req);
    if (responce && responce != null) {
        for (let index = 0; index < responce.length; index++) {
            let responceObject = {};
            let element = responce[index];
            console.log("element " + element.id)
            responceObject.id = element.id;
            responceObject.registerId = element.register_Id
            responceObject.companyName = element.company_name
            responceObject.rocNo = element.comp_roc_no
            responceObject.customerCode = element.cust_code

            responceObject.applicationDate = element.created_date;
            responceObject.status = element.cpa_status;
            responceObject.ApprovedRejectedDate = element.modified_Date;
            responceObject.ApprovedRejectedBy = element.modified_By;
            responceObject.Remarks = element.remarks;

            let contactDetails = await reportRepo.getCustDetailsReport(element.register_Id);

            for (let i = 0; i < contactDetails.length; i++) {

                let contact = contactDetails[i];
                console.log("contact " + contact.id)
                if (i === 0) {
                    responceObject.contactPersonName1 = contact.contact_person_name;
                    responceObject.email1 = contact.emailaddr;
                    responceObject.contactNo1 = contact.mobileno;
                }
                if (i === 1) {
                    responceObject.contactPersonName2 = contact.contact_person_name;
                    responceObject.email2 = contact.emailaddr;
                    responceObject.contactNo2 = contact.mobileno;
                }
                if (i === 2) {
                    responceObject.contactPersonName3 = contact.contact_person_name;
                    responceObject.email3 = contact.emailaddr;
                    responceObject.contactNo3 = contact.mobileno;
                }
            }
            returnObj.push(responceObject)
        }

    }
    return returnObj;

};

exports.get_customer_activity_report = async (req, res) => {

    return await reportRepo.get_customer_activity_report(req, res);

};

exports.get_customer_payment_due_history = async (req, res) => {

    return await reportRepo.get_customer_payment_due_history(req, res);

};