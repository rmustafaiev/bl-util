'use strict'

const fs            = require('fs')
const { promisify } = require('util')
const mkDir         = promisify(fs.mkdir)
const readFile      = promisify(fs.readFile)
const stat          = promisify(fs.stat)
const unlink        = promisify(fs.unlink)
const rename        = promisify(fs.rename)
const readDir       = promisify(fs.readdir)
const writeFile     = promisify(fs.writeFile)

const notExistPath = path =>
  stat(path)
    .then(res => Promise.resolve(res.isDirectory() !== true))
    .catch(err => err.code === 'ENOENT' ? Promise.resolve(true) : Promise.reject(err))

const existFile = path =>
  stat(path)
    .then(res => Promise.resolve(res.isFile()))
    .catch(err => err.code === 'ENOENT' ? Promise.resolve(false) : Promise.reject(err))

module.exports = {
  readFile,
  mkDir,
  notExistPath,
  unlink,
  rename,
  readDir,
  stat,
  writeFile,
  existFile
}
