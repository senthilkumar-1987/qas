const mainDb = require('../MainDb');

exports.getProductCertification = (fileid) => {
    return new Promise((resolve, reject) => {
        let query = "EXEC getProductionCertification '" + fileid + "'";
        mainDb.GetQueryData(query, (error, data) => {
            if (error) {
                return reject(`${error}, ${query}`)
            }
            return resolve(data);
        })
    })
}
exports.getEngineeringInspection = (fileid) => {
    return new Promise((resolve, reject) => {
        let query = "EXEC getEngineeringInspection '" + fileid + "'";
        mainDb.GetQueryData(query, (error, data) => {
            if (error) {
                return reject(`${error}, ${query}`)
            }
            return resolve(data);
        })
    })
}
exports.getCBScheme = (fileid) => {
    return new Promise((resolve, reject) => {
        let query = "EXEC getCBScheme '" + fileid + "'";
        mainDb.GetQueryData(query, (error, data) => {
            if (error) {
                return reject(`${error}, ${query}`)
            }
            return resolve(data);
        })
    })
}
exports.getForeignInspection = (fileid) => {
    return new Promise((resolve, reject) => {
        let query = "EXEC getForeignInspection '" + fileid + "'";
        mainDb.GetQueryData(query, (error, data) => {
            if (error) {
                return reject(`${error}, ${query}`)
            }
            return resolve(data);
        })
    })
}
exports.getGreenEngine = (fileid) => {
    return new Promise((resolve, reject) => {
        let query = "EXEC getGreenEngine '" + fileid + "'";
        mainDb.GetQueryData(query, (error, data) => {
            if (error) {
                return reject(`${error}, ${query}`)
            }
            return resolve(data);
        })
    })
}
exports.getLicenseContact1 = (comptype, fileid) => {
    return new Promise((resolve, reject) => {
        let query = "EXEC getContact1 '" + fileid + "' , '" + comptype + "'";
        mainDb.GetQueryData(query, (error, data) => {
            if (error) {
                return reject(`${error}, ${query}`)
            }
            return resolve(data);
        })
    })
}

exports.getLicenseContact2 = (comptype, fileid) => {
    return new Promise((resolve, reject) => {
        let query = "EXEC getContact2 '" + fileid + "' , '" + comptype + "'";
        mainDb.GetQueryData(query, (error, data) => {
            if (error) {
                return reject(`${error}, ${query}`)
            }
            return resolve(data);
        })
    })
}