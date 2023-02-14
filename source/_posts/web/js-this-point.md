---
title: JavaScript - this 指向问题
date: 2021-01-11 09:30:46
categories:
    - JavaScript
tags:
    - JavaScript
    - this
cover: /assets/blogCover/MIKU花(4)_78753717_p1.png
---

this 的指向问题一直是 JavaScript 中一个很重要的问题，我们在日常编程中，经常会遇到在函数中执行的时候，发现从 this 中取不到我们想要的东西，面试的过程中，this 也是经常会被面试官问到的一个问题。

接下来，我们将会在此篇文章中详细的讲解一个 JavaScript 中 this 的获取及指向问题

#### this 指向

在 JavaScript 中一个特殊的关键字 this，通过 this 我们可以获取当前代码块执行环境的对象

我们可以通过 `this.xxx` 来获取到 this 所代表的对象的属性

this 取何值，取决于 this 所处代码块为谁调用的

总结一下 this 指向几种情况
##### 普通函数调用的时候，this 指向 window 又称作默认绑定

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

##### 通过对象方法调用的时候，函数的 this 指向这个对象 又称作隐式绑定

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

  **特殊的例子: 回调函数模式**

  ~~~js
    function foo() {
      function test() {
        console.log(this)
      }
      return test
    }
    foo()()  // window
    // 因为 foo() 执行的相当于返回了 test 再一次调用和调用 test() 方法相等
    // foo()() === test()
  ~~~

  **特殊情况：参数赋值的情况**
  首先上代码
  ~~~js
    var a = 3
    function foo() {
      console.log(this)
    }
    function bar(fn) {
      fn()
    }
    var obj = {
      a: 2,
      foo: foo
    }
    bar(obj.foo)  // window
  ~~~
  
  在 bar 函数中， fn 为形参，在调用 bar 函数传入 obj.foo 实参的时候，实际上相当于隐形的将 obj.foo 赋值于 fn，fn进行调用的时候，正好符合 this 的默认绑定规则，此时 this 指向 window

  总结起来就一句话 
  **函数每次执行的都会有自己的 this 指向，函数单独调用的时候(包括自调用函数)，this 执行 window，以对象的方法调用时候，this 隐式绑定为 该对象**

##### 显示绑定 call，bind，apply

  bind,call,apply都可以改变函数的 this 指向

  ~~~js
    var obj = {
      a: 1
    }
    var a = 2
    function test() {
      console.log(this.a)
    }
    test()            // 2
    test.call(obj)    // 1
    test.bind(obj)    // 1
    test.apply(obj)   // 1
  ~~~

  其中 call 和 apply 在改变 this 指向的时候会自动调用函数，而 bind 只会改变 this 指向并不会执行函数

  call 和 bind 是可以传入多个参数 call(this, arg1, arg2, ...), apply 多个参数需要放到数组里面 apply(this, [arg1, arg2, arg3...])

##### 通过构造函数 new 关键字创建的，this 指向实例对象
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

  ~~~js
    function Fn() {
      console.log(this)
      this.a = 1
    }
    var fn = new Fn() // Fn{}
    console.log(fn.a)  // 1
  ~~~

  如果 Fn 函数 中 return 了一个对象 obj，new 的时候 this 会指向这个 obj对象

  ~~~js
    function Fn() {
      console.log(this)
      this.a = 1
      return {}
    }
    var fn = new Fn() // {}
    console.log(fn.a)  // undefined
  ~~~


通常来说，优先级的顺序大概是  new > call/bind/apply  > 隐式绑定 > 默认绑定

~~~js
  var a = 'window'
  function test() {
    console.log(this.a)
  }
  var obj = {
    a: 'obj’,
    test: test
  }
  var obj2 = {
    a: 'obj2'
  }
  test()                // window
  test.call(obj)         // obj
  obj.test.call(obj2)    // obj2
  new obj.test()         // undefined  this 指向 test{}

~~~
#### 特殊的 this 指向

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
  也可以说 箭头函数 是没有 this，他的 this 全由所处上下文对象的 this 指向决定，一旦this 指向确定，无法通过 new/call/bind/apply/隐式绑定/显示绑定等方法修改this指向

