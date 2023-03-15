---
title: JavaScript - 手写一个 Promise 方法
date: 2021-03-18 13:15:52
updated: 2021-03-18 13:15:52
tags:
    - JavaScript
cover: /assets/blogCover/MIKU花(4)_78753717_p1.png
---


ES6新增了一个用于处理异步操作数据的一个原生API，能够解决回调地狱的产生

#### 常用的方法

  * Promise.resolve()
  * Promise.reject()
  * Promise.then()
  * Promise.catch()
  * Promise.finally()
  * Promise.all()
  * Promise.race()
  * Promise.allSettled()
  * Promise.any()

接下来我们来使用代码来实现这些操作

#### 实现Promise

  首先我们在创建 Promise 实例，会传入两个函数用来表示成功的回调以及失败的回调，然后我们可以设计 Promise 类中的内容大概是这个样子的

~~~js
  const PANDING = 'panding'
  const FULFILLED = 'fulfilled'
  const REJECTED = 'rejected'
  class Promise {
    constructor(fn) {
      this.state = PANDING
      this.resolveVal = null
      this.rejectVal = null
      fn(this.resolve.bind(this), this.reject.bind(this))
    }
    resolve(value) {
      let s = setInterval(() => {
        if(this.state !== PANDING) {
          s && clearInterval(s)
          return
        }
        this.state = FULFILLED
        this.resolveVal = value || this.resolveVal
      },4)
    }
    reject(value) {
      let s = setInterval(() => {
        if(this.state !== PANDING) {
          s && clearInterval(s)
          return
        }
        this.state = REJECTED
        this.rejectVal = value || this.rejectVal
      })
    }
  }
~~~

这样就实现了一个简单的Promise方法，并且更改状态之后就不可以在修改状态了,并且用两个变量来接收`resolve`和`reject`两个方法传入的值

* `Promise.then`

~~~js

Promise.prototype.then = function(resolve, reject) {
  let s = setInterval(() => {
    if(this.state !== PANDING) {
      s && clearInterval(s)
      try {
        let success = null
        let fail = null
        // 判断 传入参数的类型并绑定this
        typeof resolve === 'function' && (success = getReturn(resolve.call(this, this.resolveVal)))
        typeof reject === 'function' && (fail = getReturn(reject.call(this, this.rejectVal)))
        if(success) return Promise.resolve(success)
        if(fail) return Promise.resolve(fail)
        return this
      } catch (error) {
        return Promise.reject(error)
      }
    }
  },4)
}
~~~

调用 `then` 方法时判断一下传入的是否是函数，如果是函数就直接调用，并把成功的参数传入
最后的 `return this` 则是为了实现链式结构

* `Promise.catch`

~~~js
  Promise.prototype.catch = function(reject) {
    let s = setInterval(() => {
      if(this.state !== PANDING) {
        s && clearInterval(s)
        try {
          try {
            let fail = null
            typeof reject === 'function' && (fail = getReturn(reject.call(this, this.rejectVal)))
            if(fail) return Promise.resolve(fail)
            return this
          } catch (error) {
            return Promise.reject(error)
          }
        } catch (error) {
          return Promise.reject(error)
        }
      }
    },4)
  }
~~~

* `Promise.finally`

~~~js
  Promise.prototype.finally = function(fn) {
    fn()
    return this
  }
~~~

* `Promise.resolve`

~~~js
  Promise.resolve = function(value) {
    if(value instanceof Promise) return value
    return new Promise((resolve) => {resolve(value)})
  }
~~~

这个稍微有些麻烦，我们需要判断传入的 `value` 是不是 `Promise` 类型的，如果是就可以直接返回，然后调用 `.then` 等方法，否则就需要我们创建一个 Promise 实例并返回


* `Promise.reject`

~~~js
  Promise.reject = function(value) {
    if(value instanceof Promise) return value
    return new Promise((resolve, reject) => {reject(value)})
  }
~~~

