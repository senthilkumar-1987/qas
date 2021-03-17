var soap = require('soap');
var constants = require('../../config/CRM-config');
var url = constants.URL;
var wsdlURL = constants.wsdlURL;
var moment = require('moment');
var logger = require('../../logger');

exports.serachCompany = (customerData) => {

  var companyDetails = customerData.registerDetails;
  let rocNo = companyDetails[0].comp_roc_no;

  var args = { search_value: rocNo, search_cd: '1' };
  var requestTime = moment(new Date).format('DD-MM-YYYY ');
  var obj = {};
  obj.request = args;
  obj.requestTime = requestTime;
  logger.info(JSON.stringify(obj))
  console.log('reqofcreate' + JSON.stringify(args))
  return new Promise((resolve, reject) => {
    soap.createClient(wsdlURL, { endpoint: url }, (err, client) => {
      client.searchCompany(args, (err, result, body) => {
        logger.info(JSON.stringify(result))
        obj.response = result;
        obj.responseTime = moment(new Date).format('DD-MM-YYYY ');
        obj.serviceType = 'searchCompany';
        obj.serviceUrl = wsdlURL
        return resolve(obj)
      })
    });
  });
}

exports.insertCompany = async (customerData) => {
  logger.info("customerDetais insertCompany\n" + JSON.stringify(customerData));
  let phone1Code = customerData.registerDetails[0].mobileno.split('-')[0];
  // let phone2Code = customerData.registerDetails[1].mobileno.split('-')[0];
  // console.log(phone1Code);
  let phone2Code = ''
  if (customerData.registerDetails.length >= 2) {
    phone2Code = (customerData.registerDetails[1].mobileno != undefined || customerData.registerDetails[1].mobileno != '') ? customerData.registerDetails[1].mobileno.split('-')[0] : '';
  }
  console.log("phone1Code " + phone1Code);
  console.log("phone2Code " + phone2Code);
  var args = {
    comp_name: customerData.registerDetails[0].company_name,
    regno: customerData.registerDetails[0].comp_roc_no,
    hbscode: '1',
    add1: customerData.address1,
    add2: customerData.address2,
    add3: customerData.address3,
    postcode: customerData.postCode,
    city: customerData.registerDetails[0].city_name,
    state_cd: customerData.registerDetails[0].state_id,
    foreign_state_desc: '',
    country_cd: customerData.registerDetails[0].country_id,
    phone1: '',
    phone1_cd: phone1Code,
    phone2_cd: phone2Code,
    phone2: '',
    fax: '',
    website: '',
    email: '',
    hpno: '',
    fax_cd: '',
    emplid: '3965',
    existing_custcode: '',
    comp_type: 'MC',
    contperson:
    {
      deptname: '',
      designation: '',
      email: '',
      emplid: '3965',
      existing_Crmid: '',
      ext1: '',
      ext2: '',
      faxno: '',
      hpno: '',
      icno: '',
      name: '',
      phone1: '',
      phone2: ''
    },
    company_cd: '2',
    govlvl1: '',
    govlvl2: '',
    govlvl3: '',
    gst_cd: '',
    gst_verified_dt: ''
  }

  console.log("reqcreateclient CRM_INte\n" + JSON.stringify(args))

  var obj = {};
  obj.request = args;
  obj.requestTime = moment(new Date).format('DD-MM-YYYY ');
  return new Promise((resolve, reject) => {
    soap.createClient(wsdlURL, { endpoint: url }, (err, client) => {
      client.insertCompany(args, (err, result, body) => {
        obj.response = result;
        obj.responseTime = moment(new Date).format('DD-MM-YYYY ');
        obj.serviceType = 'insertCompany';
        obj.serviceUrl = wsdlURL
        return resolve(obj)
      })
    });
  });
}



