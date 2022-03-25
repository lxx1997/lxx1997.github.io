---
title: 跟着 Vue源码学习 Vue api 系列 (四) - 选项 / DOM 及 生命周期函数、filters,directives,components
date: 2021-01-27 22:16:53
categories: Vue源码
tags:
    - Vue
    - 源码
---

#### el，template render

##### 源码

el 指定的元素作为 Vue 实例的挂载目标 主要是通过 Vue 实例的 $mount 方法

$mount 方法 主要 通过 el 获取到 DOM 元素 然后调用 mountComponents 方法 绑定到 Vue 实例上，最后返回 Vue 实例
~~~js
  Vue.prototype.$mount = function (
    el,
    hydrating
  ) {
    el = el && inBrowser ? query(el) : undefined;
    return mountComponent(this, el, hydrating)
  };
~~~

mountComponent 方法
  * 判断 是否有render函数，没有提示至少要有template或者render函数 (tempalte,el,render 不同同时使用)
  * 调用 beforeMount 声明周期
  * 判断是否开启性能优化检查
  * 对 vm 的 updateComponet 函数进行 监听变化，如果发生变化，触发 beforeUpdate 生命周期函数
  * Vue 实例上挂载了 node 节点后更改 Vue 是否挂载状态
  * 调用 mounted 生命周期
  * 返回 挂载了 DOM 元素的 Vue 实例
~~~js
  function mountComponent (vm, el, hydrating) {
    vm.$el = el;
    if (!vm.$options.render) {
      vm.$options.render = createEmptyVNode;
      {
        /* istanbul ignore if */
        if ((vm.$options.template && vm.$options.template.charAt(0) !== '#') ||
          vm.$options.el || el) {
          warn(
            'You are using the runtime-only build of Vue where the template ' +
            'compiler is not available. Either pre-compile the templates into ' +
            'render functions, or use the compiler-included build.',
            vm
          );
        } else {
          warn(
            'Failed to mount component: template or render function not defined.',
            vm
          );
        }
      }
    }
    callHook(vm, 'beforeMount');

    var updateComponent;
    /* istanbul ignore if */
    if (config.performance && mark) {
      updateComponent = function () {
        var name = vm._name;
        var id = vm._uid;
        var startTag = "vue-perf-start:" + id;
        var endTag = "vue-perf-end:" + id;

        mark(startTag);
        var vnode = vm._render();
        mark(endTag);
        measure(("vue " + name + " render"), startTag, endTag);

        mark(startTag);
        vm._update(vnode, hydrating);
        mark(endTag);
        measure(("vue " + name + " patch"), startTag, endTag);
      };
    } else {
      updateComponent = function () {
        vm._update(vm._render(), hydrating);
      };
    }

    // we set this to vm._watcher inside the watcher's constructor
    // since the watcher's initial patch may call $forceUpdate (e.g. inside child
    // component's mounted hook), which relies on vm._watcher being already defined
    new Watcher(vm, updateComponent, noop, {
      before: function before () {
        if (vm._isMounted && !vm._isDestroyed) {
          callHook(vm, 'beforeUpdate');
        }
      }
    }, true /* isRenderWatcher */);
    hydrating = false;

    // manually mounted instance, call mounted on self
    // mounted is called for render-created child components in its inserted hook
    if (vm.$vnode == null) {
      vm._isMounted = true;
      callHook(vm, 'mounted');
    }
    return vm
  }
~~~

##### 使用

~~~js
new Vue({
  el: '#app',
  template: `<div>test</div>`
})

new Vue({
  template: `<div>test</div>`
}).$mount('#app')

new Vue({
  el: '#app',
  render: (h) => h()
})
~~~

#### 生命周期函数

##### 源码

~~~js
  function callHook (vm, hook) {
    // #7573 disable dep collection when invoking lifecycle hooks
    pushTarget();
    var handlers = vm.$options[hook]; // 接收到的是一个数组
    var info = hook + " hook";
    if (handlers) {
      for (var i = 0, j = handlers.length; i < j; i++) {
        invokeWithErrorHandling(handlers[i], vm, null, vm, info);
      }
    }
    if (vm._hasHookEvent) {
      vm.$emit('hook:' + hook);
    }
    popTarget();
  }

  function invokeWithErrorHandling (handler,context,args,vm,info) {
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

在 callHook 方法中，主要是针对组件 生命周期进行处理，调用 invokeWithErrorHandling 方法 执行生命周期函数

在 invokeWithErrorHandling 方法中，通过 call 和 apply 执行生命周期函数及传参

##### 使用

**生命周期函数**

  * `beforeCreate`
  * `created`
  * `beforeMount`
  * `mounted`
  * `beforeUpdate`
  * `updated`
  * `beforeDestroy`
  * `destroyed`
  * `activated`
  * `deactivated`
  * `errorCaptured`
  * `serverPrefetch`

**生命周期函数执行顺序**

  1. 在 initMixin函数中，定义了 Vue 的 _init 函数，初始化 Vue 信息，合并 Vue 的 options 信息，初始化生命周期，初始化事件对象，初始化渲染方法
  2. 调用 `beforeCreate` 生命周期 *不能访问到数据和dom元素，但是能够访问生命周期函数*
  3. 初始化注册函数，初始化 data，props，methods，watch,provide
  4. 调用 `created` 生命周期 *能获取到数据及方法，但是无法操作 dom*
  5. 调用 $mount 方法挂载 DOM 元素 绑定 el 对应的 DOM 元素
  6. 调用 `beforeMount` 生命周期
  7. 调用 _update 挂载 DOM 元素,
  8. 使用 Watcher 构造函数 监听 updateComponent 方法，触发 `beforeUpdate` 生命周期
  9. 调用 `mounted` 生命周期
  10. 页面发生变化 时触发 `updated` 生命周期
  11. 页面销毁时时触发 `$destroy` 方法
  12. 调用 `beforeDestroy` 生命周期
  13. 清空 watcher，child，组件 及事件监听函数
  12. 调用 `destroyed` 生命周期

**特殊的生命周期函数**

  `activated/deactivated` 只有被 keep-alive 组件包围的组件才有 这个生命周期函数

  `errorCaptured` 全局报错信息的生命周期函数，报错捕获

#### directives

##### 源码
请参照 [Vue.directive](/lxx1997.github.io/2021/01/20/vue-learn-api-with-%E6%BA%90%E7%A0%81-02/#Vue-directive-id-string-definition-Function-Object)

##### 使用

~~~js
export default {
  directives: {
    clip: {
      insert: function() {},
      bind: function() {}
      componentUpdate: function() {}
    }
  }
}
~~~
#### filters

##### 源码
请参照 [Vue.filter](/lxx1997.github.io/2021/01/20/vue-learn-api-with-%E6%BA%90%E7%A0%81-02/#Vue-filter-id-string-definition-Function)

##### 使用

~~~js
export default {
  filters: {
    clip: function(value) {
      return value
    }
  }
}
~~~
#### components

##### 源码
请参照 [Vue.component](/lxx1997.github.io/2021/01/20/vue-learn-api-with-%E6%BA%90%E7%A0%81-02/#Vue-component-id-string-definition-Function-Object)

##### 使用

~~~js
  export default {
    components: {
      FirstComponent,
      SecondComponent
    }
  }
~~~