module.exports = {
  URL: 'http://prehnite.sirim.my/crm_ws_v1/services/Crm_ws',
  wsdlURL: 'http://prehnite.sirim.my/crm_ws_v1/services/Crm_ws?wsdl',

  //IGST INTEGRATION URLS
  iGSTURL: 'http://kunzite.sirim.my/ws_dev/services/Integration',
  iGSTwsdlURL:'http://kunzite.sirim.my/ws_dev/services/Integration?wsdl',


  REGISTERAPPLICATION_FORMAT_TEXT:'<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ws="http://ws.integration" xmlns:xsd="http://ws.integration/xsd"><soapenv:Header/><soapenv:Body><ws:registerApplication><ws:app><xsd:applicationDescription>{applicationDescription}</xsd:applicationDescription><xsd:applicationMode>{applicationMode}</xsd:applicationMode><xsd:billingaddress1>{billingaddress1}</xsd:billingaddress1><xsd:billingaddress2>{billingaddress2}</xsd:billingaddress2><xsd:billingaddress3>{billingaddress3}</xsd:billingaddress3><xsd:city>{city}</xsd:city><xsd:company>{company}</xsd:company><xsd:country>{country}</xsd:country><xsd:creditterm>{creditterm}</xsd:creditterm><xsd:crmID>{crmID}</xsd:crmID><xsd:currency>{currency}</xsd:currency><xsd:customerID>{customerID}</xsd:customerID><xsd:customerName>{customerName}</xsd:customerName><xsd:customerType>{customerType}</xsd:customerType><xsd:email>{email}</xsd:email><xsd:fileNo>{fileNo}</xsd:fileNo><xsd:foriegntotalAmount>{foriegntotalAmount}</xsd:foriegntotalAmount><xsd:foriegntotalDiscount>{foriegntotalDiscount}</xsd:foriegntotalDiscount><xsd:foriegntotalGST>{foriegntotalGST}</xsd:foriegntotalGST><xsd:gstid>{gstid}</xsd:gstid><xsd:postcode>{postcode}</xsd:postcode><xsd:referenceNo>{referenceNo}</xsd:referenceNo><xsd:scopeofService>{scopeofService}</xsd:scopeofService><xsd:sectionCode>{sectionCode}</xsd:sectionCode><xsd:siteID>{siteID}</xsd:siteID><xsd:state>{state}</xsd:state><xsd:totalAmount>{totalAmount}</xsd:totalAmount><xsd:totalDiscount>{totalDiscount}</xsd:totalDiscount><xsd:totalGST>{totalGST}</xsd:totalGST><xsd:username>{username}</xsd:username></ws:app></ws:registerApplication></soapenv:Body></soapenv:Envelope>',


};