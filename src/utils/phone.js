'use strict'

const { parseNumber }        = require('libphonenumber-js')
const { getDigits }          = require('./string')
const { BusinessLogicError } = require('../utils/custom-error')

const LOCAL_PREFIXES  = [ '79', '079', '77', '077', '78', '078' ]
const DEFAULT_JO_CODE = '962'
const NO_NUMBER       = 'Number can not be empty'

const checkLocalNumber = number => {
  for (let i = 0; i < LOCAL_PREFIXES.length; i++) {
    const phoneLength        = getDigits(number).length
    const localPrefix        = LOCAL_PREFIXES[i]
    const localPrefixLength  = localPrefix.length
    const isValidJordanPhone =
            (localPrefixLength === 2 && phoneLength === 9) || (localPrefixLength === 3 && phoneLength === 10)

    if (number.startsWith(localPrefix) && isValidJordanPhone) {
      return true
    }
  }

  return false
}

const getJOLocalPhoneNumber = number => {
  if (!number) {
    return null
  }

  let parsedNumber = number.replace(/[^0-9]/g,'')
  parsedNumber     = parsedNumber.replace(/^0+/, '')

  if (parsedNumber.startsWith(DEFAULT_JO_CODE)) {
    parsedNumber = parsedNumber.replace(DEFAULT_JO_CODE, '')
  }

  if (parsedNumber.length > 10) {
    return null
  }

  if (checkLocalNumber(parsedNumber)) {
    return DEFAULT_JO_CODE + parsedNumber.replace(/^0+/, '')
  }

  return parsedNumber
}

const parsePhoneNumber = number => {
  if (!number) {
    throw new BusinessLogicError(NO_NUMBER)
  }

  if (checkLocalNumber(number)) {
    return {
      pureNumber : number,
      countryCode: `+${DEFAULT_JO_CODE}`
    }
  }

  let phone = number

  if (!~phone.indexOf('+')) {
    phone = '+' + phone
  }

  const pureNumber  = parseNumber(phone).phone
  const countryCode = phone.replace(pureNumber, '')

  return {
    pureNumber,
    countryCode
  }
}

module.exports = {
  parsePhoneNumber,
  getJOLocalPhoneNumber
}
