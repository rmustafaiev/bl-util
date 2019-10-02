'use strict'

const Request  = Backendless.Request
const user     = require('./user')
const tables   = require('./tables')
const security = require('./security')
const transfer = require('./transfer')
const files    = require('./files')
const config   = require('../../etc/config')

class Context {
  constructor(appId, apiKey, serverUrl) {
    this.appId = appId
    this.apiKey = apiKey
    this.serverUrl = serverUrl
  }

  setAuthKey(authKey) {
    this.authKey = authKey
  }

  buildUrl(path) {
    const { serverUrl, appId } = this

    const withoutApi = url => url.replace(/\.com(\/api)/, (match, p1) => match.replace(p1, ''))

    return (serverUrl && !path.startsWith(serverUrl))
      ? `${withoutApi(serverUrl)}/${appId}/console/${path}`
      : withoutApi(path)
  }

  createRequest(path, method, body) {
    return new Request(this.buildUrl(path), method, body)
      .set('auth-key', this.authKey)
  }
}

/**
 * @param {Context} context
 * @returns {Object}
 */
const contextifyRequest = context => {
  const result = {}

  Request.methods.forEach(method => {
    result[method] = (path, body) => context.createRequest(path, method, body)
  })

  return result
}

const createClient = (serverUrl, appId, apiKey) => {
  const context = new Context(appId, apiKey, serverUrl)
  const request = contextifyRequest(context)

  return {
    tables  : tables(request, context),
    user    : user(request, context),
    security: security(request, context),
    transfer: transfer(request, context),
    files   : files(request, context)
  }
}

const createConsoleClient = async () => {
  const { consoleUser = {} } = config.backendless

  const CONSOLE_USER_LOGIN = process.env.CONSOLE_USER_LOGIN || consoleUser.email
  const CONSOLE_USER_PASSWORD = process.env.CONSOLE_USER_PASSWORD || consoleUser.password

  const client = createClient(Backendless.serverURL, Backendless.applicationId, Backendless.secretKey)
  await client.user.login(CONSOLE_USER_LOGIN, CONSOLE_USER_PASSWORD)

  return client
}

let client

const getClient = () => {
  if (!client) {
    client = createConsoleClient()
  }

  return client
}

module.exports = {
  getClient
}
