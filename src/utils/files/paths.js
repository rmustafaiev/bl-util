'use strict'

const path = require('path')

const { BACKENDLESS_REPO_PATH } = require('../../etc/config')

const securedFs = require('../../etc/files-config').secured_fs

const FILES = 'files'

const REPO_PATH  = BACKENDLESS_REPO_PATH || __dirname.slice(0, __dirname.indexOf('files'))
const FILES_PATH = path.join(REPO_PATH, FILES)

const toFilesPath = path => `${FILES}/${path}`

/**
 * Converts Backendless file URL to local (relative)
 * path beginning from the FilesRoot e.g. 'files/' folder
 * @param {String} path
 * @returns {String}
 */
function toLocalPath(path) {
  // a file-ref link has the next format so it has to skip the part until '/files/'
  // https://api.host/XXXXX-XXXX-XXXX/ZZZZ-ZZZZ-ZZZZ/files/<local-path>
  return path.replace(/^.*?\/files\//, '')
}

/**
 * Returns the absolute path to the file by OS file system,
 * based on backendless URL
 * Be aware of Backenless config section.
 *
 * @see etc/config -> backendless
 * @param {String} backendlessUrl
 * @return {string}
 */
function urlToFileSystemPath(backendlessUrl) {
  const filePath = toLocalPath(backendlessUrl)

  return path.join(FILES_PATH, filePath)
}

/**
 * Return path as full qualified file system path
 * @param filePath - Path to directory or file
 * @returns {string}
 */
function toFileSystemPath(filePath) {
  return path.join(REPO_PATH, filePath)
}

module.exports = {
  MERCHANT_ICONS_PATH     : toFilesPath(securedFs.merchantIcons.path),
  CATEGORY_ICONS_PATH     : toFilesPath(securedFs.merchantCategoryIcons.path),
  BUSINESS_LOGIC_DATA_PATH: toFilesPath(securedFs.businesslogicData.path),
  EXPORT_HISTORY_PATH     : toFilesPath(securedFs.exportHistory.path),
  MOBILE_APP_MEDIA_PATH   : toFilesPath(securedFs.mobileAppMedia.path),
  PROFILE_IMAGES_PATH     : toFilesPath(securedFs.profileImages.path),
  PAYMENT_REPORTS_PATH    : toFilesPath(securedFs.paymentReports.path),
  toFileSystemPath,
  urlToFileSystemPath
}
