exports.convertArrayToQuteString = async (val) => {


    return "'" + val.join("','") + "'";


}