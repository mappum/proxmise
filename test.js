let test = require('tape')
let proxmise = require('.')

test('must have getter', (t) => {
  try {
    proxmise()
    t.fail('should have thrown')
  } catch (err) {
    t.equals(err.message, 'Must specify a "get" handler')
  }
  t.end()
})

test('sync getter resolve', (t) => {
  let getterCallCount = 0
  let p = proxmise((path, resolve) => {
    getterCallCount++
    resolve(path)
  })

  t.test('access path', (t) => {
    let promise = p.foo.bar
    promise.then((path) => {
      t.deepEqual(path, [ 'foo', 'bar' ])
      t.equal(getterCallCount, 1)
      t.end()
    })
  })

  t.test('access root', (t) => {
    let promise = p
    promise.then((path) => {
      t.deepEqual(path, [])
      t.equal(getterCallCount, 2)
      t.end()
    })
  })
})

test('sync getter reject', (t) => {
  let getterCallCount = 0
  let p = proxmise((path, resolve, reject) => {
    getterCallCount++
    reject(path)
  })

  t.test('access path', (t) => {
    let promise = p.foo.bar
    promise.catch((path) => {
      t.deepEqual(path, [ 'foo', 'bar' ])
      t.equal(getterCallCount, 1)
      t.end()
    })
  })

  t.test('access root', (t) => {
    let promise = p
    promise.then(() => {
      t.fail('should not have resolved')
    }).catch((path) => {
      t.deepEqual(path, [])
      t.equal(getterCallCount, 2)
      t.end()
    })
  })
})

test('async getter resolve', (t) => {
  let getterCallCount = 0
  let p = proxmise(async (path) => {
    getterCallCount++
    return path
  })

  t.test('access path', (t) => {
    let promise = p.foo.bar
    promise.then((path) => {
      t.deepEqual(path, [ 'foo', 'bar' ])
      t.equal(getterCallCount, 1)
      t.end()
    })
  })

  t.test('access root', (t) => {
    let promise = p
    promise.then((path) => {
      t.deepEqual(path, [])
      t.equal(getterCallCount, 2)
      t.end()
    })
  })
})

test('async getter reject', (t) => {
  let getterCallCount = 0
  let p = proxmise(async function (path) {
    getterCallCount++
    throw path
  })

  t.test('access path', (t) => {
    let promise = p.foo.bar
    promise.then(() => {
      t.fail('should not have resolved')
    }, (path) => {
      t.deepEqual(path, [ 'foo', 'bar' ])
      t.equal(getterCallCount, 1)
      t.end()
    })
  })

  t.test('access root', (t) => {
    let promise = p
    promise.catch((path) => {
      t.deepEqual(path, [])
      t.equal(getterCallCount, 2)
      t.end()
    })
  })
})

test('mutations should error', (t) => {
  let p = proxmise(() => {})

  t.test('set', (t) => {
    try {
      p.foo = 'bar'
      t.fail('should have thrown')
    } catch (err) {
      t.equal(err.message, 'This object is read-only')
      t.end()
    }
  })

  t.test('delete', (t) => {
    try {
      delete p.foo
      t.fail('should have thrown')
    } catch (err) {
      t.equal(err.message, 'This object is read-only')
      t.end()
    }
  })
})
