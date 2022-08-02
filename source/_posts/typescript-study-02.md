---
title: typescript 学习之路进阶版
date: 2020-06-10 10:57:48
tags:
    - TypeScript
    - ES6
cover: '/assets/cover/20200225A1295.jpg'
---

#### 类型别名

~~~js
  type Name = string;
  type NameResolver = () => string;
  type NameOrResolver = Name | NameResolver;
  function getName(n: NameOrResolver): Name {
      if (typeof n === 'string') {
          return n;
      } else {
          return n();
      }
  }
~~~

类型别名为类型创建新名称。类型别名有时类似于接口，但是可以命名原语，并集，元祖和其他必须手动编写的其他类型。

别名实际上并不会创建新的类型，他会创建一个新名称来引用该类型
~~~js
  type Container<T> = {value: T}

  // 也可以在属性中使用类型别名来引用自身
  type Tree<T> = {
    value: T;
    left: Tree<T>;
    right: Tree<T>;
  }

  // 与交叉点类型一起使用
  type LinkedList<T> = T & {next: LinkedList<T>}

  interface Person {
    name: string
  }

  var people: LinkedList<Person>

  var s = people.name
  var s = people.next.name
  var s = people.next.next.name
  var s = people.next.next.next.name

  // 但是类型别名不可能出现在声明右侧的任何其他位置
~~~

#### 字符串字面量类型

~~~js
  type EventNames = 'click' | 'scroll' | 'mousemove'
  function handleEvent(ele: Element, event: EventNames) {
    // do someting
  }
  handleEvent(document.getElementById('hello'), 'scroll') // success
  handleEvent(document.getElementById('hello'), 'dblclick') // error
~~~
我们使用type定了一个字符串字面量类型`EventNames`, 它只能取三种字符串中的一种
类型别名与字符串字面量类型都是使用`type`进行定义

可以使用相同的方式使用字符串文字类型来区分重载
~~~js
  function createElement(tagName: 'img'): HTMLImageElement
  function createElement(tagName: 'input'): HTMLIputElement
  function createElement(tagName: 'string'): Element {

  }
~~~

#### 元组

数组合并了相同类型的对象，而元组(Tuple)合并了不同类型的对象

eg:
~~~js
  let tom: [string, number] = ['Tom', 25]
~~~
当赋值或访问一个已知的索引元素时,会得到正确的类型
也可以只赋值其中一项

~~~js
  let tom: [string, number]
  tom[0] = 'Tom'
~~~

如果直接对元组类型的变量进行初始化或者赋值的时候,需要提供所有的元组类型中指定的项

当添加越界的元素时,它的类型会被限制为元组的每个类型的联合类型

#### 枚举  Enum

枚举类型用于取值被限定在一定范围内的场景,比如一周只能有七天,颜色限定为红绿蓝等

eg:
枚举定义 使用`enum`定义
~~~js
enum Days {Sun, Mon, Tue, Web, Thu, Fri, Sat}

// 枚举成员会被赋值从0开始递增的数字,同时也会对枚举值到枚举名进行反向映射

Days['Sun'] === 0  // true

Days[0] === 'Sun'  // true
~~~

**手动赋值**

我们也可以手动给枚举项赋值

~~~js
enum Days {Sun = 7, Mon = 1, Tue, Wed, Thu, Fri, Sat}
// 未手动赋值的枚举项会接着上一个枚举项递增
~~~

如果**手动赋值的枚举项**与**自动赋值的枚举项**重复了,并不会报错

手动赋值的枚举项可以不是数字,但是需要使用类型断言来无视类型检查

**常数项和计算所得项**

枚举有两种类型: 常数项和计算所得项

~~~js
  enum Color {Red, Green, Blue = 'blue'.length}
~~~

上面 `'blue'.length`就是一个计算所得项

如果紧接在计算所得项后面是未手动赋值的项,那么会因为无法获得初始值而报错

**常数枚举**

~~~js
const enum Directions {
  Up,
  Down,
  Left,
  Right
}
let directions = [Directions.Up, Directions.Down, Direction.Left, Direction.Down]
~~~

常数枚举与普通枚举的区别是,它会在编译阶段被删除,并且不能包含计算成员

上述编译的结果是:

~~~js
  var directions = [0 /* Up */ , 1 /* Up */, 2 /* Up */, 3 /* Up */]
~~~

*如果在定义的时候包含了计算成员,则会在编译阶段报错*

**外部枚举**

外部枚举 是使用`declare enum` 定义的枚举类型

~~~js
declare enum Directions {
  Up,
  Down,
  Left,
  Right
}
let directions = [Directions.Up, Directions.Down, Direction.Left, Direction.Down]
~~~

同时使用`declare` 和`const`也是可以的


#### 类

**类的概念**

* 类：定义了一件事物的抽象特点，包含他的属性和方法

* 对象：类的实例，通过new生成

* 面对对象（OPP）三大特性： 封装、继承、多态

