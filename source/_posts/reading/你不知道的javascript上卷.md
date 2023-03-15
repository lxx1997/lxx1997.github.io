---
title: 《你不知道的javascript上卷》 知识点摘录
updated: 2020-11-24 13:50:50
date: 2020-11-24 13:50:50
categories:
    - reading
tags:
    - reading
cover: /assets/blogCover/MIKU花(4)_78753717_p1.png
---

#### 第一章  作用域和闭包

* 编译器查找类型 *赋值操作的目标是谁(`LHS`)* 和 *谁是赋值操作的源头(`RHS`)*

  `RHS`如果在所有嵌套的作用域中遍寻不到所需的变量，引擎就会爆出`ReferenceError`异常，如果找到了变量，但是要对变量的值进行不合理的操作，引擎就会抛出另一种类型的错误`TypeError`

  `LHS`如何在全局作用域中也无法找到目标变量，就会在全局作用域中创建一个具有该名称的变量，并将其返还给引擎，但是在‘严格模式’下执行的时候并不会创建一个全局变量，而是会和`RHS`一样抛出`ReferenceError`

  

* `eval` javascript的eval() 函数可以接受一个字符串作为参数，并将其中的内容视为javascript代码，尽量不要使用`eval`，会对系统安全造成影响

~~~js
  eval('var b = 3')
~~~

* `with` with可以将一个没有或有多个属性的对象处理为一个完全隔离的词法作用域，因此这个对 象的属性也会被处理为定义在这个作用域中的词法标识符

  *尽管 with 块可以将一个对象处理为词法作用域，但是这个块内部正常的 var 声明并不会被限制在这个块的作用域中，而是被添加到 with 所处的函数作用域中*

~~~js
with(obj) {
  a = 3;
  b = 4;
  c = 5;
}
~~~

* **匿名函数** 匿名函数没有名称标识符，函数表达式可以是匿名的，而函数声明则不可以省略函数名

  * 匿名函数在栈追踪中不会显示出有意义的函数名，使得调试很困难
  * 如果没有函数名，引用自身时只能使用`arguments.callee`引用
  * 匿名函数省略了对于代码可读性很重要的函数名

* **具名函数** 有名称标识符

* **立即执行函数表达式** `(function(){ })()`

* `try/catch`分句会创建一个块级作用域，其中声明的变量仅在catch内部有效

* `let`为其声明的变量隐式地了所在的块作用域。

* **垃圾收集** 利用作用域进行垃圾回收，变量显式声明块作用域

* *变量及函数在内的所有声明都会在任何代码被执行前首先被处理*，定义声明在编译阶段进行，赋值声明在执行阶段进行
  **先有声明后有赋值**
  **函数声明**会被提升，**函数表达式**及**具名函数**不会被提升
  在变量提升过程中，函数会被首先提升，其次才是变量
  尽管重复的声明会被忽略掉，但是出现后面的函数声明可以覆盖前面的

* **模块模式**

  * 必须有外部的封闭函数，函数必须至少被调用一次，每一次调用都会创建一个新的模块实例
  * 封闭函数必须返回至少一个内部函数，这样内部函数才能在私有作用域中形成闭包，并且可以访问或者修改私有状态

* **修改模块实例的内容**
  通过在模块实例内部保留对公共API对象的内部引用，可以从内部对模块是咧进行修改，包括添加或删除方法和属性，修改他们的值

* **现代模块机制**

  ~~~js
    // 封装模块
    var MyModules = (function Manager() {
      var modules = {}

      fucntion define(name, deps, impl) {
        // 通过for循环将deps里面的参数赋值为modules中的数据
        for(var i = 0; i < deps.length; i++) {
          deps[i] = modules[deps[i]]
        }
        // 通过apply将deps作为参数传给impl，并改变impl函数this的指向，使其指向impl
        modules[name] = impl.apply(impl, deps)
      }

      function get(name) {
        return modules[name]
      }

      return {
        define: define,
        get: get
      }
    })()

    // 定义模块
    MyModules.define( "bar", [], function() {  
      function hello(who) { 
        return "Let me introduce: " + who;   
      } 
      return {     
        hello: hello  
      };
    }); 
 
    MyModules.define('foo', ['bar'], function(bar) {
      var hungry = 'hippo'

      function awesome() {
        console.log(bar.hello(hangry).toUpperCase())
      }

      return {
        awesome
      }
    })
  ~~~

  *通过同一个构造模块函数构造的模块之间可以作为参数使用*

