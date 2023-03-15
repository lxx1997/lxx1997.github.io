---
title: 你不知道的javascript中卷 知识点摘录
date: 2020-12-03 14:41:36
updated: 2020-12-03 14:41:36
categories:
    - reading
tags:
    - reading
cover: /assets/blogCover/MIKU花(4)_78753717_p1.png
---

#### 第一章 类型和语法

* **内置类型**

  * 空值 `null`  `typeof null === 'object'`
  * 未定义 `undefined`  `typeof undefined === 'undefined'`
  * 布尔值 `boolean`  `typeof true === 'boolean'`
  * 数字 `number`  `typeof 42 === 'number'`
  * 字符串 `string`  `typeof '42' === 'string'`
  * 对象 `object`  `typeof {life: 42} === 'object'`
  * 符号 `symbol`  `typeof Symbol() === 'symbol'`
  * `typeof function() {/* .. */} === 'function'`
  * `typeof [1,2,3] === 'object'` 数组是object的一个子类型

  对变量执行`typeof`操作时，得到的结果并不是该变量的类型，而是该变量持有的值的类型，因为javascript中的变量没有类型

* `undefined` 和 `undeclared`

  已在作用域中声明但还没有赋值的变量是`undefined`，还没有在作用域声明过的变量是`undeclared`

* **数组**

  * `delete`运算符可以将单元从数组中删除，但是数据的length属性并不会发生变化

  * *如果字符串键值能够被强制类型转换为十进制数字的话，他就会被当做数字索引来处理*

  ~~~js
    var a = []
    a['13'] = 43
    a.length // 14
  ~~~

  * 类数组 - 有时候需要将类数组转换为真正的数组

    * 通过for循环遍历类数组，将类数组的每一个元素复制到新的数组里
    * `slice` 返回的是类数组的一个数组复本
      `Array.prototype.slice.call(arguments)`
    * `concat`
      `Array.prototype.concat.apply([], arguments)`
    * `splice`
      `Array.prototype.splice.call(arguments, 0)`
    * `Array.form()`

* **字符串**

  * 字符串和数据的确很相似，都是类数组，都有`length`属性，以及`indexOf`和`concat`方法，但是*字符串是不可变的*，*数组是可变的*
  * 字符串可以借用数组的非变更方法来处理字符串
    `Array.prototype.join.call(a, '-)`,`Array.prototype.map.call(a, function() {/* .. */})`
  * 字符串反转 可以先将字符串转成数组反转后再转成字符串
    `string.split('').reverse().join('')` 包含复杂的字符，可以使用工具库

* **数字**

  * 数字常亮一般用十进制表示，数字前面的`0`可以省略，小数部分最后面的`0`也可以省略
  * 指数模式 `5E10 === 50000000000 === 50000000000.toExponential() //5e+10`
  * `.toFixed()` 指定小数部分的显示位数 输出结果实际上是给定数字的字符串形式，如果指定的小数部分显示位数多余实际位数就用0补齐
  * `.toPrecision()` 用来指定有效位数的显示位数
  * *对于`.`运算符，因为它是一个有效的数字字符，会被优先识别为数字常量的一部分，然后才是对象属性访问运算符*
  ~~~js
    42.toFixed(3) // SyntaxError
    (42).toFixed(3) // '42.000'
    0.42.toFixed(3) // '0.420'
    42..toFixed(3) // '42.000'
    42 .toFixed(3) // '42.000'
  ~~~
  * 数字常量的格式
  ~~~js
    0xf3 // 243的16进制
    0363 // 243的八进制
    // es6
    0o363 // 243的八进制
    0b11110011 // 243的二进制
  ~~~
  * 极小数运算 为了保证精准，可以设置一个误差范围值（*机械精度*）`Number.EPSILON`
  ~~~js
    // 如果没有Number.EPSILON，自己定义Number.EPSILON，如果有直接拿来使用
    if(!Number.EPSILON) {
      Number.EPSILON = Math.pow(2, -52)
    }

    function numbersCloseEnoughToEqual(n1, n2) {
      return Math.abs(n1 - n2) < Number.EPSILON
    }
    var a = 0.1 + 0.2
    var b = 0.3
    numbersCloseEnoughToEqual(a, b)  // true
  ~~~
  * `Number.MAX_VALUE` 为 `Math.pow(2, 53) - 1` 即 `2^53-1` 在es6中被定义为`Number.MAX_SAFE_INTEGER`
  * 最小整数是 `-Math.pow(2, 53) + 1` 在es6中被定义为`Number.MIN_SAFE_INTEGER`
  * 整数检测 `Number.isInteger(..)`
  * 检查一个值是否是安全的整数 `Number.isSafeInteger(..)`
  * `a | 0`可以将变量a中的数值转化为32位有符号整数，因为数位运算符`|`只适用32位整数，因此与0进行操作即可截取a中的32位数位

