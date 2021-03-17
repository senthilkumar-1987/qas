exports.convertArrayToQuteString = async (val) => {

    val.forEach((element, index) => {
        console.log("elementelement\n" + element)
        val[index] = element.trim().replace(/'/g, "''");

        if (element === '<Empty>') {
            val[index] = null
        }


    });

    return "'" + val.join("','") + "'";


}