---
title: JavaScript - this 指向问题
date: 2021-01-11 09:30:46
categories: JavaScript
tags:
    - JavaScript
---

this 的指向问题一直是 JavaScript 中一个很重要的问题，我们在日常编程中，经常会遇到在函数中执行的时候，发现从 this 中取不到我们想要的东西，面试的过程中，this 也是经常会被面试官问到的一个问题。

接下来，我们将会在此篇文章中详细的讲解一个 JavaScript 中 this 的获取及指向问题

#### this 获取

在 JavaScript 中一个特殊的关键字 this，通过 this 我们可以获取当前代码块执行环境的对象

我们可以通过 `this.xxx` 来获取到 this 所代表的对象的属性

this 取何值，取决于 this 所处代码块为谁调用的

来看下面这一段代码

~~~js
  var name = 'zhangsan'
  function fn() {
    var name = 'lisi'
    console.log(this.name)
  }
  fn()
~~~

猜一下上述代码 输出的 `name` 是什么？

对的，输出的 `zhangsan`，也许你会问为什么 函数 fn 里面的 this 不是指向函数 fn，这是因为在全局中通过 var 创建的变量也会默认挂载在 window 对象中， 调用 `fn()` 函数的时候，直接调用相当于 `window.fn()`，此时 this 指向调用函数 fn 的对象 即 window，所以输出的是 `zhangsan`。

需要注意一点的是，这段代码在浏览器执行和在 node 环境在执行输出的结果是不一样，因为在  node 环境中 全局对象是 global，而不是 window。

我们对以上代码再次进行改装

~~~js
  var name = 'zhangsan'
  var obj = {
    name: 'lisi',
    fn: function() {
      console.log(this.name)
    }
  }
  var fn = obj.fn
  obj.fn()
  fn()
~~~

上述代码输出的是什么呢？可能有会说输出的都是 `lisi`，因为函数 fn 位于 obj 对象里，所以它的 this 指向 obj，但是我们想说这是一种错误的理解方式，因为 **this 的指向不是由他位于哪个代码块中决定，而是由它所在的代码块由谁调用来决定**。

我们知道函数在执行之前都会经过解析，然后在栈内存中存放解析后的键值对，当解析到 obj 的时候，因为 obj 的类型是 Object 所以会在栈内存中开辟一个新的栈内存，用来存储 obj 的键值对，然后将新建的栈内存通过引用赋予 obj，当解析到 obj 的 fn 函数的时候，同样会开辟一个新的栈内存 `AAAFFF000`，这个栈内存用来存放 fn 的函数字符串

当我们通过 obj 来调用的时候，可以理解为 `AAAFFF000` 这个栈内存 上下文对象是 obj， 此时通过 this 调用的时候，this 指的就是 obj 这个对象

而将 obj.fn 赋值于 fn 的时候，由于 obj.fn 是一个引用对象，所以将 obj.fn 的引用地址复制给了 fn，然后调用 fn 相当于在 window 的环境下执行 `AAAFFF000` 这个代码块，此时的 this 指向 window

所以输出的是
~~~js
  //  'lisi'
  //  'zhangsan'
~~~

接下来我们对这段代码进行进一步改造，然后看一下它的执行结果

~~~js
  var name = 'zhangsan'
  var obj = {
    name: 'lisi',
    fn: (function() {
      console.log(this.name)
      return function() {
        console.log(this.name)
      }
    })()
  }
  var fn = obj.fn
  obj.fn()
  fn()
~~~

你猜到这段代码输出的结果了吗？

这段代码输出的结果是

~~~js
  //  'zhangsan'
  //  'lisi'
  //  zhangsan
~~~
大家看 obj 对象中的 fn 函数，这个函数是一个自执行函数，会在解析的时候就执行，这个时候上下文对象是 window，所以输出的是 'zhangsan' 然后返回一个函数，此时这个 obj.fn 就等于这个 return 回来的函数

后面的输出的数据执行方法和上一个例子是一样的，这里就不在多做赘述

从上述的几个例子我们可以看出 this 的指向并不由它所在的位置决定的，而是他执行的时候环境的执行上下文决定

总结一下 this 指向几种情况

1. 普通函数调用的时候，this 指向 window
2. 通过构造函数 new 关键字创建的，this 指向实例对象
  在通过 new 关键字构造函数时，主要做了以下四件事
  * 首先创建了一个空对象
  * 然后连接到原型，将 obj 的 `__proto__` 指向构造函数的 prototype
  ~~~js
    class A {}
    var a = new A()
    a.__proto__ === A.prototype
  ~~~
  * 通过 `.call(obj)` 将 function 的 this 指向 obj
  * 返回创建的这个对象
3. 通过对象方法调用的时候，函数的 this 指向这个对象
4. 通过时间绑定的方法， this 指向 绑定事件的对象
5. 定时器函数的 this 指向 window

#### 改变 this 指向的几种方法

##### es6 的箭头函数

  先来看一下普通函数的 this 指向
  ~~~js
    function b() {
      function a(){ console.log(this) }
      let c = function() {a()}
      let obj2 = {a,c}
      obj2.a()// {a: fn(), c:fn()}
      obj2.c()// window
    }
    let obj = {b}
    obj.b()//使函数b内上下文this为obj
  ~~~

  如果加上箭头函数
  ~~~js
    function b() {
      let a = () => console.log(this)
      let c = function() {a()}
      let obj2 = {a,c}
      obj2.a()//{b: fn()}
      obj2.c()//{b: fn()}
    }
    let obj = {b}
    obj.b()//{b:fn()}
  ~~~
  从上面的例子可以看出，箭头函数在调用的时候，指向声明的时候所在的上下文

