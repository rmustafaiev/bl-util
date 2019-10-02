/*
Unicode based ranges for Arabic chars
Arabic (0600—06FF, 225 characters)
Arabic Supplement (0750—077F, 48 characters)
Arabic Extended-A (08A0—08FF, 39 characters)
Arabic Presentation Forms-A (FB50—FDFF, 608 characters)
Arabic Presentation Forms-B (FE70—FEFF, 140 characters)
Rumi Numeral Symbols (10E60—10E7F, 31 characters)
Arabic Mathematical Alphabetic Symbols (1EE00—1EEFF, 143 characters)
*/

/*
  Arabic alphabet and numeric
  English Alphabet and numeric
  Special characters `_` `.` `-` `#`
  Refer BAC-1457
 */
const notAllowedTagChars = /[^\u10E60—\u10E7F\u0600-\u06FF0-9a-zA-Z-_#\.]/

/**
 * Returns whether string contains not allowed chars for the transaction tag
 * @param str
 * @return {boolean}
 */
const hasNotAllowedTagChars = str => notAllowedTagChars.test(str)

module.exports = { hasNotAllowedTagChars }