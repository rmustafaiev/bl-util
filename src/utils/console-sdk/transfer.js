'use strict'

/**
 * @param {Request} req
 * @param {Context} context
 * @returns {Object}
 */
module.exports = (req, context) => ({//eslint-disable-line
  /**
   *
   * @param {Stream} file
   * @returns {Promise|*}
   */
  importData(file) {
    return req.post('import/data/step1').form({ file })
      .then(data => req.post('import/data/step2', data))
  }
})