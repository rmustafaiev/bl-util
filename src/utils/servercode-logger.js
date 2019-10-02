'use strict'

const { URLSearchParams }             = require('url')
const { includesIgnoreCase }          = require('./array')
const { notEmptyString }              = require('./string')
const { maskField, maskObjectFields } = require('./mask')
const crypto                          = require('crypto')
const { serverUrl: muleServerUrl }    = require('../etc/config').mule

const HIDE_MANDATORY = [ 'password', 'login' ]

const {
        showRequestPayload,
        showBackendlessResponsePayload,
        showMuleResponsePayload,
        showResponseStatus,
        maskPayloadNPI,
        maskFields: confMaskFields
      } = require('../etc/logging')

const parseBody = res => {
  try {
    return JSON.parse(res.body)
  } catch (e) {
    return res.body
  }
}

const maskFields = confMaskFields.concat(HIDE_MANDATORY)

const responseError = response => {
  return response && (response instanceof Error || response.status < 200 || response.status >= 300)
}

const getResponseData = response => response && parseBody(response) || null

const checkPayloadNPIAndMask = data => {
  if (!maskPayloadNPI) {
    return data
  }

  return maskObjectFields(data, maskFields)
}

const wrapResponseData = (label, data) => {
  const isMuleResp = label && label.indexOf(muleServerUrl) !== -1
  const wrapResp   = checkPayloadNPIAndMask(data)

  if (showMuleResponsePayload && isMuleResp) {
    return wrapResp
  }

  if (showBackendlessResponsePayload && data) {
    return wrapResp
  }

  return Array.isArray(data) ? data.length : 1
}

const requestTiming = label => {
  const time = process.hrtime()

  return data => {
    const duration  = process.hrtime(time)
    const ms        = duration[0] * 1000 + duration[1] / 1e6
    const status    = showResponseStatus ? ` STATUS: ${data.status} ` : ' '
    const error     = responseError(data) ? '(Error)' : ''
    const respData  = getResponseData(data)
    const traceResp = wrapResponseData(label, respData)

    console.log(
      '%s (%s): %sms',
      label,
      status,
      error || `Data: [${traceResp ? 'Ok' : 'No data'}], took: `,
      ms.toFixed(3)
    )

    if (!error && isNaN(parseInt(traceResp))) {
      console.log('------- response payload: ------------------------------')
      console.log(traceResp)
      console.log('--------------------------------------------------------')
    }
    return data
  }
}

const maskUrlParams = url => {
  url = decodeURIComponent(url)

  if (!maskPayloadNPI) {
    return url
  }

  const [ uri, params ]  = url.split('?')
  const queryParams      = new URLSearchParams(params)
  const arrIncludesField = includesIgnoreCase(maskFields)

  if (!params || !queryParams) {
    return uri
  }

  const maskedParams = Array.from(queryParams.entries())
    .reduce((str, entry) => {
      const [ param, val ] = entry
      str += !str ? '?' : '&'
      str += `${param}=${arrIncludesField(param) ? maskField(param, val) : val}`

      return str
    }, '')

  return uri && `${uri}${maskedParams}`
}

const createLabel = (method, uid, url, isReg = true) =>
  `${method}:[${uid}] ${isReg ? ' >> ' : ' << '} ${maskUrlParams(url)}`

const showRequest = (method, uid, url, body) => {

  const label = createLabel(method, uid, url, true)

  body = notEmptyString(body) ? parseBody({ body }) : body

  const data = body && checkPayloadNPIAndMask(body) || ''

  console.log(label, data)
}

/**
 * Patch Bakendless.Request to print every request fields, its execution timing and count of rows in response
 */
Backendless.Request.send = (send => (path, method, headers, body, encoding) => {
  let url = path

  const loggingCall = require('url').parse(path).path.endsWith('/log')
  const publishCall = require('url').parse(path).path.endsWith('/servercode/publishcode/JS')
  const uid         = crypto.randomBytes(6).toString('hex').toUpperCase()

  if (loggingCall || publishCall) {
    return send(path, method, headers, body, encoding)
  }

  if (url.startsWith(Backendless.appPath)) {
    url = url.substr(Backendless.appPath.length)
  }

  if (!showRequestPayload) {
    showRequest(method, uid, url, body)
  }

  const timing = requestTiming(createLabel(method, uid, url, false))

  return send(path, method, headers, body, encoding)
    .then(result => timing(result))
    .catch(error => Promise.reject(timing(error)))
})(Backendless.Request.send)