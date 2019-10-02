const { testToken } = require('../etc/test-config')
const env           = require('../utils/envs')

const checkTestToken = token => env.PRODUCTION ? false : token === testToken

module.exports = {
  checkTestToken
}
