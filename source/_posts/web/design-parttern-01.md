---
title: JavaScript 设计模式联系  -  创建型设计模式
date: 2021-06-14 18:25:20
updated: 2021-06-14 18:25:20
tags:
    - JavaScript
cover: /assets/blogCover/Day18 I’m Not Human_100789898.png
---


#### 简单工厂模式

> 简单工厂模式(Simple Factory) 又叫静态工厂模式，由一个工厂对象决定创建摸一种产品对象类的实例

> 简单工厂模式的理念就是创建对象，提取多个类似需求中相同部分，针对不同的地方进行特殊处理

~~~js
  function factory(object) {
    const Factory = new Object()
    // 相同的部分
    Factory.name = object.name
    Factory.age = object.name

    // 不同的部分
    switch(object.type) {
      case 'type1':
        // 特殊处理
        break;
      case 'type2':
        // 特殊处理
        break;
      default:
        break;
    }

    return Factory
  }
~~~

#### 工厂方法模式

> 工厂方法模式(Factory Methods) 通过对产品类的抽象使其创建业务，主要负责用于创建多累产品的实例

> 工厂方法模式的本意是将时间创建对象工作推迟到了子类当中，这样核心类就成为了抽象类，在使用工厂方法模式时，需要使用安全策略来防止我们每次获取到的不是想要的对象

##### 安全策略

~~~js
  function Factory() {
    if(this instanceof Factory) {
      return this
    } else {
      return new Factory()
    }
  }
~~~

通过以上代码在实例化对象的时候判断一下是否是创建对象实例，如果不是则返回一个新的实例，以便能获取到预期的对象

##### 工厂方式模式代码

~~~js
  
  function Factory(type, content) {
    if(this instanceof Factory) {
      return this[type](content)
    } else {
      return new Factory(type, content)
    }
  }
  Factory.prototype.Car = {

  }
  Factory.prototype.Pat = {
    
  }
  Factory.prototype.Clothes = {
    
  }
~~~

#### 抽象工厂模式

> 抽象工厂模式(Abstract Factory) 通过对类的工厂抽象使其业务用于**产品类簇**的创建，而不是创建某一类产品的实例

抽象类工厂其实是实现子类继承父类的方法，我们需要通过传递子类以及要继承父类的名称，并且在抽象工厂方法中增加一次对抽象类存在性的判断，如果存在，子类继承父类的方法。
子类继承了父类的所有的属性和方法，如果子类中没有方法或者属性覆盖父类方法，当调用的时候，会直接返回父类的属性和方法。

抽象类工厂的主要作用是，当子类调用了自己本身不存在且不需要的方法是，会给予提示

~~~js
  function Abstract(child, parent) {
    if(typeof Abstract[parent] === 'function') {
      // 定义一个空的父类
      function F() {}
      F.prototype = new Abstract[parent]()

      child.constructor = child
      child.prototype = new F()
    } else {
      throw new Error('未找到改抽象类')
    }
  }
  Abstract.Car = function() {
    this.type = 'car'
  }
  Abstract.Car.prototype = {
    getName: function () {
      throw Error('抽象类方法无法调用')
    },
    getPrice: function() {
      throw Error('抽象类方法无法调用')
    }
  }

  function Aodis() {
    this.name = 'aodi'
    this.price = 12312
  }
  Abstract(Aodis, 'Car')
  console.log(Aodis)
  Aodis.prototype.getName = function() {
    console.log(this.name)
  }
  const aodi = new Aodis()

  aodi.getName()
  aodi.getPrice()
~~~

##### 抽象类

> 抽象类是一种声明了但是无法使用的类，当你调用抽象类的方法时就会报错，我们可以手动在类型的方法中进行错误提示

~~~js
  function Abstract() {}
  Abstract.prototype = {
    getName() {
      console.log('抽象方法无法使用！！！')
    },
    getPrice() {
      console.log('抽象方法无法使用！！！')
    }
  }
~~~
当我们通过**继承**或者直接使用的方式来调用抽象类中方法时，会直接抛出错误

