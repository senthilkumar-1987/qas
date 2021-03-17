let newCustomerRegistrationLogic = require('../../repositories/CustomersRepository/NewCustomerRegistrationLogic')
const Cryptr = require('../../config/encrypt.decrypt.service')

let confirmMail = async (req, res) => {

  try {

    console.log("/api/users/confirmMail")
    var originalEmail = Cryptr.decryptedText(req.query.msg);
    let mailConfirmDetails = await newCustomerRegistrationLogic.mailConfirmationValidation(originalEmail).catch((e) => {
      console.log(e);
    });

    // var action="mailverification"
    // let logEntry= await newCustomerRegistrationLogic.logAudit(mailConfirmDetails.registerId,originalEmail,action).catch((e) => {
    // });

    if (mailConfirmDetails.mailStatus == 'Regisiterd') {
      res.send('<h1>Thanks For Your Confirmation<h1>');
    }
    if (mailConfirmDetails.mailStatus == 'Already Done') {
      res.send('<h1>Already Done !!!<h1>');
    }
    //    res.json(mailConfirmDetails);
  }
  catch (err) {
    console.log(err);
    res.json({ error: err });
  }
}

module.exports = {
  confirmMail
}