但是这里还有许多需要注意的地方，例如`Promise.then`中如果有 return 的话则需要以返回的状态和值为主，如果没有,就以上一次的状态和值为主
同时还需要对代码使用 `try...catch...` 进行容错处理，使得在 catch 中能够拿到错误信息

代码修改如下
~~~js
  Promise.prototype.then = function(resolve, reject) {
    try {
      let success = null
      let fail = null
      // 判断 传入参数的类型并绑定this
      typeof resolve === 'function' && (success = getReturn(resolve.call(this, this.resolveVal)))
      typeof reject === 'function' && (fail = getReturn(reject.call(this, this.rejectVal)))
      if(success) return Promise.resolve(success)
      if(fail) return Promise.resolve(fail)
      return this
    } catch (error) {
      return Promise.reject(error)
    }
  }

  function getReturn(val) {
    if(typeof val === 'function') return val()
    return val
  }
~~~

#### 实现Promise高级语法

* `Promise.all`

~~~js
  Promise.all = function(arr) {
    try {
      if(arr instanceof Array) {
        return new Promise((resolve, reject) => {
          let resolveVal = []
          let isReject = false
          for(let i = 0; i < arr.length; i++) {
            let res = getReturn(arr[i])
            if(res instanceof Promise) {
              res.then(res1 => {
                // 保证数组顺序返回正确
                resolveVal[i] = res1
              }).catch(err => {
                reject(err)
                isReject = true
              })
            }
            else resolveVal.push(res)
            if(isReject) break
          } 
          resolve(resolveVal)
        })
      } else throw new Error('Promise.all must receive Array')
    } catch (error) {
      if(error instanceof Error) throw error
      return Promise.reject(error)
    }
  }
~~~


* `Promise.race`

~~~js
  Promise.race = function(arr) {
    try {
      if(arr instanceof Array) {
        return new Promise((resolve, reject) => {
          if(arr.length === 0) resolve()
          for(let i = 0; i < arr.length; i++) {
            let res = getReturn(arr[i])
            if(res instanceof Promise) {
              res.then(res1 => {
                if(res1) {
                  resolve(res)
                }
              }).catch(err => {
                if(err) {
                  reject(err)
                }
              })
            } else {
              resolve(res)
              break;
            }
          }
        })
      } else throw new Error('Promise.all must receive Array')
    } catch (error) {
      if(error instanceof Error) throw error
      return Promise.reject(error)
    }
  }
~~~

* `promise.allSettled`

~~~js
  Promise.allSettled = function(arr) {
    try {
      if(arr instanceof Array) {
        return new Promise((resolve, reject) => {
          let resolveVal = []
          let length = 0
          if(arr.length === 0) resolve([])
          for(let i = 0; i < arr.length; i++) {
            let res = getReturn(arr[i])
            if(res instanceof Promise) {
              res.then(res1 => {
                if(res1) {
                  resolveVal[i] = {
                    status: FULFILLED,
                    value: res1
                  }
                  if(++length === arr.length) resolve(resolveVal)
                }
              }).catch(err => {
                if(err) {
                  resolveVal[i] = {
                    status: REJECTED,
                    value: err
                  }
                  if(++length === arr.length) resolve(resolveVal)
                }
              })
            } else {
              resolveVal[i] = {
                status: FULFILLED,
                value: res
              }
              if(++length === arr.length) resolve(resolveVal)
            }
          }
        })
      } else throw new Error('Promise.all must receive Array')
    } catch (error) {
      if(error instanceof Error) throw error
      return Promise.reject(error)
    }
  }
~~~

这些代码中还是有很多的bug

#### 全部代码

~~~js
const PANDING = 'panding'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'
class Promise {
  constructor(fn) {
    this.state = PANDING
    this.resolveVal = null
    this.rejectVal = null
    fn(this.resolve.bind(this), this.reject.bind(this))
  }
  resolve(value) {
      if(this.state !== PANDING) {
        return
      }
      this.state = FULFILLED
      this.resolveVal = value || this.resolveVal
  }
  reject(value) {
      if(this.state !== PANDING) {
        return
      }
      this.state = REJECTED
      this.rejectVal = value || this.rejectVal
  }
}
Promise.resolve = function(value) {
  if(value instanceof Promise) return value
  return new Promise((resolve) => {resolve(value)})
}
Promise.reject = function(value) {
  if(value instanceof Promise) return value
  return new Promise((resolve, reject) => {reject(value)})
}