* **特殊数值**

  * *不是值的值*
    `undefined`类型只有一个值 `undefined`, `null`类型也只有一个值，即`null`
    `null`指空值，不能作为标识符，不能将其作为变量来使用和赋值, `undefined`指没有值，是一个标识符，可以被当做变量使用和赋值

    `undefined`是一个内置标识符，他的值为`undefined`，通过`void`运算符即可得到该值
    ~~~js
      var a = 42
      console.log(void a, a) // undefined 42
    ~~~
  
  * 特殊的数字
    * `NaN` 它与自身不相等，需要用`isNaN` or `Number.isNaN`方法来判断是否是NaN
    * 无穷数 可以从有穷到无穷，但是无法从无穷到有穷 `±Infinity`
    * 零值 加法和减法无法的到0值 `JSON.stringify(-0) => '0'  JSON.parse('-0') => '0'`

  * 特殊等式
    * `Object.is()` 主要用来处理特殊的相等比较
    * `==`和`===`的效率更高，更为通用

  * 值和引用
    * 简单值（基本类型值）总是通过值复制的方式来赋值/传递 `null`,`undefined`,`symbol`,`string`,`number`,`boolean`
    * 复杂值（对象和函数）总是通过引用复制的方式来赋值/传递 `object`, `array`, `function`
      *由于引用指向的值本身而非变量，因此一个引用无法更改另一个引用的指向*
      *不能通过引用一个新的引用来更改旧的引用的指向，只能修改新旧引用共同指向的值*
      如果通过值复制的方式来传递复合值，就需要创建一个复本，这样传递的就不是原始值`foo(a.slice())`，foo中的操作不会影响到a指向的数组

* **原生函数**

  * String()
  * Number()
  * Boolean() *通过Boolean创建的真值并不是真正意义的真值 ，它总是`true`*
  * Array()
  * Object()
  * Function()
  * RegExp()
  * Date()
  * Error()
  * Symbol()

  原生函数可以被当做构造函数来使用
  ~~~js
    var a = new String('hello world')
    typeof a // object
    a instanceof String // true
    Object.prototype.toString.call(a) // '[object String]'
  ~~~

  * 内部属性[[Class]]
    `typeof` 返回值为`object`的对象都包含有一个内部属性[[Class]],这个属性无法直接访问，可以通过`Object.prototype.toString.call(..)`来查看

    *Null的内部属性为`[object Null]` Undefined的内部属性为`[object Undefined]`*

  * 封装对象包装
    如果想要自行封装基本类型值，可以使用`Object(..)`函数，一般不推介使用封装对象
    部分封装对象封装基本类型时获取到的值并非我们想要的值(`Boolean`)

  * 拆封
    想要得到封装对象中的基本类型值，可以使用`valueOf()`函数
    在使用的时候回发生隐式拆分

  * 原生函数

    * `Array(..)`
      *Array构造函数只带一个数字参数时，会被作为数组的预设长度*

      **对于一个有长度的空数组，无法使用`map(..)`但是可以使用`join(..)`**,因为`join(..)`首先嘉定数组不为空，然后通过`length`属性来遍历其中的元素

      ~~~js
        Array.apply( null, { length: 3 } ) 
        // 等价于
        Array(undefined, undefined, undefined)
        // apply的第二个参数可以是数组或者类数组
      ~~~
      **永远不要创建和使用空单元数组**

    * `Object(..)`、`Function(..)`、`RegExp(..)` 同理，尽量不要使用
      动态定义正则表达式可以使用`new RegExp(pattern, flags)`来定义

    * `Date(..)` 和 `Error(..)`
      创建日期对象使用`new Date()`, `Date(..)`可以带参数，用来指定日期和时间
      `Date.now()`自动获取当前时间戳

      `Error(..)`主要是为了获得当前运行栈的上下文，与throw一起使用

    * `Symbol(..)`
      符号具有唯一性的特殊值
      符号可以用作属性名，但无论是在代码还是开发控制台中都无法查看和访问它的值，只会 显示为诸如 Symbol(Symbol.create) 这样的值

  * 原生原型

    原生函数都有自己的`prototype`对象，包含其对应子类型所特有的行为特征
    **所有的函数都可以调用`Function.prototype`的`apply(..)`, `call(..)`, `bind(..)`**

    * `Function.prototype` 是一个函数
    * `RegExp.prototype` 是一个正则表达式
    * `Array.prototype` 是一个数组
    
