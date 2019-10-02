'use strict'

/**
 * @param {Request} req
 * @param {Context} context
 * @returns {Object}
 */
module.exports = (req, context) => ({
  /**
   * @param {String} login
   * @param {String} password
   * @returns {Promise.<{name:String, email:String, authKey:String}>}
   */
  login(login, password) {
    return req.post(`${context.serverUrl}/console/home/login`)
      .unwrapBody(false)
      .send({ login, password })
      .then(res => {
        const authKey = res.headers['auth-key']

        context.setAuthKey(authKey)

        return { name: res.body.name, email: res.body.email, authKey }
      })
  },

  logout() {
    return req.delete(`${context.serverUrl}/console/home/logout`).then(() => {
      context.setAuthKey(null)
    })
  }

})
