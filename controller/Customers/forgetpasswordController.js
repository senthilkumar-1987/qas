let forgotpasswordLogic = require('../../repositories/CustomersRepository/forgetPasswordLogic');
let responseDto = require('../../config/ResponseDto')
let constants = require('./../../config/Constants')


let foregetpassword = async (req, res) => {
    var responseobj = {};
    try {
        //console.log(req.body.logincredentials)


        let userDetails = await forgotpasswordLogic.USER_VALIDATION(req.body.logincredentials.mail)
        console.log("userDetails" + JSON.stringify(userDetails))

        if (userDetails && userDetails !== null && userDetails.length > 0) {
            console.log("inside if")
            if (userDetails[0].secret_answer === req.body.logincredentials.secretAnswer.trim()) {

                let data = forgotpasswordLogic.Generate_password(req.body.logincredentials.mail)

                return res.json(new responseDto(constants.STATUS_SUCCESS, '', 'Password reset and sent to your email.'))
                //responseobj.message = 'valid'
            } else {
                // responseobj.message = 'invalid'

                return res.json(new responseDto(constants.STATUS_FAIL, '', 'Incorrect Answer...'))
            }

        } else {
            console.log("else")

            return res.json(new responseDto(constants.STATUS_FAIL, '', 'User Name Not Found'))

            // responseobj.message = 'User Name Not Found'

        }


    } catch (err) {
        //responseobj.message = 'invalid'
        // responseobj.err = err;
        console.log(err);
        // res.json({ responseobj });

        return res.json(new responseDto(constants.STATUS_FAIL, err, 'Something Went Wrong !'))
    }
}

module.exports = {
    foregetpassword
}
