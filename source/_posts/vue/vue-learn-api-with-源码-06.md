---
title: 跟着 Vue源码学习 Vue api 系列 (六) - 实例 property
date: 2021-01-29 14:34:56
updated: 2021-01-29 14:34:56
categories: 
    - [Vue]
    - [SourceCode]
tags:
    - Vue
    - SourceCode
cover: /assets/blogCover/MIKU花(4)_78753717_p1.png
---

#### $data

##### 源码

~~~js
  dataDef.get = function () { return this._data };
  Object.defineProperty(Vue.prototype, '$data', dataDef);
~~~

通过 Object.defineProperty 方法对 Vue 原型上的 $data 设置监听方法，访问 $data 属性的时候 直接返回 Vue 的 _data 数据

不推介使用 $data 来访问 Vue 中 data 中的数据，因为 Vue 在内部已经做了映射，直接把 data 中的属性 映射到 Vue 实例上

#### $props

##### 源码

~~~js
  propsDef.get = function () { return this._props };
  Object.defineProperty(Vue.prototype, '$props', propsDef);
~~~

通过 Object.defineProperty 方法对 Vue 原型上的 $props 设置监听方法，访问 $props 属性的时候 直接返回 Vue 的 _props 数据

不推介使用 $props 来访问 Vue 中 props 中的数据，因为 Vue 在内部已经做了映射，直接把 props 中的属性 映射到 Vue 实例上

#### $el

##### 源码

~~~js
  // $mount
    el = el && inBrowser ? query(el) : undefined;
  // mountComponent
    vm.$el = el;
~~~

  存储了 Vue 实例的根元素

#### $options

##### 源码
~~~js
  // 初始化实例的时候传入 options 参数
  function Vue (options) {
    if (!(this instanceof Vue)
    ) {
      warn('Vue is a constructor and should be called with the `new` keyword');
    }
    this._init(options);
  }

  // _init 方法
  if (options && options._isComponent) {
      // optimize internal component instantiation
      // since dynamic options merging is pretty slow, and none of the
      // internal component options needs special treatment.
      initInternalComponent(vm, options);
    } else {
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      );
    }
~~~

##### 使用

Vue 也支持我们自定义 property 特性，可以通过 optionMergeStrategies 配置自定义特性的合并规则

访问的时候通过 this.$options.property 来访问

#### $parnet

  指向当前组件的 父实例，如果没有父组件实例，则为 null

#### $children

  指向组件的子组件 是一个数组

#### $root

  指向 Vue 实例的根组件，如果没有父组件，即指向自身
  ~~~js
    vm.$parent = parent;
    vm.$root = parent ? parent.$root : vm;
    vm.$children = [];
  ~~~

#### $slots
  `[name]: Array<VNode>`
  用来访问插槽

##### 源码

~~~js
  // initRender
  vm.$slots = resolveSlots(options._renderChildren, renderContext);

  // resolveSlots
  function resolveSlots (
    children,
    context
  ) {
    if (!children || !children.length) {
      return {}
    }
    var slots = {};
    for (var i = 0, l = children.length; i < l; i++) {
      var child = children[i];
      var data = child.data;
      // remove slot attribute if the node is resolved as a Vue slot node
      if (data && data.attrs && data.attrs.slot) {
        delete data.attrs.slot;
      }
      // named slots should only be respected if the vnode was rendered in the
      // same context.
      if ((child.context === context || child.fnContext === context) &&
        data && data.slot != null
      ) {
        var name = data.slot;
        var slot = (slots[name] || (slots[name] = []));
        if (child.tag === 'template') {
          slot.push.apply(slot, child.children || []);
        } else {
          slot.push(child);
        }
      } else {
        (slots.default || (slots.default = [])).push(child);
      }
    }
    // ignore slots that contains only whitespace
    for (var name$1 in slots) {
      if (slots[name$1].every(isWhitespace)) {
        delete slots[name$1];
      }
    }
    return slots
  }
~~~

在初始化渲染的时候，解析 DOM 树，通过 resolveSlots 方法 提取出 slots 对象

resolveSlots 方法 判断 slot 属性是否为空，然后将同一个 slot 下的 node 节点 合并成一个 slot 数组,最后通过 delete 方法删除 slot 为空的数组

##### 使用

~~~html
  <blog-post>
    <template v-slot:header>
      <h1>About Me</h1>
    </template>

    <p>Here's some page content, which will be included in vm.$slots.default, because it's not inside a named slot.</p>

    <template v-slot:footer>
      <p>Copyright 2016 Evan You</p>
    </template>

    <p>If I have some content down here, it will also be included in vm.$slots.default.</p>.
  </blog-post>
  <script>
    Vue.component('blog-post', {
      render: function (createElement) {
        var header = this.$slots.header
        var body   = this.$slots.default
        var footer = this.$slots.footer
        return createElement('div', [
          createElement('header', header),
          createElement('main', body),
          createElement('footer', footer)
        ])
      }
    })
  </script>
~~~

#### $scopedSlots

  `{ [name: string]: props => Array<VNode> | undefined }`

  用来访问作用域插槽。对于包括 默认 slot 在内的每一个插槽，该对象都包含一个返回相应 VNode 的函数。

##### 源码

