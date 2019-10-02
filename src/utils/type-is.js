'use strict'

const typeIs = arg => Object.prototype.toString.call(arg).slice(8, -1)

typeIs.number    = arg => typeIs(arg) === 'Number' && !Number.isNaN(arg)
typeIs.string    = arg => typeIs(arg) === 'String'
typeIs.object    = arg => typeIs(arg) === 'Object'
typeIs.array     = arg => typeIs(arg) === 'Array'
typeIs.date      = arg => typeIs(arg) === 'Date'
typeIs.null      = arg => typeIs(arg) === 'Null'
typeIs.undefined = arg => typeIs(arg) === 'Undefined'

module.exports = typeIs
