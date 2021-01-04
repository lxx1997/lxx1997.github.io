---
title: 函数 - 函数反柯里化（uncurrying）
date: 2020-12-17 11:00:35
categories: thought
tags:
    - thought
    - javascript
    - function
---

[参考链接](https://segmentfault.com/a/1190000012912503)

> [函数柯里化](/lxx1997.github.io/2020/12/17/fucntion-currying/)

#### 含义

  **柯里化：**是固定部分参数,返回一个接受剩余参数的函数,也称为部分计算函数,目的是为了缩小适用范围，创建一个针对性更强的函数，核心思想是把多参数传入的函数拆成单(部分)参数函数，内部再返回下一个单(部分)参数函数，依次处理剩余函数

  **反柯里化：**扩大适用范围，创建一个应用范围更广的函数，使本来只有特定对象才适用的方法，扩展到更多对象

#### 通用实现

  ~~~js
    // 第一种实现方式
    Function.prototype.unCurrying = function() {
      const self = this
      // ...rest 方法相当于使用es6语法的解构赋值使用rest接收入参数组，相当于arguments rest的值是传入的所有参数组成的一个数组
      return function(...rest) {
        return Function.prototype.call.apply(self, rest)
      }
    }
    const push = Array.prototype.push.unCurrying()
    /*
      * 1 为 Function 原型添加 unCurrying 方法，并在执行的时候保存执行 unCurrying 的方法到self
      * 2 借用apply把要借用的函数作为this环境赋予call，并传入之后的形参作为参数执行
    */

    // 第二种实现方式
    Function.prototype.unCurrying = function() {
      return this.call.bind(this)
    }

    // 第三种实现方式
    function unCurrying(fn) {
      return function(tar, ...argu) {
        return fn.apply(tar, argu)
      }
    }
  ~~~

#### 使用反柯里化

  ~~~js
    Function.prototype.unCurrying = function() {
      const self = this
      return function(...rest) {
        console.log(rest, 'uncurrying rest')
        
        return Function.prototype.call.apply(self, rest)
      }
    }
    const push = Array.prototype.push.unCurrying()
    ~function(...rest) {
      console.log(rest, 'before')
      push(rest, 4, 5)
      console.log(rest, 'after')
    }(1,2,3)
  ~~~

  反柯里化其实反映的是一种思想 - 扩大方法的适用范围

  ~~~js
    Function.prototype.unCurrying = function() {
      const self = this
      return function(...rest) {
        console.log(rest, 'uncurrying rest')
        
        return Function.prototype.call.apply(self, rest)
        // Array.prototype.push.call({a: 3}, 4, 5)
      }
    }
    const push = Array.prototype.push.unCurrying()
    ~function() {
      let rest = {a: 3}
      console.log(rest, 'before')
      push(rest, 4, 5)
      console.log(rest, 'after')
    }(1,2,3)
  ~~~

  只要是方法就可以借用 unCurrying 方法

  ~~~js
    // call
    var call = Function.prototype.call.unCurrying()
    function $(id) {
      return this.getElementById(id)
    }
    // call()
    call($, document, 'demon')
    /*
      * 解题步骤
      * => Function.prototype.call.apply(Function.prototype.call, [$, document, 'demon'])
      * => Function.prototype.call.call($, document, 'demon')
      * => $.call(document, 'demon')
      * => document.getElementById('demon)
    */
    // unCurrying 借用自己本身
    const unCurrying = Function.prototype.unCurrying.unCurrying()
    const map = unCurrying(Array.prototype.map)
    map({0: 4, 1: 'a', 2: null, length: 3}, n => n + n)
    /*
      * const map = unCurrying(Array.prototype.map) 步骤
      * => Function.prototype.call.apply(Function.prototype.unCurrying, [Array.prototype.map])
      * => Function.prototype.unCurrying.call(Array.prototype.map)
      * => Array.prototype.map.unCurrying()
      * => map = Array.prototype.map.unCurrying()
      * => map({0: 4, 1: 'a', 2: null, length: 3}, n => n + n)
      * => Function.prototype.call.apply(Array.prototype.map, [{0: 4, 1: 'a', 2: null, length: 3}, n => n + n])
      * => Array.prototype.map.call({0: 4, 1: 'a', 2: null, length: 3}, n => n + n)
      * => {0: 4, 1: 'a', 2: null, length: 3}.map(n => n + n)
      * => {0: 8, 1: 'aa', 2: 0, length: 3}
    */
  ~~~~

#### 总结

  函数柯里化
  ~~~js
    function(arg1, arg2)               // function(arg1)(arg2)
    function(arg1, arg2, arg3)         // function(arg1)(arg2)(arg3)
    function(arg1, arg2, arg3, arg4)   // function(arg1)(arg2)(arg3)(arg4)
  ~~~
  反柯里化
  
  ~~~js
    obj.fn(arg1, arg2)             //  fn(obj, arg1, arg2)
  ~~~

#### 终点知识解析

 1. `Function.prototype.call.apply(self, rest)`

    小例子：
    ~~~js
      Math.Max.apply([], [1, 2, 3])
    ~~~
    > 先执行 apply 将 math 替换成 []
    > 然后在执行 Max 并传入[1,2,3],此时因为 apply 的关系  [1,2,3]扁平化为1,2,3

    `Function.prototype.call.apply(self, rest)`过程

    * `Function.prototype.call.apply(Array.prototype.push, rest)`
    * `Array.prototype.push.call(...rest)` *所以在传递 rest 的时候，需要操作的对象放在第一位，方便 call 绑定 this*
    * rest[0].push(rest.shift(1))

    ~~~js
      var obj = {a: 3}
      Array.prototype.push.call(obj, 4, 5) // 2
      obj // {0: 4, 1: 5, a: 3, length: 2}
      var obj = {a: 3, b: 3}
      Array.prototype.push.call(obj, 4, 5) // 2
      obj //{0: 4, 1: 5, a: 3, b: 3, length: 2}
    ~~~
