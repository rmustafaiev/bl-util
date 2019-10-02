const { aws } = require('../../etc/config')
const S3      = require('aws-sdk/clients/s3')

module.exports = new S3({
  accessKeyId    : aws.apiKey,
  secretAccessKey: aws.apiSecret,
  region         : aws.region,
  apiVersion     : aws.version
})
