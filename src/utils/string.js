'use strict'

/**
 * @param {String} str
 * @return {String}
 */
const isString       = str => typeof str === 'string'
/**
 * Returns boolean, check if not empty string
 * @param {*} value
 * @return {boolean}
 */
const notEmptyString = value => (typeof value === 'string' && value.trim() !== '')

/**
 * Transform first letter to lower case in input string
 *
 * @param {String} str
 * @return {String}
 */
const toLowerCaseFirstLetter = str => str[0].toLowerCase() + str.substr(1)

const capitalize = str => str[0].toUpperCase() + str.substr(1)

/**
 * Get a piece of string
 *
 * @param {String} str
 * @param {Number} params
 * @return {String}
 */
const getStringPiece = (str, ...params) => isString(str) ? str.slice(...params) : str

/**
 * Get a digits of string
 *
 * @param {String} str
 * @return {String}
 */
const getDigits = str => str.replace(/\D+/g, '')

/**
 * Returns an array of string specified, default separator is coma.
 * @param str
 * @param separator
 * @return {boolean|any[]}
 */
const toArray = (str, separator = ',') => (notEmptyString(str) && str.split(separator).map(v => v.trim())) || []

module.exports = {
  isString,
  toLowerCaseFirstLetter,
  capitalize,
  notEmptyString,
  getStringPiece,
  getDigits,
  toArray
}