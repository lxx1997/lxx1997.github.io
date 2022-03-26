---
title: 函数 - 函数柯里化（Currying）
date: 2020-12-17 09:16:37
categories: thought
tags:
    - thought
    - JavaScript
    - function
cover: '/assets/cover/20200225A1295.jpg'
---
[参考文章](https://www.cnblogs.com/pigtail/p/3447660.html)
> [函数反柯里化](/lxx1997.github.io/2020/12/17/fucntion-uncurrying/)

函数柯里化其实本身是固定一个可以预期的参数，并返回一个特定的函数，处理批特定的需求，增加了函数的适用性，降低了函数的适用范围

**柯里化函数**通用实现

~~~js
  function currying(fn) {
    var slice = Array.prototype.slice,
        // 取出传入的多个参数(不包含第一位)
        _args = slice.call(arguments, 1)
    
    return function() {
      var _inargs = slice.call(arguments)
      // 将创建柯里化函数传入的参数与后传入的参数进行合并
      return fn.apply(null, _args.concat(_inargs))
    }
  }
~~~

1. 提高适用性

  解决了兼容性问题，但同时也会再来，使用的不便利性，不同的应用场景往，要传递很多参数，以达到解决特定问题的目的。有时候应用中，同一种规则可能会反复使用，这就可能会造成代码的重复性。

  ~~~js
    function square(i) {
        return i * i;
    }

    function dubble(i) {
        return i *= 2;
    }

    function map(handeler, list) {
        return list.map(handeler);
    }

    var mapSQ = currying(map, square);
    mapSQ([1, 2, 3, 4, 5]);
    mapSQ([6, 7, 8, 9, 10]);
    mapSQ([10, 20, 30, 40, 50]);

    var mapDB = currying(map, dubble);
    mapDB([1, 2, 3, 4, 5]);
    mapDB([6, 7, 8, 9, 10]);
    mapDB([10, 20, 30, 40, 50]);
  ~~~

  *缩小了函数的适用范围，但同时提高函数的适性*

  ~~~js
    function Ajax() {
      this.xhr = new XMLHttpRequest();
    }

    Ajax.prototype.open = function(type, url, data, callback) {
      this.onload = function() {
        callback(this.xhr.responseText, this.xhr.status, this.xhr);
      }

      this.xhr.open(type, url, data.async);
      this.xhr.send(data.paras);
    }

    'get post'.split(' ').forEach(function(mt) {
      Ajax.prototype[mt] = currying(Ajax.prototype.open, mt);
    });

    var xhr = new Ajax();
    xhr.get('/articles/list.php', {},
    function(datas) {
      // done(datas)    
    });

    var xhr1 = new Ajax();
    xhr1.post('/articles/add.php', {},
    function(datas) {
      // done(datas)    
    });
  ~~~

2. 延迟执行

  不断地柯里化，累计传入的参数，最后执行

  ~~~js
    var add = function() {
      var _this = this,
      _args = arguments
      return function() {
        if (!arguments.length) {
          var sum = 0;
          for (var i = 0, i< _args.length; i++ {
            sum += _args[i]
          }
          return sum
        } else {
          // 通过函数的push方法，存储每一次调用的返回参数到 _args 中
          Array.prototype.push.apply(_args, arguments)
          // arguments.callee 返回的是arguments所在函数本身，此操作相当于return
          return arguments.callee
        }
      }
    }
    add(1)(2)(3)(4)();//10

    // 通用的写法
    var curry = function(fn) {
      var _args = []
      return function cb() {
        if (arguments.length == 0) {
          return fn.apply(this, _args)
        }
        Array.prototype.push.apply(_args, arguments);
        return cb;
      }
    }
  ~~~

3. 固定异变因素

  提前把易变因素，传参固定下来，生成一个更明确的应用函数。最典型的代表应用，是bind函数用以固定this这个易变对象。
  ~~~js
    Function.prototype.bind = function(context) {
      var _this = this,
      _args = Array.prototype.slice.call(arguments, 1);
      // arguments [this, arg1, arg2 ...]
      return function() {
        // 绑定 this 到创建柯里化函数时绑定的this，同时合并参数
        return _this.apply(context, _args.concat(Array.prototype.slice.call(arguments)))
      }
    }
  ~~~

