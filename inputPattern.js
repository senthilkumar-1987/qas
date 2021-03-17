exports.alphaNumeric = (e) => {

    var reg = /^[a-zA-Z0-9]+$/;

    console.log("" + reg.test(String.fromCharCode(e.which)));


    if (!reg.test(String.fromCharCode(e.which))) {
        e.preventDefault();
    }


    // if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
    //     e.preventDefault();
    //     return false;
    // }
    // return true;

}


exports.numberOnly = (e) => {

    var reg = /^[0-9]+$/;

    console.log("" + reg.test(String.fromCharCode(e.which)));

    if (!reg.test(String.fromCharCode(e.which))) {
        e.preventDefault();
    }

}

exports.numberOnlywithspecialchar = (e) => {

    var reg = /^[0-9-+]+$/;

    console.log("" + reg.test(String.fromCharCode(e.which)));

    if (!reg.test(String.fromCharCode(e.which))) {
        e.preventDefault();
    }

}


exports.specialcharNotAllowROcNo = (e) => {

    var reg = /^[a-zA-Z0-9-]+$/;

    console.log("" + reg.test(String.fromCharCode(e.which)));

    if (!reg.test(String.fromCharCode(e.which))) {
        e.preventDefault();
    }

}

exports.loginIdMailValidation = (emailToValidate) => {
    // const emailToValidate = 'a@a.com';
    const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    // var pattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/; 
    return emailRegexp.test(emailToValidate);
}


exports.password = (e) => {
    // var reg = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,8}$/;
    var reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
    //console.log("O--->" + e)
    console.log("regg--" + reg.test(e));

    return reg.test(e);

}

