'use strict'

const { readFile }            = require('../fs')
const { aws }                 = require('../../etc/config')
const { extractFileName,
        urlToFileSystemPath } = require('../files')
const { promisify }           = require('util')
const s3                      = require('./s3.js')
const { rename }              = require('../fs')
const uuidv1                  = require('uuid/v1')

const SECONDS_IN_HOUR = 60 * 60
const SECONDS_IN_DAY  = 24 * SECONDS_IN_HOUR
const SECONDS_IN_WEEK = 7 * SECONDS_IN_DAY

const putObject = promisify(s3.putObject.bind(s3))

const uploadToS3 = async (fileName, data, options) => {
  await putObject({
    Bucket: aws.bucket,
    Key   : fileName,
    Body  : data,
    ...options
  })

  return getS3Url(fileName)
}

const copyToS3 = async path => {
  const fileName = extractFileName(path)

  const file = await readFile(path)

  return uploadToS3(fileName, file)
}

const getS3Url = (fileName, expires) => {
  const s3Params = {
    Bucket : aws.bucket,
    Key    : fileName,
    Expires: expires || SECONDS_IN_WEEK
  }

  return s3.getSignedUrl('getObject', s3Params)
}

const bulkDelete = fileNameArr => {
  const s3Keys = fileNameArr.map(fileName => ({ Key: fileName }))

  const deleteObjects = promisify(s3.deleteObjects.bind(s3))

  const s3Params = {
    Bucket: aws.bucket,
    Delete: {
      Objects: s3Keys
    }
  }

  return deleteObjects(s3Params)
}

const deleteFolder = async path => {
  const listObjects = promisify(s3.listObjects.bind(s3))

  const { Contents } = await listObjects({
    Bucket: aws.bucket,
    Prefix: path
  })

  if (Contents.length === 0) {
    return console.log('List of objects empty.')
  }

  await bulkDelete(Contents.map(({ Key }) => Key))

  return deleteFolder(path)
}

const extractS3FileName = url => (url.match(aws.regexp))[1]

const renameFile = async url => {
  const fileName = extractFileName(url)
  const uuid     = uuidv1()
  const newUrl   = url.replace(fileName, `${uuid}-${fileName}`)

  await rename(urlToFileSystemPath(url), urlToFileSystemPath(newUrl))

  return newUrl
}

module.exports = {
  copyToS3,
  bulkDelete,
  getS3Url,
  extractS3FileName,
  renameFile,
  uploadToS3,
  deleteFolder
}
