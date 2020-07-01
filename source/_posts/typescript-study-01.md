---
title: typescript 学习质量 - 01
date: 2020-04-08 09:10:06
tags:
---
[参考文章:廖雪峰 typescript入门教程](http://ts.xcatliu.com/index.html)
#### 数据类型
**原始数据类型**
* boolean  布尔值
~~~js
let isDone: boolean = false;
// 注意:使用构造函数Boolean创建的对象不是布尔值
let createdByNewBoolean: boolean = new Boolean(1);

// Type 'Boolean' is not assignable to type 'boolean'.
//   'boolean' is a primitive, but 'Boolean' is a wrapper object. Prefer using 'boolean' when possible.
// 实际上new Boolean 返回的是一个boolean对象
~~~
* number 数值定义
* string 字符串定义
* void 空值
  声明一个void类型的变量 只能赋值为undefined和null
* null undefined
  null 和 undefined 是所有类型的子类型
<!-- more -->
**任意值 any**
  如果是一个普通类型,在复制过程中改变变量类型是不允许的,但是any类型允许被赋值为任意类型.
  在任意值上访问任何属性都是允许的,也可以调用任何方法
  **变量如果在声明时,未指定类型,将会被识别为任意值**

如果没有明确指定类型,typescript会按照类型推论的规则，推断出一个类型 
如果定义的时候没有复制，不管之后有没有复制，都会被推断成any类型而不被检查

**联合类型**

~~~js
let myFavoriteNumber: string | number;
// myFavoritNumber 可以取字符串类型和数值类型的一种
~~~
当typescript不确定一个联合类型的变量是哪个变量的时候，只能访问此联合类型的所有类型里共有的属性和方法
~~~js
function getString(something: string | number): string {
    return something.toString();
}
~~~
定义的联合类型的变量在被赋值的时候，会根据类型推论规则推断出一个类型

#### 接口

**什么是接口**
接口是对行为的抽象，具体如何行动需要由类(classes)去实现(implement)
typescript 中的接口是一个十分灵活的概念，除了可以用于对类的一部分行为进行抽象以外，也常用于对\[对象的形状(shape)\]进行描述

~~~js
interface Person {
    name: string;
    age: number;
}

let tom: Person = {
    name: 'Tom',
    age: 25
};
~~~

接口一般首字母大写，建议接口的名称上加上`I`前缀
定义的变量和接口属性不同是不允许的

**可选属性**
又是完美希望不要完全匹配一个形状，那么可用可选属性

~~~js
interface Person {
    name: string;
    age?: number;
}

let tom: Person = {
    name: 'Tom'
};
~~~

可选属性的含义是该属性可以不存在
这是仍然**不允许添加未定义的属性**

**任意属性**

如果希望一个接口允许有任意属性，可以使用如下方式
~~~js
interface Person {
    name: string;
    age?: number;
    [propName: string]: any;
}

let tom: Person = {
    name: 'Tom',
    gender: 'male'
};
~~~
使用\[propNmae: string\]定义了任意属性去string类型的值
**一旦定义了任意属性，那么确定属性和可选属性的类型都必须是它的类型的子集**

_也就是值的属性需要和任意值的属性相同，如果不同则会报错_

一个接口只能定义一个任意属性，如果接口中有多个类型的属性，则可以在任意属性中使用联合类型
~~~js
interface Person {
    name: string;
    age?: number;
    [propName: string]: string | number;
}

let tom: Person = {
    name: 'Tom',
    age: 25,
    gender: 'male'
};
~~~
**只读属性  readonly**

readonly 属性需要在初始化对象的时候赋值
**只读的约束存在于第一次给对象赋值的时候，而不是第一次给只读属性赋值的时候**

#### 数组
~~~js
  let list: any[] = ['lxx', 24, {age: 30}]
~~~

#### 函数类型

在javascript中有两种常见的定义函数的方式----函数声明和函数表达式

~~~js
  //  函数声明 Function Declaration
  function sum(x,y) {

  }

  // 函数表达式
  let one = function() {}
~~~

一个函数有输入和输出，要在TypeScript 中对其进行约束，需要把输入和输出都考虑到，其中函数声明的类型比较简单。
**输入多余的(或者少于要求的)参数是不被允许的**

**函数表达式**

~~~js
  // 第一种
  let sum = function(x: number, y number): number {

  }
  // 第一种方法只对等号右侧的匿名函数进行了类型定义，而等号左边的mysum，是通过复制操作进行类型推论而推断出来的
  // 第二种  推介
  let sum: (x: number, y:number) => number = function(x: number, y number): number {

}
~~~

_typescript中的 `=>` 和es6中的`=>` 代表的含义不同_
_typescript中 `=>`表示函数的定义，左侧是输入类型，需要用括号括起来，右边是输出类型_

**接口定义函数**

~~~js
  interface SearchFunc {
    (source: string, subString: string): boolean
  }
  let mySearch: SearchFunc
  mySearch = function(source: string, subString: string) {
    return source.search(subString) !== -1;
  }
~~~
采用函数表达式|接口定义函数的方式时，对等号左侧进行类型限制，可以保证以后对函数名赋值时保证参数个数，参数类型，返回值类型不变

**可选参数**
用`?`表示可选参数

~~~js
  function buildName(firstName: string, lastName?: string) {
    if (lastName) {
        return firstName + ' ' + lastName;
    } else {
        return firstName;
    }
  }
  let tomcat = buildName('Tom', 'Cat');
  let tom = buildName('Tom');
~~~

_可选参数必须就在必需参数后面，可选参数后面不允许在出现必须参数_

**参数默认值**
typescript 会将添加了默认值的参数识别为可选参数，如果不传参，将会设置为默认值

**剩余参数**
ES6中可以使用`...rest` 方式 获取函数中的剩余参数

剩余参数只能是最后一个参数

**重载**

~~~js
 function reverse(x: number | string): number | string {
    if (typeof x === 'number') {
        return Number(x.toString().split('').reverse().join(''));
    } else if (typeof x === 'string') {
        return x.split('').reverse().join('');
    }
  } 
~~~
_表达不够精确，输入为数字的时候，输出也应该是数字_
这时可以使用重载定义多个reverse的函数类型
~~~js
 function reverse(x: number): number;
  function reverse(x: string): string;
  function reverse(x: number | string): number | string {
      if (typeof x === 'number') {
          return Number(x.toString().split('').reverse().join(''));
      } else if (typeof x === 'string') {
          return x.split('').reverse().join('');
      }
  }
~~~
TypeScript会有限从最前面的函数定义开始匹配，多个函数定义如果有包含关系，需要优先把精确的定义写在前面

 #### 类型断言

~~~js
 值  as 类型
 or
 <类型>值
~~~
类型断言可以用来手动指定一个值的类型

**将一个联合类型断言为其中一个类型**

当typescript不确定一个联合类型的变量到底是哪个类型的时候，我们只能访问此联合类型的所有类型的共有的属性和方法

如果我们需要在还不确定类型的时候就访问其中一个类型特有的属性和方法
此时可以使用类型断言，将animal断言成fish
~~~js
interface Cat {
  name: string,
  run(): void
}
interface Fish{
  name: String,
  swim(): void
}

function isFish(animal: Cat|Fish) {
  if(typeof (animal as Fish).swim === 'function') {
    return true
  }
  return false
}
~~~

_注意：类型断言只能欺骗typescript编译器，无法避免运行时的错误，反而滥用类型断言可能会导致运行时错误_
_在使用类型断言的时候，如果没有使用公共方法，如果传入类型变化，就会导致运行错误_
*使用类型断言的时候要格外小心，尽量避免断言后调用方法或者引用深层属性，减少不必要的运行时错误*

**将一个父类断言为更加具体的子类**
~~~js
  class ApiError extends Error {
    code: number = 0;
  }
  class HttpError extends Error {
    code: number = 200;
  }
  function isApiError(error:Error) {
    if(typeof (error as ApiError).code === 'number') {
      return true
    }
    return false
  }
~~~

上面的例子 因为ApiError 和HttpError是一个类 还可以通过instanceof 来判断error是否是它的实例

但是有的时候ApiError 和HttpError不是一个类，而是一个接口(interface)  接口是一个类型，不是一个真正的值，在编译的结果中会被删除，无法使用instanceof 来做运行时判断

**将任何一个类型断言为any**

当我们引用一个在此类型上不存在的属性和方法时，就会报错，这时可以使用`as any` 临时断言为any类型
在any类型的变量上，访问任何属性都是允许的，_将一个变量断言为any 是解决typescript中类型问题的最后一个手段_， **它极有可能掩盖了真正的类型错误**


**将`any`断言为一个具体的类型**
在日常代码操作时，遇到any类型的变量，可以选择无视它，任由滋生更多的any，也可以选择改进它，通过类型断言及时吧any断言为精确的类型，使我们的代码向着高可维护性的目标发展

~~~js
  function getCacheData(key: string): any {
    return (window as any).cache[key];
  }

  interface Cat {
      name: string;
      run(): void;
  }

  const tom = getCacheData('tom') as Cat;
  tom.run()
~~~

**类型断言限制**
* 联合类型可以被断言为其中一个类型
* 父类可以被断言为子类
* 任何类型都可以被断言为any
* any可以被断言为任何类型
* 要使得A能被断言为B，只需要A兼容B或B兼容A
但是并不是任何一类型都可以被断言为任何另一个类型
eg:
~~~js
  interface Animal {
    name: string;
  }
  interface Cat {
    name: string;
    run(): void;
  }
  let tom: Cat = {
    name: 'Tom',
    run: () => {console.log('run')}
  }

  let animal: Animal = tom
~~~
typescript 是结构类型系统，类型之间的对比只会比较最终的结构，而会忽略他们定义时的关系
上面的这个例子，Cat包含了 Animal中的所有属性，除此之外，还有一个额外的方法run，typescript并不关心Cat和Animal之间定义的时是什么关系，智慧看他们最终的结构有什么关系，所以与`Cat extends Animal`是等价的

_如果animal 兼容 Cat时，他们就可以互相进行类型断言_
* 允许`Animal as Cat`是因为**父类可以被断言为子类**
* 允许`Cat as Animal`因为既然子类拥有父类的属性和方法，那么被断言为父类，获取父类的属性，调用父类的方法不会出现问题，故**子类可以被断言为父类**

**双重断言**
* 任何类型都可以被断言为any
* any可以被断言为任何类型
~~~js
  interface Cat {
      run(): void;
  }
  interface Fish {
      swim(): void;
  }

  function testCat(cat: Cat) {
      return (cat as any as Fish);
  }
~~~
上面这个例子中，如果直接使用`cat as Fish`,肯定会报错,因为`Cat`和`Fish`不兼容

这时候如果使用双重断言 价格任何一个类型断言为任何另一个类型
_但是双重断言可能会导致运行时错误_
_除非迫不得已,千万不要使用双重断言_


#### 类型断言 VS 类型转换

类型断言智慧影响TypeScript编译时的类型,编译完成后,类型断言语句会被删除

~~~js
function toBoolean(something: any): boolean {
    return something as boolean;
}

toBoolean(1);
// 返回值为 1
~~~

所以类型断言不是类型转换,不会影响到变量的类型
如果要进行类型转换,直接调用类型转换方法
~~~js
  function toBoolean(something: any): boolean {
      return Boolean(something);
  }

  toBoolean(1);
  // 返回值为 true
~~~

#### 类型断言 VS类型声明

~~~js
  function getCacheData(key: string): any {
    return (window as any).cache[key];
  }

  interface Cat {
      name: string;
      run(): void;
  }

  const tom = getCacheData('tom') as Cat;
  tom.run();
~~~

使用`as Cat` 将any类型断言为Cat类型
也可以通过类型声明的方法将tom声明为Cat，然后再将ay类型的`getCacheData('tom')`赋值给Cat类型的tom
类型声明比类型断言更加严格，因此为了增加代码质量，优先使用类型声明，这也比类型断言的as语法更加优雅

#### 类型断言 VS 泛型

我们还有第三种方式可以解决这个问题，那就是泛型：
~~~js
  function getCacheData<T>(key: string): T {
      return (window as any).cache[key];
  }

  interface Cat {
      name: string;
      run(): void;
  }

  const tom = getCacheData<Cat>('tom');
  tom.run();
~~~
通过给 getCacheData 函数添加了一个泛型 <T>，我们可以更加规范的实现对 getCacheData 返回值的约束，这也同时去除掉了代码中的 any，是最优的一个解决方案。

#### 声明文件

* declare var 声明全局变量
* declare function 声明全局方法
* declare class 声明全局类
* declare enum 声明全局枚举
* declare namespace 声明（含有子属性的）全局对象
* interface和type声明全局类型
* export 导出变量
* export namespace 导出（含有子属性的）对象
* export default ES6默认导出
* export = commonjs导出模块
* export as namespace  UMD库声明全局变量
* declare global 扩展全局变量
* declare module 扩展模块
* ///<reference /> 三斜线指令

**什么是声明语句**
eg：当我们要使用一些第三方库的时候，在ts中，编译器并不知道他们是什么东西，这时候就需要使用declare var 来定义他的类型

~~~js
  declare var jQuery: (selector: string) => any

  jQuery('#foo')
~~~
`declare var` 并没有真正的定义一个变量，只是定义了全局变量jQuery的类型，仅仅会用于编译时的检查，在编译结果中会被删除

**什么是声明文件**

通常会把声明语句放到一个单独的文件（jQuery.d.ts）中，这就是声明文件

~~~js
  // jquery.d.ts
  declare var jQuery: (selector: string) => any

  // index.ts
  jQuery('#foo')
~~~

声明文件必须以`.d.ts`为后缀
ts会解析项目中所有的`*.ts`文件，当然也包含以`.d.ts`结尾的文件。所以我们将`jQuery.d.ts`放到项目中，其他所有*.ts文件就可以获得jQuery的类型定义

**第三方声明文件**

推介使用`@types`统一管理第三方库的声明文件,直接用npm安装对应的声明模块即可
~~~js
  npm install @types/jquery --save-dev
~~~

**全局变量**

* declare var  用来定义给全局变量的类型  declare let declare const 同理,
  _声明语句中只能定义类型，切勿在声明语句中定义具体的实现_
  _declare const 不允许再次修改值_
* declare function  定义全局函数的类型
  _在函数类型的声明语句中,函数重载也是支持的_
  ~~~js
    // src/jQuery.d.ts

    declare function jQuery(selector: string): any;
    declare function jQuery(domReadyCallback: () => any): any;
    // src/index.ts

    jQuery('#foo');
    jQuery(function() {
        alert('Dom Ready!');
    });
  ~~~
* declare class 当全局变量是一个类,我们用declare class 来定义他的类型
  declare class 语句也只能用来定义类型,不能用来定义具体的体现
  ~~~js
    // src/Animal.d.ts

    declare class Animal {
        name: string;
        constructor(name: string);
        sayHi(): string;
    }
    // src/index.ts

    let cat = new Animal('Tom');
  ~~~

  *declare enum 外部枚举
  ~~~js
    // src/Directions.d.ts

    declare enum Directions {
        Up,
        Down,
        Left,
        Right
    }
    // src/index.ts

    let directions = [Directions.Up, Directions.Down, Directions.Left, Directions.Right];
  ~~~
  与全局变量类型声明一致,declare enum 仅用来定义类型,而不是具体的值

 * declare namespace 
  namespace 是ts早期为了解决模块化而创造的关键字,中文称命名空间
  我们应该使用declare namespace jQuery 来声明拥有多个子属性的全局变量
  ~~~js
    // src/jQuery.d.ts

    declare namespace jQuery {
        function ajax(url: string, settings?: any): void;
    }
    // src/index.ts

    jQuery.ajax('/api/get_something');
  ~~~

  在delcare namespace 内部,我们也可以直接使用function ajax来声明哈数,而不是使用delcare function ajax 也可以使用const, class, enum等语句
  **嵌套的命名空间**
  如果对象拥有深层的层级,则需要使用嵌套的namespace来声明深层的属性类型

  ~~~js
    // src/jQuery.d.ts
    declare namespace jQuery {
        function ajax(url: string, settings?: any): void;
        namespace fn {
            function extend(object: any): void;
        }
    }
    // src/index.ts
    jQuery.ajax('/api/get_something');
    jQuery.fn.extend({
        check: function() {
            return this.each(function() {
                this.checked = true;
            });
        }
    });  
  ~~~

  当然,如果jQuery下仅有fn这一个属性 则不需要嵌套namespace

  ~~~js
    // src/jQuery.d.ts
    declare namespace jQuery.fn {
        function extend(object: any): void;
    }
    // src/index.ts
    jQuery.fn.extend({
        check: function() {
            return this.each(function() {
                this.checked = true;
            });
        }
    });
  ~~~
**interface  &&   type**

  使用interface和type来声明一个全局的接口或者类型