'use strict'

const assert = require('assert')

const Operators = {
  EQUAL                : '=',
  NOT_EQUAL            : '!=',
  NOT_EQUAL_ALT        : '<>',
  GREATER_THAN         : '>',
  GREATER_THAN_OR_EQUAL: '>=',
  LESS_THAN            : '<',
  LESS_THAN_OR_EQUAL   : '<=',
  LIKE                 : 'like',
  NOT_LIKE             : 'not like',
  IN                   : 'in',
  NOT_IN               : 'not in',
  IS_NULL              : 'is null',
  IS_NOT_NULL          : 'is not null'
}

const NUMERIC_OPERATORS = [
  Operators.GREATER_THAN,
  Operators.GREATER_THAN_OR_EQUAL,
  Operators.LESS_THAN,
  Operators.LESS_THAN_OR_EQUAL
]

class Subquery {
  constructor(value) {
    this.value = value
  }

  setValue(value) {
    this.value = value
  }

  toString() {
    return this.value
  }
}

const escape = value => {
  if (typeof value === 'string') {
    return value.replace(/'/g, '')
  }

  return value
}

const escapeSingleQuote = value => "'" + value.replace(/'/g, "''") + "'"

const wrapValue = value => typeof value === 'string' ? escapeSingleQuote(value) : value

const equal = (field, value) => `${field}=${wrapValue(value)}`

const notEqual = (field, value) => `${field}!=${sql.wrapValue(value)}`

const inSubset = (field, values) => {
  const inClause = Array.isArray(values)
    ? values.filter(v => v != null).map(sql.wrapValue).join(',')
    : values

  return `${field} IN (${inClause})`
}

const notInSubset = (field, values) => {
  const inClause = Array.isArray(values)
    ? values.map(sql.wrapValue).join(',')
    : values

  return `${field} NOT IN (${inClause})`
}

const like = (field, value) => `${field} LIKE ${sql.wrapValue(String(value))}`
const notLike = (field, value) => `${field} NOT LIKE ${sql.wrapValue(String(value))}`

const isNull = field => `${field} IS NULL`
const isNotNull = field => `${field} IS NOT NULL`

const distance = (lat, lon, latField, lonField, radiusInMiles) => {
  const distance = `distance(${lat}, ${lon}, ${latField}, ${lonField})`

  if (radiusInMiles) {
    return `${distance} <= mi(${radiusInMiles})`
  }

  return distance
}

const sum = (field, alias) => `sum(${field}) ${alias ? 'as ' + alias : ''}`

const subquery = (table, column, where) => new Subquery(`${table}[${where}].${column}`)

const buildCriteria = (field, operator, value) => {
  assert(field, 'field is null or empty')

  if (!operator && !value) {
    return field
  }

  assert(operator, 'operator is null or empty')

  operator = operator.toLowerCase()

  if (NUMERIC_OPERATORS.includes(operator)) {
    return `${field} ${operator} ${value}`
  }

  if (operator === Operators.EQUAL) {
    return equal(field, value)
  }

  if (operator === Operators.NOT_EQUAL) {
    return notEqual(field, value)
  }

  if (operator === Operators.IN) {
    return inSubset(field, value)
  }

  if (operator === Operators.NOT_IN) {
    return notInSubset(field, value)
  }

  if (operator === Operators.IS_NULL) {
    return isNull(field)
  }

  if (operator === Operators.IS_NOT_NULL) {
    return isNotNull(field)
  }

  if (operator === Operators.LIKE) {
    return like(field, value)
  }

  if (operator === Operators.NOT_LIKE) {
    return notLike(field, value)
  }

  throw new Error(`Unsupported operator: ${operator}`)
}

class Expression {
  constructor(field, operator, value) {
    this.nodes = []

    if (field) {
      this.nodes.push({ type: 'AND', criteria: buildCriteria(field, operator, value) })
    }
  }

  isEmpty() {
    return this.nodes.length === 0
  }

  and(field, operator, value) {
    if (field) {
      return this._addNode('AND', buildCriteria(field, operator, value))
    }

    return this
  }

  or(field, operator, value) {
    if (field) {
      return this._addNode('OR', buildCriteria(field, operator, value))
    }

    return this
  }

  _addNode(type, criteria) {
    const node = { type, criteria }

    return Object.assign(new Expression(), { nodes: this.nodes.concat(node) })
  }

  toString() {
    let result = ''
    let needParentheses = false

    this.nodes.forEach(node => {
      const criteria = String(node.criteria)

      if (criteria) {
        if (result) {
          result += ` ${node.type} `
          needParentheses = true
        }

        result += criteria
      }
    })

    return needParentheses ? `(${result})` : result
  }
}

const sql = (field, operator, value) => new Expression(field, operator, value)
sql.Expression = Expression
sql.Subquery = Subquery
sql.subquery = subquery
sql.escape = escape
sql.wrapValue = wrapValue
sql.Operators = Operators
sql.NUMERIC_OPERATORS = NUMERIC_OPERATORS
sql.not = condition => sql(`NOT ${condition}`)
sql.distance = distance
sql.sum = sum
sql.isEmpty = field => sql.equal(field, '')
sql.isNull = field => sql(field, Operators.IS_NULL)
sql.isNotNull = field => sql(field, Operators.IS_NOT_NULL)
sql.isNullOrEmpty = field => sql.isNull(field).or(sql.isEmpty(field))
sql.isFalsy = field => sql(sql(field, Operators.IS_NULL).or(field, Operators.EQUAL, false))
sql.isTruthy = field => sql(field, Operators.EQUAL, true)
sql.equal = (field, value) => sql(field, Operators.EQUAL, value)
sql.notEqual = (field, value) => sql(field, Operators.NOT_EQUAL, value)
sql.in = (field, values) => sql(field, Operators.IN, values)
sql.notIn = (field, values) => sql(field, Operators.NOT_IN, values)
sql.like = (field, value) => sql(field, Operators.LIKE, value)
sql.notLike = (field, value) => sql(field, Operators.NOT_LIKE, value)
/**
 * @deprecated
 */
sql.expr = sql
/**
 * @deprecated
 */
sql.criteria = sql

module.exports = sql