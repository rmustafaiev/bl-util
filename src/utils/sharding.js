'use strict'

const { shard : { numTables, tablePrefix } } = require('../etc/config')

const normalizeSuffix = shard => shard < 10 ? '0' + shard : '' + shard

const tableNameOfShard = shardKey => tablePrefix.concat(normalizeSuffix(shardKey))

const shardNumByCif = cif => {
  const id = parseInt(cif)

  return id % numTables
}

const tableNameByCif = cif => {
  const shardKey = shardNumByCif(cif)

  return tableNameOfShard(shardKey)
}

const extractCif = where => {
  const regex = /customerNumber='(.+?)'/

  const match = where.toString().match(regex)

  if (!match) {
    throw new Error('query does\'t contain "customerNumber"')
  }

  return match[1]
}

module.exports = {
  tableNameByCif,
  shardNumByCif,
  extractCif,
  tableNameOfShard,
  tablePrefix,
  maxTables: numTables
}