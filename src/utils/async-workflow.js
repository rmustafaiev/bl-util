'use strict'

const assert          = require('assert')
const { backendless } = require('../etc/config')
const { deepClone }   = require('../utils/object')
                        require('../utils/servercode-logger')

const EVENT_NAME = 'runAsyncWorkflow'

function getBLEventURL(event) {
  const { serverURL, applicationId } = Backendless

  return `${serverURL}/${applicationId}/${backendless.restApiKey}/servercode/events/${event}`
}

Backendless.ServerCode.customEvent(EVENT_NAME, async req => {
  const { path, args } = req.args

  assert(path, 'path argument is missing')

  const workflow = require('../workflows/' + path)

  await workflow(...args)
}, true)

const invokeEvent = (event, args) => Backendless.Request
  .post(getBLEventURL(event))
  .type('application/json')
  .send(deepClone(args))

const runAsyncWorkflow = (path, args) => invokeEvent(EVENT_NAME, { path, args })

module.exports = runAsyncWorkflow