* 封装（Encapsulation）：将对数据的操作细节隐藏起来，质保楼对外的接口，外界调用端不需要知道细节，就能通过对外提供的接口来访问该对象，同时也保证了外界无法任意更改对象内部的数据

* 继承（Inheritance）：子类继承父类，子类除了拥有父类的所有特性外，还有一些更具体的特性

* 多态（Poluymorphism）：由继承而产生的不同的类，对同一个方法可以有不同的响应，程序会自动判断应该如何执行

* 存取器(getter & setter): 用于改变属性的读取和赋值行为

* 修饰符(Modifiers): 修饰符是一些关键字,用于限定成员或类型的性质,比如`public`表示共有属性和方法

* 抽象类(Abstract Class): 抽象类是供其他继承的基类,抽象类不允许被实例化,抽象类中的抽象方法必须在子类中被实现

* 接口(interface): 不同类之间巩固偶的属性和方法可以抽象成一个接口,接口可以被类实现,一个类只能继承自另一个类,但是可以实现多个接口

**ES6中类的用法**

 **属性和方法**

 使用`class`定义类,使用`constructor`定义构造函数
 
 通过`new` 生成新实例的时候,会自动带调用构造函数

 **类的继承**

 使用`extends` 关键字实现继承,子类通过`super`关键字调用父类的构造函数和方法

 ~~~js
  class Cat extends Animal {
    constructor(name) {
      super(name);
      console.log(this.name)
    }
    sayHi() {
      return super.sayHi()
    }
  }
 ~~~

 **存取器**

 使用getter和setter可以改变属性的赋值和读取行为

  ~~~js
    class Animal {
      constructor(name) {
        this.name = name
      }
      get name() {
        return 'jack'
      }
      set name(value) {
        console.log('setter:' + value)
      }
    }
  ~~~

  **静态方法**

  使用`static`修饰符修饰的方法称为静态方法,不需要实例化,而是直接通过类来调用

  ~~~js
    class Animal {
      static isAnimal(a) {
        return a instanceof Animal
      }
    }
    let a = new Animal('Jack)
    Animal.isAnimal(a)  // true
    a.isAnimal(a)   // TypeError
  ~~~ 

**ES7中类的用法**

  **实例属性**
  
  ES6中实例的属性只能通过构造函数中的`this.xxx`来定义,ES7可以直接在类里面定义

  ~~~js
    // ES7
    class Animal {
      name = 'Jack';
      constructor() {
        // TODO something
      }

      let a = new Animal()
    }
  ~~~

  **静态属性**

  可以用`static` 定义一个静态属性

  ~~~js
    // ES7
    class Animal {
      static name = 'Jack';
      constructor() {
        // TODO something
      }
      let a = new Animal()
    }
  ~~~

**TypeScript中使用类**

  **public private和protect**

  TypeScript中可以使用三种访问修饰符分别是`public`,`private`,`protected`

  * `public`修饰的属性或方法是共有的,可以在任何地方被访问,默认所有的属性和方法都是`public`的
  * `private`修饰的属性和方法是私有的,不能在声明它的类的访问'
  * `protected`修饰的属性和方法是受保护的,它和`private`类似,区别是在子类中也是允许被访问的

  *当构造函数`constructor`修饰为`private`时,该类不允许被继承或者实例化*
  *当构造函数`constructor`修饰为`protected`时, 该类只允许被继承*

  **参数属性**

  修饰符和`readonly`还可以使用构造函数参数中,等同于类中定义该属性的同时给该属性赋值,使代码更简洁

  ~~~js
    class Animal {
      public construtor(public name) {
        // 等同于 this.name = name
      }
    }
  ~~~

  **readonly** 

  只读属性关键字,只允许出现在属性声明或索引签名或构造函数中
  *如果`readonly`和其他修饰符同时存在的话,需要写在后面*

  **抽象类**

  `abstract`用于定义抽象类和其中的抽象方法

  抽象类是不允许被实例化的

  如果定义了一个抽象类,并且定义了一个抽象方法`sayHi`, 在实例化抽象类的时候报错

  抽象类中的抽象方法必须被子类实现,如果继承了抽象类,却没有实现抽象类中的抽象方法,就是编译报错

  正确使用抽象类
  ~~~js
    abstract class Animal {
      public name;
      public constructor(name) {
        this.name = name;
      }
      public abstract sayHi();
    }

    class Cat extends Animal {
      public sayHi() {
        console.log(`Meow, My name is ${this.name}`);
      }
    }

    let cat = new Cat('Tom');
  ~~~

  **类的类型**
  给类加上TypeScript的类型

  ~~~js
    class Animal {
      name: string;
      constructor(name: string) {
        this.name = name;
      }
      sayHi(): string {
        return `My name is ${this.name}`;
      }
    }

    let a: Animal = new Animal('Jack');
    console.log(a.sayHi()); // My name is Jack
  ~~~