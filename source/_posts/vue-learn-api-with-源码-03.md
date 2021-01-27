---
title: 跟着 Vue 源码学习 Vue api 系列 (二) - 选项 / 数据
date: 2021-01-24 22:38:26
categories: Vue 源码
tags:
    - Vue
    - 源码
---

#### data

在 data 中的数据 在 vue2 中会使用 Object.defineProperty 方法监听数据变化（vue3 采用 proxy）当数据发生变化的时候，会带动页面发生变化

在使用data的时候推介使用 返回一个初始对象的函数的方法，如果 data 是一个纯粹的对象，会造成 Vue 所有实例共享同一个引用数据对象

##### 源码
~~~js
  function initData (vm) {
    var data = vm.$options.data;
    data = vm._data = typeof data === 'function'
      ? getData(data, vm)
      : data || {};
    if (!isPlainObject(data)) {
      data = {};
      warn(
        'data functions should return an object:\n' +
        'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function',
        vm
      );
    }
    // proxy data on instance
    var keys = Object.keys(data);
    var props = vm.$options.props;
    var methods = vm.$options.methods;
    var i = keys.length;
    while (i--) {
      var key = keys[i];
      {
        if (methods && hasOwn(methods, key)) {
          warn(
            ("Method \"" + key + "\" has already been defined as a data property."),
            vm
          );
        }
      }
      if (props && hasOwn(props, key)) {
        warn(
          "The data property \"" + key + "\" is already declared as a prop. " +
          "Use prop default value instead.",
          vm
        );
      } else if (!isReserved(key)) {
        proxy(vm, "_data", key);
      }
    }
    // observe data
    observe(data, true /* asRootData */);
  }
~~~

上述源码 主要是判断一下 data 的 类型以及判断 data 定义的变量名是否在 props 及 methods 中是否也存在，之后调用 observe 方法给 data 对象添加数据监听

~~~js
  function getData (data, vm) {
    // #7573 disable dep collection when invoking data getters
    pushTarget();
    try {
      return data.call(vm, vm)
    } catch (e) {
      handleError(e, vm, "data()");
      return {}
    } finally {
      popTarget();
    }
  }
~~~
数据映射，将 data 的数据映射到 Vue 实例上，这样我们通过 Vue.property 的方法也能访问到 data 上的数据
