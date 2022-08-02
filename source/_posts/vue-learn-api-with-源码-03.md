---
title: 跟着 Vue源码学习 Vue api 系列 (三) - 选项 / 数据
date: 2021-01-24 22:38:26
categories: 
    - Vue
    - SourceCode
tags:
    - Vue
    - SourceCode
cover: '/assets/cover/20200225A1295.jpg'
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

##### 使用

~~~js
  export default {
    data() {
      return {
        parameter: 'parameter'
      }
    }
  }
~~~

#### props

##### 源码

~~~js
  function normalizeProps (options, vm) {
    var props = options.props;
    if (!props) { return }
    var res = {};
    var i, val, name;
    if (Array.isArray(props)) { // 判断 props 类型 第一种是传递数组 ['props1', 'props2']
      i = props.length;
      while (i--) {
        val = props[i];
        if (typeof val === 'string') {
          name = camelize(val);
          res[name] = { type: null };
        } else {
          warn('props must be strings when using array syntax.');
        }
      }
    } else if (isPlainObject(props)) {  // 判断 props 类型 第二种是传递带有类型检查的对象
      for (var key in props) {
        val = props[key];
        name = camelize(key);
        res[name] = isPlainObject(val)
          ? val
          : { type: val };
      }
    } else {
      warn(
        "Invalid value for option \"props\": expected an Array or an Object, " +
        "but got " + (toRawType(props)) + ".",
        vm
      );
    }
    options.props = res;
  }
~~~

##### 使用
  props 有两种使用方式

  * 数组方式

    子组件用一个数组接收父组件传递的props `props: ['props1', 'props2']`
    **缺点**就是无法做类型检查，无法控制接收到的 props 的数据类型及默认值

  * 对象方式

    子组件用一个对象接收父组件传入的props
    对象属性上有以下参数  
    * `type` props 的数据类型，单个类型 直接判断 `type: String` ，多个类型 传递数组 `type: [String, Array]`
    * `default` 默认值，如果父组件没有传递此 props，将会自动取默认值
    * `require`  是否必传
    * `validator` 自定义验证函数
~~~js
  export default {
    // props: ['props1', 'props2']
    props: {
      props1: {
        type: String,
        default: '',
        require: true,
        validator: () => {}
      },
      props: Number
    }
  }
~~~

#### propsData
  使用 new 创建 Vue 实例的时候使用
##### 源码

  此源码也包含 props
~~~js
  function initProps (vm, propsOptions) {
    var propsData = vm.$options.propsData || {};
    var props = vm._props = {};
    // cache prop keys so that future props updates can iterate using Array
    // instead of dynamic object key enumeration.
    var keys = vm.$options._propKeys = [];
    var isRoot = !vm.$parent;
    // root instance props should be converted
    if (!isRoot) {
      toggleObserving(false);
    }
    var loop = function ( key ) {
      keys.push(key);
      var value = validateProp(key, propsOptions, propsData, vm);
      /* istanbul ignore else */
      {
        var hyphenatedKey = hyphenate(key);
        if (isReservedAttribute(hyphenatedKey) ||
            config.isReservedAttr(hyphenatedKey)) {
          warn(
            ("\"" + hyphenatedKey + "\" is a reserved attribute and cannot be used as component prop."),
            vm
          );
        }
        defineReactive$$1(props, key, value, function () {
          if (!isRoot && !isUpdatingChildComponent) {
            warn(
              "Avoid mutating a prop directly since the value will be " +
              "overwritten whenever the parent component re-renders. " +
              "Instead, use a data or computed property based on the prop's " +
              "value. Prop being mutated: \"" + key + "\"",
              vm
            );
          }
        });
      }
      // static props are already proxied on the component's prototype
      // during Vue.extend(). We only need to proxy props defined at
      // instantiation here.
      if (!(key in vm)) {
        proxy(vm, "_props", key);
      }
    };

    for (var key in propsOptions) loop( key );
    toggleObserving(true);
  }
~~~
此方法主要是在初始化的时候 将propsData，props进行响应式处理

##### 使用 
~~~js
 new Vue（{
   propsData: {
     msg: '123
   }
 }
~~~

#### computed

##### 源码

~~~js
  function initComputed (vm, computed) {
    // 创建一个 watcher 对象
    var watchers = vm._computedWatchers = Object.create(null);
    // 判断当前页面渲染类型 是否是服务端渲染
    var isSSR = isServerRendering();

    for (var key in computed) {  // 遍历 computed 对象 获取属性的返回值
      var userDef = computed[key];
      var getter = typeof userDef === 'function' ? userDef : userDef.get;
      if (getter == null) {
        warn(
          ("Getter is missing for computed property \"" + key + "\"."),
          vm
        );
      }
      // 如果 当前页面不是服务端渲染，调用 watcher 方法监听 computed 数值变化
      if (!isSSR) { 
        watchers[key] = new Watcher(
          vm,
          getter || noop,
          noop,
          computedWatcherOptions
        );
      }

      if (!(key in vm)) { // 关键的一步，判断 computed 定义的变量在props及data中是否有值
        defineComputed(vm, key, userDef);  // 给 computed 的属性添加 get 方法
      } else {
        if (key in vm.$data) {
          warn(("The computed property \"" + key + "\" is already defined in data."), vm);
        } else if (vm.$options.props && key in vm.$options.props) {
          warn(("The computed property \"" + key + "\" is already defined as a prop."), vm);
        }
      }
    }
  }
~~~

defineComputed 函数  主要作用是设置 映射到 Vue 实例上的 computed 属性的 get 和 set 方法

