'use strict'

const CacheStore = require('../models/cache-store')

const cachePut = (key, val, expire) => CacheStore.put(key, val, expire)

const cacheUpdate = (key, val, expire) => CacheStore.update(key, val, expire)

const cacheGet = key => CacheStore.get(key)

const cacheRemove = key => CacheStore.remove(key)

const cacheContains = key => CacheStore.contains(key)

const cacheExpireAt = key => CacheStore.expireAt(key)

module.exports = {
  cachePut,
  cacheUpdate,
  cacheRemove,
  cacheGet,
  cacheContains,
  cacheExpireAt
}