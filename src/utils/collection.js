'use strict'

const { toLowerCaseFirstLetter, capitalize }    = require('./string')
const { predicates: { isPrimitive }, isObject } = require('./object')
const isArray                                   = Array.isArray

/**
 * Remove props according to a predicate
 *
 * @param {Object|Array} collection
 * @param {Array<String>|String} predicate - path to property. Example: 'a.b.c'
 * @returns {Object|Array}
 */
const exclude = (collection, predicate) => {
  if (isPrimitive(collection) || !predicate) {
    return collection
  }

  if (isArray(collection)) {
    collection.forEach(item => exclude(item, predicate))
  } else if (isArray(predicate)) {
    predicate.forEach(path => exclude(collection, path))
  } else if (predicate.indexOf('.') === -1) {
    if (collection[predicate]) {
      delete collection[predicate]
    }
  } else {
    const prop     = predicate.split('.')[0]
    const restPath = predicate.slice(predicate.indexOf('.') + 1)

    exclude(collection[prop], restPath)
  }

  return collection
}

/**
 * Traverse collection recursively, and applies callback function per each key
 * !Note it is possible to mutate orig objects, be aware of changes,
 * or use clone object as per mutation.
 *
 * @example
 *    - host is the target object,
 *    - key the property own key of host
 *    - value > host.key = value
 *    const modifier = (host, key, value) => {
 *      host[key] = 'new value'
 *    }
 * @param {Object|Array} collection
 * @param {Function} modifier
 */
const traverse = (collection, modifier) => {
  if (isArray(collection)) {
    collection.forEach((x, i) => {
      traverse(x, modifier)

      modifier(collection, i, x)
    })
  } else if (isObject(collection)) {
    for (const key in collection) {
      if (collection.hasOwnProperty(key)) {
        traverse(collection[key], modifier)

        modifier(collection, key, collection[key])
      }
    }
  }

  return collection
}

traverse.modifiers = {
  updateKey: (collection, key, modifier) => {
    if (typeof key === 'string') {
      const newKey = modifier(key)

      if (key !== newKey) {
        collection[newKey] = collection[key]
        delete collection[key]
      }
    }
  },

  uncapitalize: (collection, key) =>
    traverse.modifiers.updateKey(collection, key, toLowerCaseFirstLetter),

  capitalize: (collection, key) =>
    traverse.modifiers.updateKey(collection, key, capitalize)
}

module.exports = {
  exclude,
  traverse
}
