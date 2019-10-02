'use strict'

const { notEmptyString } = require('./string')
const isArray            = Array.isArray

/**
 * Check if income data is Object
 *
 * @param {Object} obj
 * @return {Boolean}
 */
exports.isObject = obj => obj instanceof Object && obj.constructor === Object

/**
 * Creates an object composed of the picked object properties.
 *
 * @param {Object} object
 * @param {Array.<String>} props
 * @returns {Object}
 */
exports.pick = (object, props) => {
  // support for functional programming
  if (!props && object instanceof Array) {
    props = object

    return object => exports.pick(object, props)
  }

  const result = {}

  props.forEach(prop => {
    result[prop] = object[prop]
  })

  return result
}

/**
 * The opposite of `pick` this method creates an object composed of the own and inherited enumerable
 * properties of `object` that are not omitted
 *
 * @param {Object} object
 * @param {Array} props The properties to omit
 * @param {Boolean} deep
 * @return {Object}
 */
exports.omit = (object, props, deep) => {
  return exports.omitBy(object, (value, prop) => props.includes(prop), deep)
}

/**
 * This method creates an object composed of the own and inherited enumerable string keyed properties
 * of object that predicate doesn't return truthy for.
 * The predicate is invoked with two arguments: (value, key).
 *
 * @param {Object} object
 * @param {Function} predicate
 * @param {Boolean} deep
 */
exports.omitBy = (object, predicate, deep) => {
  const result = {}

  Object.keys(object).forEach(prop => {
    if (!predicate(object[prop], prop)) {
      result[prop] = object[prop]

      if (deep && exports.isObject(result[prop])) {
        result[prop] = exports.omitBy(result[prop], predicate, deep)
      }
    }
  })

  return result
}

exports.predicates = {
  isUndefined: value => value === undefined,
  isNil      : value => value == null,
  isPrimitive: value => value !== Object(value)

}

exports.values = object => Object.keys(object).map(key => object[key])

/**
 * Checks if two objects are equal by certain properties
 *
 * @param {Object} obj
 * @param {Object} anotherObj
 * @param {Array} properties names list
 * @return {Boolean}
 */
exports.isEqualBy = (obj, anotherObj, properties) => {
  return properties.reduce((memo, propertyName) => {
    return memo && obj[propertyName] === anotherObj[propertyName]
  }, true)
}

exports.keysToLowerCase = obj => {
  return Object.keys(obj).reduce(function(accum, key) {
    accum[key.toLowerCase()] = obj[key]
    return accum
  }, {})
}

/**
 * Traverse Object props and returns 1st level simple Map
 * @param obj
 * @returns {{}}
 */
exports.simpleMap = obj => {
  const map = new Map()

  Object.keys(obj).forEach(key => {
    map.set(key, obj[key])
  })

  return obj && map
}

exports.defineConstructorName = (obj, newName) => {
  Object.defineProperty(obj, 'name', { value: newName })
}

/**
 * Replace key in object
 *
 * @param {Object} obj
 * @param {String} oldKey
 * @param {String} newKey
 * @return {Object}
 */
exports.replaceKeys = (obj, oldKey, newKey) => {
  if (obj.hasOwnProperty(oldKey) && notEmptyString(newKey) && oldKey !== newKey) {
    obj[newKey] = obj[oldKey]
    delete obj[oldKey]
  }
  if (obj.hasOwnProperty(oldKey) && notEmptyString(newKey) && oldKey === newKey) {
    const tmp = obj[oldKey]

    delete obj[oldKey]
    obj[newKey] = tmp
  }

  return obj
}

//TODO Adjust utility functions to be generall everywhere
//NO duplication isObject vs exports.isObject
//this is done in they way to back capability!
const isFunction = t => typeof t === 'function'

const isObject = obj => obj === Object(obj)

const isPlainObject = o => isObject(o) && !isArray(o) && !isFunction(o)

const isEmpty = obj => !isObject(obj) || Object.keys(obj).length === 0

const clone = obj => {
  if (isArray(obj)) {
    return obj.concat()
  }

  if (isObject(obj)) {
    return Object.assign({}, obj)
  }

  return obj
}

const deepClone = obj => {
  if (isArray(obj)) {
    return obj.map(deepClone)
  }

  if (isObject(obj)) {
    const result = {}

    Object.keys(obj).forEach(key => {
      result[key] = deepClone(obj[key])
    })

    return result
  }

  return obj
}

const deepAssign = (target, ...sources) => {

  return sources.reduce((object, source) => {
    if (object === source) {
      return object
    }

    for (const key in source) {
      if (source.hasOwnProperty(key)) {
        if (isObject(source[key]) && isObject(object[key])) {
          object[key] = deepAssign(object[key], source[key])
        } else if (isObject(source[key])) {
          object[key] = deepClone(source[key])
        } else {
          object[key] = source[key]
        }
      }
    }

    return object
  }, target)
}

const deepSet = (obj, path, value, setRecursively = false) => {
  path.reduce(( obj, key, level ) => {
    level++

    if (setRecursively && typeof obj[key] === 'undefined' && level !== path.length) {
      obj[key] = {}

      return obj[key]
    }

    if (typeof obj !== 'undefined') {
      if (level === path.length) {
        obj[key] = value

        return value
      } else {
        return obj[key]
      }
    }
  }, obj)
}

exports.clone         = clone
exports.deepClone     = deepClone
exports.deepAssign    = deepAssign
exports.isPlainObject = isPlainObject
exports.isEmpty       = isEmpty
exports.deepSet       = deepSet