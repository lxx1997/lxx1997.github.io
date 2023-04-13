---
title: 常用的设计模式
cover: /assets/blogCover/miku散发（重新上传）_73247827.png
date: 2023-04-10 22:30:43
updated: 2023-04-10 22:30:43
categories:
    - [JavaScript]
    - [web]
tags:
    - JavaScript
    - web
---


## 工厂模式

    通过工厂模式，可以让我们使用同一个类时，根据不同传参，创建不同类型的实例以满足我们的需求
~~~js
class Factory {
    constructor(type, data) {
        switch(type) {
            case "type1":
                return new Type1(data)
            case "type2":
                return new Type2(data)
            default:
                return new TypeDefault(data)
        }
    }
}
~~~
## 抽象工厂模式

    抽象模式主要在与对于类的一些结构进行抽象化处理，如果继承于该类的类直接调用，会抛出错误，需要继承类重新实现这个方法

    主要用于对方法的处理，针对我们传入的类添加其他类的抽象方法，并且实现对象方法
~~~js
var VehicleFactory =  function(subType, superType) {
    if(typeof VehicleFactory[superType] === "function") {
        // 创建一个缓存类
        function F() {}
        // 继承父类的属性和方法
        F.prototype = new VehicleFactory[superType]()
        // 将子类的constructor 指向子类
        subType.constructor = subType
        // 子类原型继承父类
        subType.prototype = new F()

    } else {
        throw new Error("未创建" + superType + "抽象类")
    }
}
VehicleFactory.Car = function() {
    this.type = "car"
}
VehicleFactory.Car.prototype = {
    getPrice: function() {
        return new Error("抽象方法不能调用")
    }
}

var Car = function() {
    this.price = 12312
}
VehicleFactory(Car, "Car")
Car.prototype.getPrice = function() {
    returrn this.price
}
let car = new Car()
car.getPrice() // 12312
~~~
## 单例模式

单例模式主要保证我们每次 new 或者拿到的实例都是同一个实例，避免创建新的是类

~~~js
let instance = undefined

class Factory {
    constructor() {
    }
    getInstance() {
        if(instance) {
            return instance
        } else {
            instance = new Factory()
            return instance
        }
    }
}
~~~

## 观察者模式
## 状态模式
## 组合模式
## 享元模式
## 原型链模式
## 桥接模式
## 装饰器模式
## 代理模式
## 策略模式
## 访问者模式
## 委托模式
## 数据访问对象模式
## 节流模式
## 参与者模式