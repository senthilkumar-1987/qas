module.exports = {
  MSG_STATUS_OPEN: 'OPEN',
  // MAIL_NOTIFICATION_FORGET_PASSWORD: 'Dear  {contactName1} <BR><BR><BR>  Please Use Below Credentials for Login SIRIM QAS International Sdn Bhd.<br>Below is your login credential :<br><br>Name :{contactName1}<br>Username : {userName1}<br>New Temporary Password:{passwords}<br><br><br><br><br>Yours sincerely,<br>{CPANAME}, <br>{CPAMAIL} <br> Please proceed  https://pcid-uat.sirim.my/  <br>Note: This is a system generated email. Please do not reply to this email. ',
  MAIL_NOTIFICATION_FORGET_PASSWORD: 'Dear  {contactName1} <BR><BR><BR>  Please Use Below Credentials for Login SIRIM QAS International Sdn Bhd.<br><BR>Below is your login credential :<br>Username : {userName1}<br>New Temporary Password:{passwords}<br><br>Please proceed  https://pcid-uat.sirim.my:80/<br><br><br>Yours sincerely,<br>{CPANAME}, <br>{CPAMAIL} <br>   <br><br>Note: This is a system generated email. Please do not reply to this email. ',
  MAIL_NOTIFICATION_EXS_CUSTOM_APPR_INFO: 'Dear {contactName1} <BR><BR><BR>Your company registration is approved by SIRIM QAS International Sdn Bhd.<br>Below is your login credential :<br><br>Name :{contactName1}<br>Username : {userName1}<br>New Temporary Password:{password1}<br><br><br><br><br>Yours sincerely,<br>{CPANAME}, <br>{CPAMAIL} <br> Please proceed  https://pcid-uat.sirim.my:80/  <br><br>Note: This is a system generated email. Please do not reply to this email. ',
  MAIL_NOTIFICATION_CPA_CUSTOM_APPR_INFO: 'Dear,<BR><BR><BR>Below is your login credential :<br><br>Name :{contactNames}<br>Username : {userNames}<br>New Temporary Password:{passwords}<br><br><br><br><br>Yours sincerely,<br>{CPANAME}, <br>{CPAMAIL}​ <br><br>Note: This is a system generated email. Please do not reply to this email. ',
  MAIL_NOTIFICATION_CUSTOM_APPR_INFO: 'Dear {contactName1} ,<BR><BR><BR>Your company registration is approved by SIRIM QAS International Sdn Bhd.<br>Below is your login credential :<br><br>Name :{contactName1}<br>Username : {userName1}<br>New Temporary Password:{password1}<br><br>Please proceed <br>https://pcid-uat.sirim.my/<br><br><br><br>Yours sincerely,<br>{CPANAME}, <br> {CPAMAIL} <br><br>Note: This is a system generated email. Please do not reply to this email. ',
  MAIL_NOTIFICATION_CUSTOM_REJECT_INFO: 'Dear {contactName}<BR><BR><BR>Your company registration is rejected by SIRIM QAS International Sdn Bhd.<br>Reason: {Reason}<br><br>However, should you have questions, Please contact the following officer for further clarification.<br>Name: {CPANAME}<br>Email: {CPAMAIL} <br>SIRIM QAS International Sdn Bhd<br><br>Yours sincerely,<br>{CPANAME}<br><br>Note: This is a system generated email. Please do not reply to this email.',
  MAIL_NOTIFICATION_CPA_REJECT_INFO: 'Dear,<BR><BR><BR>{companyName} company registration is rejected by SIRIM QAS International Sdn Bhd.<br>Reason:{Reason} . <br>Yours sincerely,',
  MAIL_CONFIRMATION_URL: '/api/users/confirmMail?msg={encryptedData}',
  MAIL_CONFIRMATION_TEXT: 'Dear {USER_NAME},<br></br></b></br><br>Your application has been submitted successfully.<br><br><br> <a href={MAIL_LINK} ><p>Please click here to verify your email</p></a> <br><br><br>Yours sincerely,<br>SIRIM QAS International Sdn Bhd <br><br>Note: This is a system generated email. Please do not reply to this email.',
  MAIL_NOTIFICATION_CUSTOM_INFO: 'Dear {USER_NAME},<br></br></b></br>Company:{COMPANY_NAME} has submitted a new registration from the eSCIS Customer Portal.<br><br><br>Login to https://pcid-uat.sirim.my:80/ to view and verify the registration form.<br><br>Note: This is a system generated email. Please do not reply to this email. ',

  // MAIL_NOTIFICATION_CUSTOM_INFO: 'Dear {USER_NAME},<br></br></b></br>Company:{COMPANY_NAME} has submitted a new registration from the eSCIS Customer Portal.<br><br><br>Login to https://pcid-uat.sirim.my/ to view and verify the registration form.<br><br>Note: This is a system generated email. Please do not reply to this email. ',

  CUSTOMER_CREDENTIALS_TEXT: '<h1>Dear contact:, {USER_NAME}</h1><br><p>Please Use Below Credentials for Login</p><p>UserName:<b>{USER_NAME}</b></p><br><p>Password:<b>{PASSWORD}</b></p>',
  // CUSTOMER_FIRST_TEXT_BAD_DEBT:'Dear {CUSTOMERNAME},</br></b></br>Please Find Enclosed here with the List of invoice(s) has been oustanding appreciate very <br>much if you could look into this matter and arrange for prompt payment upon <br>receiving our letter <br></br><br></br>Thanks,</br>SIRIM QAS International Sdn Bhd<br><br>Note: This is a system generated email. Please do not reply to this email.',
  //CUSTOMER_FIRST_TEXT_BAD_DEBT: 'Dear {CUSTOMERNAME},<br></br><br></br>Please Find Enclosed here with the List of invoice(s) has been overdue appreciate very <br></br>much if you could look into this matter and arrange for prompt payment upon <br></br>receiving our letter <br></br><br></br>Thanks,<br></br>SIRIM QAS International<br></br><br></br>Note: This is a system generated email. Please do not reply to this email.',
  CUSTOMER_FIRST_TEXT_BAD_DEBT: 'Dear {CUSTOMERNAME},<br></br><br></br>Please find enclosed here with the List of invoice(s) has been overdue appreciate very <br></br>much if you could look into this matter and arrange for prompt payment upon <br></br>receiving our letter <br></br><br></br>Thank you,<br></br>SIRIM QAS International<br></br><br></br>Note: This is a system generated email. Please do not reply to this email.',

  CUSTOMER_FIRST_TEXT_LOD: 'Dear {CUSTOMERNAME},<br></br><br></br>Please find enclosed herewith the Letter of Demand for your action. <br></br><br></br>Thank you,<br></br>SIRIM QAS International<br></br><br></br>Note: This is a system generated email. Please do not reply to this email.',

  CUSTOMER_FIRST_TEXT_DEBT: 'Dear All,<br></br><br></br>Please find enclosed herewith the List of Debt Collector for your action. <br></br><br></br>Thank you,<br></br>SIRIM QAS International<br></br><br></br>Note: This is a system generated email. Please do not reply to this email.',

  SERVICE_URL_ROOT: 'https://pcid-uat.sirim.my:80',
  SERVICE_URL_ROOT_BACKEND: 'https://pcid-uat.sirim.my',
  MSG_STATUS_RESOLVE: 'RESOLVE',
  MSG_STATUS_CLOSE: 'CLOSE',
  ENQUIRY_REQUEST_SUCCESS: 'Request Raised Successfully!!!...',
  ENQUIRY_REQUEST_FAIL: 'Request Raised Fail!... Contact to Administrator...',
  ENQUIRY_REPLY_SUCCESS: 'Replied Successfully!!!...',
  ENQUIRY_REPLY_FAIL: 'Replied Fail..!!!!',
  ENQUIRY_CLOSE_SUCCESS: 'Enquiry Successfully!!!...',
  ENQUIRY_CLOSE_FAIL: 'Enquiry Close is Fail..!! Contact to Administrator...',
  ENQUIRY_SUCCESS: 'Successfully!...',
  STATUS_SUCCESS: "SUCCESS",
  STATUS_FAIL: "FAIL",
  CPA_MAIL_ID: 'dinesh.n@fasoftwares.com',

  STATUS_FPX_ZERO: 00,
  STATUS_ZERO: 0,
  STATUS_ONE: 1,
  STATUS_TWO: 2,
  STATUS_THREE: 3,
  STATUS_FOUR: 4,
  STATUS_FIVE: 5,
  STATUS_SIX: 6,
  STATUS_SEVEN: 7,

  //PDF Header Constands. Do not delete this.
  LINE_HEADER_1: 'SIRIM QAS INTERNATIONAL SDN. BHD. (410334-X)',
  LINE_HEADER_2: 'Building 8, SIRIM Complex,',
  LINE_HEADER_3: '1, Persiaran Dato Menteri, Section 2,',
  LINE_HEADER_4: '40700, Shah Alam, Selangor Darul Ehsan',
  LINE_HEADER_5: 'Tel: 603-55446400 Fax: 603-55446810',
  LINE_HEADER_6: 'www.sirim-qas.com.my',
  COMPANY_NAME: 'SIRIM QAS International Sdn Bhd',
  // From_Mail: 'karthik.c@accordinnovations.com',
  From_Mail: 'escistest@sirim.my',

  credit_Note_Text: '<h3>Dear All,</h3><br><p>Please Find Below Attachment</p><br></p><br><p>Thanks,<br><b>eSCIS Customer Portal</b></p>',


  No: "No",
  Yes: "Yes",
  EnableIGST: "Yes"

};

