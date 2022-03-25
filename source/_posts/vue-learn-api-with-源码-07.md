---
title: 跟着 Vue源码学习 Vue api 系列 (七) - 实例 property
date: 2021-02-01 15:25:46
categories: Vue源码
tags:
    - Vue
    - 源码
---


#### $on $emit

监听 `Vue.$emit` 发送的事件，回调函数会接收所有传入参数的参数

##### 源码

~~~js
  // $on 监听事件
  Vue.prototype.$on = function (event, fn) {
    var vm = this;
    if (Array.isArray(event)) {
      for (var i = 0, l = event.length; i < l; i++) {
        vm.$on(event[i], fn);
      }
    } else {
      (vm._events[event] || (vm._events[event] = [])).push(fn);
      // optimize hook:event cost by using a boolean flag marked at registration
      // instead of a hash lookup
      if (hookRE.test(event)) {
        vm._hasHookEvent = true;
      }
    }
    return vm
  };
  // $emit 发送事件及参数
  Vue.prototype.$emit = function (event) {
    var vm = this;
    {
      var lowerCaseEvent = event.toLowerCase();
      if (lowerCaseEvent !== event && vm._events[lowerCaseEvent]) {
        tip(
          "Event \"" + lowerCaseEvent + "\" is emitted in component " +
          (formatComponentName(vm)) + " but the handler is registered for \"" + event + "\". " +
          "Note that HTML attributes are case-insensitive and you cannot use " +
          "v-on to listen to camelCase events when using in-DOM templates. " +
          "You should probably use \"" + (hyphenate(event)) + "\" instead of \"" + event + "\"."
        );
      }
    }
    var cbs = vm._events[event];
    if (cbs) {
      cbs = cbs.length > 1 ? toArray(cbs) : cbs;
      var args = toArray(arguments, 1);
      var info = "event handler for \"" + event + "\"";
      for (var i = 0, l = cbs.length; i < l; i++) {
        // 调用 事件监听的回调函数
        invokeWithErrorHandling(cbs[i], vm, args, vm, info);
      }
    }
    return vm
  };
  // invokeWithErrorHandling
  function invokeWithErrorHandling (
    handler,
    context,
    args,
    vm,
    info
  ) {
    var res;
    try {
      res = args ? handler.apply(context, args) : handler.call(context);
      if (res && !res._isVue && isPromise(res) && !res._handled) {
        res.catch(function (e) { return handleError(e, vm, info + " (Promise/async)"); });
        // issue #9511
        // avoid catch triggering multiple times when nested calls
        res._handled = true;
      }
    } catch (e) {
      handleError(e, vm, info);
    }
    return res
  }
~~~

**主要是用了 事件发布订阅模式**

`(vm._events[event] || (vm._events[event] = [])).push(fn)` 通过这段代码 将 `$on` 监听的事件名称及方法 存储到 Vue 的私有属性 `_event` 中，当使用 `$emit` 发送事件的时候会在 `_event` 中找到对应的时间名，然后调用 `res = args ? handler.apply(context, args) : handler.call(context)` 调用 回调函数


##### 使用 

~~~js
  // 发送事件
  this.$emit('sayHi', 'hi')

  // 接收事件
  this.$on('sayHi', function(msg) {
    console.log('say ' + msg) // say hi
  })
~~~

#### $once

  监听一个自定义时间，只触发一次，触发之后移除监听器

~~~js
  Vue.prototype.$once = function (event, fn) {
    var vm = this;
    function on () {
      vm.$off(event, on);
      fn.apply(vm, arguments);
    }
    on.fn = fn;
    vm.$on(event, on);
    return vm
  };
~~~

在 $once 函数内部定义了一个回调函数，用于 触发事件之后调用 $off 方法销毁事件监听器
$emit 触发 $once 监听事件

#### $off

  移除事件监听器

~~~js
  Vue.prototype.$off = function (event, fn) {
    var vm = this;
    // all
    if (!arguments.length) {
      vm._events = Object.create(null);
      return vm
    }
    // array of events
    if (Array.isArray(event)) {
      for (var i$1 = 0, l = event.length; i$1 < l; i$1++) {
        vm.$off(event[i$1], fn);
      }
      return vm
    }
    // specific event
    var cbs = vm._events[event];
    if (!cbs) {
      return vm
    }
    if (!fn) {
      vm._events[event] = null;
      return vm
    }
    // specific handler
    var cb;
    var i = cbs.length;
    while (i--) {
      cb = cbs[i];
      if (cb === fn || cb.fn === fn) {
        cbs.splice(i, 1);
        break
      }
    }
    return vm
  };
~~~
  使用 $off 方法移除监听器的时候可以选择性的传两个参数 `event, fn`
  * 如果不传参数 默认移除所有的监听器事件
  * 如果只传了 event 事件，移除对应事件下所有的监听器事件
  * 如果同时提供了 event 事件和 回调，移除对应事件下的这个回调的监听器

##### 使用

~~~js
  this.$off() // 移除所有
  this.$off('test') // 移除 test 下的所有监视器函数
  this.$off('test', fn) // 移除 test 下的 fn 回调函数 fn 是一个变量，指向回调函数地址
~~~

#### $mount

  传入 el 为 DOM 元素

##### 源码

[参考地址](/lxx1997.github.io/2021/01/27/vue-learn-api-with-源码-04/#el，template-render)


##### 使用

~~~js
  new Vue({
    render: (h) => h()
  }).$mount('#app')
~~~

#### $forceUpdate

强制更新页面，仅影响实例本身和插入插槽内容的子组件

~~~js
  Vue.prototype.$forceUpdate = function () {
    var vm = this;
    if (vm._watcher) {
      vm._watcher.update();
    }
  };
~~~

原理是调用 Watcher 的 update 方法更新 DOM 元素


#### $nextTick

  [Vue.nextTick](/lxx1997.github.io/2021/01/20/vue-learn-api-with-源码-02/#Vue-nextTick-callback-Function-context-Object)

#### $destroy

##### 源码

~~~js
  Vue.prototype.$destroy = function () {
    var vm = this;
    if (vm._isBeingDestroyed) {
      return
    }
    callHook(vm, 'beforeDestroy');
    vm._isBeingDestroyed = true;
    // remove self from parent
    var parent = vm.$parent;
    if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
      remove(parent.$children, vm);
    }
    // teardown watchers
    if (vm._watcher) {
      vm._watcher.teardown();
    }
    var i = vm._watchers.length;
    while (i--) {
      vm._watchers[i].teardown();
    }
    // remove reference from data ob
    // frozen object may not have observer.
    if (vm._data.__ob__) {
      vm._data.__ob__.vmCount--;
    }
    // call the last hook...
    vm._isDestroyed = true;
    // invoke destroy hooks on current rendered tree
    vm.__patch__(vm._vnode, null);
    // fire destroyed hook
    callHook(vm, 'destroyed');
    // turn off all instance listeners.
    vm.$off();
    // remove __vue__ reference
    if (vm.$el) {
      vm.$el.__vue__ = null;
    }
    // release circular reference (#6759)
    if (vm.$vnode) {
      vm.$vnode.parent = null;
    }
  };
~~~

* 在 $destroy 函数执行过程中，触发了 `beforeDestroy` 和 `destroyed` 生命周期函数
* 为防止多次调用，添加了是否正在销毁组件状态
* 同时移除所有的子组件，监听函数
* 销毁所有的事件监听函数，并置空 node 节点
