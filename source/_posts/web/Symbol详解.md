---
title: Symbol详解
date: 2020-12-04 15:23:00
updated: 2020-12-04 15:23:00
tags:
    - Symbol
    - ES6
    - JavaScript
cover: /assets/blogCover/MIKU花(4)_78753717_p1.png
---

## 定义Symbol

  ~~~js
    var sym = Symbol()
    var sym1 = Symbol('foo')
  ~~~

  `Symbol('foo')`并不会强制将字符串foo转化成symbol类型，他每次都会创建一个新的symbol类型
  因此`Symbol('foo') !== Symbol('foo')`



  **如果想要创建一个Symbol包装器对象**，可以使用`Object()`函数

  ~~~js
    var sym = Symbol('foo')
    typeof sym  // 'symbol
    var symObj = Object(sym)
    typeof symObj // 'object'
  ~~~

  **全局共享的Symbol**
    可以使用`Symbol.for()`或`Symbol.keyFor()`方法从全局的symbol注册表设置和取得symbol

  **在对象中查找symbol属性**
    `Object.getOwnPropertySymbols()`查找一个给定对象的符号属性时返回一个symbol类型的数组，数组可能为空

## 属性

  1. `Symbol.iterator` 为每一个对象定义了默认的迭代器，可以被`for...of`循环使用

```markdown
当需要对一个对象进行迭代时，它的`@@iterator`方法都会在不传参情况下被调用，返回的迭代器用于获取要迭代的值

一些内置类型拥有默认的迭代器行为
* `Array.prtotype[@@iterator]()`
* `TypedArray.prtotype[@@iterator]()`
* `String.prtotype[@@iterator]()`
* `Map.prtotype[@@iterator]()`
* `Set.prtotype[@@iterator]()`

**自定义迭代器**
~~~js
  var myIterable = {}
  myIterable[Symbol.iterator] = function* () {
    yield 1;
    yield 2;
    yield 3;
  }
  [...myIterable]  // [1,2,3]

  for (var x of myIterable) {
    console.log(x) / 1 -> 2 -> 3
  }
~~~

如果一个迭代器没有返回一个迭代器对象，那么他是一个不合格的迭代器，在运行时将会抛出异常
```

  2. `Symbol.asyncIterator` 是一个用于访问对象的`@@asyncIteratir`方法的内建符号，一个异步可迭代对象必须要有`Symbol.asyncIterator`

  ~~~js
    const myAsyncIterable = new Object();
    myAsyncIterable[Symbol.asyncIterator] = async function*() {
        yield "hello";
        yield "async";
        yield "iteration!";
    };

    (async () => {
        for await (const x of myAsyncIterable) {
            console.log(x);
            // expected output:
            //    "hello"
            //    "async"
            //    "iteration!"
        }
    })();
  ~~~

  3. `Symbol.match`指定了匹配的是正则表达式而不是字符串，`String.prototype.match()`方法会调用此函数

  ~~~js
    const regexp = /foo/
    regexp[Symbol.match] = false
    console.log('foo'.startWith(regexp))  // true
    console.log('baz'.startWith(regexp))  // false
  ~~~

  4. `Symbol.replace`这个属性指定了当一个字符串替换所匹配字符串时调用的方法，`String.prototype.replace()`会调用此方法

  ~~~js
    class Replace {
      constructor(value) {
        this.value = value
      }
      [Symbol.replace](string) {
        return `s/${string}/${this.value}/g`
      }
    }
    console.log('foo'.replace(new Replace('bar'))) // s/foo/bar/g
  ~~~

  5. `Symbol.search`指定了一个搜索方法，这个方法接受用户输入的正则表达式，返回改正则表达式在字符串中匹配到的下标 `String.prototype.search()`会调用此方法

  ~~~js
    class caseInsensitiveSearch {
      constructor(value) {
        this.value = value.toLowerCase()
      }
      [Symbol.search](string) {
        return string.toLowerCase().indexOf(this.value)
      }
    }
    console.log('foobar'.search(new caseInsensitiveSearch('BaR'))); // 3
  ~~~

  6. `Symbol.split`指向一个正则表达式的索引处分割字符串的方法，这个方法通过`String.prototype.split()`调用

  ~~~js
    /a/[Symbol.split]('aba', 3)

    var exp = {
      pat: 'in'
      [Symbol.split](str) {
        return str.split(this.pat)
      }
    }
    'dayinlove'.split(exp)
  ~~~

  7. `Symbol.hasInstance` 可以判断某对象是否为某构造器的实例，应此你们可以用它自定义`instanceof`操作符在某个类上的行为

  ~~~js
    class Array1 {
      static [Symbol.hasInstance](instance) {
        return Array.isArray(instance)
      }
    }

    console.log([] instanceof Array1)  // true
  ~~~

  8. `Symbol.isConcatSpreadable`符号用于配置某对象作为`Array.prototype.concat()`方法的参数时是否展开数据元素

  ~~~js
const a = ['a', 'b', 'c']
const b = [1, 2, 3]
let ab = a.concat(b)  // ['a', 'b', 'c', 1, 2, 3]

b[Symbol.isConcatSpreadable] = false
ab = a.concat(b) // ['a', 'b', 'c', Array[1, 2, 3]]

  ~~~

9. `Symbol.toStringTag`作为对象的属性键使用，对用的属性值应该为字符串类型，内置的`Object.prototype.toString()`方法会读取这个标签并把它包含在自己的返回值里面

   加上`toStringTag`属性，你的类也可以自定义类型标签

   ~~~js
   class myClass {
     get [Symbol.toStringTag]() {
       return 'myClass'
     }
   }
   console.log(Object.prototype.toString.call(new myClass())) // '[object myClass]'
   ~~~

   10. `Symbol.for()`方法会根据给定的键`key`，来从运行时的symbol注册表中找到对应的symbol，如果找到了就返回，没有找到就新建一个symbol并加入到全局symbol的注册表中

   ~~~js
   Symbol.for('foo')  // 全局注册 foo
   Symbol.for('foo')  // 返回上一个全局注册的foo
   
   Symbol.for('foo') === Symbol.for('foo') // true
   Symbol('foo') === Symbol('foo') // false
   
   var sym = Symbol.for('mario')
   sym.toSstring() // 'Symbol(mario)'
   ~~~

   11. `Symbol.keyFor()` 用来获取全局symbol注册表中与某个symbol关联的键

   ~~~js
    // 创建一个全局 Symbol 
    var globalSym = Symbol.for("foo"); 
    Symbol.keyFor(globalSym); // "foo"

    var localSym = Symbol(); 
    Symbol.keyFor(localSym); // undefined，

    // 以下Symbol不是保存在全局Symbol注册表中
    Symbol.keyFor(Symbol.iterator) // undefined
   ~~~

