'use strict'

const delay = (delay = 100) => new Promise(resolve => {
  setTimeout(() => resolve(), delay)
})

/**
 * @param {Function} callback
 * @param {Number} delayed
 * @return {Promise<any>}
 */
const deferredProcess = async (callback, delayed = 1000) => {
  await delay(delayed)

  return callback()
}

const runSequential = async tasks => {
  const result = []

  for (const task of tasks) {
    result.push(await task())
  }

  return result
}


/**
 * Run tasks in parallel
 * Tasks must be an array of promises settled
 *
 * @param tasks - an array of promises to be executed
 * @param limit - number of concurrent tasks (default is 1 max is 100)
 * @param cb - callback function to be invoked per each task progress.
 * @return {Promise<[]>}
 */
const runInParallel = (tasks, limit, cb) => {
  const total = tasks.length

  if (!limit) {
    limit = tasks.length
  }

  return new Promise((resolve, reject) => {

    let i = -1
    let running = 0
    let done = false

    const results = []

    const onTaskComplete = index => result => {
      results[index] = result
      running--

      cb && cb(result)

      if (!running && done) {
        return resolve(results)
      }

      replenish()
    }

    const iteratee = i =>
      Promise.resolve()
        .then(() => tasks[i]())
        .then(onTaskComplete(i), reject)

    const replenish = () => {
      while (running < limit && !done) {
        i += 1

        if (i >= total) {
          done = true

          if (running <= 0) {
            resolve(results)
          }

          return
        }

        running += 1

        iteratee(i)
      }
    }

    replenish()
  })
}

module.exports = {
  runSequential,
  runInParallel,
  delay,
  deferredProcess
}