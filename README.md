# Proxmise

`proxmise` is short for "proxied Promise". It lets you create an object where arbitrary keys can be accessed asynchronously.

## Installation

Requires __node v7.6.0__ or higher.

```bash
$ npm install proxmise
```

## Usage

```js
let Proxmise = require('proxmise')

// create your proxmise by defining a getter func
let prox = Proxmise((path, resolve, reject) => {
  // path is an array.
  // if `prox.foo.bar` is accessed, path will be ['foo','bar']
  resolve(path.join('.'))
})

// any path can be accessed and will return a Promise.
// it will resolve to the result of your getter func
console.log(await prox.this.is.the.path)
// -> 'this.is.the.path'
```

```js
// you may also use an async function for your getter func
let prox = Proxmise(async (path) => path)
```

## License

MIT