/*
exports.insertCompany= (customerData) =>{

  var args= {comp_name:customerData.company_name,
             regno:customerData.registerId,
             hbscode:'',
             add1:customerData.address1,
             add2:customerData.address2,
             add3:customerData.address3,
             postcode:customerData.postCode,
             city:customerData.registerDetails[0].city_name,
             state_cd:customerData.registerDetails[0].state_id,
             country_cd:customerData.registerDetails[0].country_id,
             phone1_cd:customerData.mobileno,
             phone1:'',
             phone2_cd:'',
             phone2:'',
             fax_cd:'',
             fax:'',
             website:'',
             email:'',
             hpno:'',
             comp_type:customerData.registerDetails[0].company_type,
             comp_cd:'',
             existing_custcode:'',
             govlvl1_cd:'',
             govlvl2_cd:'',
             govlvl3_cd:'',
             state_foreign_desc:'',
             emplid:'name',
             company_cd:'2',
             name:'',
             designation:''

          };
  //logger.info(args);
soap.createClient(wsdlURL, {endpoint: url}, function(error, client) {
  if (error) {
      console.error(error);
  } else {
      client.insertCompany(args, function(error, result) {
          if (error) {
              console.error(error);
              process.exit(1);
          }
        return result
      });
  }
})
} */



// Start Below services IGST Integration.

exports.getCompanyStructureDetails = (customerCode) => {
  var args = { custcode: customerCode };//08002896
  // logger.info("getCompanyStructure args "+JSON.stringify(args));
  var requestTime = new Date();
  var obj = {};
  obj.request = args;
  obj.requestTime = requestTime;
  logger.info(JSON.stringify(obj))
  return new Promise((resolve, reject) => {
    soap.createClient(wsdlURL, { endpoint: url }, (err, client) => {
      client.getCompanyStructure(args, (err, result, body) => {
        logger.info('\ngetCompanyStructureDetails SOPUI --> ' + JSON.stringify(result));
        obj.response = result;
        obj.responseTime = new Date();
        obj.serviceType = 'getCompanyStructure';
        obj.serviceUrl = wsdlURL
        return resolve(obj)
      })
    });
  });
}


exports.registerApplication = (request) => {
  var requestTime = new Date();
  var obj = {};
  obj.request = request;
  obj.requestTime = requestTime;
  logger.info('\n registerApplication SOPUI -->\n ' + JSON.stringify(obj));
  return new Promise((resolve, reject) => {
    soap.createClient(constants.iGSTwsdlURL, { endpoint: constants.iGSTURL }, (err, client) => {
      client.registerApplication(request, (err, result, body, statusCode) => {
        logger.info("statusCode registerApplicationDetaila " + statusCode)
        logger.info('\n registerApplication SOPUI Responce -->\n ' + JSON.stringify(result));
        logger.info('\n registerApplication SOPUI Responcebody -->\n ' + JSON.stringify(body));
        obj.response = result;
        obj.responseTime = new Date();
        obj.serviceType = 'registerApplication';
        obj.serviceUrl = wsdlURL
        return resolve(obj)
      })
    });
  });
}

exports.registerApplicationDetail = (request) => {
  var requestTime = new Date();
  var obj = {};
  obj.request = request;
  obj.requestTime = requestTime;
  logger.info('\n registerApplicationDetail SOPUI --> \n' + JSON.stringify(obj));
  return new Promise((resolve, reject) => {
    soap.createClient(constants.iGSTwsdlURL, { endpoint: constants.iGSTURL }, (err, client) => {
      client.registerApplicationDetail(request, (err, result, body) => {
        logger.info('\n registerApplicationDetail SOPUI Responce --> \n' + JSON.stringify(result));
        logger.info('\n registerApplicationDetail SOPUI Responcebody -->\n ' + JSON.stringify(body));
        obj.response = result;
        obj.responseTime = new Date();
        obj.serviceType = 'registerApplicationDetail';
        obj.serviceUrl = wsdlURL
        return resolve(obj)
      })
    });
  });
}


exports.confirmServiceDeliveryInclusiveTaxinvoice = (request) => {
  var requestTime = new Date();
  var obj = {};
  obj.request = request;
  obj.requestTime = requestTime;
  logger.info('\n confirmServiceDeliveryInclusiveTaxinvoice SOPUI -->\n ' + JSON.stringify(obj));
  return new Promise((resolve, reject) => {
    soap.createClient(constants.iGSTwsdlURL, { endpoint: constants.iGSTURL }, (err, client) => {
      client.confirmServiceDeliveryInclusiveTaxInvoice(request, (err, result, body) => {
        logger.info('\n confirmServiceDeliveryInclusiveTaxinvoice SOPUI Responce  -->\n ' + JSON.stringify(result));
        logger.info('\n confirmServiceDeliveryInclusiveTaxinvoice SOPUI Responcebody -->\n ' + JSON.stringify(body));
        obj.response = result;
        obj.responseTime = new Date();
        obj.serviceType = 'confirmServiceDeliveryInclusiveTaxinvoice';
        obj.serviceUrl = wsdlURL
        return resolve(obj)
      })
    });
  });
}


