---
title: JavaScript - 手写一个 Promise 方法
cover: /assets/blogCover/39_80002807.png
date: 2023-03-13 16:22:04
updated: 2023-03-13 16:22:04
categories:
    - JavaScript
tags:
    - JavaScript
---

手动实现 promise, 下面hi全部的代码,写了差不多有两个小时，并且附上示例

之前也有一版，不过我觉得这一版更好理解一些
~~~js
// this code for create a new promise

const PROMISE_PADDING = "padding"
const PROMISE_FULLFILLED = "fullfilled"
const PROMISE_REJECTED = "rejected"

class newPromise {
  constructor(func) {
    this.status = PROMISE_PADDING
    this.value = undefined
    this.resolveCB = []
    this.rejectCB = []

    const resolve = (val) => {
      if(this.status !== PROMISE_PADDING) {
        return
      }
      this.value = val
      this.status = PROMISE_FULLFILLED
      this.resolveCB && this.resolveCB.map(fn => {
        this.value = fn(this.value)
      })
    }

    const reject = (val) => {
      if(this.status !== PROMISE_PADDING) {
        return
      }
      this.value = val
      this.status = PROMISE_REJECTED
      this.rejectCB && this.rejectCB.map(fn => {
        this.value = fn(this.value)
      })
    }
    try {
      func(resolve, reject)
    } catch (error) {
      reject(error.message)
    }
  }

  then(res, rej) {
    res = typeof res !== "function" ? (val) => val : res
    rej = typeof rej !== "function" ? (val) => val : rej

    return new newPromise((resolve, reject) => {
      if(this.status === PROMISE_PADDING) {
        // 这里之所以用 个函数包围住，主要是因为多次使用 .then 的时候，后面的 then 拿到的是前一个then 返回的实例，所以会出现，后面的then，无法执行
        // 使用函数包裹之后，然后调用 resolve 和reject 保证后续 then 方法能够拿到正确的值
        this.rejectCB.push(() => {
          try {
            let val = rej(this.value)
            reject(val)
          } catch (error) {
            reject(error.message)
          }
        })
        this.resolveCB.push(() => {
          try {
            let val = res(this.value)
            resolve(val)
          } catch (error) {
            reject(error.message)
          }
        })
      }
      if(this.status === PROMISE_FULLFILLED) {
        try {
          this.value = res(this.value)
          resolve(this.value)
        } catch (error) {
          reject(error.message)
        }
      }
      if(this.status === PROMISE_REJECTED) {
        try {
          this.value = rej(this.value)
          reject(this.value)
        } catch (error) {
          reject(error.message)
        }
      }
    })
  }

  catch(rej) {
    return this.then(undefined, rej)
  }

  static resolve(fn) {
    fn = typeof fn !== "function" ? (val) => val : fn
    if(fn instanceof newPromise) {
      return fn
    }
    return new newPromise((resolve, reject) => {
      try {
        this.value = fn()
        resolve(this.value)
      } catch (error) {
        reject(error.message)
      }
    })
  }

  static reject(fn) {
    fn = typeof fn !== "function" ? (val) => val : fn
    if(fn instanceof newPromise) {
      return fn
    }
    return new newPromise((resolve, reject) => {
      try {
        this.value = fn()
        reject(this.value)
      } catch (error) {
        reject(error.message)
      }
    })
  }

