---
title: 跟着 Vue源码学习 Vue api 系列 (一) - 全局配置
date: 2021-01-09 22:17:53
categories: Vue源码
tags:
    - Vue
    - 源码
---

此篇文章用来记录 Vue 中 Api 在 Vue源码中的具体实现方法，以便更好的理解 Vue 的各种 Api 的使用方法

#### 全局配置

Vue 的全局配置参数是存放在 `config` 里面的，我们可以通过修改 config 中的 properties

~~~js
  Config = {
    // user
    optionMergeStrategies: { [key: string]: Function };
    silent: boolean;
    productionTip: boolean;
    performance: boolean;
    devtools: boolean;
    errorHandler: ?(err: Error, vm: Component, info: string) => void;
    warnHandler: ?(msg: string, vm: Component, trace: string) => void;
    ignoredElements: Array<string | RegExp>;
    keyCodes: { [key: string]: number | Array<number> };
    // platform
    isReservedTag: (x?: string) => boolean;
    isReservedAttr: (x?: string) => boolean;
    parsePlatformTagName: (x: string) => string;
    isUnknownElement: (x?: string) => boolean;
    getTagNamespace: (x?: string) => string | void;
    mustUseProp: (tag: string, type: ?string, name: string) => boolean;
    // private
    async: boolean;
    // legacy
    _lifecycleHooks: Array<string>;
  }
~~~

##### 1. silent Boolean

  silent 配置 主要用于判断是否输出 Vue 所有的日志和警告
  * 默认为 false 不取消日志和警告输出
  * 设置为 true  取消日志和警告输出
  ~~~js
    var hasConsole = typeof console !== 'undefined';
    // hasConsole 用于判断 window对象中 是否包含有 console 这个属性
    if (hasConsole && (!config.silent)) {
      console.error(("[Vue warn]: " + msg + trace));
    }
  ~~~

