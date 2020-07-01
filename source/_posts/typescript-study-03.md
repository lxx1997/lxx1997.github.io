---
title: typescript 学习之路进阶版  -  2
date: 2020-06-22 16:31:39
tags:
    - typescript
    - ES6
---

#### 类和接口

  **类实现接口**
  实现(implements)是面向对象中一个重要概念,一般来讲,一个类只能继承自另一个类,有时候不同类之间可以有一些共有特性,这时候可以把特新提取成接口(interfaces), 用`implements`关键字来实现,这个特新大大提高了面向对象的灵活性

  ~~~js
    interface Alarm {
      alert(): void
    }
    class Door {

    }

    class SecurityDoor extends Door implements Alarm {
      alert() {
        console.log('securityDoor)
      }
    }
    class Car implements Alarm {
      alert() {
        console.log('car')
      }
    }
  ~~~
<!-- more -->
  一个类可以实现多个接口

  ~~~js
    interface Alarm {
      alert(): void
    }
    interface Light {
      lightOn(): void;
      lightOff(): void;
    }
    class Car implements Alarm, Light {

    }
  ~~~

  **接口继承接口**

  接口与接口之间也可以是继承关系,并拥有继承的方法

  ~~~js
    interface Alarm {
      alert(): void;
    }
    interface Light extends Alarm {

    }
  ~~~

  **接口继承类**

  常见的面向对象语言中,接口是不能继承类的,但是在TypeScript中是可以的

  ~~~js
    class Point {
        x: number;
        y: number;
        constructor(x: number, y: number) {
            this.x = x;
            this.y = y;
        }
    }

    interface Point3d extends Point {
        z: number;
    }

    let point3d: Point3d = {x: 1, y: 2, z: 3};
  ~~~

  当我们在声明 `class Point` 时,除了会创建一个名为Point的类外,同时也创建了一个名为Point类型(实例的类型)

  所以我们既可以将Point当作一个类来用

  也可以将Point当作一个类型来用 (使用:Point表示参数的类型)

  当我们声明 `interface Point3d extends Point`的时候,Point3d继承的实际上是类Point的实例的类型,*定义了一个接口Point3d继承了另一个接口PointInstaneType*
  *声明point类时创建的Point类型是不包含构造函数的,静态属性和静态方法也是不包含的*

  