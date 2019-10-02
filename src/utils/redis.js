'use strict'

const { URL } = require('url')
const Redis   = require('./redis-client')
const env     = require('../utils/envs')

const { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD } = require('../etc/config')

let options

if (env.PRODUCTION) {
  const sessionsURL = `rediss://:${REDIS_PASSWORD}@${REDIS_HOST}:${REDIS_PORT}`

  options = {
    url: sessionsURL,
    tls: {
      servername: new URL(sessionsURL).hostname
    }
  }
} else {
  options = {
    host    : REDIS_HOST,
    port    : REDIS_PORT,
    password: REDIS_PASSWORD
  }
}

module.exports = new Redis(options)
