'use strict'

const curry = fn => (...args) => fn.bind(null, ...args)

const map = curry((fn, arr) => arr.map(fn))

const pipe = (...fns) => x => fns.reduce((v, f) => f(v), x)

const tap = curry((fn, x) => {
  fn(x)
  return x
})

const trace = label => {
  return tap(x => console.log(` -> ${ label }:  ${ x }`))
}

const logOut = (logger, method) => label => {
  //return tap(x => logger.info(` -> ${ label }:  ${ x }`))
  return tap(x => logger[method](` -> ${ label }:  ${ x }`))
}

/**
 * Usage:
 *
 *
 * const toSlug = pipe(
 trace('input'),
 split(' '),
 map(toLowerCase),
 trace('after map'),
 join('-'),
 encodeURIComponent
 )
 console.log(toSlug('JS Cheerleader'));
 // '== input:  JS Cheerleader'
 // '== after map:  js,cheerleader'
 // 'js-cheerleader'

 * @type {{curry: function(*): function(...[*]): (*|any), map: *,
 * pipe: function(...[*]): function(*=): (*|any),
 * tap: *,
 * trace: function(*),
 * logOut: function(*=): function(*)}}
 */
module.exports = {
  curry,
  map,
  pipe,
  tap,
  trace,
  logOut
}