~~~js
  // Vue.prototype._render
  this.$scopedSlots = normalizeScopedSlots(data.scopedSlots, this。$slots);
  // 函数 normalizeScopedSlots
  function normalizeScopedSlots (
    slots,
    normalSlots,
    prevSlots
  ) {
    var res;
    var hasNormalSlots = Object.keys(normalSlots).length > 0;
    var isStable = slots ? !!slots.$stable : !hasNormalSlots;
    var key = slots && slots.$key;
    if (!slots) {
      res = {};
    } else if (slots._normalized) {
      // fast path 1: child component re-render only, parent did not change
      return slots._normalized
    } else if (
      isStable &&
      prevSlots &&
      prevSlots !== emptyObject &&
      key === prevSlots.$key &&
      !hasNormalSlots &&
      !prevSlots.$hasNormal
    ) {
      // fast path 2: stable scoped slots w/ no normal slots to proxy,
      // only need to normalize once
      return prevSlots
    } else {
      res = {};
      for (var key$1 in slots) {
        if (slots[key$1] && key$1[0] !== '$') {
          res[key$1] = normalizeScopedSlot(normalSlots, key$1, slots[key$1]);
        }
      }
    }
    // expose normal slots on scopedSlots
    for (var key$2 in normalSlots) {
      if (!(key$2 in res)) {
        res[key$2] = proxyNormalSlot(normalSlots, key$2);
      }
    }
    // avoriaz seems to mock a non-extensible $scopedSlots object
    // and when that is passed down this would cause an error
    if (slots && Object.isExtensible(slots)) {
      (slots)._normalized = res;
    }
    def(res, '$stable', isStable);
    def(res, '$key', key);
    def(res, '$hasNormal', hasNormalSlots);
    return res
  }
~~~

  
#### $refs

##### 源码
~~~js
  var ref = {
    create: function create (_, vnode) {
      registerRef(vnode);
    },
    update: function update (oldVnode, vnode) {
      if (oldVnode.data.ref !== vnode.data.ref) {
        registerRef(oldVnode, true);
        registerRef(vnode);
      }
    },
    destroy: function destroy (vnode) {
      registerRef(vnode, true);
    }
  };

  function registerRef (vnode, isRemoval) {
    var key = vnode.data.ref;
    if (!isDef(key)) { return }

    var vm = vnode.context;
    var ref = vnode.componentInstance || vnode.elm;
    var refs = vm.$refs;
    if (isRemoval) {
      if (Array.isArray(refs[key])) {
        remove(refs[key], ref);
      } else if (refs[key] === ref) {
        refs[key] = undefined;
      }
    } else {
      if (vnode.data.refInFor) {
        if (!Array.isArray(refs[key])) {
          refs[key] = [ref];
        } else if (refs[key].indexOf(ref) < 0) {
          // $flow-disable-line
          refs[key].push(ref);
        }
      } else {
        refs[key] = ref;
      }
    }
  }
~~~

通过 registerRef 方法 注册和移除旧的 VNode

##### 使用

~~~html
  <my-component ref="myComponent"></my-component>
  <script>
    export default {
      mounted() {
        console.log(this.$refs['myComponent'])
      }
    }
  </script>
~~~

#### $isServer

~~~js
  var isServerRendering = function () {
    if (_isServer === undefined) {
      /* istanbul ignore if */
      if (!inBrowser && !inWeex && typeof global !== 'undefined') {
        // detect presence of vue-server-renderer and avoid
        // Webpack shimming the process
        _isServer = global['process'] && global['process'].env.VUE_ENV === 'server';
      } else {
        _isServer = false;
      }
    }
    return _isServer
  };
~~~

判断 代码运行环境是否是服务端渲染,开启对应渲染和优化方法

#### $attrs

  包含了父作用域中不作为 prop 被识别且获取的 attribute 绑定(除开 class 和 style)，当一个组件没有声明任何props时，这里会包含所有父作用域的绑定，并且可以通过 `v-bind="$attrs"` 传入内部组件

~~~js
  // function updateChildComponent
  vm.$attrs = parentVnode.data.attrs || emptyObject;
~~~

#### $listeners

  包含了父作用域中的 `v-on`(不包含 `.natvie` 修饰器) 事件监听器，可以通过 `v-on="$listeners"` 传入内部组件

~~~js

  vm.$listeners = listeners || emptyObject;
~~~

#### $watch

##### 源码
~~~js
  Vue.prototype.$watch = function (
    expOrFn,
    cb,
    options
  ) {
    var vm = this;
    if (isPlainObject(cb)) {
      return createWatcher(vm, expOrFn, cb, options)
    }
    options = options || {};
    options.user = true;
    var watcher = new Watcher(vm, expOrFn, cb, options);
    if (options.immediate) {
      try {
        cb.call(vm, watcher.value);
      } catch (error) {
        handleError(error, vm, ("callback for immediate watcher \"" + (watcher.expression) + "\""));
      }
    }
    return function unwatchFn () {
      watcher.teardown();
    }
  };
~~~

  主要是通过 Watcher 构造函数及 createWatcher 方法对 Vue 实例的属性进行监控，然后返回一个取消观察的函数，用来停止触发回调

##### 使用

~~~js
  // 第一种使用
  this.$watch('property', cb)
  // 第二种使用
  this.$watch('property', cb, {
    deep: true,
    immediate: true
  })
  // 第三种使用
  this.$watch('property', {
    handler: cb,
    deep: true,
    immediate: true
  })
~~~

$watch 方法会返回一个取消侦听函数，但是如果包含 immediate 选项时，不能在第一次回调时取消侦听给定的 `property`

~~~js
  // bad example
  const unwatch = this.$watch('property', function() {
    unwatch()
  }, {
    deep: true,
    immediate: true
  })
  // good example
  const unwatch = this.$watch('property', function() {
    if(unwatch) {
      unwatch()
    }
  }, {
    deep: true,
    immediate: true
  })
~~~
 

#### $set
  参考[Vue.set](/2021/01/20/vue-learn-api-with-源码-02/#Vue-set-target-Object-Array-index-Number-string-value-any)

#### $delete

  参考[Vue.delete](/2021/01/20/vue-learn-api-with-源码-02/#Vue-delete-target-Object-Array-index-Number-string)