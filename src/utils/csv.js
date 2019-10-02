'use strict'

const csv = require('fast-csv')

/**
 * Returns CSV string from the object/array given
 * @param dataObj
 * @param transformFn
 * @return {Promise<String>}
 */
const objectToString = (dataObj, transformFn) => {
  return new Promise((resolve, reject) => {
    const options = {
      headers     : true,
      quoteHeaders: true
    }

    if (transformFn) {
      options.transform = transformFn
    }

    csv.writeToString(dataObj, options, (err, data) => {
      if (data) {
        resolve(data)
      }
      if (err) {
        reject(err)
      }
    })
  })
}

module.exports = { objectToString }