exports.GenerateCreditPayment = (request) => {
  var requestTime = new Date();
  var obj = {};
  obj.request = request;
  obj.requestTime = requestTime;
  logger.info('\n GenerateCreditPayment SOPUI -->\n ' + JSON.stringify(obj));
  return new Promise((resolve, reject) => {
    // soap.createClient(constants.iGSTwsdlURL, { endpoint: constants.iGSTURL }, (err, client) => {
    //   client.GenerateGeneralPaymentInfo(request, (err, result, body) => {
    soap.createClient(constants.iGSTwsdlURL, { endpoint: constants.iGSTURL }, (err, client) => {
      client.generateCreditPayment(request, (err, result, body) => {
        logger.info('\n GenerateCreditPayment SOPUI Responce-->\n ' + JSON.stringify(result));
        logger.info('\n GenerateCreditPayment SOPUI Responcebody -->\n ' + JSON.stringify(body));
        obj.response = result;
        obj.responseTime = new Date();
        obj.serviceType = 'GenerateCreditPayment';
        obj.serviceUrl = wsdlURL
        return resolve(obj)
      })
    });
  });
}

exports.GenerateGeneralPaymentInfo = (request) => {
  // var args = { custcode: customerCode };
  var requestTime = new Date();
  var obj = {};
  obj.request = request;
  obj.requestTime = requestTime;
  logger.info('\GenerateGeneralPaymentInfo SOPUI -->\n ' + JSON.stringify(obj));
  return new Promise((resolve, reject) => {
    soap.createClient(constants.iGSTwsdlURL, { endpoint: constants.iGSTURL }, (err, client) => {
      client.generateGeneralPaymentInfo(request, (err, result, body) => {
        logger.info('\n GenerateGeneralPaymentInfo SOPUI -->\n ' + JSON.stringify(result));
        logger.info('\n GenerateGeneralPaymentInfo SOPUI Responcebody -->\n ' + JSON.stringify(body));
        obj.response = result;
        obj.responseTime = new Date();
        obj.serviceType = 'GenerateGeneralPaymentInfo';
        obj.serviceUrl = wsdlURL
        return resolve(obj)
      })
    });
  });
}


exports.getReceiptAvailable = (request, userdata) => {
  console.log("getReceiptAvailablegetReceiptAvailable\n" + JSON.stringify(request))

  // var args = { custcode: userdata.custId };
  var requestTime = new Date();
  var obj = {};
  obj.request = request;
  obj.requestTime = requestTime;
  logger.info('\n getReceiptAvailable SOPUI -->\n ' + JSON.stringify(obj));
  return new Promise((resolve, reject) => {
    soap.createClient(constants.iGSTwsdlURL, { endpoint: constants.iGSTURL }, (err, client) => {
      client.getReceiptAvailable(request, (err, result, body) => {
        logger.info('\n getReceiptAvailable SOPUI Responce -->\n ' + JSON.stringify(obj));
        logger.info('\n getReceiptAvailable SOPUI Responcebody -->\n ' + JSON.stringify(body));
        obj.response = result;
        obj.responseTime = new Date();
        obj.serviceType = 'getReceiptAvailable';
        obj.serviceUrl = wsdlURL
        return resolve(obj)
      })
    });
  });
}



exports.confirmServiceDelivery = (request, customerId) => {
  // var args = { custcode: customerCode };
  var args = { custcode: customerId };
  var requestTime = new Date();
  var obj = {};
  obj.request = request;
  obj.requestTime = requestTime;
  logger.info('\n confirmServiceDelivery SOPUI -->\n ' + JSON.stringify(obj));
  return new Promise((resolve, reject) => {
    soap.createClient(constants.iGSTwsdlURL, { endpoint: constants.iGSTURL }, (err, client) => {
      client.confirmServiceDelivery(request, (err, result, body) => {
        logger.info('\n confirmServiceDelivery SOP UI Responce -->\n ' + JSON.stringify(result));
        logger.info('\n confirmServiceDelivery SOPUI Responcebody -->\n ' + JSON.stringify(body));
        obj.response = result;
        obj.responseTime = new Date();
        obj.serviceType = 'confirmServiceDelivery';
        obj.serviceUrl = wsdlURL
        return resolve(obj)
      })
    });
  });
}

// End Below services IGST Integration.