~~~js
  function defineComputed (
    target,
    key,
    userDef
  ) {
    // 同样，首先判断一下是否是服务端渲染
    var shouldCache = !isServerRendering();
    if (typeof userDef === 'function') {
      sharedPropertyDefinition.get = shouldCache
        ? createComputedGetter(key)
        : createGetterInvoker(userDef);
      sharedPropertyDefinition.set = noop;
    } else {
      sharedPropertyDefinition.get = userDef.get
        ? shouldCache && userDef.cache !== false
          ? createComputedGetter(key)
          : createGetterInvoker(userDef.get)
        : noop;
      sharedPropertyDefinition.set = userDef.set || noop;
    }
    if (sharedPropertyDefinition.set === noop) {
      sharedPropertyDefinition.set = function () {
        warn(
          ("Computed property \"" + key + "\" was assigned to but it has no setter."),
          this
        );
      };
    }
    Object.defineProperty(target, key, sharedPropertyDefinition);
  }

  function createComputedGetter (key) {
    return function computedGetter () {
      var watcher = this._computedWatchers && this._computedWatchers[key];
      if (watcher) {
        if (watcher.dirty) {
          watcher.evaluate();
        }
        if (Dep.target) {
          watcher.depend();
        }
        return watcher.value
      }
    }
  }

  function createGetterInvoker(fn) {
    return function computedGetter () {
      return fn.call(this, this)
    }
  }
~~~

##### 使用

~~~js
export default {
  computed: {
    parameter1() {
      return 1
    },
    parameter2: {
      get() {
        return 2
      },
      set() {
        this.parameter1 = 4
      }
    }
  }
}
~~~

#### methods

##### 源码

~~~js
  function initMethods (vm, methods) {
    var props = vm.$options.props;
    for (var key in methods) {
      {
        if (typeof methods[key] !== 'function') {
          warn(
            "Method \"" + key + "\" has type \"" + (typeof methods[key]) + "\" in the component definition. " +
            "Did you reference the function correctly?",
            vm
          );
        }
        if (props && hasOwn(props, key)) {
          warn(
            ("Method \"" + key + "\" has already been defined as a prop."),
            vm
          );
        }
        if ((key in vm) && isReserved(key)) {
          warn(
            "Method \"" + key + "\" conflicts with an existing Vue instance method. " +
            "Avoid defining component methods that start with _ or $."
          );
        }
      }
      vm[key] = typeof methods[key] !== 'function' ? noop : bind(methods[key], vm); // 调用 函数的bind 方法，绑定 methods 方法的 this 到 Vue 实例上
    }
  }
~~~

##### 使用
  不推介使用箭头函数来命名 methods 函数 此时 函数的 this  指向了 父级作用域上下文 
~~~js
  export default {
    methods: {
      fn1() {
        // todo...
      },
      fn2() {
        // todo...
      }
    }
  }
~~~

#### watch

Vue 中 watch 主要用于监听 data，props，computed 对象中的属性发生变化，一旦发生变化就会触发对应的函数，更新对应数据及页面结构

##### 源码


~~~js
  function initWatch (vm, watch) {
    for (var key in watch) {
      var handler = watch[key];
      if (Array.isArray(handler)) {
        for (var i = 0; i < handler.length; i++) {
          createWatcher(vm, key, handler[i]);
        }
      } else {
        createWatcher(vm, key, handler);
      }
    }
  }

  function createWatcher (
    vm,
    expOrFn,
    handler,
    options
  ) {
    if (isPlainObject(handler)) {
      options = handler;
      handler = handler.handler;
    }
    if (typeof handler === 'string') {
      handler = vm[handler];
    }
    return vm.$watch(expOrFn, handler, options)
  }
~~~

在 initWatch 的时候， 首先针对传入的 watch对象进行遍历
watch 的属性如果是数组，数组内的函数会异议调用，其他情况会直接创建 watch
  * vm    Vue 实例
  * watch  vue 组件上的 watch 对象

在 createWatcher 函数里面，因为传入的handler 可能是对象，所以做了兼容处理，之后要调用了 Vue 实例上的 $watch 方法来实现属性的监听, $watch 方法 我们会在接下进行讲解，现在先有个印象
  * vm    Vue 实例
  * expOrFn  要进行数据监控的变量名
  * handler   回调函数，数据发生改变后执行此函数，吧改变后的值传递回来，也可以是对象，但是对象中必须要包含 handler 属性且是一个函数或者一个键，可以通过它在 vm 上找到对应函数
  * options   配置参数 针对对象进行特殊处理，防止无法监听到对象值的变化

##### 使用

在看了源码中的 initWatch 函数和 createWatcher 函数之后，根据对 watch 内部参数的处理我们可以猜到在使用 watch 的时候我们可以传递 数组、对象、函数、字符串

回调函数不推介使用 箭头函数，因为箭头函数的上下文已经绑定了，不会指向 Vue 实例

~~~js
  export default {
    watch: {
      // Vue 在监控到 a 发生变化之后 会执行 methods 方法 即 vm['methods']
      a: 'methods',
      // Vue 在监控到 b 发生变化之后 会执行此回调函数
      b: function() {},
      // 针对对象属性监听，在 createWatcher 函数中 会对对象进行处理，取出回调函数 及 options 配置
      // c 发生变化之后 会调用 对象中 handler 函数
      c: {
        handler: 'methods',
        deep: true
      }
      // d 放生变化之后，数组中的每一个函数都会被执行，数组内部 watch 方法的执行和以上三种类似
      d: ['methods', function(){}, {
        handler: function() {}
      }],
      // 此种方法针对对象的某一个值进行监听，在 Vue 中会对 `key:'e-f' 进行处理，精准查找到  e 对象下的 f 属性
      'e.f': function() {}
    }
  }
~~~

