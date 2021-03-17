var nodemailer = require('nodemailer');



var transporter = nodemailer.createTransport({

  //LOCAL ACCESS 
  // example with google mail service
  host: 'smtpout.secureserver.net',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: 'karthik.c@accordinnovations.com', // replace by your email to practice
    pass: 'Accord@123' // replace by your-password
  },

  tls: {
    rejectUnauthorized: false
}
  //SIRIM ACCESS
  // host: 'smtp.sirim.my',
  // port: 25,
  // secure: false, // true for 465, false for other ports
  // auth: {
  //   user: 'escistest@sirim.my', // replace by your email to practice
  //   pass: '123456' // replace by your-password
  // }

});

module.exports = transporter;