* **强制类型转换**

  * 值类型转换 - 类型转换发生在静态类型语言的编译阶段，强制类型转换发生在动态类型语言的运行时(`runtime`)，又可以区分为"隐式强制类型转换"和"显示强制类型转换"

  * 抽象值操作
    * `toString()` - 负责处理非字符串到字符串的强制类型转换
    * `JSON.stringify()` *`undefined`,`function`, `symbol`,循环引用的对象都不能用`JSON.stringify`进行处理，会被自动忽略，在数组中则会返回null* 
    如果需要对含有非法JSON值的对象作字符串化，或者对象中的某些值无法被序列化时，需要定义`toJSON()`方法返回一个安全的JSON值

    `toJSON`返回的是一个能够被字符串化的安全的JSON值，然后再由`JSON.stringify`对其进行字符串化

    我们可以向`JSON.stringify()`传递一个可选参数replacer, 可以是数组或者函数，用来指定对象序列化过程中哪些属性应该被处理，哪些被排除

    ~~~js
      var a = {
        b: 42,
        c: '42'.
        d: [1,2,3]
      }
      // replacer为数组的话，必须是一个字符串数组
      JSON.stringify(a, ['b', 'c'])  // "{"b":42,"c":"42"}" 
      JSON.stringify(a, function(k,v) {
        if(k!=="c") return v
      }) // "{"b":42,"d":[1,2,3]}" 
    ~~~
    `JSON.stringify` 还有一个可选参数space用来指定输出的缩进格式。space 为正整数时是指定 每一级缩进的字符数，它还可以是字符串

    ~~~js
      var a = {
        b: 42,   
        c: "42",  
        d: [1,2,3]
      }; 
      JSON.stringify( a, null, 3 ); 
      // "{ "b": 42, "c": "42", "d": [  1,         2,        3     ]  }" 
      JSON.stringify( a, null, "-----" ); // "{ // -----"b": 42, // -----"c": "42", // -----"d": [ // ----------1, // ----------2, // ----------3 // -----] // }"
    ~~~
    
  * `toNumber()`

    true转换为1，false转化为0，undefined转化为NaN，null转化为0

    在进行转化时，抽象操作ToPrimitive会首先检查该值是否有valueOf方法，如果有并且返回基本类型值，就使用该值进行强制类型转换，如果没有就使用toString的返回值来强制类型转换，如果都不返回基本值，就会报TypeError

  * `toBoolean`

    假值包含 undefined，null，false，+0，-0，NaN, "" 会被转换为false

    * 显示强制类型转换

    String(), Number() a.toString() 一元运算符+

      * 日期显示转化为数字  `new Date() or +new Date()  new Date().getTime() Date.now()`

      * 奇特的`~`运算符  返回2的补码 `~x ≈ -(x+1)`  
        `~a.indexOf(b)`强制转化为真假值

      * 字位截除 `~~ or x | 0` 只适用于32位数字

      * 显示解析数字字符串
        * Number()  不允许出现非数字字符
        * parseInt()  允许出现非数字字符 第二个参数表示进制类型
        * parseFloat()
      
      * Boolean() !!

    * 隐式强制类型转换

      * 字符串和数字之间的隐式强制类型转换 
      如果 + 的其中一个操作数是字符串，则执行字符串拼接，否则执行数字加法
      **"[]+{} {} + []" => [object Object] 0**
      *第一个表达式{} 被当做空对象来对待 第二个表达式{}被当做代码块来看待*
      隐式转换如果有valueOf方法则是会先调用valueOf方法然后通过ToString抽象操作将返回值转为字符串 String直接调用ToString()

      ~~~js
        var a = {
          valueOf: function() { return 42},
          toString: function() { return 4 }
        }
        a + ''  // '42'
        String(a)  // '4'
      ~~~

        - 会将字符串转化为数字
      
      * 布尔值到数字的隐式强制类型转换

      * 隐式强制转换成布尔值

      * || && - 选择器运算符， 他们的返回值是两个操作数中的一个然后返回他的值

      * 符号的强制类型转换
        **符号不能被强制类型转换为数字，但可以被强制类型转为布尔值**

      * 宽松相等 `==` 严格相等 `===`

      ~~~js
        var x = 1 || '1'
        var y = true
        x == y // true

        null == undefined // true
      ~~~

      **对象和非对象之间的比较**，对象会先toString然后才与非对象进行比较

      满足`a == 2 && a == 3`为true
      ~~~js
        var i = 2

        Number.prototype.valueOf = function() {
          return i++
        }
        var a = new Number(42)
        console.log(a + '')  // 2
        console.log(a + '')  // 3
      ~~~

      ~~~js
        "0" == null;           // false 
        "0" == undefined;      // false 
        "0" == false;          // true -- 晕！ 
        "0" == NaN;            // false 
        "0" == 0;              // true 
        "0" == "";             // false 
        
        false == null;         // false 
        false == undefined;    // false 
        false == NaN;          // false 
        false == 0;            // true -- 晕！ 
        false == "";           // true -- 晕！ 
        false == [];           // true -- 晕！ 
        false == {};           // false 
        
        "" == null;            // false 
        "" == undefined;       // false 
        "" == NaN;             // false 
        "" == 0;               // true -- 晕！ 
        "" == [];              // true -- 晕！ 
        "" == {};              // false 
        
        0 == null;             // false 
        0 == undefined;        // false 
        0 == NaN;              // false 
        0 == [];               // true -- 晕！ 
        0 == {};               // false
      ~~~

      极端的例子

      ~~~js
        [] == ![]  // true
        2 == [2]  // true
        "" == [null]  // true
        0 == "\n"  // true  "\n"等空字符串被toNumber强制转换成0
      ~~~      

  * 抽象关系比较

    a < b - a和b的一方一个是数字，另一方将会被转化成数字进行比较
    a < b - a和b的一方两个都是字符串，将会按照字母顺序进行比较

