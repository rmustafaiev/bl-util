'use strict'

const cachePut = (key, val, ttl) => Backendless.Cache.put(key, val, ttl)

const cacheGet = key => Backendless.Cache.get(key)

const cacheRemove = key => Backendless.Cache.remove(key)

const cacheContains = key => Backendless.Cache.contains(key)

const expireIn = (key, seconds) => Backendless.Cache.expireIn(key, seconds)

const expireAt = (key, timestamp) => Backendless.Cache.expireAt(key, timestamp)

module.exports = {
  cachePut,
  cacheRemove,
  cacheGet,
  cacheContains,
  expireIn,
  expireAt
}