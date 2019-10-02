'use strict'

/**
 * Gets the first element of array.
 * @param {Array} array
 */
const pickFirst = array => array[0]

const descending = field => (a, b) => {
  if (a[field] < b[field]) {
    return 1
  }
  if (a[field] > b[field]) {
    return -1
  }
  return 0
}

const ascending = field => (a, b) => {
  if (a[field] > b[field]) {
    return 1
  }
  if (a[field] < b[field]) {
    return -1
  }
  return 0
}

/**
 * Sort an Array by the field specified,
 * by default order is Ascending.
 * Returns sorted array by reference
 * @param {Array} arr
 * @param {String} field
 * @param {Boolean} asc, (Ascending)
 * @returns {Array}
 */
const sortBy = (arr, field, asc = true) => {
  return asc
    ? arr.sort(ascending(field))
    : arr.sort(descending(field))
}

/**
 * Creates an object composed of keys generated from the results of running each element of collection thru iteratee.
 * @param {Array.<Object>} array
 * @param {Function|String} iteratee
 * @returns {Object}
 */
const groupBy = (array, iteratee) => {
  const result = {}

  if (typeof iteratee === 'string') {
    const prop = iteratee

    iteratee = item => item[prop]
  }

  array.forEach((item, i) => {
    const key = iteratee(item, i)

    result[key] = result[key] || []
    result[key].push(item)
  })

  return result
}

/**
 * Creates an object composed of keys generated from the results of running each element of collection thru iteratee.
 * The corresponding value of each key is the last element responsible for generating the key.
 * The iteratee is invoked with one argument: (value).
 *
 * @param {Array.<Object>} array
 * @param {Function|String} iteratee
 * @returns {Object}
 */
const keyBy = (array, iteratee) => {
  const result = {}

  if (typeof iteratee === 'string') {
    const prop = iteratee

    iteratee = item => item[prop]
  }

  array.forEach((item, i) => {
    result[iteratee(item, i)] = item
  })

  return result
}

/**
 * Check data for array type and array not empty
 * @param {Array} array
 * @return {Boolean}
 */
const isNotEmptyArray = array => Boolean(Array.isArray(array) && array.length)

/**
 * Returns originated source array split by chunks [1...n] => [[1..x], [x...y] ...]
 * @param sourceArr
 * @param chunkSize
 * @return {Array}
 */
const chunk = (sourceArr, chunkSize) => {
  const res = []
  const arr = [ ...sourceArr ]
  while (arr.length) {
    res.push(arr.splice(0, chunkSize))
  }
  return res
}

/**
 * Returns whether Array contains the key/value (strings only)
 *
 * @param arr
 * @return {Function}
 */
const includesIgnoreCase = arr => key => {
  if (Array.isArray(arr)) {
    return arr.filter( k => k.toString().toLowerCase() === key.toLowerCase()).length > 0
  }
}

/**
 * Function for getting batch of input array
 *
 * @param {Array} arr - input array
 * @param {Object} params - should include optional pageSize and/or offset
 * @return {Array}
 */
const getPaginatedArray = (arr, params = {}) => {
  let { pageSize, offset } = params

  const size = arr.length

  offset   = offset || 0
  pageSize = (pageSize || size) + offset

  return arr.slice(offset, pageSize)
}

const flatten = source => source.reduce(
  (acc, val) => acc.concat(Array.isArray(val) ? flatten(val) : val), []
)

const range = n => [ ...Array(n).keys() ]

const groupToBuckets = (array, bucketSize) => {
  return Object.values(groupBy(array, (item, i) => Math.floor(i / bucketSize)))
}

const toArray = value => Array.isArray(value) ? value : [ value ]

const uniq = array => [ ...new Set(array) ]

/**
 * Separates and returns unique records and duplicates using the "setKey" received function
 *
 * @param {Array} records
 * @param {Function} setKey
 * @param {Function} [setValue]
 * @return {{duplicates: Array, map: Map<any, any>}}
 */
const createMap = (records, setKey, setValue) => {
  const map        = new Map()
  const duplicates = []

  for (const record of records) {
    const key             = setKey(record)
    const processedRecord = setValue ? setValue(record) : record

    if (map.has(key)) {
      duplicates.push(processedRecord)
    }
    else {
      map.set(key, processedRecord)
    }
  }

  return { map, duplicates }
}

module.exports = {
  pickFirst,
  isNotEmptyArray,
  sortBy,
  groupBy,
  keyBy,
  chunk,
  flatten,
  includesIgnoreCase,
  getPaginatedArray,
  range,
  groupToBuckets,
  toArray,
  uniq,
  createMap
}