* **语法**

  * 语句与表达式

    * 语句的结果值 
      语法不允许我们获取语句的结果值并将其赋值给另一个变量，如果需要可以使用`eval`来获取结果值 或者 `do{..}`代码块

      ~~~js
        var a,b
        a = eval("if(true){b=4+38}")
        a // 42

        a = do {
          if(true) {
            b = 4 + 38
          }
        }
        a // 42
      ~~~

      * `++`和`--`
        ++a  先执行加法运算然后返回
        a++  先返回然后执行加法运算
        --a  先执行减法运算然后返回
        a--  先返回然后执行减法运算

      * `,`逗号运算符将多个独立的表达式语句串联成一个语句

  * 上下文规则

    * 大括号 `{}`

      1. 对象常量
      ~~~js
        var a = {
          b: 10
        }
      ~~~
      2. 标签 / 代码块
      在这里是一个普通的代码块，可以和let块级作用域声明一起使用
      ~~~js
        {
          b: foo()
        }
      ~~~
      标签语句 使用break和continue都可以带标签，实现goto那样的跳转
      *continue foo 代表执行foo*
      *break 代表跳出foo函数，从foo结束的位置开始执行* 
      ~~~js
        foo: { 
          other: {
            console.log(2)
            bar: {
              console.log( "Hello" ); 
              break foo;   
              console.log( "never runs" );  
            }
          }
          console.log( "World" );
        } 
      ~~~
      3. 对象解构
      `{...obj}` - 赋值 / 命名参数对象解构 
      4. else if 和可选代码块

  * 运算符优先级

    * && > ||

    * 短路 && 和 ||可以造成逻辑短路

    * && 运算符的优先级高于 ||，而 || 的优先级又高于 ? :。
  
  * `try..finally..`

  * `switch() { case }`

#### 第二章 异步和性能

* **异步**

  1. 异步是关于现在和将来的时间间隙，而并行是关于能够同时发生的事情,并行计算最常见的工具就是进程和线程。进程和线程独立运行，但多个线程能够共享单个进程的内存
  2. 事件循环把自身的工作分成一个个任务并顺序执行，不允许对共享内存的 并行访问和修改。通过分立线程中彼此合作的事件循环，并行和顺序执行可以共存。

  3. 并发运行的进程之间可能会存在相互影响，如果进程之间没有影响的话，不确定性是完全可以接受的

  4. 交互的程序可以采用协调交互顺序来处理这样的竞态条件，通过给请求固定获取位置，使得交互的两个程序无论请求顺序如何，最后返回的结果顺序是固定的。

  5. 竞态 - 只有第一个运行完成的程序起作用

  6. 协作 - 取到一个长期运行的“进程”，并将其分割成多个步骤或多批任务，使得其他并发“进程”有机会将自己的运算插入到事件循环队列中交替运行，事件循环队列的交替运行会提高 站点 /App 的响应（性能）
  ~~~js
    var res = []

    function response(data) {
      var chunk = data.splice(0,1000)
      res = res.concat(
        chunk.map(val => val * 2)
      )
      if(data.length > 0) {
        // 通过setTimeout 方法将函数放到异步执行队列，不影响现有函数执行
        setTimeout(function() {
          response(data)
        }, 0)
      }
    }
  ~~~

  * 任务 - 类似于排队，严格指定任务队列中函数的先后执行顺序

* **回调**

  * 避免回调地狱 代码会变得非常复杂难以维护及更新

* **Promise**