##### 2. optionMergeStrategies Object

  自定义选项合并策略，覆盖已有值

  主要用于 mixin 和 Vue.extend() 方法时对子组件和父组件 有相同属性时的合并策略

  **以下的 parentVal，parent 等父参数 只有 Vue.extend 或者 extends 传入对应类型数据时才有数据**

  Vue源码 自带的属性
  `el`，`propsData`，`provide` 子组件和父组件如果有相同的方法，以子组件为主
  * el
  * propsData
    ~~~js
      var defaultStrat = function (parentVal, childVal) {
        return childVal === undefined
          ? parentVal
          : childVal
      };
      strats.el = strats.propsData = function (parent, child, vm, key) {
        if (!vm) {
          warn(
            "option \"" + key + "\" can only be used during instance " +
            'creation with the `new` keyword.'
          );
        }
        // 在这里进行了判断，如果 child 存在 就返回 child 否则返回 parent
        // 表明在合并的过程中 el 和 propsData 以子的为准
        return defaultStrat(parent, child)
      };
    ~~~
  * provide  `strats.provide = mergeDataOrFn;`
  * data
    ~~~js
      function (parentVal, childVal, vm ) {
        // childVal 是 组件的 data 函数
        if (!vm) {
          // 判断 vue 的 data 对象是一个函数 保证各个组件之间的数据互不影响
          if (childVal && typeof childVal !== 'function') {
            warn(
              'The "data" option should be a function ' +
              'that returns a per-instance value in component ' +
              'definitions.',
              vm
            );
            // 如果子的值不是函数 返回父的值
            return parentVal
          }
          return mergeDataOrFn(parentVal, childVal)
        }
        return mergeDataOrFn(parentVal, childVal, vm)
      };
    ~~~
    **margeDataOrFn 方法**
    ~~~js
      // 合并数据
      function mergeDataOrFn (parentVal, childVal, vm) {
        if (!vm) {
          // in a Vue.extend merge, both should be functions
          if (!childVal) {
            return parentVal
          }
          if (!parentVal) {
            return childVal
          }
          // when parentVal & childVal are both present,
          // we need to return a function that returns the
          // merged result of both functions... no need to
          // check if parentVal is a function here because
          // it has to be a function to pass previous merges.
          return function mergedDataFn () {
            return mergeData(
              typeof childVal === 'function' ? childVal.call(this, this) : childVal,
              typeof parentVal === 'function' ? parentVal.call(this, this) : parentVal
            )
          }
        } else {
          return function mergedInstanceDataFn () {
            // instance merge
            var instanceData = typeof childVal === 'function'
              ? childVal.call(vm, vm)
              : childVal;
            var defaultData = typeof parentVal === 'function'
              ? parentVal.call(vm, vm)
              : parentVal;
            if (instanceData) {
              return mergeData(instanceData, defaultData)
            } else {
              return defaultData
            }
          }
        }
      }
    ~~~
    **margeData 方法**
    [set方法详解](/lxx1997.github.io/2020/12/15/vue-源码常用方法/#set)
    ~~~js
      function mergeData (to, from) {
        if (!from) { return to }

        var key, toVal, fromVal;
        // 判断是否有 Symbol 数据类型，避免合并数据的时候遗漏 Symbol 类型属性
        // Reflect.ownKeys(obj) 可以遍历出 Symbol 类型属性
        // Object.keys,Object.values 无法遍历出 Symbol 类型属性
        var keys = hasSymbol
          ? Reflect.ownKeys(from)
          : Object.keys(from);

        for (var i = 0; i < keys.length; i++) {
          key = keys[i];
          // in case the object is already observed...
          if (key === '__ob__') { continue }
          toVal = to[key];
          fromVal = from[key];
          if (!hasOwn(to, key)) {
            set(to, key, fromVal);
          } else if (
            toVal !== fromVal &&
            isPlainObject(toVal) &&
            isPlainObject(fromVal)
          ) {
            mergeData(toVal, fromVal);
          }
        }
        return to
      }
    ~~~
  * watch
    ~~~js
      function (parentVal, childVal, vm, key) {
        // work around Firefox's Object.prototype.watch...
        if (parentVal === nativeWatch) { parentVal = undefined; }
        if (childVal === nativeWatch) { childVal = undefined; }
        /* istanbul ignore if */
        if (!childVal) { return Object.create(parentVal || null) }
        {
          assertObjectType(key, childVal, vm);
        }
        if (!parentVal) { return childVal }
        var ret = {};
        extend(ret, parentVal);
        for (var key$1 in childVal) {
          var parent = ret[key$1];
          var child = childVal[key$1];
          if (parent && !Array.isArray(parent)) {
            parent = [parent];
          }
          // parent 存在 则和 child 合并，否则判断 child 是否是数组，返回 数组
          ret[key$1] = parent
            ? parent.concat(child)
            : Array.isArray(child) ? child : [child];
        }
        return ret
      };
    ~~~
  `hooks`，`watch` 会把子组件和父组件相同的钩子函数合并到一个数组上，父组件的钩子函数先执行
  * 声明周期函数(在此不一一列举了)
    ~~~js
      var LIFECYCLE_HOOKS = [
        'beforeCreate',
        'created',
        'beforeMount',
        'mounted',
        'beforeUpdate',
        'updated',
        'beforeDestroy',
        'destroyed',
        'activated',
        'deactivated',
        'errorCaptured',
        'serverPrefetch'
      ];
      LIFECYCLE_HOOKS.forEach(function (hook) {
        strats[hook] = mergeHook;
      });
      // 使用方法
      function mergeHook (parentVal, childVal) {
        /**
          * 下面这个三目表达式可以拆分成下列样式
          * var test1 = Array.isArray(childVal) ? childVal : [childVal]
          * var test2 = parentVal ? parentVal.concat(childVal) : test1
          * var test3 = childVal ? test2 : parentVal
          * 如果 childVal 存在，就执行 test2 语句 不存在 则取 parentVal
          * test2 语句中 如果 parentVal 存在， 则与 childVal 连接成一个新数组 否则执行 test1 语句
          * test1 语句中 如果 childVal 是数组 就取 childVal 否则就转成数组
        */
        var res = childVal
          ? parentVal
            ? parentVal.concat(childVal)
            : Array.isArray(childVal)
              ? childVal
              : [childVal]
          : parentVal;
        // 对 获得的 res 进行去重
        return res
          ? dedupeHooks(res)
          : res
      }

      function dedupeHooks (hooks) {
        var res = [];
        for (var i = 0; i < hooks.length; i++) {
          // 如果 res 数组中不存在 hooks[i],就插入 hooks[i] 否则略过
          if (res.indexOf(hooks[i]) === -1) {
            res.push(hooks[i]);
          }
        }
        return res
      }
    ~~~
  * component
  * directive
  * filter
    ~~~js
      function mergeAssets (parentVal, childVal, vm, key) {
        // 以 parentVal 为原型 创建对象 res.prototype === parentVal
        var res = Object.create(parentVal || null);
        if (childVal) {
          //判断 childVal 的类型
          assertObjectType(key, childVal, vm);
          // 通过 extend  方法将 childVal 的属性复制到 res 上 并覆盖相同属性的数据
          return extend(res, childVal)
        } else {
          return res
        }
      }
    ~~~
  `components`，`directives`，`filters` 使用了原型继承，返回合并后的新对象
  * props
  * methods
  * inject
  * computed
    ~~~js
      function (parentVal, childVal, vm, key) {
        if (childVal && "development" !== 'production') {
          assertObjectType(key, childVal, vm);
        }
        if (!parentVal) { return childVal }
        var ret = Object.create(null);
        // 合并 parentVal 和 childVal
        extend(ret, parentVal);
        if (childVal) { extend(ret, childVal); }
        return ret
      };
    ~~~
    `props`，`methods`，`computed`，`inject` 采用对象合并的方法，先合并父组件，在合并子组件，如果父组件和子组件有相同的属性，子组件会覆盖父组件的属性

    简单的使用示例
    ~~~js
      Vue.config.optionMergeStrategies._myOptions = (parntVal, childVal, vm) => {
          console.log(parntVal, childVal, vm)
          return parntVal ? childVal ? childVal + parntVal : 0 : childVal
        }
      const B = {
        _myOptions: 3
      }
      const C = {
        _myOptions: 3
      }
      Vue.component('test', {
        mixins: [B,C],
        data() {
          return {
            test: 1
          }
        },
        _myOptions: 2,
        mounted() {
          console.log(this.$options._myOptions) // 8
        },
        template: `<div> children </div>`
      })
      const app = new Vue({
        el: '#app',
        template: `
        <div>
          test
          <test></test>
        </div>
        `
      })
    ~~~
#### devtools

~~~js
  // detect devtools
  var devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;
~~~

#### errorHandler

  默认是 `undefined` 指定组件的渲染和观察期间未捕获错误的处理函数。这个处理函数被调用时，可获取错误信息和 Vue 实例。

~~~js
  Vue.config.errorHandler = (err, vm, info) => {
    console.error(' 错误拦截:', err, vm, info)
  }
~~~

  源码位置
~~~js
  function globalHandleError (err, vm, info) {
    if (config.errorHandler) {
      try {
        return config.errorHandler.call(null, err, vm, info)
      } catch (e) {
        // if the user intentionally throws the original error in the handler,
        // do not log it twice
        if (e !== err) {
          logError(e, null, 'config.errorHandler');
        }
      }
    }
    logError(err, vm, info);
  }
~~~

#### warnHandler

  默认值是 `undefined`，只会在开发环境下生效，生产环境下会被忽略

~~~js
  Vue.config.warnHandler = (msg, vm, trace) => {
    console.error(' 错误拦截:', msg, vm, trace)
  }
~~~

源码
~~~js
  warn = function (msg, vm) {
    var trace = vm ? generateComponentTrace(vm) : '';
    if (config.warnHandler) {
      config.warnHandler.call(null, msg, vm, trace);
    } else if (hasConsole && (!config.silent)) {
      console.error(("[Vue warn]: " + msg + trace));
    }
  };
~~~

#### ignoredElements  Array<string | RegExp>

  默认是一个空字符串，是一个由 字符串或者正则表达式组成的数组

  作用是为了屏蔽 Vue 的组件验证的时候，自定义组件([Web Components API](http://www.ruanyifeng.com/blog/2019/08/web_components.html))报错提示功能，匹配到数组里面的组件名称的时候，会过滤掉提示

~~~js
  Vue.config.ignoredElements = [
    'my-custom-web-component',
    'another-web-component',
    // 用一个 `RegExp` 忽略所有“ion-”开头的元素
    // 仅在 2.5+ 支持
    /^ion-/
  ]
~~~

  源码位置

~~~js
  function isUnknownElement$$1 (vnode, inVPre) {
    return (
      !inVPre &&
      !vnode.ns &&
      !(
        config.ignoredElements.length &&
        config.ignoredElements.some(function (ignore) {
          return isRegExp(ignore)
            ? ignore.test(vnode.tag)
            : ignore === vnode.tag
        })
      ) &&
      config.isUnknownElement(vnode.tag)
    )
  }
~~~

#### keyCodes   {[key: string]: number | Array<number>}

  给 `v-on` 自定义键位别名
~~~js
  Vue.config.keyCodes = {
    v: 86,
    f1: 112,
    // camelCase 不可用
    mediaPlayPause: 179,
    // 取而代之的是 kebab-case 且用双引号括起来
    "media-play-pause": 179,
    up: [38, 87]
  }
~~~

~~~html
  <input type="text" @keyup.media-play-pause="method">
  <input type="text" @keyup.179="method">
  <!-- 以上两种方法等效 -->
~~~

#### performance  boolean

  默认为 false 设置为 true 以在浏览器开发工具的性能/时间线面板中启用对组件初始化、编译、渲染和打补丁的性能追踪

#### productionTip boolean

  默认为 true， 设置为 false 阻止 vue 在启动时生成生产提示信息


