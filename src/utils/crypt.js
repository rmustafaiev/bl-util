'use strict'

const crypto = require('crypto')
const IV_LENGTH = 16

const encrypt = (data, key, algorithm) => {
  const iv      = crypto.randomBytes(IV_LENGTH)
  const cipher  = crypto.createCipheriv(algorithm || 'aes-256-cbc', key, iv)
  let encrypted = cipher.update(data)

  encrypted = Buffer.concat([encrypted, cipher.final()])

  return iv.toString('hex') + ':' + encrypted.toString('hex')
}

const decrypt = (data, key, algorithm) => {
  const textParts     = data.split(':')
  const iv            = Buffer.from(textParts.shift(), 'hex')
  const encryptedData = Buffer.from(textParts.join(':'), 'hex')
  const decipher      = crypto.createDecipheriv(algorithm || 'aes-256-cbc', key, iv)
  let decrypted       = decipher.update(encryptedData)

  decrypted = Buffer.concat([ decrypted, decipher.final() ])

  return decrypted.toString()
}


module.exports = { decrypt, encrypt }