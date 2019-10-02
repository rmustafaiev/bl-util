'use strict'

const config  = require('../etc/config')

const { notEmptyString } = require('../utils/string')

const AndroidUser = 'AndroidUser'
const IOSUser     = 'IOSUser'
const RestUser    = 'RestUser'

const SECURITY_ROLE = { AndroidUser, IOSUser, RestUser }

const DEVICE_TYPE = {
  ANDROID: 'ANDROID',
  BL     : 'BL', // -business logic, server code
  IOS    : 'IOS',
  JS     : 'JS',
  REST   : 'REST',
  WP     : 'WP' // -windows phone
}

const ApiKeys = {
  [AndroidUser]: config.BACKENDLESS_ANDROID_API_KEY,
  [IOSUser]    : config.BACKENDLESS_IOS_API_KEY,
  [RestUser]   : config.BACKENDLESS_REST_API_KEY
}

const serviceContext = {
  init(context) {
    this.context = context
  },

  /**
   * Returns the only User role assigned among the roles and by device type
   * @return {string} user role 'IOSUser' | 'AndroidUser' | 'RestUser'
   */
  pickBuildInUserRole() {
    const { deviceType, userRoles } = this.context

    switch (deviceType) {
      case DEVICE_TYPE.IOS:
        return userRoles.includes(IOSUser) && IOSUser

      case DEVICE_TYPE.ANDROID:
        return userRoles.includes(AndroidUser) && AndroidUser

      case DEVICE_TYPE.REST:
        return userRoles.includes(RestUser) && RestUser
    }
  },

  _getApiAccessKey() {
    const userRole = this.pickBuildInUserRole()

    return ApiKeys[userRole]
  },

  /**
   * Returns device (api key) URL based on context
   * Check whether User role presence otherwise null will be as a result
   * @returns {string}
   */
  getAPIAccessBaseURL() {
    const apiKey = this._getApiAccessKey()

    return apiKey ? `${config.BACKENDLESS_SERVER_URL}/${Backendless.applicationId}/${apiKey}` : null
  },

  getLang() {
    const lang = this.context && this.context.httpHeaders && this.context.httpHeaders['x-app-lang']

    return notEmptyString(lang) && (lang.toLowerCase() === 'ar' ? 'ar' : 'en') || 'en'
  },

  DEVICE_TYPE,
  SECURITY_ROLE
}

module.exports = serviceContext
