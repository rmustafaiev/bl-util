'use strict'

const { ENVIRONMENT } = require('../etc/config')

module.exports = {
  PRODUCTION : ENVIRONMENT === 'PRODUCTION',
  DEVELOPMENT: ENVIRONMENT === 'DEVELOPMENT'
}
