---
title: new Object() 和 Object.create() 的区别
date: 2021-01-04 20:46:00
updated: 2021-01-04 20:46:00
categories:
    - JavaScript
tags:
    - JavaScript
cover: /assets/blogCover/Day18 I’m Not Human_100789898.png
---

  今天我们来谈一谈通过 `new Object()` 和 `Object.create()` 创造的对象有什么区别

  首先这两个方法都可以用来创建一个对象

  ~~~js
    var a = new Object()
    var a = Object.create()
    // 或者
    var a = new Object(obj)
    var a = Object.create(obj)
  ~~~

  但是这两个方法创建的对象是有一些不同

  1. `new Object()` 创建的对象是通过构造函数创建的对象，添加的属性是在自身实例下面
     `Object.create()` 创建的对象可以理解为继承一个对象，添加的属性是在 `__proto__` 属性下面

    ~~~js
      var a = {a: 1}
      var b = new Object(a)
      console.log(b)            // {a: 1}
      var c = Object.create(a)
      console.log(c)            // {}
      console.log(c.__proto__)  // {a: 1}
    ~~~

  2. `new Object()` 创建空对象的时候也是有 `__proto__` 原型链的
     `Object.create()` 创建空对象是没有 `__proto__` 原型链的

    ~~~js
      var b = new Object()
      console.log(b)            // {}
      console.log(b.__proto__)  // {a: 1}
      var c = Object.create(a)  // 此时有数据，不多描述
      console.log(c)            // {}
      console.log(c.__proto__)  // undefined
    ~~~

  3. 使用 `Object.create({}, {p: {value: 42}})` 创建的对象访问时，p的值不可修改，不可枚举

  ~~~js
    var c = Object.create({}, {p: {value: 42}})  // 此时有数据，不多描述
    console.log(c)            // {p: 42}
    c = Object.create({}, {p: 42})      // 此时会报错 VM587:1 Uncaught TypeError: Property description must be an object: 42  要求我们 p 的值 42，要放在一个对象中
    Object.keys(c)            // []
  ~~~

