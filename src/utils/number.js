'use strict'

const typeIs = require('./type-is')

const DIRTY_CHARACTERS = [ '+', '-', '.' ]

/**
 * Check if argument is number
 * @param {Number|String} num
 * @return {Boolean}
 */
const isNumeric = num => (typeIs.number(num) || typeIs.string(num)) && !isNaN(parseFloat(num)) &&
  isFinite(num.toString().replace(/^-/, ''))

/**
 * Check if argument is pure number
 * @param {Number|String} num
 * @return {Boolean}
 */
const isNaturalNumber = num => {
  const stringNumber = String(num)
  let   pureNumber   = true

  if (!stringNumber.length) {
    return false
  }

  DIRTY_CHARACTERS.forEach(char => {
    if (stringNumber.includes(char)) {
      pureNumber = false
    }
  })

  return isNumeric(num) && pureNumber
}

const random = (min, max) => {
  if (!max) {
    max = min
    min = 0
  }

  return Math.floor(Math.random() * (max - min)) + min
}

const generateSixDigitCode = () => {
  return random(100000, 999999)
}

const floatPrecision = (x, n) => {
  const mult = Math.pow(10, n)

  return Math.floor(x * mult) / mult
}

module.exports = {
  isNumeric,
  isNaturalNumber,
  generateSixDigitCode,
  floatPrecision,
  random
}
