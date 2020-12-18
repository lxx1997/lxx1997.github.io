---
title: javascript之arguments.callee
date: 2020-05-05 10:59:56
categories: javascript
tags:
      - javascript
---

arguments.callee 在哪个函数中执行，它就代表哪个函数，通常用于匿名函数中
在匿名函数中，有时需要自己调用自己，但是由于是匿名函数，没有名字，无法调用，这时可以用arguments.callee来代替匿名的函数

~~~js
(function(n) => {
    if(n > 1) {
        return n * arguments.callee(n-1)
    } else {
        return n
    }
})()
~~~
<!---more--->
or
~~~js
// 也是立执行函数的一种
~~function(n) => {
    if(n > 1) {
        return n * arguments.callee(n-1)
    } else {
        return n
    }
}()

~~~

计算n的阶乘