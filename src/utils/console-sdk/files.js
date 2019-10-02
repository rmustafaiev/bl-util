'use strict'

/**
 * @param {Request} req
 * @param {Context} context
 * @returns {Object}
 */
module.exports = (req, context) => ({ // eslint-disable-line
  fileExists(filePath) {
    return req.get(`files/files/exists/${filePath}`)
  },

  createFile(filePath, fileContent) {
    return req
      .post(`files/create/${filePath}/`, { file: fileContent })
      .set('Accept', '*/*')
  },

  editFile(filePath, fileContent) {
    return req.post(`files/edit/${filePath}/`, { file: fileContent })
  },

  deleteFile(filePath) {
    return req.delete(`files/${filePath}/`)
  }
})