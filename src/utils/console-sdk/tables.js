'use strict'

const DataTypes = {
  INT            : 'INT',
  DOUBLE         : 'DOUBLE',
  BOOLEAN        : 'BOOLEAN',
  STRING         : 'STRING',
  DATETIME       : 'DATETIME',
  TEXT           : 'TEXT',
  STRING_ID      : 'STRING_ID',
  EXTENDED_STRING: 'EXTENDED_STRING',

  FILE_REF: 'FILE_REF',
  DATA_REF: 'DATA_REF',
  GEO_REF : 'GEO_REF',
  CHILD_OF: 'CHILD_OF',

  UNKNOWN: 'UNKNOWN'
}

const RELATION_URL_SUFFIX = 'relation'
const GEO_RELATION_URL_SUFFIX = 'georelation'

const COLUMNS_URL_SUFFIX = {
  [DataTypes.DATA_REF]: RELATION_URL_SUFFIX,
  [DataTypes.GEO_REF] : GEO_RELATION_URL_SUFFIX
}

const tableUrl = tableName => `data/tables/${tableName}`
const tableColumnsUrl = tableName => `${tableUrl(tableName)}/columns`

const isRelType = dataType => dataType === DataTypes.DATA_REF || dataType === DataTypes.GEO_REF

const normalizeTable = table => Object.assign(table, {
  columns     : table.columns && table.columns.map(normalizeColumn) || [],
  relations   : table.relations && table.relations.map(normalizeDataRelationTableColumn) || [],
  geoRelations: table.geoRelations && table.geoRelations.map(normalizeGEORelationTableColumn) || []
})

const normalizeDataRelationTableColumn = column => Object.assign(column, {
  name    : column.columnName,
  dataType: DataTypes.DATA_REF
})

const normalizeGEORelationTableColumn = column => Object.assign(column, {
  name    : column.columnName,
  dataType: DataTypes.GEO_REF
})

const normalizeColumn = column => {
  if (column.defaultValue) {
    if (column.dataType === 'BOOLEAN') {
      column.defaultValue = column.defaultValue === 'true'
    }

    if (column.dataType === 'INT') {
      column.defaultValue = parseInt(column.defaultValue)
    }
  }

  return column
}

let cahedTables

/**
 * @param {Request} req
 * @param {Context} context
 * @returns {Object}
 */
module.exports = (req, context) => ({ //eslint-disable-line

  get() {
    if (cahedTables) {
      return Promise.resolve(cahedTables)
    }

    return req.get('data/tables').then(resp => {
      resp.tables = resp.tables.map(normalizeTable)

      cahedTables = resp

      return resp
    })
  },

  async create(tableName, columns) {
    cahedTables = null

    const table = await req.post('data/tables', { name: tableName }).then(normalizeTable)

    if (columns) {
      for (const column of columns) {
        await this.createColumn(tableName, column)
      }
    }

    return table
  },

  update(table, props) {
    cahedTables = null

    return req.put(tableUrl(table), props).then(normalizeTable)
  },

  remove(table) {
    cahedTables = null

    return req.delete(tableUrl(table))
  },

  /**
   * @param {String} table
   * @param {Object} record
   * @returns {Promise|*}
   */
  createRecord(table, record) {
    return req.post(`data/${table}`, record)
  },

  updateRecord(table, record) {
    return req.put(`data/${table}/${record.objectId}`, record)
  },

  removeRecord(table, recordId) {
    return req.delete(`data/${table}/${recordId}`)
  },

  loadRecords(table, query) {
    return req.get(`data/${table}`).query(query)
  },

  forEachRecord(table, query, iteratee) {
    query || (query = {})

    const pageSize = 100
    let offset = 0
    let totalCount = 0

    return new Promise((resolve, reject) => {
      const processPage = () => {
        const options = Object.assign({}, query.options, { pageSize, offset })
        const pageQuery = Object.assign({}, query, { options })

        return this.loadRecords(table, pageQuery).then(data => {
          totalCount += data.length

          const processNextPage = () => {
            if (data.length < pageSize) {
              return resolve(totalCount)
            }

            offset += pageSize

            return processPage()
          }

          return Promise.all(data.map(iteratee)).then(processNextPage)
        })
      }

      processPage().catch(reject)
    })
  },

  createColumn(table, column) {
    const urlSuffix = COLUMNS_URL_SUFFIX[column.dataType]

    if (isRelType(column.dataType)) {
      column.columnName = column.name
    }

    cahedTables = null

    return req.post(tableColumnsUrl(table) + (urlSuffix ? `/${urlSuffix}` : ''), column)
  },

  deleteColumn(table, column) {
    const path = tableColumnsUrl(table)

    if (isRelType(column.dataType)) {
      return req.delete(`${path}/${RELATION_URL_SUFFIX}/${column.name}`)
    }

    cahedTables = null

    return req.delete(`${path}/${column.name}`)
  },

  updateColumn(table, prevColumn, column) {
    const urlSuffix = COLUMNS_URL_SUFFIX[prevColumn.dataType] || prevColumn.name

    if (isRelType(column.dataType)) {
      column.columnName = column.name
    }

    cahedTables = null

    return req.put(`${tableColumnsUrl(table)}/${urlSuffix}`, column)
  }
})