* 作用域
  
  作用域链是基于动态作用域的，而不是代码中的作用域嵌套

  ~~~js
    function foo() {
      console.log( a ); // 2 
    } 
    function bar() {
      var a = 3;
      foo();
    } 
    var a = 2; 
    bar();
  ~~~

#### 第二章  this和对象原型

  `this`提供了一种更优雅的方式来隐式传递一个对象引用，因此可以将API设计得更加简洁并且易于复用

  `this`是在运行的时候绑定的，并不是在编写的时候绑定的，它的上下文取决于函数调用时用的耕种条件。
  当一个函数被调用时，会创建一个活动记录（有时候也称为执行上下文）。这个记录会包 含函数在哪里被调用（调用栈）、函数的调用方法、传入的参数等信息。this 就是记录的 其中一个属性，会在函数执行的过程中用到

###### this 的綁定

  * 默认绑定 - 如果函数直接使用不带有任何修饰的函数引用进行调用，使用默认绑定规则，如果使用了严格模式，全局对象将无法使用默认绑定，因此this会绑定到undefined

  * 隐式绑定 - 如果函数调用位置含有上下文对象，隐式绑定规则会把函数调用中ths绑定到这个上下文对象，对象属性引用链中只有最顶层或者说最后一层会影响调用位置

  * 隐式丢失 - 被隐式绑定的函数会丢失绑定对象，会应用默认绑定，从而把this绑定到全局对象或者undefined上(取决于是否是严格模式)

  ~~~js
    function foo() {      console.log( this.a ); } 
    function doFoo(fn) {     // fn 其实引用的是 foo 
    fn(); // <-- 调用位置！ } 
    var obj = {      a: 2,     foo: foo  }; 
    var a = "oops, global"; // a 是全局对象的属性 
    doFoo( obj.foo ); // "oops, global"
  ~~~

  * 显示绑定 - JavaScript的宿主环境会提供一些特殊的函数，如果传入的是一个原始值(`Number`, `String`, `Boolean`)，原始值会被转成它对应的对象形式(`new String(..)`, `new Number(..)`, `new Boolean(..)`)，这种通常认为是`装箱`
    * call(this, argument) 第一个对象用来绑定this，调用函数时指向这个this，call的参数是直接放进去的，*函数会默认执行一次*
    * apply(this, argument) 第一个对象用来绑定this，调用函数时指向这个this，apply的参数是一个数组，*函数会默认执行一次*
    * band(this, argument) 第一个对象用来绑定this，调用函数时指向这个this，band的参数是直接放进去的，*函数不会默认执行一次*

    ~~~js
      function test() {
        console.log(arguments[0], 'b')
        console.log(this.a, 'a')
      }
      var obj = {
        a: 10,
        b: 20
      }
      test(13)
      console.log('call')
      test.call(obj, obj.b)
      console.log('apply')
      test.apply(obj, [obj.b])
      console.log('bind')
      var test1 = test.bind(obj, obj.b)
      test()
      test1()
      // console
      13 b
      undefined a
      call
      20 b
      10 a
      apply
      20 b
      10 a
      bind
      undefined b
      undefined a
      20 b
      10 a
    ~~~

  * **显示绑定变种**

    * 硬绑定

    ~~~js
      function foo(something) {      console.log( this.a, something );      return this.a + something; } 
      var obj = {      a:2 }; 
      var bar = function() {     return foo.apply( obj, arguments ); }; 
      var b = bar( 3 ); // 2 3 console.log( b ); // 5
    ~~~

    ES5 中提供了内置的方法 Function.prototype. bind

    * API调用的上下文

    许多第三方库以及javascript内置函数，提供了一个可选参数，统称为上下文，作用和`bind(..)`，确保回调函数使用指定的this

    ~~~js
      function foo(el) {      console.log( el, this.id ); } 
      
      var obj = {     id: "awesome" }; 
      
      // 调用 foo(..) 时把 this 绑定到 obj [1, 2, 3].forEach( foo, obj ); // 1 awesome 2 awesome 3 awesome
    ~~~
  
  * new绑定 - 函数在new表达式中被调用时，它是一个构造函数，会初始化新创建的对象，称之为*构造函数调用*

    使用new来调用函数，会自动执行下面操作
    * 创建一个全新的对象
    * 这个新对象会被执行`[[原型]]`连接
    * 这个新对象会绑定到函数调用的this
    * 如果函数没有返回其他对象，那么new表达式中的函数调用会自动返回这个新对象

* this绑定优先级

  默认绑定 < 隐式绑定 < 显示绑定 < new绑定

* 判断this
  * 判断是否在new中调用，绑定的是新创建的对象
  * 是否通过call，apply，bind，绑定的是指定对象
  * 判断是否在某个上下文对象中调用，绑定的是上下文对象
  * 以上全部满足使用默认绑定，绑定到全局对象，严格模式下为undefined

###### 对象

* 主要类型 - `string`,`number`,`boolean`,`null`,`undefined`,`object`

* 内置对象 - `String`,`Number`,`Boolean`,`Array`,`Function`,`Object`,`Date`,`RegExp`,`Error`

* 判断一个对象的类型
  * typeof 返回值是字符串
  * instanceof 返回值是boolean
  * Object.prototype.toString.call(obj) 返回值是字符串 `'[object Object]'`

* 对象属性访问 - `.a`语法通常称为属性访问，`[a]`通常称为键访问，可以接受任意任意字符串作为属性名。

* 对象中，属性名永远都是字符串，如果使用string以外的其他值作为属性名，首先会被转成字符串

* 可计算属性名 - 属性键根据构造函数时传入的键值参数变化

* 属性和方法 - 函数不属于某个对象，只是相同函数对象的多个引用

* 复制对象

  * Object.assign(..)方法实现浅复制，它会遍历一个或者多个原对象的可枚举的自有键并将它们复制到目标对象，最后返回目标对象。
    object.assign使用`=`操作符来赋值，所以源对象属性的一些特性(比如writable)不会被复制到目标对象
  
* 属性描述符

  * Object.getOwnPropertyDescriptor(obj, key)

  ~~~js
    {
      value: ,
      writable: true,
      enumerable: true,
      configurable: true
    }
  ~~~

    * writable 决定是否可以修改属性的值
    * Configurable 如果属性是可配置的，就可以使用defineProperty(..)来修改
    * Enumerable 控制属性是否会出现在对象的属性枚举中，如果为false，遍历的时候不会出现在枚举中，但是仍然可以正常访问

* 不变性

  * 对象常量 - 结合`writable: false` 和`configurable: false`就可以创建一个真正的常量属性（不可修改，重定义或者删除）

  * 禁止扩展 - 如果想要禁止一个对象添加新属性并保留已有属性，可以使用`Object.preventExtensions(..)`

  * 密封 - `Object.seal(..)`会创建一个密封的对象，这个方法实际上会在一个现有对象的基础上调用`Object.preventExtensions(..)`并把所有的属性标记为`configurable: false`，密封之后不仅不能添加新属性，也不能重新配置或者删除任何现有属性

  * 冻结 - `Object.freeze(..)`会创建一个冻结对象，实际上会在一个现有对象的基础上调用`Object.seal(..)`，并将所有数据访问属性标记为`writable: false`

* 存在性 可用通过 `in`和`Object.hasOwnProperty`来检查属性是否在对象中，所有的普通对象都可以连接到`Object.hasOwnProperty`，但是通过`Object.create()`创建的对象无法访问`Object.hasOwnProperty`,这时可以通过`Object.prototype.hasOwnProperty.call(obj, a)`,它借用基础的`hasOwnProperty`方法并显示绑定到`obj`上面

###### 混合对象"类"

* 类理论