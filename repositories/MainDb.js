const sql = require("mssql");
const config = require('../db');
const db = new sql.ConnectionPool(config).connect();


exports.executeQuery = async (query) => {
    return new Promise((resolve, reject) => {
        db.then(pool => {
            return pool.query(query)
        }).then(result => {
            data = result.recordset;
            // console.log("Execute query => \n" + JSON.stringify(result))
            return resolve(data)
        }).catch(err => {
            return reject(err)
        })

    })

}


exports.executeUpdateQuery = async (query) => {
    return new Promise((resolve, reject) => {
        db.then(pool => {
            return pool.query(query)
        }).then(result => {
            data = result.rowsAffected;
            // console.log("Execute query => \n" + JSON.stringify(result))
            return resolve(data)
        }).catch(err => {
            return reject(err)
        })

    })

}

exports.GetQueryData = (query, callback) => {

    db.then(pool => {
        return pool.query(query)
    }).then(result => {
        data = result.recordset;

        // console.log('GetQueryData--> '+JSON.stringify(result));

        if (!Array.isArray(data) || !data.length) {
            return callback(undefined, null);
        }
        else {
            return callback(undefined, data);
        }
    }).catch(err => {
        console.log('failed' + err);
        return callback(`${err}`, err);
    })
}

exports.InsertUpdateDeleteData = (query, callback) => {
    // console.log("InsertUpdateDeleteData ==> " + query);
    db.then(pool => {
        return pool.query(query)
    }).then(result => {
        data = result.rowsAffected;
        // console.log("result " + JSON.stringify(result))
        if (!Array.isArray(data) || !data.length) {
            return callback(undefined, null);
        }
        else {
            return callback(undefined, data[0]);
        }
    }).catch(err => {
        console.log(err);
        return callback(`${err}`, err);
    })
}


exports.InsertandReturnId = (query, callback) => {
    db.then(pool => {
        return pool.query(query)
    }).then(result => {
        // data = result;
        // console.log("result1 " + JSON.stringify(result))
        return callback(undefined, result);
        // if (!Array.isArray(data) || !data.length) {
        //     console.log("data if "+JSON.stringify(data))
        //     return callback(undefined, data);
        // }
        // else {
        //     console.log("data else "+JSON.stringify(data))
        //     return callback(undefined, data);
        // }
    }).catch(err => {
        console.log(err);
        return callback(`${err}`, err);
    })
}

// exports.onlinePaymentInsertFunction = (query) => {
//     return new Promise((resolve, reject) => {
//         InsertUpdateDeleteData(query, (error, data) => {
//             if (error) {
//                 return reject(`${error}, ${query}`);
//             }
//             return resolve(data);
//         });
//     })
// }




// To insert a new row and return the ID
function execInsertandReturnID(query, callback) {
    db.then(pool => {
        return pool.query(query)
    }).then(result => {
        data = result.recordset;
        // console.log("result ==> \n" + JSON.stringify(result))
        if (!Array.isArray(data) || !data.length) {
            return callback(undefined, null);
        } else {
            return callback(undefined, data[0]);
        }
    }).catch(err => {
        return callback(err, undefined);
    })
}

// To insert a new row and return the ID
exports.InsertandReturnID = async (query) => {
    return new Promise((resolve, reject) => {
        execInsertandReturnID(query, (error, data) => {
            if (error) {
                return reject(`${error}, ${query}`);
            }
            return resolve(data);
        });
    })
}

exports.Insert_Return_id = (query) => {
    console.log(query);
    return new Promise((resolve, reject) => {

        execInsertandReturnID(query, (error, data) => {
            if (error) {
                return reject(`${error}, ${query}`);
            }
            return resolve(data);
        });
    })
}


exports.InsertReturnOrderId = (query) => {
    //console.log(query);
    return new Promise((resolve, reject) => {

        execInsertandReturnID(query, (error, data) => {
            if (error) {
                return reject(`${error}, ${query}`);
            }


            return resolve(data);
        });
    })
}

exports.Insert_Return_addrId = (query) => {
    //console.log(query);
    return new Promise((resolve, reject) => {

        execInsertandReturnID(query, (error, data) => {
            if (error) {
                return reject(`${error}, ${query}`);
            }


            return resolve(data.AddrId);
        });
    })
}


// To insert a new multiplerow and return the ID
exports.InsertmultipleandReturnID = (query, params) => {
    return new Promise((resolve, reject) => {
        execInsertandReturnID(query, [params], (error, data) => {
            if (error) {
                return reject(`${error}, ${query}`);
            }
            console.log("details---------------->" + JSON.stringify(data), [params])
            return resolve(data);
        });
    })
}

exports.excuteSelectQuery = (query) => {
    return new Promise((resolve, reject) => {
        GetQueryDataExecution(query, (error, data) => {
            if (error) {
                return reject(`${error}, ${query}`);
            }
            // console.log("excuteSelectQuery\n" + JSON.stringify(data))
            return resolve(data);
        });
    })
}

function GetQueryDataExecution(query, callback) {

    // console.log('GetQueryDataExecution--> '+query);
    db.then(pool => {
        return pool.query(query)
    }).then(result => {
        // console.log("GetQueryDataExecution\n" + JSON.stringify(data))

        data = result.recordset;

        if (!Array.isArray(data) || !data.length) {
            return callback(undefined, null);
        }
        else {
            return callback(undefined, data);
        }
    }).catch(err => {
        console.log('failed');
        return callback(`${err}`, undefined);
    })
}


exports.GetQueryDataSelectMessages = (query, callback) => {

    db.then(pool => {
        return pool.query(query)
    }).then(result => {
        data = result.recordset;

        // console.log('GetQueryData--> '+JSON.stringify(result));

        if (!Array.isArray(data) || !data.length) {
            return callback(undefined, null);
        }
        else {
            return callback(undefined, data);
        }
    }).catch(err => {
        console.log('failed' + err);
        return callback(`${err}`, err);
    })
}