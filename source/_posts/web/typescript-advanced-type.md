---
title: TypeScript 高级类型
cover: /assets/blogCover/雨_93096964_p1.png
date: 2022-12-06 14:39:19
updated: 2022-12-06 14:39:19
categories:
  - TypeScript
tags:
    - TypeScript
    - ES6
---

TypeScript 有许多高级类型，方便系统更好判断代码是否存在不合理的点，也更方便用户来排查错误和编写代码，下面介绍一些常用的高级类型，这些高级类型在日常开发中可能没有机会用到，但是了解一下对我们并没有任务坏处

## 交叉类型

交叉类型是将多个类型合并为一个类型。 这让我们可以把现有的多种类型叠加到一起成为一种类型，它包含了所需的所有类型的特性

相当于混入（`mixin`）,在新的类型中，可以拥有合并的所有类型中的成员

使用 `&` 来表示交叉

~~~typescript
function extend<T, U>(first: T, second: U): T & U {
    let result = <T & U>{};
    for (let id in first) {
        (<any>result)[id] = (<any>first)[id];
    }
    for (let id in second) {
        if (!result.hasOwnProperty(id)) {
            (<any>result)[id] = (<any>second)[id];
        }
    }
    return result;
}

class Person {
    constructor(public name: string) { }
}
interface Loggable {
    log(): void;
}
class ConsoleLogger implements Loggable {
    log() {
        // ...
    }
}
var jim = extend(new Person("Jim"), new ConsoleLogger());
var n = jim.name;
jim.log();
~~~

通过上述例子,我们利用泛型创建一个 `extend` 方法用来合并两个对象，通过交叉符号 `&` 判断函数返回类型是传入类型的合并类型

这样我们在访问 `extend` 返回的对象时，如果获取到不存在的属性，就会贴心的为我们提示错误

## 联合类型

联合类型与交叉类型很有关联，但是使用上却完全不同.

交叉类型 是将多个类型合并成一个新的类型

联合类型 是满足多个类型中的一个，这些类型可以是基础类型(`string`, `number` ...) 也可以是用户定义的类或者接口
