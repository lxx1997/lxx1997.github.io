---
title: 《你不知道javascript》 知识点摘录
date: 2020-11-20 09:44:55
categories:
    - reading
tags:
    - reading
cover: /assets/blogCover/MIKU花(4)_78753717_p1.png
---

#### 第一部分  类型和语法
* `&&` 运算符的优先级高于 `||`, 而 `||` 的优先级高于 `? :`, `&&` `||` 是左关联， `? :` 是右关联

* 在 `try...catch...`中，如果包含在for循环中，在一定情况下会在i++执行之前执行，如果在`try...catch...`中，加入`yield`, 由于`yield`的特性，try并未结束，因此catch、finally并不会立即执行
    *finally中的return会覆盖try和catch中的return的返回值*

* `switch`
  * `switch`中的匹配算法是`===`
  * `case` 中的表达式尽量不要使用 `&& or ||`，因为匹配的数值并一定严格相等



* 判断字段类型
  * `typeof`  
  * `instanceof`
  * `Object.prototype.toString.call(obj)`

* 再给html标签添加`id`标签的时候回默认添加一个和标签相同名称的全局变量

* 在script标签中是使用javascript语言，如果语句中包含`</script>`则会被视为script标签的结束，应该使用`"</sc" + "ript>"`来代替

#### 第二部分 异步和性能

* **尽量避免发送同步的ajax请求，因为这样会锁定浏览器的UI,并且阻塞所用的用户交互**

* javascript从不跨线程共享数据

###### New Promise()

* `Promise.all()`
  `Promise.all`可以将多个`Promise`实例包装成一个新的`Promise`实例，同时，成功和失败的返回值是不同的, 成功的时候返回一个结果数据，失败的时候则最先被`reject`失败的状态的值

  *返回的成功的结果的数据顺序和`Promise.all`接收到的数组顺序是一致的*
  **如果有一个`promise`被拒绝， 主Promise.all()就会被立刻拒绝，并丢弃来自其他所有promise的全部结果**

  ~~~js
    function add(fun1, fun2) {
      return Promise.all([fun1, fun2]).then(values => {
        return values
      })
    }
    const fun1 = new Promise((resolve, reject) => {
        resolve(2)
      })
    const fun2 = new Promise((resolve, reject) => {
        resolve(4)
      })
    add(fun1, fun2).then(values => {
      console.log(values) // [2, 4]
    })
  ~~~

* `Promise.race`

  `Promise.race` 竞赛模式 只要传入的数组里面那个结果先出来，就返回哪个结果（不论返回的接口是成功还是失败）

  ~~~js
    let p1 = new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve('success')
      },1000)
    })

    let p2 = new Promise((resolve, reject) => {
      setTimeout(() => {
        reject('failed')
      }, 500)
    })

    Promise.race([p1, p2]).then((result) => {
      console.log(result)
    }).catch((error) => {
      console.log(error)  // 打开的是 'failed'
    })
  ~~~

* 调用Promise的then()时，只传入一个完全处理函数，一个默认拒绝处理函数就会顶替上来，把错误重新抛出，是的错误可以沿着Promise链传递下去，知道遇到显式定义的拒绝处理函数

* `Promise.finally` 通常用来处理被丢弃或者忽略的promise, 如果有需要释放的资源可以在finally进行释放

* `Promise.none`

  所有的promise都被拒绝才返回

* `Promise.any`

  至少需要一个promise完成就返回

* `Promise.first`

  只要第一个Promise完成，后续任何拒绝和完成都会忽略

* `Promise.last`

  只有最后一个完成的Promise胜出

* 并发迭代 `Promise.map`

  ~~~js
    // 封装Promise.map
    if(!Promise.map) {
      Promise.map = function(vals, cb) {
        return Promise.all(
          vals.map(function(val) {
            return new Promise( function(resolve) {
              cb(val, resolve)
            })
          })
        )
      }
    }

    // 使用Promise.map

    Promise.map([p1, p2, p3], function(pr, done) {
      promise.resolve(pr).then((v) => {
        done(v * 2)
      }, done)
    }).then((values) => {
      console.log(values)
    })
  ~~~

* `try...catch...` 不能和`Promise`连用，`try...catch...`只有在同步的情况下才能捕捉到异常，任何异步的错误都将无法捕捉到

* 一些无效的使用`Promise API`: `new Promise(null)`、 `Promise.all()`、`Promise.race(42)`

###### 生成器 `function *foo(){ }`

* 定义生成器函数

~~~js
  function *foo() {
    // what to do...
  }
~~~

* 调用生成器函数

~~~js
  // 在此处创建了一个生成器foo
  function *foo(x, y) {
    return x + y
  }
  // 创建一个的迭代器对象，将迭代器对象赋值给了变量it
  var it = foo(3, 4)
  // 调用it.next() 指示生成器从当前的位置继续运行，停留在下一个yield或者生成器结束
  var res = it.next()
  res.value   // 7
~~~

  需要的`next()` 调用比`yield`语句多一个，因为第一个`next()`用来启动一个生成器，并运行到第一个`yield`处，第二个`next()`调用完第一个被暂停的`yield`表达式，第三个`next()`调用完成第二个`yield`，依次类推

  **可以通过next向yield表达式传值**

  `yield` 和 `next()`组合起来，在生成器的执行过程中，构成了一个双向消息传递系统

  ~~~js
    function *foo(x) {
      var y = x * (yield "hello")
      return y
    }
    var it = foo(6)  //初始化一个迭代器 it
    var res = it.next()
    res.value  // hello

    var res = it.next(7)
    res.value  // 42
  ~~~

  最后一个`next()`由`return`来回答 `value`为`return` 出来的值，如果生成器中没有`return`，会有一个假定的，隐式的`return`，会在默认的情况下回答最后的`next()`调用提出的问题

* 多个迭代器

  ~~~js
    function *foo() {
      var x = yield 2
      z++
      console.log(z, 'z')
      var y = yield (x * z)
      console.log(x,y,z)
    }

    var z = 1
    var it1 = foo()  // 第一个迭代器
    var it2 = foo()  // 第二个迭代器

    var val1 = it1.next().value
    var val2 = it2.next().value

    console.log(val1, val2, "val1, val2")

    val1 = it1.next(val2 * 10).value
    val2 = it2.next(val1 * 5).value
    console.log(val1, val2, "val1, val2, two")

    it1.next(val2 / 2)
    it2.next(val1 / 4)

    // console
    // 2 2 val1, val2
    // 2 z
    // 3 z
    // 40 600 val1, val2, two
    // 20 300 3
    // 200 10 3
  ~~~

  *多个迭代器交互的时候，生成器中包含有全局变量时，会对全局变量造成污染*

  **可以用于记录函数生成的最后一个值**

  ~~~js
    var something = (function () {
      var nextVal
      return {
        [Symbol.interator]: function() {
          return this
        },
        next: function() {
          if(nextVal === undefined) {
            nextVal = 1
          } else {
            nextVal = (3 * nextVal) + 6
          }
          return {done: false, value: nextVal}
        }
      }
    })()

    something.next().value // 1
    something.next().value // 9
    something.next().value // 33
  ~~~

  `es6`新增了一个`for ... of ...`循环，意味着可以通过原生循环语法自动贴袋标准迭代器

  ~~~js
    for (var v of something) {
      console.log(v)
      if(v > 10) {
        break;
      }
    }
  ~~~

* 终止生成器

  `for ... of ...` 循环内的break会触发finally语句，终止生成器，也可以在外部调用`it.return(..)`手动终止生成器的迭代器实例

  调用`it.return`之后会立刻终止生成器，运行finally语句