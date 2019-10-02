'use strict'

const SECOND    = 1000
const MINUTE    = 60 * SECOND
const HOUR      = 60 * MINUTE
const DAY       = 24 * HOUR
const WEEK      = 7 * DAY
const YEAR      = 365 * DAY
const LEAP_YEAR = 366 * DAY

const calculatePeriod = (fromDate, toDate) => (toDate - fromDate) / DAY

const supplementDigit = num => num < 10 ? '0'.concat(num) : num.toString()

const formatYYYYMMDD = (timeStamp, delimiter = '-') => {
  const date = new Date(timeStamp)

  const yy = date.getFullYear()
  const mm = supplementDigit(date.getMonth() + 1)
  const dd = supplementDigit(date.getDate())

  return `${yy}${delimiter}${mm}${delimiter}${dd}`
}

const formatDDMMYYYY = (timeStamp, delimiter = '-') => {
  const date = new Date(timeStamp)

  const yy = date.getFullYear()
  const mm = supplementDigit(date.getMonth() + 1)
  const dd = supplementDigit(date.getDate())

  return `${dd}${delimiter}${mm}${delimiter}${yy}`
}

const formatHHMMSS = (timeStamp, delimiter = ':') => {
  const date = new Date(timeStamp)

  const hh = supplementDigit(date.getHours())
  const mm = supplementDigit(date.getMinutes())
  const ss = supplementDigit(date.getSeconds())

  return `${hh}${delimiter}${mm}${delimiter}${ss}`
}

const formatMMYYYY = (timeStamp, delimiter = '-') => {
  const date = new Date(timeStamp)

  const yy = date.getFullYear()
  const mm = supplementDigit(date.getMonth() + 1)

  return `${mm}${delimiter}${yy}`
}

const translateArabicDate = date => date.replace(/[٠١٢٣٤٥٦٧٨٩]/g, d => d.charCodeAt(0) - 1632)

const isArabicDate = date => {
  let countArDigits = 0
  date.split('').forEach(d => d.charCodeAt(0) >= 1632 && d.charCodeAt(0) <= 1641 && countArDigits++)

  return countArDigits > 2
}

const beginningOfCurrentMonth = () => {
  const now = new Date()

  return new Date(now.getFullYear(), now.getMonth()).getTime()
}

const beginningOfNextMonth = () => {
  const now = new Date()

  return beginningOfMonth(now.getMonth() + 1)
}

const beginningOfPastMonth = () => {
  const now = new Date()

  return beginningOfMonth(now.getMonth() - 1)
}

const endOfPastMonth = () => {
  const now = new Date()

  return endOfTheMonth(now.getMonth() - 1)
}

const beginningOfMonth = month => {
  const now = new Date()

  return new Date(now.getFullYear(), month).getTime()
}

const endOfTheMonth = month => beginningOfMonth(month + 1) - 1

const startOfToday = () => {
  return startOfTheDay(new Date().getDate())
}

const endOfToday = () => {
  return endOfTheDay(new Date().getDate())
}

/**
 * Start of the given day (month, year if omit this year this month)
 * @param day
 * @param month - optional
 * @param year - optional
 * @return {number}
 */
const startOfTheDay = (day, month = null, year = null) => {
  const now = new Date()

  return new Date(year || now.getFullYear(), month || now.getMonth(), day, 0, 0, 0).getTime()
}


/**
 * End of the given day (month, year if omit this year this month)
 * @param day
 * @param month - optional
 * @param year - optional
 * @return {number}
 */
const endOfTheDay = (day, month = null, year = null) => {
  const now = new Date()

  return new Date(year || now.getFullYear(), month || now.getMonth(), day + 1, 0, 0, 0).getTime() - 1
}

/**
 *
 * @param {Date|Number} date
 * @param {Number} months
 * @return {number}
 */

const addMonth = (date, months) => {
  const d = new Date(date)

  return d.setMonth(d.getMonth() + months)
}

/**
 *
 * @param {Date|Number} date
 * @param {Number} count
 * @return {number}
 */

const substractMonth = (date, count) => {
  return addMonth(date, -count)
}

const getJordanDate = date => {
  const jordanTimeZoneOptions = {
    year    : 'numeric', month   : 'numeric', day     : 'numeric',
    hour    : 'numeric', minute  : 'numeric', second  : 'numeric',
    hour12  : false,
    timeZone: 'Asia/Amman'
  }

  return new Intl.DateTimeFormat('ar-JO', jordanTimeZoneOptions).format(date)
}

// TODO: Next function is necessary to remove after the transition to the BL 5
/**
 * This function allows you to set a specific time relative to the current time and return it in milliseconds
 * It takes time to enter in the format like "hour:min:sec:ms" when "ms" is optional EX: "12:04:55"
 * Its peculiarity is that if the time you specified is not available in these day,
 * it will return this time in the next day.
 *
 * @param {String} time - format like "hour:min:sec:ms"
 * @returns {Number}
 */
const getSpecificTime = time => {
  const serverDate  = new Date()
  const serverHours = serverDate.getHours()

  const jordanDate = getJordanDate(serverDate)
  const offset     = new Date(jordanDate).getHours() - serverHours

  const [ hours, minutes, seconds, ms = 0 ] = time.split(':').map(num => Number(num))

  if ((hours - offset) <= serverHours) {
    serverDate.setDate(serverDate.getDate() + 1)
  }

  serverDate.setHours(hours - offset, minutes, seconds, ms)

  return serverDate.getTime()
}

module.exports = {
  dateConstants: {
    SECOND,
    MINUTE,
    HOUR,
    DAY,
    WEEK,
    YEAR,
    LEAP_YEAR
  },
  calculatePeriod,
  formatYYYYMMDD,
  formatHHMMSS,
  formatDDMMYYYY,
  translateArabicDate,
  isArabicDate,
  beginningOfCurrentMonth,
  beginningOfPastMonth,
  endOfPastMonth,
  startOfToday,
  endOfToday,
  formatMMYYYY,
  addMonth,
  beginningOfNextMonth,
  substractMonth,
  getSpecificTime,
  getJordanDate
}
