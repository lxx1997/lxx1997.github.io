---
title: TypeScript 学习之路进阶版 - 泛型
date: 2020-06-28 09:17:07
tags:
    - typescript
---


#### 泛型

  **泛型**是指在定义函数、接口或者类的时候，不预选指定类的具体累心，而是在使用的时候在指定类型的一种特性

  ~~~js
    function createArray<T>(length: number, value: T): Array<T> {
      let result: T[] = [];
      for (let i = 0; i < length; i++) {
          result[i] = value;
      }
      return result;
    }

    createArray<string>(3, 'x'); // ['x', 'x', 'x']
  ~~~

  我们在函数名后添加了`<T>`, 其中`T`用来指代任意输入的类型，在后面的输入和输出都可以使用
  
  在调用的时候可以指定他的具体的类型，也可以不指定，而让类型推论自动推算出来

  **多个类型参数**

  定义泛型的时候,可以一次定义多个类型参数

  ~~~js
    function swap<T, U>(tuple: [T, U]): [U, T] {
        return [tuple[1], tuple[0]];
    }

    swap([7, 'seven']); // ['seven', 7]
  ~~~

  输入的`<T, U>`是元组

  **泛型约束**

  在函数内部使用泛型变量的时候，由于事先不知道它是那种类型的，所以不能随意操作它的属性和方法

  这时我们可以对泛型进行约束，只允许这个函数传入那些包含`length`属性的变量

  ~~~js
    interface Lengthwise {
        length: number;
    }

    function loggingIdentity<T extends Lengthwise>(arg: T): T {
        console.log(arg.length);
        return arg;
    }
  ~~~

  在上面的例子中，我们使用了`extends`约束了泛型T必须符合接口l的形状，也就是必须包含length属性

  多个类型参数之间也可以互相约束

  ~~~js
    function copyFields<T extends U, U>(target: T, source: U): T {
        for (let id in source) {
            target[id] = (<T>source)[id];
        }
        return target;
    }

    let x = { a: 1, b: 2, c: 3, d: 4 };

    copyFields(x, { b: 10, d: 20 });
  ~~~

  我们使用了两个类型参数，其中要求T继承于U，这样就保证了U中不会出现T中不存在的字段

  **泛型接口**

  ~~~js
    interface CreateArrayFunc<T> {
        (length: number, value: T): Array<T>;
    }

    let createArray: CreateArrayFunc<any>;
    createArray = function<T>(length: number, value: T): Array<T> {
        let result: T[] = [];
        for (let i = 0; i < length; i++) {
            result[i] = value;
        }
        return result;
    }

    createArray(3, 'x'); // ['x', 'x', 'x']
  ~~~

  在使用泛型接口的时候，需要定义泛型的类型

  **泛型类**

  与泛型接口类似，泛型也可以用于类的类型定义

  ~~~js
    class GenericNumber<T> {
        zeroValue: T;
        add: (x: T, y: T) => T;
    }

    let myGenericNumber = new GenericNumber<number>();
    myGenericNumber.zeroValue = 0;
    myGenericNumber.add = function(x, y) { return x + y; };
  ~~~

  **泛型参数的默认类型**

  我们可以为泛型中的类型参数指定默认类型，从实际值参数中也无法推测出时，这个默认类型就会起作用

  ~~~js
    function createArray<T = string>(length: number, value: T): Array<T> {
        let result: T[] = [];
        for (let i = 0; i < length; i++) {
            result[i] = value;
        }
        return result;
    }
  ~~~

  #### 声明合并

  如果定义了两个相同名字的函数、接口或类，那么它们会合并成一个类型

  **函数的合并**

  可以使用重载定义多个函数类型

  ~~~js
    function reverse(x: number): number
    function reverse(y:number): string
    function reverse(x: number | string): number | string {
      if (typeof x === 'number') {
        return Number(x.toString().split('').reverse().join(''))
      } else if (typeof x === 'string') {
        return x.split('').reverse().join('')
      } 
    }
  ~~~

  **接口的合并**

  接口的属性在合并时会简单的合并到一个接口中

  ~~~js
    interface Alarm {
      price: number
    }
    interface Alarm {
      weight: number
    }

    // 相当于

    interface Alarm {
      price：number;
      weight: number
    }
  ~~~

  合并的属性的类型必须是唯一的

  ~~~js
    interface Alarm {
      price: number
    }
    interface Alarm {
      price: number
      weight: number
    }

    // 相当于

    interface Alarm {
      price：number;
      weight: number
    }
  ~~~
  
  假如 `price` 的类型不一致就会报错

  接口中方法的合并与函数的合并一样