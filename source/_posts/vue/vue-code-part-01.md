---
title: Vue源码阅读 part 01
date: 2021-01-02 23:37:19
updated: 2021-01-02 23:37:19
categories:
    - Vue
tags:
    - Vue
cover: /assets/blogCover/Day18 I’m Not Human_100789898.png
---

### Vue源码目录结构

> `compiler`          **编译**
>  - Vue 使用**字符串**作为模板
>  - 在编译文件夹中存放对 模板字符串 解析的算法，抽象语法树，优化
> `core`              **核心**
>  - Vue 构造函数，以及生命周期等方法
> `platforms`         **平台**
>  - 针对运行的环境(browser/andriod/ios) 的不同实现
>  - 也是 vue 的入口
> `server`            **服务端**
>  - 将 vue 用在服务器端的代码
> `sfc`               **单文件组件**
> `shared`            **共用工具、方法**

#### vue 具体文件

- shared/constant   **常量**

  * ASSET_TYPES  每一个 vue 组件需要挂载的成员
  * LIFECYCLE_HOOKS   生命周期函数 `hook`

- shared/utils  **工具方法**

  * isPrimitive   **判断是否为基本数据类型**
  ~~~ts
    function isPrimitive (value: any): boolean %checks {
      return (
        typeof value === 'string' ||
        typeof value === 'number' ||
        // $flow-disable-line
        typeof value === 'symbol' ||
        typeof value === 'boolean'
      )
    }
  ~~~

  * toRawType   **获取传入参数的数据类型**
  ~~~ts
    const _toString = Object.prototype.toString
    function toRawType (value: any): string {
      return _toString.call(value).slice(8, -1)
    }
  ~~~

  * isPromise    **判断是否是 Promise 函数**
  ~~~js
    function isPromise (val: any): boolean {
      return (
        isDef(val) &&
        typeof val.then === 'function' &&
        typeof val.catch === 'function'
      )
    }
  ~~~

  * toString    **重写字符串转化**

  针对特殊的数据类型 object，array 进行处理
  ~~~js
    function toString (val: any): string {
      return val == null
        ? ''
        : Array.isArray(val) || (isPlainObject(val) && val.toString === _toString)
          ? JSON.stringify(val, null, 2)
          : String(val)
    }
  ~~~

  * makeMap     **针对需要缓存的数据map映射，提高速度**

  ~~~js
    function makeMap (
      str: string,
      expectsLowerCase?: boolean
    ): (key: string) => true | void {
      const map = Object.create(null)
      const list: Array<string> = str.split(',')
      for (let i = 0; i < list.length; i++) {
        map[list[i]] = true
      }
      return expectsLowerCase
        ? val => map[val.toLowerCase()]
        : val => map[val]
    }
  ~~~

  * cached      **使用闭包检查是否缓存**

  ~~~js
    function cached<F: Function> (fn: F): F {
      const cache = Object.create(null)
      return (function cachedFn (str: string) {
        const hit = cache[str]
        return hit || (cache[str] = fn(str))  // 第一次调用的时候 hit 是没有值的，但是后面调用的时候，因为闭包原理，cache里面就存储了值
      }: any)
    }
  ~~~

  * camelize    **将-字符连接的变量转化为驼峰模式**

  ~~~js
    const camelizeRE = /-(\w)/g
    const camelize = cached((str: string): string => {
      return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : '')
    })
  ~~~

  * hyphenate   **将驼峰模式转化为-字符连接的变量**

  ~~~js
    const hyphenateRE = /\B([A-Z])/g
    const hyphenate = cached((str: string): string => {
      return str.replace(hyphenateRE, '-$1').toLowerCase()
    })
  ~~~

  * looseEqual    **判断两个对象是否相等**

  js中判断对象是否相等比较的是引用类型
  因此对比两个对象对象相等有以下步骤
    1. 首先判断传入参数 a, b 的引用类型是否一致，如果一致则返回true
    2. 然后判断传入的 a,b 的类型是否是 Object 类型
    3. 遍历 a 对象的成员，如果 a 中每个成员都在 b 中并且对应成员相等
    4. 遍历 b 对象的成员，如果 b 中每个成员都在 a 中并且对应成员相等
    5. 如果成员是引用类型，使用递归
  ~~~js
    function looseEqual (a: any, b: any): boolean {
      if (a === b) return true
      const isObjectA = isObject(a)
      const isObjectB = isObject(b)
      if (isObjectA && isObjectB) {
        try {
          const isArrayA = Array.isArray(a)
          const isArrayB = Array.isArray(b)
          if (isArrayA && isArrayB) {
            // 这一步判断 a 和 b 两个对象的长度是否相等
            return a.length === b.length && a.every((e, i) => {
              return looseEqual(e, b[i])
            })
          } else if (a instanceof Date && b instanceof Date) {
            return a.getTime() === b.getTime()
          } else if (!isArrayA && !isArrayB) {
            const keysA = Object.keys(a)
            const keysB = Object.keys(b)
            // 这一步判断 a 和 b 两个对象的长度是否相等
            return keysA.length === keysB.length && keysA.every(key => {
              return looseEqual(a[key], b[key])
            })
          } else {
            /* istanbul ignore next */
            return false
          }
        } catch (e) {
          /* istanbul ignore next */
          return false
        }
      } else if (!isObjectA && !isObjectB) {
        return String(a) === String(b)
      } else {
        return false
      }
    }
  ~~~

  * once      **利用闭包， 使函数只调用一次**

  ~~~js
    function once (fn: Function): Function {
      let called = false
      return function () {
        if (!called) {
          called = true
          fn.apply(this, arguments)
        }
      }
    }
  ~~~

### Vue 知识点

  * 性能优化
    1. vue 运行在浏览器中，所以需要考虑性能
      每次数据的更新都是更新虚拟 DOM (模板解析) 因此将经常使用的字符串和算法进行缓存
      垃圾回收机制原则中有一个统计现象 “使用的越多的数据，一般都会频繁的使用”

      - 每次创建一个数据，就会考虑是否将其回收
      - 数据达到一定限额的时候就会考虑到垃圾回收(不是实时更新)
      - 每次 都判断对象是否需要回收，需要就遍历
      - 对对象进行划分，统计，往往一个数据使用完以后就不在使用了
      - 如果一个对象在一次回收中还保留下来，统计的结果结果就是这个对象会比较持久的在内存中驻留

      vue 模板中 的 指令， 每次数据发生变化都有可能带来 指令 的解析，所以解析就是字符串处理，一般会消耗一定的性能