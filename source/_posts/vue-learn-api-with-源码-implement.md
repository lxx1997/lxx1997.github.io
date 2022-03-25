---
title: 浅浅的剖析一下 Vue 的执行顺序
date: 2021-02-08 11:02:00
categories: Vue源码
tags:
    - Vue
    - 源码
---

#### 定义 Vue 构造函数

~~~js
  import { initMixin } from './init'
  import { stateMixin } from './state'
  import { renderMixin } from './render'
  import { eventsMixin } from './events'
  import { lifecycleMixin } from './lifecycle'
  import { warn } from '../util/index'

  function Vue (options) {
    if (process.env.NODE_ENV !== 'production' &&
      !(this instanceof Vue)
    ) {
      warn('Vue is a constructor and should be called with the `new` keyword')
    }
    this._init(options)
  }

  initMixin(Vue)
  stateMixin(Vue)
  eventsMixin(Vue) 
  lifecycleMixin(Vue)
  renderMixin(Vue)

  export default Vue
~~~

定义了 一个 Vue 构造函数，这个构造函数传入的参数是 options，使用的时候通过 new 关键字来创建实例，然后调用了 `_init` 方法 根据传入的 `options` 配置来初始化 Vue 实例

#### 初始化 initMixin

~~~js  
  var uid$3 = 0;
  Vue.prototype._init = function (options) {
    var vm = this;
    vm._uid = uid$3++;
    var startTag, endTag;
    // 是否记录 性能
    if (config.performance && mark) {
      startTag = "vue-perf-start:" + (vm._uid);
      endTag = "vue-perf-end:" + (vm._uid);
      mark(startTag);
    }

    vm._isVue = true;
    if (options && options._isComponent) {
      initInternalComponent(vm, options);
    } else {
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      );
    }
    {
      initProxy(vm);
    }
    vm._self = vm;
    initLifecycle(vm);
    initEvents(vm);
    initRender(vm);
    callHook(vm, 'beforeCreate');
    initInjections(vm); // resolve injections before data/props
    initState(vm);
    initProvide(vm); // resolve provide after data/props
    callHook(vm, 'created');
    if (config.performance && mark) {
      vm._name = formatComponentName(vm, false);
      mark(endTag);
      measure(("vue " + (vm._name) + " init"), startTag, endTag);
    }

    if (vm.$options.el) {
      vm.$mount(vm.$options.el);
    }
  };
~~~

通过上述代码，我们可以看到 Vue 在初始化的时候主要做了以下几件事
* 创建 Vue 实例 唯一标识符 `_uid`
* 根据 config 配置判断是否开启 性能监控 `performance`
* 设置 Vue 标识符 `_isVue` 为 `true` 代表当前实例是 Vue 实例
* 通过 option 的 `_isComponents` 属性判断当前 Vue 实例是否是组件，如果是组件就调用 `initInternalComponent` 函数，不是组件就调用 `mergeOptions` 方法，并将返回的参数赋予 Vue 实例的 $options 属性
* 调用 `initProxy` 方法，判断 proxy 代理是否存在，如果存在，使用 proxy 对 Vue 实例进行响应式监控和代理
* 设置 Vue 的 _self 属性 为自身实例
* 调用 initLifecycle 函数 初始化生命周期
* 调用 initEvents 方法 初始化事件对象
* 调用 initRender 方法 初始化渲染使用的方法 `slot, scopedSlots, createElement, _c`方法，并对 `$attrs,$listeners` 方法进行进行数据响应式处理
* 调用 `beforeCreate` 生命周期，由于此时 还没有任何数据或者方法挂载到 Vue 实例上，所以 无法访问
* 调用 initInjections 方法 初始化 `inject` 属性
* 调用 initState 方法 初始化 `data,props,methods,computed,watch` 属性，设置数据响应式处理，及将属性挂载到 Vue 实例上
* 调用 initProvide 方法 初始化 `provide` 属性
* 调用 `created` 生命周期，此时可以访问到 `inject,data,props,methods,computed`上属性的值
* 调用 `$mount` 方法 获取 元素节点 `el`
* 判断是否传入 `render` 函数，没有就初始化一个空 DOM 节点
* 调用 `beforeMount` 生命周期
* 设置 组件变化的监听方法，监听组件是否更新
* 设置 Vue 实例挂载状态为 true
* 调用 `mounted` 生命周期

#### stateMixin

该函数主要针对 实例 `$data`, `$props` 进行数据响应式处理，不允许更新
并且初始化实例 `$set`, `$delete`, `$watch`(并返回一个 撤销监听的方法)

#### eventMixin

初始化事件方法  `$once`, `$on`, `$off`, `$emit`

#### lifecycleMixin

初始化 `_update`, `forceUpdate`, `destory`

当组件发生更新操作或者卸载的时候会触发这些生命周期
`beforeUpdate`,  `updated`,  `beforeDestory`,  `destoryed`

#### renderMixin

在这个函数中 首先通过 installRenderHelpers 方法在 Vue 实例上注册了 协助渲染的函数

~~~js
  function installRenderHelpers (target) {
    target._o = markOnce;   // 定义静态节点 只渲染一次, v-once 指令
    target._n = toNumber;   // 转化为整型
    target._s = toString;   // 字符串转化
    target._l = renderList; // 渲染 v-for 循环
    target._t = renderSlot; // 渲染 slot
    target._q = looseEqual; // 判断 对象是否相等
    target._i = looseIndexOf;   // 获取 元素 在 数组中的位置
    target._m = renderStatic;   // 定义静态节点 只渲染一次, v-once 指令
    target._f = resolveFilter;  // 调用 filter 方法
    target._k = checkKeyCodes;  // 检查键盘事件
    target._b = bindObjectProps;  // 读取 元素的 attr 属性绑定到 props 上面
    target._v = createTextVNode;  // 创建 文本node 节点
    target._e = createEmptyVNode; // 创建空节点
    target._u = resolveScopedSlots;   // 渲染 ScopedSlot
    target._g = bindObjectListeners;  // 绑定事件函数到 on 方法上去
    target._d = bindDynamicKeys;  // 渲染传入 变量 的 attrs 属性
    target._p = prependModifier;  // 设置前置修饰符
  }
~~~

然后初始化 `$nextTick` `_render`

#### 解析 dom 元素并渲染(patch)

Vue 再渲染 DOM 的时候即 `mountComponent` 方法中 会调用 `_update` 方法，并将 Vue 的 `_render` 函数的返回值 (一个 VNode 对象) 作为参数传入,第二个参数 `hydrating` 为 undefined

然后在 _update 方法中 通过 `__patch__` 即 `patch/createPatchFunction` 方法渲染页面

我们来看一下 `patch` 方法做了哪些东西

~~~js
  //  vm.$el, vnode
  var patch = createPatchFunction({ nodeOps: nodeOps, modules: modules })
~~~
* 首先创造了 几个生命周期
~~~js
  var hooks = ['create', 'activate', 'update', 'remove', 'destroy'];
~~~







