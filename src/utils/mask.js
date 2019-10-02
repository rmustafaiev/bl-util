'use strict'

const { traverse } = require('./collection')
const { deepClone } = require('./object')
const { includesIgnoreCase }  = require('./array')
const { notEmptyString }      = require('./string')
const isObject                = obj => obj === Object(obj)

const HIDE_MANDATORY = [ 'password', 'login' ]

const MAX_LEN  = 16
const MIN_HIDE = 4
const DEF_HIDE = 3

const maskField = (field, val) => {
  if (!notEmptyString(val)) {
    return val
  }

  let len = val.length <= MIN_HIDE ? 0 : DEF_HIDE

  if (HIDE_MANDATORY.includes(field)) {
    len = 0
  }

  const re = new RegExp(`.(?=.{${len}})`, 'g')// repl except last 3

  const res = val.replace(re, '*')

  return (res && res.length > MAX_LEN) ? res.substr(-MAX_LEN) : res
}

const maskFieldModifier = fields => (obj, key, value) => {
  const arrIncludes = includesIgnoreCase(fields)

  if (typeof key === 'string' && arrIncludes(key)) {
    if (!isObject(value) || !Array.isArray(value)) {
      obj[key] = maskField(key, value && value.toString())
    }
  }
}

/**
 * Returns the object (clone) with the fields that should be Hidden/masked
 * passes through object recursively and masks the fields that passed in the fields argument.
 * mainly for card Numbers, customerIds any NPI (none public infos')
 *
 * @param object
 * @param fields
 * @return {*}
 */
const maskObjectFields = (object, fields) => {
  if (!object || !isObject(object) || !Array.isArray(fields)) {
    return object
  }

  return traverse(deepClone(object), maskFieldModifier(fields))
}

exports.maskField         = maskField
exports.maskObjectFields  = maskObjectFields
exports.maskFieldModifier = maskFieldModifier