  static all(...args) {
    return new newPromise((resolve, reject) => {
      let arr = []
      if(args.length === 0) {
        resolve([])
        return
      }
      for(let i = 0; i < args.length; i++) {
        let item = args[i]
        if(!(item instanceof newPromise)) {
          item = newPromise.resolve(item)
        }
        console.log(item instanceof newPromise)
        item.then(res => {
          arr[i] = {
            status: PROMISE_FULLFILLED,
            value: res
          }
          if(arr.every(item => item) && arr.length === args.length) {
            resolve(arr)
          }
        }, rej => {
          reject(rej)
        })
      }
    })
  }
  static allSettled(...args) {
    return new newPromise((resolve, reject) => {
      let arr = []
      if(args.length === 0) {
        resolve([])
        return
      }
      for(let i = 0; i < args.length; i++) {
        let item = args[i]
        if(!(item instanceof newPromise)) {
          item = newPromise.resolve(item)
        }
        item.then(res => {
          arr[i] = {
            status: PROMISE_FULLFILLED,
            value: res
          }
          if(arr.every(item => item) && arr.length === args.length) {
            resolve(arr)
          }
        }, rej => {
          arr[i] = {
            status: PROMISE_REJECTED,
            value: rej
          }
          if(arr.every(item => item) && arr.length === args.length) {
            resolve(arr)
          }
        })
      }
    })
  }
  static race(...args) {
    return new newPromise((resolve, reject) => {
      let arr = []
      if(args.length === 0) {
        resolve([])
        return
      }
      for(let i = 0; i < args.length; i++) {
        let item = args[i]
        if(!(item instanceof newPromise)) {
          item = newPromise.resolve(item)
        }
        item.then(res => {
          resolve(res)
        }, rej => {
          rej(arr)
        })
      }
    })
  }
  static any(...args) {
    return new newPromise((resolve, reject) => {
      let arr = []
      if(args.length === 0) {
        resolve([])
        return
      }
      for(let i = 0; i < args.length; i++) {
        let item = args[i]
        if(!(item instanceof newPromise)) {
          item = newPromise.resolve(item)
        }
        item.then(res => {
          resolve(res)
        }, rej => {
          arr[i] = {
            status: PROMISE_FULLFILLED,
            value: rej
          }
          if(arr.every(item => item) && arr.length === args.length) {
            reject(arr)
          }
        })
      }
    })
  }
}

// new newPromise((resolve, reject) => {
//   setTimeout(() => {
//     resolve(1000)
//   }, 2000);
// }).then((res => {
//   console.log(res, "res1")
// })).then(res => {
//   console.log(res, "res4")
// })
// new newPromise((resolve, reject) => {
//   // resolve(1000)
//   throw new Error(12345)
// }).then(res => {
//   console.log(res, "res2")
//   return res
// }).then(res => {
//   console.log(res, "res3")
// }).catch(err => {
//   console.log(err, "err")
// })
// newPromise.resolve(() => {
//   return 10000
// }).then(res => {
//   console.log(res)
// })
// newPromise.all(() => {throw new Error(123)},() => 234, new newPromise((resolve) => setTimeout(() => resolve(1000), 1000))).then(res => {
//   console.log(res)
// }, err => {
//   console.log(err)
// })
// newPromise.allSettled(() => {throw new Error(123)},() => 234, new newPromise((resolve) => setTimeout(() => resolve(1000), 1000))).then(res => {
//   console.log(res)
// }, err => {
//   console.log(err)
// })
// newPromise.race(() => {throw new Error(123)},() => 234, new newPromise((resolve) => setTimeout(() => resolve(1000), 1000))).then(res => {
//   console.log(res)
// }, err => {
//   console.log(err)
// })
Promise.race([new Promise((resolve, reject) => {
  setTimeout(() => reject(3234), 500)
}), new Promise((resolve) => {
  setTimeout(() => resolve(1000), 1000)
})]).then(res => {
  console.log(res)
}, err => {
  console.log(err)
})
newPromise.any(() => {throw new Error(123)},() => 234, new newPromise((resolve) => setTimeout(() => resolve(1000), 1000))).then(res => {
  console.log(res)
}, err => {
  console.log(err)
})
// promise.then((res) => {
//   console.log(res)
// }).then(res => {
//   console.log(res, "res")
//   throw new Error("1234")
// }).catch((err) => {
//   console.log(err, "1234")
// })

// Promise.resolve(100).then((res) => {
//   console.log(res, "promise")
// }).then(res => {
//   console.log(res, "promise res")
// })
~~~
