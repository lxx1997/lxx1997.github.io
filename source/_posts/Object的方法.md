---
title: Object的方法
date: 2020-11-26 17:54:45
tags:
cover: '/assets/cover/20200225A1295.jpg'
---

#### 属性

* Object.length  值为1

* Object.prototype  可以为所有的Object类型的对象添加属性

#### 方法

* Object.assign()

  用于将所有可枚举属性的值从一个或多个源对象分配到目标对象，并返回目标对象

  此方法只会拷贝源对象自身的并且可枚举的属性到目标对象，该方法调用源对象的get和目标对象的set，如果为了将属性定义复制到原型应使用`Object.getOwnPropertyDescriptor()`和`Object.defineProperty()`

  `Object.assign()`是浅拷贝,会改变源对象的值



* Object.create()

  创建一个新对象，使用现有的对象来提供新创建的对象的`__proto__`

* Object.defineProperty()

* Object.defineProperties()

* Object.entries()

* Object.freeze()

* Object.getOwnPropertyDescriptor()

* Object.getOwnPropertyNames()

* Object.getOwnPropertySymbols()

* Object.getPrototypeOf()

* Object.is()

* Object.isExtensible()

* Object.isFrozen()

* Object.isSealed()

* Object.keys()

* Object.preventExtensions()

* Object.seal()

* Object.setPrototypeOf()

* Object.values()

#### 属性

* Object.prototype.constructor

  返回创建实例对象的`Object`构造函数的引用，此属性的值是对函数本身的引用，而不是一个包含函数名称的字符串

  所有的对象都会从他的原型上继承一个`constructor`属性

* Object.prototype.__proto__

   *该特性已从Web标准中删除，但是目前一些浏览器仍然支持，但是在未来某个时间停止使用，请尽量不要使用该特性*

   该属性是一个访问器属性(一个getter函数和setter函数)，暴露了通过它访问的对象的内部prototype(一个对象或null)

   推介使用`Object.getPrototypeOf/Reflect.getPrototypeOf`和`Object.setPrototypeOf/Reflect.setPrototypeOf`(*设置对象的prototype是一个缓慢的过程，会影响性能，应该尽量避免*)

* Object.prototype.__noSuchMethod__

* Object.prototype.__count__  *已被废弃*

* Object.prototype.__parent__ *已被废弃*

#### 方法

* Object.prototype.__defineGetter__()

* Object.prototype.__defineGetter__()

* Object.prototype.__lookupGetter__()

* Object.prototype.__lookupSetter__()

* Object.prototype.hasOwnProperty()

* Object.prototype.isPprototypeOf()

* Object.prototype.propertyIsEnumerable()

* Object.prototype.toSource()

* Object.prototype.toLocaleString()

* Object.prototype.toString()

* Object.prototype.unwatch()

* Object.prototype.valueOf()

* Object.prototype.watch()

* Object.prototype.eval()  *已废弃*
