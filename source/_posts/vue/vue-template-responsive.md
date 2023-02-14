---
title: 03 - Vue源码解读-响应式
date: 2020-12-18 17:40:59
categories:
    - Vue
tags:
    - Vue
    - JavaScript
cover: /assets/blogCover/MIKU花(4)_78753717_p1.png
---

#### 响应式原理

  - 我们在使用 Vue 的时候，复制属性获得属性都是直接使用Vue实例
  - 我们在设计属性值的时候，页面数据更新

  ##### `Object.defineProperty(obj, key, {})`

  ~~~js
    // 注意 value 和 writable 不可以和 get set 连用
    Object.defineProperty(obj, key, {
      enumerable: !!enumerable,
      configurable: true,
      set (newValue){
        value = newValue
      },
      get(){
        console.log(value)
        return value
      }
    })
  ~~~

  使用 `Object.defineProperty()` 实现数据监控

  ~~~js
    const data = {
      name: '优·库里伍德·海尔赛兹',
      behavior: '吃橘子',
      like: [
        {juice: 'juice'}
      ],
      other: {
        name: '相川步',
        behavior: {
          name: '约的人',
          time: '12m'
        }
      }
    }
    function setPerperties(obj, key, value, enumerable) {
      console.log(obj, key, value, !!enumerable)
      Object.defineProperty(obj, key, {
        enumerable: !!enumerable,
        configurable: true,
        set (newValue){
          value = newValue
        },
        get(){
          console.log(value)
          return value
        }
      })
    }
    function setReactive(o) {
      Object.keys(o).map(key => {
        if(Object.prototype.toString.call(o[key]) === '[object Object]') {
          setReactive(o[key]) 
        } else if(Object.prototype.toString.call(o[key]) === '[object Array]') {
          o[key].map(item => {
            if(Object.prototype.toString.call(item) === '[object Object]' || Object.prototype.toString.call(item) === '[object Array]') setReactive(item)
          })
        } else {
          setPerperties(o, key, o[key], true)
        }
      })
    }
    setReactive(data)
  ~~~

  针对数组中的特殊方法进行响应式化处理
  * push      向数组的最后添加元素，并返回新的数组长度
  * unshift   向数组的开始添加元素，并返回新的数组长度
  * pop       删除数组的最后一个元素，并返回被删除的元素
  * shift     删除数组的第一个元素，并返回被删除的元素
  * reverse   翻转数组，并返回翻转之后的数组
  * sort      数组排序
  * splice    向/从数组中添加/删除项目，然后返回被删除的项目，rrayObject.splice(index,howmany,item1,.....,itemX) (删除的位置, 删除的个数， 插入的新元素)

  * vue2 中数组发生变化，设置 length 没法通知（Vue3 中使用Proxy语法解决了这个问题）
  * 加进来的元素也应该是响应式的
  * 技巧：如果一个函数已经定义了，但是我们需要扩展其功能，我们一般的处理方法
    1. 使用一个临时的函数名存储函数
    2. 重新定义原来的函数
    3. 定义扩展的功能
    4. 调用临时的那个函数
  ~~~js
    function func() {
      console.log('old property')
    }
    // 第一步
    let _tempFn = func
    // 第二步
    func = function() {
      // 第四步
      _tempFn()
      // 第三步
      console.log('new property')
    }
    func()
  ~~~

  * 如何修改数组的扩展函数
  * 不能直接修改数组的 prototype
  * 修改要进行响应式化的数组的原型(__proto__)
  * 原型式继承：修改原型链结构
  *   继承关系： arr -> Array.prototype -> Object.prototype -> ...
  *   修改之后： arr -> 改写的方法 -> Array.prototype -> Object.prototype -> ...
  ~~~js
    let arr = []
    let ARRAY_METHOD = ['pop', 'unshift', 'push', 'shift', 'reverse', 'sort', 'splice']

    let arrayMethods = Object.create(Array.prototype)
    ARRAY_METHOD.map(item => {
      arrayMethods[item] = function() {
        Array.from(arguments).map(item => {
          setReactive(item)
        })
        // 在这里对数据进行响应式化
        let res = Array.prototype[item].apply(this, arguments)
        return res
      }
    })

    arr.__proto__ = arrayMethods
  ~~~
  * vue做了兼容，如果浏览器兼容__proto__，就使用 原型式继承
  * 不兼容就使用 混入法 将方法一个个的加入到 arr 中

  将方法整合到设置响应式方法中
  ~~~js
    function setReactive(o) {
      Object.keys(o).map(key => {
        if(Object.prototype.toString.call(o[key]) === '[object Object]') {
          setReactive(o[key]) 
        } else if(Object.prototype.toString.call(o[key]) === '[object Array]') {
          console.log(o[key])
          o[key].__proto__ = arrayMethods // 拦截数组，进行数组响应式
          o[key].map(item => {
            if(Object.prototype.toString.call(item) === '[object Object]' || Object.prototype.toString.call(item) === '[object Array]') setReactive(item)
          })
        } else {
          setPerperties(o, key, o[key], true)
        }
      })
    }
  ~~~

  对 对象 或者 数组 重新赋值 如何设置响应式

  setPerperties() 函数的set方法中 重新调用一次 setReactive()

#### 变更页面
  在 JGVue 函数中调用 setReactive 方法 把 this._data 设置成响应式类型，同时传递 vue 实例到 Object.defineProperty
  ~~~js
    function JGVue(options) {
      this._data = options.data
      setReactive(this._data, this)
      this._template = document.querySelector(options.el) // vue 中这里是DOM
      this.mount() // 挂载
    }
  ~~~
  修改 setReactive 方法
  ~~~js
    function setReactive(o, vm) {
      Object.keys(o).map(key => {
        if(Object.prototype.toString.call(o[key]) === '[object Object]') {
          setReactive(o[key], vm) 
        } else if(Object.prototype.toString.call(o[key]) === '[object Array]') {
          o[key].__proto__ = arrayMethods // 拦截数组，进行数组响应式
          o[key].map(item => {
            if(Object.prototype.toString.call(item) === '[object Object]' || Object.prototype.toString.call(item) === '[object Array]') setReactive(item, vm)
          })
        } else {
          setPerperties.call(vm, o, key, o[key], true)
        }
      })
    }
  ~~~
  修改 setPerperties 函数

  ~~~js
    function setPerperties(obj, key, value, enumerable) {
      let _that = this
      Object.defineProperty(obj, key, {
        enumerable: !!enumerable,
        configurable: true,
        set (newValue){
          value = newValue
          _that.mountComponent()
        },
        get(){
          return value
        }
      })
    }
  ~~~



