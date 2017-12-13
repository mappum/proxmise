module.exports = function proxmise (get, set, path = []) {
  if (typeof get !== 'function') {
    throw Error('Must specify a "get" handler')
  }

  // create Promise and pull out resolve/reject funcs
  let funcs
  let promise = new Promise((resolve, reject) => {
    funcs = { resolve, reject }
  })

  // override 'then' and 'catch' to detect if a property is
  // the one the user wants to access
  function wrap (method) {
    return function (...args) {
      // run getter
      let res = get(path, funcs.resolve, funcs.reject)

      // if getter returned a Promise, hook it up to the
      // proxmise
      if (res instanceof Promise) {
        res.then(funcs.resolve, funcs.reject)
      }

      // call the actual Promise method (then/catch)
      // to attach the user's handler
      return method.call(promise, ...args)
    }
  }

  // return proxied Promise
  return new Proxy(promise, {
    get (obj, key) {
      // use overriden Promise methods
      if (key === 'then') return wrap(promise.then)
      if (key === 'catch') return wrap(promise.catch)

      // recursively wrap props
      return proxmise(get, set, path.concat(key))
    },

    set () {
      throw Error('This object is read-only')
    },

    deleteProperty () {
      throw Error('This object is read-only')
    }
  })
}
