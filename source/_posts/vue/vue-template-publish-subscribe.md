---
title: 03 - Vue源码解读-发布订阅模式
date: 2020-12-21 14:06:22
categories:
    - Vue
tags:
    - Vue
    - JavaScript
cover: /assets/blogCover/MIKU花(4)_78753717_p1.png
---

#### 发布订阅模式

  ###### 代理方法 

  将 app._data 中的成员给映射到 vue 实例上面，由于app.data 已经是响应式的对象了，所以只需要让app访问的成员去访问 app._data 的对应成员

  引入一个函数 proxy(target, src, prop),target 的操作映射到 src.prop 上面 *(当时没有 es6 的 Proxy 语法)*

  使用一个新的方法来处理 `Observer` 方法对属性进行处理，将这个方法封装到 initData 方法中

  ~~~js
    JGVue.prototype.initData = function () {
      let keys = Object.keys(this._data)
      // 响应式化  setReactive
      for (let k = 0; k < keys.length; k++) {
        setReactive(this._data, vm)
      }
      // 代理
      for (let k = 0; k < keys.length; k++) {
        // 将 this._data[keys[k]] 映射到 this[keys[i]]
        // 访问这个属性的时候相当于访问 this._data 的这个属性
        Object.defineProperty(this, keys[k], {
          enumerable: true,
          configurable: true,
          get() {
            return this._data[keys[k]]
          },
          set(newValue) {
            this._data[key[i]] = newValue
          }
        })
      }
    }
  ~~~

  或者以下方法

  ~~~js
    JGVue.prototype.initData = function () {
      let keys = Object.keys(this._data)
      // 响应式化  setReactive
      for (let k = 0; k < keys.length; k++) {
        setReactive(this._data, vm)
      }
      // 代理
      for (let k = 0; k < keys.length; k++) {
        // 将 this._data[keys[k]] 映射到 this[keys[i]]
        // 访问这个属性的时候相当于访问 this._data 的这个属性
        proxy(this, '_data', keys[k])
      }
    }
    function proxy(target, prop, key) {
      Object.defineProperty(target, key, {
        enumerable: true,
        configurable: true,
        get() {
          return target[prop][key]
        },
        set(newValue) {
          target [prop][key[i]] = newValue
        }
      })
    }
  ~~~