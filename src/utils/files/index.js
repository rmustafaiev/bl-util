'use strict'

const csv  = require('fast-csv')
const path = require('path')

const serviceContext = require('../service-context')

const { toFileSystemPath, urlToFileSystemPath } = require('./paths')

const { merchantCategoryIcons, merchantIcons } = require('../../etc/files-config').secured_fs

const { unlink, readFile, readDir, stat } = require('../fs')

/**
 * Extracts file name from Backendless URL (BS File API)
 * @param {String} path
 * @return {string | undefined}
 */
function extractFileName(path) {
  return path.split('/').pop()
}

/**
 * Remove the file from BL file system
 * @param {String} path - the absolute path
 * @return {Promise<*>}
 */
function removeFile(path) {
  return unlink(path)
}

/**
 * @typedef {Object} ParsingCsvProps
 * @property {Boolean} headers
 * @property {Boolean} trim
 * @property {String} separator
 * @property {Boolean} ignoreEmpty
 * @property {Boolean} discardColumns
 */

/**
 * Function for parsing csv data to Array of objects
 * @param {String} fileData
 * @param {ParsingCsvProps} props
 * @returns {Promise.<Object[]>}
 */

const parseCsvData = (fileData, props = {}) => {
  const { separator, headers, trim, ignoreEmpty, discardColumns } = props

  return new Promise((resolve, reject) => {
    const result = []

    const settings = {
      headers               : headers || true,
      trim                  : trim || true,
      delimiter             : separator || ',',
      ignoreEmpty           : ignoreEmpty || true,
      discardUnmappedColumns: discardColumns || false,
      ...props
    }

    csv
      .fromString(fileData, settings)
      .on('error', error => {
        reject(error)
      })
      .on('data', parsedData => {
        result.push(parsedData)
      })
      .on('end', () => {
        resolve(result)
      })
  })
}

/**
 * @typedef {Object} ParsingCsvProps
 * @property {Boolean} headers
 * @property {Boolean} trim
 * @property {String} separator
 * @property {Boolean} ignoreEmpty
 * @property {Boolean} discardColumns
 */

/**
 * Function for parsing csv files to Array of objects
 * @param {String} pathToFile
 * @param {String} fileName
 * @param {ParsingCsvProps} props
 * @returns {Promise.<Object[]>}
 */
const parseCsvFile = async (pathToFile, fileName, props = {}) => {
  const filePath = path.resolve(pathToFile, fileName)

  const fileData = await readFile(filePath)

  return parseCsvData(fileData, props)
}

const removeExpiredFiles = async (directoryPath, expireTime) => {
  const files = await readDir(directoryPath)

  for (let i = 0; i < files.length; i++) {
    const fileStat = await stat(`${directoryPath}/${files[i]}`)

    const { ctimeMs } = fileStat
    const curDate     = new Date().getTime()

    if (curDate - ctimeMs > expireTime) {
      try {
        await unlink(`${directoryPath}/${files[i]}`)
      } catch (err) {
        console.log(err)
      }
    }
  }
}

const clearDirectory = async dirPath => {
  try {
    const files = await readDir(dirPath)

    const unlinkPromises = files.map(filename => unlink(`${dirPath}/${filename}`))

    return await Promise.all(unlinkPromises)
  } catch (err) {
    console.log(err)
  }
}

const DEFAULT_CATEGORY_ICON = 'General.png'

const getIconURL = (path, icon) => {
  if (!icon) {
    icon = DEFAULT_CATEGORY_ICON
    path = merchantCategoryIcons.path
  }

  const baseUrl = serviceContext.getAPIAccessBaseURL()

  return [ baseUrl, `files/${path}`, icon ].join('/')
}

const getCategoryIconURL = icon => getIconURL(merchantCategoryIcons.path, icon)

const getMerchantIconURL = icon => getIconURL(merchantIcons.path, icon)

module.exports = {
  extractFileName,
  toFileSystemPath,
  urlToFileSystemPath,
  removeFile,
  parseCsvFile,
  removeExpiredFiles,
  clearDirectory,
  parseCsvData,
  getMerchantIconURL,
  getCategoryIconURL
}
