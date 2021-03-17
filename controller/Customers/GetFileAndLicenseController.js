let getFilesandLicenseRepo = require('../../repositories/CommonRepository/GetFileAndLicenseDetails');
let constants = require('../../config/Constants');
let logger = require('../../logger');

let fileDetails = async (req, res) => {
    let responseObj = {};


    try {

        // console.log(JSON.stringify(req.userData))
        let custCode = req.userData.custId;
        let filesArrobj = [];
        let getFilesResponse = await getFilesandLicenseRepo.Load_all_files(custCode).catch((e) => {
            responseObj.filesList = '';
            responseObj.message = e;
            return res.json(responseObj);
        });
        let filesobj = {
            value: '',
            label: ''
        };
        filesArrobj.push(filesobj);
        // logger.info("getFilesResponse " + getFilesResponse);
        if (getFilesResponse && getFilesResponse != null && getFilesResponse != '') {
            for (let x in getFilesResponse) {
                let filesobj = {
                    value: getFilesResponse[x].FileId,
                    label: getFilesResponse[x].FileNo,
                };
                filesArrobj.push(filesobj);
            }
            responseObj.filesList = filesArrobj;
            responseObj.message = constants.STATUS_SUCCESS
        } else {
            responseObj.filesList = [];
            responseObj.message = constants.STATUS_SUCCESS
        }

        // logger.info(responseObj.length);
        res.json(responseObj);
        //return res.json(constants.STATUS_SUCCESS,responseListgetFilesResponse);
    }
    catch (e) {
        console.log(e);
        res.json({ error: e });
    }
}
let licenseDetails = async (req, res) => {
    let responseObj = {};


    try {
        let licenseArrobj = [];
        let getlicenseResponse = await getFilesandLicenseRepo.Load_License_No_By_FileNo(req.query.fileId).catch((e) => {
            responseObj.message = e
            return res.json(responseObj);
        });
        let licenseobj = {
            value: '',
            label: ''
        };
        licenseArrobj.push(licenseobj);
        // console.log(JSON.stringify(ResultCountry));
        for (let x in getlicenseResponse) {
            let licenseobj = {
                value: getlicenseResponse[x].CertId,
                label: getlicenseResponse[x].CertNo,
            };
            licenseArrobj.push(licenseobj);
        }
        responseObj.LicenseList = licenseArrobj;
        responseObj.message = constants.STATUS_SUCCESS
        //console.log(responseObj);
        res.json(responseObj);
        //return res.json(constants.STATUS_SUCCESS,responseListgetFilesResponse);
    }
    catch (e) {
        console.log(e);
        res.json({ error: e });
    }
}

let POfileDetails = async (req, res) => {
    let responseObj = {};


    try {

        // console.log(JSON.stringify(req.userData))
        //  let custCode = req.userData.custId;
        let Userid = req.userData.id;
        let filesArrobj = [];
        let getFilesResponse = await getFilesandLicenseRepo.PoFileId(Userid).catch((e) => {
            responseObj.filesList = '';
            responseObj.message = e;
            return res.json(responseObj);
        });
        let filesobj = {
            value: '',
            label: ''
        };



        filesArrobj.push(filesobj);
        // logger.info("getFilesResponse " + getFilesResponse);
        if (getFilesResponse && getFilesResponse != null && getFilesResponse != '') {

            for (let x in getFilesResponse) {

                let filesobj = {
                    value: getFilesResponse[x].FileId,
                    label: getFilesResponse[x].FileNo,
                };
                filesArrobj.push(filesobj);

            }
            responseObj.filesList = filesArrobj;
            responseObj.message = constants.STATUS_SUCCESS
        } else {
            responseObj.filesList = [];
            responseObj.message = constants.STATUS_SUCCESS
        }

        // logger.info(responseObj.length);
        res.json(responseObj);
        //return res.json(constants.STATUS_SUCCESS,responseListgetFilesResponse);
    }
    catch (e) {
        console.log(e);
        res.json({ error: e });
    }
}

module.exports = {
    fileDetails, licenseDetails, POfileDetails
}