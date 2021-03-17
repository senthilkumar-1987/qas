'use strict'
const mainDb = require('../MainDb');
const Cryptr = require('../../config/encrypt.decrypt.service');
const logger = require('../../logger')
var constants = require('../../config/Constants');


exports.Insert_New_ParamType = async (SaveparamType) => {

    let query = `INSERT INTO TBL_SIRIM_Config (param_type,prefix,lastusedno,is_Latest,created_date)
    VALUES('${SaveparamType.paramtype}','${SaveparamType.prefix}','${SaveparamType.lastusedno}', '1','${SaveparamType.createdDate}' )`
    // console.log(query)
    return new Promise((resolve, reject) => {
        mainDb.InsertUpdateDeleteData(query, (error, data) => {
            if (error) {
                console.log("error" + error)
                return reject(`${error}, ${query}`)
            }
            return resolve(data);
        })
    });
}

exports.INSERT_MAINTAINANCE_LOGIC = async (SaveparamType) => {
    let query = `INSERT INTO TBL_SIRIM_Config (param_type,prefix,lastusedno,is_Latest)
   VALUES('${SaveparamType.paramtype}','${SaveparamType.prefix}','${SaveparamType.lastusedno}', '${SaveparamType.islatest}' )`

}



exports.SaveRemainder = async (data) => {

    console.log(JSON.stringify(data))


    logger.info("SaveRemainder Started")

    return new Promise((resolve, reject) => {
        let query;
        query = `UPDATE tbl_sirim_bad_dept_reminder_settings  SET Period = '${data.days}' where Reminder='${data.Reminder}'`

        console.log(query)

        mainDb.InsertUpdateDeleteData(query, (error, data) => {
            if (error) {
                return reject(`${error}, ${query}`)
            }

            logger.info("SaveRemainder Ended")
            return resolve(data)
        })

    })


}






exports.FindExistingRecord = async (paramType) => {
    return new Promise((resolve, reject) => {
        let query = `select * from tbl_sirim_config where param_type='${paramType}' AND is_Latest=1 `
        mainDb.GetQueryData(query, (error, data) => {
            if (error) {
                return reject(`${error}, ${query}`)
            }
            return resolve(data)
        })
    })
}


exports.updateMaintanceRecords = async (SaveparamType) => {

    let query = `UPDATE tbl_sirim_config SET is_Latest=0 WHERE  param_type='${SaveparamType.paramtype}' AND is_Latest=1 `
    // console.log(query)
    return new Promise((resolve, reject) => {
        mainDb.InsertUpdateDeleteData(query, (error, data) => {
            if (error) {
                console.log("error" + error)
                return reject(`${error}, ${query}`)
            }
            return resolve(data);
        })
    });

}


exports.LoadParamType = async () => {
    return new Promise((resolve, reject) => {
        let query = `select * from tbl_sirim_config where is_Latest =1`
        mainDb.GetQueryData(query, (error, data) => {
            if (error) {
                return reject(`${error}, ${query}`)
            }
            return resolve(data)
        })
    })
}