Promise.all = function(arr) {
  try {
    if(arr instanceof Array) {
      return new Promise((resolve, reject) => {
        let resolveVal = []
        let isReject = false
        for(let i = 0; i < arr.length; i++) {
          let res = getReturn(arr[i])
          if(res instanceof Promise) {
              res.then(res1 => {
                resolveVal[i] = res1
              }).catch(err => {
                reject(err)
                isReject = true
              })
          }
          else resolveVal.push(res)
          if(isReject) break
        } 
        resolve(resolveVal)
      })
    } else throw new Error('Promise.all must receive Array')
  } catch (error) {
    if(error instanceof Error) throw error
    return Promise.reject(error)
  }
}
Promise.race = function(arr) {
  try {
    if(arr instanceof Array) {
      return new Promise((resolve, reject) => {
        if(arr.length === 0) resolve()
        for(let i = 0; i < arr.length; i++) {
          let res = getReturn(arr[i])
          if(res instanceof Promise) {
            res.then(res1 => {
              if(res1) {
                resolve(res)
              }
            }).catch(err => {
              if(err) {
                reject(err)
              }
            })
          } else {
            resolve(res)
          }
        }
      })
    } else throw new Error('Promise.all must receive Array')
  } catch (error) {
    if(error instanceof Error) throw error
    return Promise.reject(error)
  }
}
Promise.allSettled = function(arr) {
  try {
    if(arr instanceof Array) {
      return new Promise((resolve, reject) => {
        let resolveVal = []
        let length = 0
        if(arr.length === 0) resolve([])
        for(let i = 0; i < arr.length; i++) {
          let res = getReturn(arr[i])
          if(res instanceof Promise) {
            res.then(res1 => {
              if(res1) {
                resolveVal[i] = {
                  status: FULFILLED,
                  value: res1
                }
                if(++length === arr.length) resolve(resolveVal)
              }
            }).catch(err => {
              if(err) {
                resolveVal[i] = {
                  status: REJECTED,
                  value: err
                }
                if(++length === arr.length) resolve(resolveVal)
              }
            })
          } else {
            resolveVal[i] = {
              status: FULFILLED,
              value: res
            }
            if(++length === arr.length) resolve(resolveVal)
          }
        }
      })
    } else throw new Error('Promise.all must receive Array')
  } catch (error) {
    if(error instanceof Error) throw error
    return Promise.reject(error)
  }
}
Promise.prototype.then = function(resolve, reject) {
  let s = setInterval(() => {
    if(this.state !== PANDING) {
      s && clearInterval(s)
      try {
        let success = null
        let fail = null
        // 判断 传入参数的类型并绑定this
        typeof resolve === 'function' && (success = getReturn(resolve.call(this, this.resolveVal)))
        typeof reject === 'function' && (fail = getReturn(reject.call(this, this.rejectVal)))
        if(success) return Promise.resolve(success)
        if(fail) return Promise.resolve(fail)
        return this
      } catch (error) {
        return Promise.reject(error)
      }
    }
  },4)
}
Promise.prototype.catch = function(reject) {
  let s = setInterval(() => {
    if(this.state !== PANDING) {
      s && clearInterval(s)
      try {
        try {
          let fail = null
          typeof reject === 'function' && (fail = getReturn(reject.call(this, this.rejectVal)))
          if(fail) return Promise.resolve(fail)
          return this
        } catch (error) {
          return Promise.reject(error)
        }
      } catch (error) {
        return Promise.reject(error)
      }
    }
  },4)
}
Promise.prototype.finally = function(fn) {
  fn()
  return this
}

function getReturn(val) {
  if(typeof val === 'function') return val()
  return val
}
~~~