---
title: JavaScript 原型链
date: 2021-01-14 22:57:43
categories:
    - JavaScript
tags:
    - JavaScript
    - prototype
cover: '/assets/cover/20200225A1295.jpg'
---


当我们定义了一个函数或者对象的时候，自带有属性中有一个属性 `__proto__`，这个属性又被称作原型链，指向构造当前函数的 `prototype`

~~~js
  function Test() {
    this.a = 1
  }
  const test = new Test()
  console.log(test.__proto__)  // {constructor: f}
  console.log(Test.prototype)  // {constructor: f}
  console.log(test.__proto__ === Test.prototype)  // true
~~~

当我们继续打印 `Test.prototype.__proto__` 的时候会发现 Test 的构造函数是 Object，即

~~~js
  console.log(Test.prototype.__proto__ === Object.prototype)  // true
~~~

这个时候就会发现有些特殊的事情，当我们在 Test 的 prototype 属性上添加一些属性或者 Object 的 prototype 上添加一些属性，这时通过 new 构造出来的实例能不能访问到这些属性或者方法呢，接下来让我们尝试一下

~~~js
  function Test() {
    this.a = 1
  }
  const test = new Test()
  Test.prototype.b = 3
  Object.prototype.c = 4

  console.log(test.a)   // 1
  console.log(test.b)   // 3
  console.log(test.c)   // 4
~~~~

这个时候如果我们在 test 实例上新增一个属性 b 并赋值，这时侯打印出来的 test.b 的值是多少呢
~~~js
  function Test() {
    this.a = 1
  }
  const test = new Test()
  Test.prototype.b = 3
  Object.prototype.c = 4
  test.b = 5
  console.log(test.b)   // b
~~~

这是因为 使用 new 构造函数的时候，会自动继承构造函数上的所有方法及属性，当我们在访问实例的某个属性的时候，会现在实例对象上查找是否包含有这个属性，如果包含就直接返回，不包含的话就会在实例的原型链 `__proto__` 上继续查找，如果仍未找到，则会继续通过 `__proto__`一级一级的向上查找，直到找到 原型链的最后一级 `Object`,如果仍未找到就返回 `undefined`

**constructor**

在实例的自身属性及 `__proto__` 属性上有一个 `contructor` 属性，该属性指向 构造当前实例的 构造函数

~~~js
  function Test() {
    this.a = 1
  }
  const test = new Test()
  // 这是因为 使用 new  构造函数的时候 把 Test 的所有属性都赋予了 test
  test.__proto__.constructor  // f Test() {this.a = 1}
  test.constructor  // f Test() {this.a = 1}
~~~

**判断是否包含属性**

如何判断 实例的属性 是在实例自身身上还是在原型链上呢，这时候可以通过 `Object.hasOwnProperty`

~~~js
  function Test() {
    this.a = 1
  }
  const test = new Test()
  Test.prototype.b = 3
  Object.prototype.c = 4
  console.log(test.hasOwnProperty('a')) // true
  console.log(test.hasOwnProperty('b')) // false
  console.log(test.hasOwnProperty('c')) // false
  console.log('a' in test) // true
  console.log('b' in test) // true
  console.log('v' in test) // true
~~~

属性 b 和 c 是挂载到 test 的原型链上的属性，并不属于 test 自身，所以通过 `Object.hasOwnProperty` 访问的时候返回为 false

**特殊的原型 Object 和 Function**

~~~js
  Function.__proto__ === Function.prototype   // true
  Object.__proto__ === Function.prototype   // true
  Object.__proto__ === Function.__proto__   // true
~~~