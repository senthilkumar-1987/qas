let licenseViewRepo = require('../../repositories/CustomersRepository/LicenseViewRepo');
var constants = require('../../config/PaymentConstants');

exports.getLicenseDetails = async (req, res) => {
    let responseObj = {};

    try {

        let sector = req.body.sector;
        let fileId = req.body.fileid;
        responseObj.message = constants.STATUS_SUCCESS
        if(sector==="PC")
        {
            let manucature_contact={};
            let license_contact={};
            let resObj=await licenseViewRepo.getProductCertification(fileId);
            let manufact_contact1=await licenseViewRepo.getLicenseContact1("M",fileId);
            let manufact_contact2=await licenseViewRepo.getLicenseContact2("M",fileId);
            manucature_contact.contact1=manufact_contact1;
            manucature_contact.contact2=manufact_contact2;
            let license_contact1=await licenseViewRepo.getLicenseContact1("L",fileId);
            let license_contact2=await licenseViewRepo.getLicenseContact2("L",fileId);
            license_contact.contact1=license_contact1;
            license_contact.contact2=license_contact2;

            responseObj.details=resObj;
            responseObj.manufacturer_contact=manucature_contact;
            responseObj.licenser_contact=license_contact
        }
        else if(sector==="GE")
        {
            let manucature_contact={};
            let license_contact={};
            let resObj=await licenseViewRepo.getGreenEngine(fileId);
            let manufact_contact1=await licenseViewRepo.getLicenseContact1("M",fileId);
            let manufact_contact2=await licenseViewRepo.getLicenseContact2("M",fileId);
            manucature_contact.contact1=manufact_contact1;
            manucature_contact.contact2=manufact_contact2;
            let license_contact1=await licenseViewRepo.getLicenseContact1("L",fileId);
            let license_contact2=await licenseViewRepo.getLicenseContact2("L",fileId);
            license_contact.contact1=license_contact1;
            license_contact.contact2=license_contact2;

            responseObj.details=resObj;
            responseObj.manufacturer_contact=manucature_contact;
            responseObj.licenser_contact=license_contact
        }
        else if(sector==="FI")
        {
            let manucature_contact={};
            let license_contact={};
            let resObj=await licenseViewRepo.getForeignInspection(fileId);
            let manufact_contact1=await licenseViewRepo.getLicenseContact1("M",fileId);
            let manufact_contact2=await licenseViewRepo.getLicenseContact2("M",fileId);
            manucature_contact.contact1=manufact_contact1;
            manucature_contact.contact2=manufact_contact2;
            let license_contact1=await licenseViewRepo.getLicenseContact1("L",fileId);
            let license_contact2=await licenseViewRepo.getLicenseContact2("L",fileId);
            license_contact.contact1=license_contact1;
            license_contact.contact2=license_contact2;

            responseObj.details=resObj;
            responseObj.manufacturer_contact=manucature_contact;
            responseObj.licenser_contact=license_contact
        }
        else if(sector==="EI")
        {
            let manucature_contact={};
            let license_contact={};
            let resObj=await licenseViewRepo.getEngineeringInspection(fileId);
            let manufact_contact1=await licenseViewRepo.getLicenseContact1("M",fileId);
            let manufact_contact2=await licenseViewRepo.getLicenseContact2("M",fileId);
            manucature_contact.contact1=manufact_contact1;
            manucature_contact.contact2=manufact_contact2;
            let license_contact1=await licenseViewRepo.getLicenseContact1("L",fileId);
            let license_contact2=await licenseViewRepo.getLicenseContact2("L",fileId);
            license_contact.contact1=license_contact1;
            license_contact.contact2=license_contact2;

            responseObj.details=resObj;
            responseObj.manufacturer_contact=manucature_contact;
            responseObj.licenser_contact=license_contact
        }
        else if(sector==="CBS")
        {
            let manucature_contact={};
            let license_contact={};
            let resObj=await licenseViewRepo.getCBScheme(fileId);
            let manufact_contact1=await licenseViewRepo.getLicenseContact1("M",fileId);
            let manufact_contact2=await licenseViewRepo.getLicenseContact2("M",fileId);
            manucature_contact.contact1=manufact_contact1;
            manucature_contact.contact2=manufact_contact2;
            let license_contact1=await licenseViewRepo.getLicenseContact1("L",fileId);
            let license_contact2=await licenseViewRepo.getLicenseContact2("L",fileId);
            license_contact.contact1=license_contact1;
            license_contact.contact2=license_contact2;

            responseObj.details=resObj;
            responseObj.manufacturer_contact=manucature_contact;
            responseObj.licenser_contact=license_contact
        }
        res.json(responseObj);
    }
    catch (e) {
        console.log(e);
        res.json({ error: e });
    }
}
