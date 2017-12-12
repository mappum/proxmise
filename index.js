module.exports = function proxmise (get, path = []) {
  if (typeof get !== 'function') {
    throw Error('Must specify a "get" handler')
  }

  // create Promise and pull out resolve/reject funcs
  let resolve, reject
  let promise = new Promise((rs, rj) => {
    resolve = rs
    reject = rj
  })

  // use an overriden 'then' to detect if a property is
  // the one the user wants to access
  function then (next) {
    // run access handler
    let getProm = get(path, resolve, reject)

    // handler returned Promise, we should hook it up
    // to our Proxmise
    if (getProm instanceof Promise) {
      getProm.then(resolve)
      getProm.catch(reject)
    }

    return promise.then(next)
  }

  // return a wrapped Promise for this property
  return new Proxy(promise, {
    get (obj, key) {
      // use overriden 'then' func
      if (key === 'then') return then

      // recursively wrap props
      return proxmise(get, path.concat(key))
    }
  })
}
