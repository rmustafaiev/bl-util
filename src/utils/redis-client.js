const { promisify } = require('util')
const redisConnect  = require('redis')

class Redis {
  constructor(options) {
    this.options = options
  }

  async init() {
    this.client  = redisConnect.createClient(this.options)
    this.get     = promisify(this.client.get).bind(this.client)
    this.auth    = promisify(this.client.auth).bind(this.client)
    this.del     = promisify(this.client.del).bind(this.client)
    this.srem    = promisify(this.client.srem).bind(this.client)
    this.zrange  = promisify(this.client.zrange).bind(this.client)
    this.zscore  = promisify(this.client.zscore).bind(this.client)
    this.hgetall = promisify(this.client.hgetall).bind(this.client)
    this.hset    = promisify(this.client.hset).bind(this.client)
    this.hget    = promisify(this.client.hget).bind(this.client)

    if (this.options.password) {
      await this.auth(this.options.password)
    }
  }
}

module.exports = Redis