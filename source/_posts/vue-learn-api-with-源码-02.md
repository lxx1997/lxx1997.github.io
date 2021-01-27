---
title: 跟着 Vue 源码学习 Vue api 系列 (二) - 全局 api
date: 2021-01-20 17:18:54
categories: Vue 源码
tags:
    - Vue
    - 源码
---


#### Vue.extend({})

##### 源码
~~~js
  function initExtend (Vue) {
    /**
      * Each instance constructor, including Vue, has a unique
      * cid. This enables us to create wrapped "child
      * constructors" for prototypal inheritance and cache them.
      */
    Vue.cid = 0;
    var cid = 1;

    /**
      * Class inheritance
      */
    Vue.extend = function (extendOptions) {
      extendOptions = extendOptions || {};
      var Super = this; // 使用 super 继承Vue 实例
      var SuperId = Super.cid;  // 存储 Vue 实例的 cid
      var cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {});
      if (cachedCtors[SuperId]) {
        return cachedCtors[SuperId]  // 优化，如果多次使用同一个 Vue.extend 返回的是同一个 Vue.extend ,使用缓存，减少不必要的内存消耗
      }

      var name = extendOptions.name || Super.options.name;
      if (name) {
        validateComponentName(name);  // 检验 Vue extend 的name 属性是否合法
      } 

      var Sub = function VueComponent (options) {
        this._init(options);
      };
      /** 原型继承，将 vue 的原型 集成到子类 Sub 构造函数上，同时添加唯一标识符 */
      Sub.prototype = Object.create(Super.prototype); 
      Sub.prototype.constructor = Sub;
      Sub.cid = cid++;
      /** 调用 mergeOptions 方法 将 extend的所有属性 合并到 Vue的 options 属性上 */
      Sub.options = mergeOptions(
        Super.options,
        extendOptions
      );
      Sub['super'] = Super;

      // For props and computed properties, we define the proxy getters on
      // the Vue instances at extension time, on the extended prototype. This
      // avoids Object.defineProperty calls for each instance created.
      // 如果包含 props 属性，重新初始化 props
      if (Sub.options.props) {
        initProps$1(Sub);
      }
      // 如果包含 computed 属性，重新初始化 computed
      if (Sub.options.computed) {
        initComputed$1(Sub);
      }

      // allow further extension/mixin/plugin usage
      Sub.extend = Super.extend;
      Sub.mixin = Super.mixin;
      Sub.use = Super.use;

      // create asset registers, so extended classes
      // can have their private assets too.
      ASSET_TYPES.forEach(function (type) {
        Sub[type] = Super[type];
      });
      // enable recursive self-lookup  启动递归查找
      if (name) {
        Sub.options.components[name] = Sub;
      }

      // keep a reference to the super options at extension time.
      // later at instantiation we can check if Super's options have
      // been updated.
      // 在分机处保留对超级选项的引用时间。稍后在实例化时，我们可以检查Super的选项是否已更新。
      Sub.superOptions = Super.options;
      Sub.extendOptions = extendOptions;
      Sub.sealedOptions = extend({}, Sub.options);

      // cache constructor
      cachedCtors[SuperId] = Sub;  // 在此处赋值，缓存 当前 Vue extend
      return Sub
    };
  }
~~~

  通过以上源码，我们可以看出 Vue 在 extend 的时候主要做了以下几个事情
  * 首先进行兼容处理，保证传入的对象不为空
  * 创建一个变量 Super 用来存储 Vue 实例，并且存储 Vue 的 cid
  * 判断当前 extend 是否已经被使用过，如果已经使用过，直接返回，以减少内存消耗
  * 创建一个新的构造函数 Sub ，原型指向 Super 的原型，并创建一个唯一的 cid
  * 接下来通过 mergeOptions 方法，将传入的 参数 与 Vue 实例的 options(data,lifeCycle,methods,props,methods 等) 合并，遵循 Vue 内部 config 中定义的optionMergeStrategies 配置
  * 初始化 props 和 computed 属性
  * 重新对 extend，mixin，use，filter，directive，component 属性进行赋值
  * 最后 通过 _Ctor 缓存 当前创建的  Vue.extend 实例
  * 返回 当前 Sub 构造函数，该构造函数 具有 Vue 所有属性及方法

##### 使用

  ~~~js
    var Profile = Vue.extend({
      data() {
        return {
          name: 'lxx',
          age: 24,
        }
      },
      computed: {
        time() {
          return new Date.getTime()
        }
      },
      mounted() {
        this.getName()
      }
      methods: {
        getName() {
          console.log(this.name)
        }
      }
    })

    new Profile().$mount('#app')
  ~~~

  当我们 使用 Vue.extend 为 Vue 扩展一些信息的时候，会根据 Vue 的 optionMergeStrategies 配置的默认属性合并规则进行属性 合并，这样我们在任意组件都可以使用到这些属性和方法

#### Vue.nextTick([callback: Function,context: Object])

  Vue 更新页面并不是同步更新的，而是采用异步更新的。

  浏览器有一个更新循环 tick，这个 tick 时间间隔大概十几毫秒，Vue 在到浏览器执行下一个 tick 的时间段内搜集所有需要更新的 Dom 数据，在 下一个 tick 循环到来的时候同步更新到页面上。这时候就会造成一个问题，如果我们想在改变数据之后立刻获取页面的数据的话，这时候还没有触发浏览器的 tick 更新，页面没有变化，我们是获取不到更新后的 DOM 数据

  使用 Vue.nextTick 可以使我们在页面更新完成之后获取 DOM

##### 源码

~~~js
  function nextTick (cb, ctx) {
    var _resolve;
    callbacks.push(function () {
      if (cb) {
        try {
          cb.call(ctx);
        } catch (e) {
          handleError(e, ctx, 'nextTick');
        }
      } else if (_resolve) {
        _resolve(ctx);
      }
    });
    if (!pending) {
      pending = true;
      timerFunc();
    }
    // $flow-disable-line
    if (!cb && typeof Promise !== 'undefined') {
      return new Promise(function (resolve) {
        _resolve = resolve;
      })
    }
  }
~~~
  在 timerFunc() 函数 中 通过判断 Promise MutationObserver 及 setImmediate函数是否存在 如在就使用对应函数，不存在就使用setTimeout方法

##### 使用

~~~js
  Vue.nextTick(() => {
    // 获取更新后的 Dom
  })
~~~

#### Vue.set(target: Object | Array, index: Number | string, value: any)

  用于修改一些 Vue 响应式无法监听到的对象属性变更，同时触发视图更新

##### 源码

~~~js
  function set (target, key, val) {
    if (isUndef(target) || isPrimitive(target)
    ) {
      warn(("Cannot set reactive property on undefined, null, or primitive value: " + ((target))));
    }
    if (Array.isArray(target) && isValidArrayIndex(key)) {
      target.length = Math.max(target.length, key);
      target.splice(key, 1, val);
      return val
    }
    if (key in target && !(key in Object.prototype)) {
      target[key] = val;
      return val
    }
    var ob = (target).__ob__;
    if (target._isVue || (ob && ob.vmCount)) {
      warn(
        'Avoid adding reactive properties to a Vue instance or its root $data ' +
        'at runtime - declare it upfront in the data option.'
      );
      return val
    }
    if (!ob) {
      target[key] = val;
      return val
    }
    defineReactive$$1(ob.value, key, val);
    ob.dep.notify();
    return val
  }
~~~

* 首先判断传过来的 target 是否存在，及数据类型是否是基本数据类型
* 判断 target 是否是数组，以及 key 值 是否可用，然后调用 Array 的 slice 方法替换数组数据
* 判断 key 是否属于 target
* 判断 传入 target 对象 是否是 Vue 实例
* 调用 defineReactive$$1 监听数据变化
* 调用 发布订阅模式 的 发布方法

##### 使用

~~~js
  Vue.set(target, key, value)
~~~

#### Vue.delete(target: Object | Array, index: Number | string)

  删除对象的 property。如果对象是响应式的，确保删除能触发更新视图。这个方法主要用于避开 Vue 不能检测到 property 被删除的限制，但是你应该很少会使用它。

##### 源码
~~~js
function del (target, key) {
    if (isUndef(target) || isPrimitive(target)
    ) {
      warn(("Cannot delete reactive property on undefined, null, or primitive value: " + ((target))));
    }
    if (Array.isArray(target) && isValidArrayIndex(key)) {
      target.splice(key, 1);
      return
    }
    var ob = (target).__ob__;
    if (target._isVue || (ob && ob.vmCount)) {
      warn(
        'Avoid deleting properties on a Vue instance or its root $data ' +
        '- just set it to null.'
      );
      return
    }
    if (!hasOwn(target, key)) {
      return
    }
    delete target[key];
    if (!ob) {
      return
    }
    ob.dep.notify();
  }
~~~

* 首先判断传过来的 target 是否存在，及数据类型是否是基本数据类型
* 判断 target 是否是数组，以及 key 值 是否可用，然后调用 Array 的 slice 方法替换数组数据
* 判断 传入 target 对象 是否是 Vue 实例
* 删除 `target[key]`
* 调用 发布订阅模式 的 发布方法

##### 使用

~~~js
  Vue.delete(target, key)
~~~

#### Vue.directive( id: string, [definition]: Function | Object )

  此方法主要是为了给 Vue 设置自定义指令 及获取 Vue 指令

##### 源码

首先 定义了一个 `platformDirectives` 存储 directive 指令的属性，然后通过 extend 方法，将 `platformDirectives` 上的属性 复制到 `Vue.options.directives` 上
~~~js
  var platformDirectives = {
    model: directive,
    show: show
  };

  extend(Vue.options.directives, platformDirectives)
~~~

directive 对象的属性

~~~js
  var directive = {
    inserted: function() {},
    componentUpdated: function(){}
  }

~~~
* install
~~~js
  inserted: function inserted (el, binding, vnode, oldVnode) {
    if (vnode.tag === 'select') {
      // #6903
      if (oldVnode.elm && !oldVnode.elm._vOptions) {
        mergeVNodeHook(vnode, 'postpatch', function () {
          directive.componentUpdated(el, binding, vnode);
        });
      } else {
        setSelected(el, binding, vnode.context);
      }
      el._vOptions = [].map.call(el.options, getValue);
    } else if (vnode.tag === 'textarea' || isTextInputType(el.type)) {
      el._vModifiers = binding.modifiers;
      if (!binding.modifiers.lazy) {
        el.addEventListener('compositionstart', onCompositionStart);
        el.addEventListener('compositionend', onCompositionEnd);
        // Safari < 10.2 & UIWebView doesn't fire compositionend when
        // switching focus before confirming composition choice
        // this also fixes the issue where some browsers e.g. iOS Chrome
        // fires "change" instead of "input" on autocomplete.
        el.addEventListener('change', onCompositionEnd);
        /* istanbul ignore if */
        if (isIE9) {
          el.vmodel = true;
        }
      }
    }
  },
~~~
我们可以看到在 inserted 函数中对 指令绑定的元素做了一个判断， 针对 select，textarea标签及 input 标签且属性是 是文本输入类型的元素做了特殊处理

**componentUpdated**

~~~js
  componentUpdated: function componentUpdated (el, binding, vnode) {
    if (vnode.tag === 'select') {
      setSelected(el, binding, vnode.context);
      // in case the options rendered by v-for have changed,
      // it's possible that the value is out-of-sync with the rendered options.
      // detect such cases and filter out values that no longer has a matching
      // option in the DOM.
      var prevOptions = el._vOptions;
      var curOptions = el._vOptions = [].map.call(el.options, getValue);
      if (curOptions.some(function (o, i) { return !looseEqual(o, prevOptions[i]); })) {
        // trigger change event if
        // no matching option found for at least one value
        var needReset = el.multiple
          ? binding.value.some(function (v) { return hasNoMatchingOption(v, curOptions); })
          : binding.value !== binding.oldValue && hasNoMatchingOption(binding.value, curOptions);
        if (needReset) {
          trigger(el, 'change');
        }
      }
    }
  }
~~~

在 componentUpdated 方法中 对select 标签的元素做了特殊处理，渲染其子元素 option 

**bind,update,unbind**

针对元素的 display 进行处理

##### 使用

insert 函数传入参数有四个 
  * el 当前指令挂载的元素节点
  * binding   `v-[name]:[arg].[modifies].[modifies]="[expression]"`
      name: 指令名
      value: 指令的绑定值  
      oldValue: 指令绑定的前一个值，value参数改变之前的值
      expression: 字符串形式的指令表达式
      arg: 传递指令的参数
      modifiers: 包含修饰符的对象 
      **首先 如果 express 没有话 不会获取到 value, 如果想要获取 value，就要包含有 expression, 则该 expression 必须在 data 或者 computed 上必须要在第一层上**
      **就算是 expression 用 ex1.ex2 或者 ex1[ex2],value 的值为 `data[ex1]` 或者 `computed[ex1]`**
      **当 expression 为一个可以计算的表达式的时候 例如 `1+1`, `ex1 + 1` 等，value 的结果为 expression 计算之后的结果**
  * vnode 虚拟node节点
  * oldVnode 上一个虚拟 DOM 节点

~~~html
<div id="app">
    <div>this is test for directive</div>
    <div v-test:test2.test1="test3">{{test3}}</div>
  </div>
  <script>
    Vue.directive('test', {
      bind: function(el, binding, vnode, oldValue) {
        console.log(el,binding,vnode,oldValue)
        /**
          el: <div>4</div>
          binding:  arg: "test2"
                    def: {bind: ƒ, componentUpdated: ƒ}
                    expression: "test3"
                    modifiers: {test1: true}
                    name: "test"
                    rawName: "v-test:test2.test1"
                    value: 4
          vnode  VNode{}
          oldValue  VNode{}
        */
      },
      // 使用 componentUpdated 可以监控元素节点数据变化 展示的 更新之后的数据
      componentUpdated:function(el, binding, vnode, oldValue) {
        console.log(el,binding,vnode,oldValue)
        /**
          el: <div>9</div>
          binding:  arg: "test2"
                    def: {bind: ƒ, componentUpdated: ƒ}
                    expression: "test3"
                    modifiers: {test1: true}
                    name: "test"
                    rawName: "v-test:test2.test1"
                    value: 9
          vnode  VNode{}
          oldValue  VNode{}  // 此处存放的是 value 未被更改为4的时候的节点
        */
      },
      // 在元素bind的时候 可能updated方法就已经执行，
      // 此时 bind时候 的el对象是更新之后的对象,即 testChild 为 8 test3 为 9
      // 但是 Vnode 及 oldVNode 还是元素未发生更改之前的元素节点
      updated:function(el, binding, vnode, oldValue) {
        console.log(el,binding,vnode,oldValue, 'updated')
      },
      // 指令解绑的时候触发  可以使用 v-if 控制元素隐藏和显示来触发 unbid
      unbind: function(el, binding, vnode, oldValue) {
        console.log(el,binding,vnode,oldValue, 'unbind')
      },
      // 页面一渲染就会触发
      insert: function(el, binding, vnode, oldValue) {
        console.log(el,binding,vnode,oldValue, 'insert')
      },
    })
    var app = new Vue({
      el: "#app",
      data: () => {
        return {
          test3: 4,
          testChild: 4
        }
      },
      mounted() {
        setTimeout(() => {
          this.test3 = 9,
          this.testChild = 8
        }, 1000)
      },
    })
  </script>
~~~

#### Vue.filter(id:string, definition: Function)

##### 源码
~~~js
  var ASSET_TYPES = [
    'component',
    'directive',
    'filter'
  ];
  ASSET_TYPES.forEach(function (type) {
      Vue[type] = function (
        id,
        definition
      ) {
        if (!definition) {
          return this.options[type + 's'][id]
        } else {
          /* istanbul ignore if */
          if (type === 'component') {
            validateComponentName(id);
          }
          if (type === 'component' && isPlainObject(definition)) {
            definition.name = definition.name || id;
            definition = this.options._base.extend(definition);
          }
          if (type === 'directive' && typeof definition === 'function') {
            definition = { bind: definition, update: definition };
          }
          this.options[type + 's'][id] = definition;
          return definition
        }
      };
    });
  }
~~~

以上代码 是  'component', 'directive', 'filter' 三个全局API 注册到 Vue 实例上的方法

如果是 component 则检查 组件名称是否是合格的组件名称 然后在判断 是否是 definition 参数是否是对象，如果是，则使用 Vue 实例的 extend 方法扩展全局的 extend 属性

如果是 directive 如果传入的 definition 是函数 则默认调用 bind 和 update 方法

##### 使用

~~~html
<div>{{ test | uppcase}}<div>
<script>
Vue.filter('uppcase', function(value) {
  return value && value.toUpperCase()
}
</script>
~~~

#### Vue.component(id: string, definition: Function | Object)

##### 源码

请查看 Vue.filter 的讲解

##### 使用
~~~js
  Vue.componet('my-component', {
    data() {return {}}
    methods: {}
    computed: {}
  })
~~~

definition 可以传递 Vue.extend({}),也可以直接传一个对象，Vue会自动调用 Vue.extend 方法

#### Vue.use(plugin)

##### 源码
~~~js
  function initUse (Vue) {
    Vue.use = function (plugin) {
      var installedPlugins = (this._installedPlugins || (this._installedPlugins = []));
      if (installedPlugins.indexOf(plugin) > -1) {  // 判断是否 安装过此插件
        return this
      }

      // additional parameters
      var args = toArray(arguments, 1);
      args.unshift(this);
      if (typeof plugin.install === 'function') {
        plugin.install.apply(plugin, args);   // 调用 plugin 的 install 函数
      } else if (typeof plugin === 'function') {
        plugin.apply(null, args); // 直接执行 plugin 函数
      }
      installedPlugins.push(plugin);
      return this
    };
  }
~~~


##### 使用

~~~js
// plugin必须是一个函数 或者包含 install 的对象 
Vue.use(plugin)
~~~

#### Vue.mixin(plugin)

##### 源码

~~~js
  function initMixin$1 (Vue) {
    Vue.mixin = function (mixin) {
      this.options = mergeOptions(this.options, mixin);
      return this
    };
  }
~~~

此方法 调用了 mergeOptions 方法将 传入的参数 与 Vue 的 options 属性合并

##### 使用

  这个方法会影响 所有创建的 Vue 组件，不推介使用，但是可以用于 optionMergeStrategies 自定义 选项
~~~js
  Vue.mixin({
    created: function () {
      var myOption = this.$options.myOption
      if (myOption) {
        console.log(myOption)
      }
    }
  })

  new Vue({
    myOption: 'hello!'
  })
  // => "hello!"
~~~

#### Vue.compile
将一个模板字符串编译成 render 函数

##### 源码
**没看懂，有时间再来研究(2021-01-24)**
~~~js
  function createCompileToFunctionFn (compile) {
    var cache = Object.create(null);
    return function compileToFunctions (
      template,
      options,
      vm
    ) {
      options = extend({}, options);
      var warn$$1 = options.warn || warn;
      delete options.warn;

      /* istanbul ignore if */
      {
        // detect possible CSP restriction
        try {
          new Function('return 1');
        } catch (e) {
          if (e.toString().match(/unsafe-eval|CSP/)) {
            warn$$1(
              'It seems you are using the standalone build of Vue.js in an ' +
              'environment with Content Security Policy that prohibits unsafe-eval. ' +
              'The template compiler cannot work in this environment. Consider ' +
              'relaxing the policy to allow unsafe-eval or pre-compiling your ' +
              'templates into render functions.'
            );
          }
        }
      }

      // check cache
      var key = options.delimiters
        ? String(options.delimiters) + template
        : template;
      if (cache[key]) {
        return cache[key]
      }

      // compile
      var compiled = compile(template, options);

      // check compilation errors/tips
      {
        if (compiled.errors && compiled.errors.length) {
          if (options.outputSourceRange) {
            compiled.errors.forEach(function (e) {
              warn$$1(
                "Error compiling template:\n\n" + (e.msg) + "\n\n" +
                generateCodeFrame(template, e.start, e.end),
                vm
              );
            });
          } else {
            warn$$1(
              "Error compiling template:\n\n" + template + "\n\n" +
              compiled.errors.map(function (e) { return ("- " + e); }).join('\n') + '\n',
              vm
            );
          }
        }
        if (compiled.tips && compiled.tips.length) {
          if (options.outputSourceRange) {
            compiled.tips.forEach(function (e) { return tip(e.msg, vm); });
          } else {
            compiled.tips.forEach(function (msg) { return tip(msg, vm); });
          }
        }
      }

      // turn code into functions
      var res = {};
      var fnGenErrors = [];
      res.render = createFunction(compiled.render, fnGenErrors);
      res.staticRenderFns = compiled.staticRenderFns.map(function (code) {
        return createFunction(code, fnGenErrors)
      });

      // check function generation errors.
      // this should only happen if there is a bug in the compiler itself.
      // mostly for codegen development use
      /* istanbul ignore if */
      {
        if ((!compiled.errors || !compiled.errors.length) && fnGenErrors.length) {
          warn$$1(
            "Failed to generate render function:\n\n" +
            fnGenErrors.map(function (ref) {
              var err = ref.err;
              var code = ref.code;

              return ((err.toString()) + " in\n\n" + code + "\n");
          }).join('\n'),
            vm
          );
        }
      }

      return (cache[key] = res)
    }
  }
~~~

##### 使用

~~~js
  var res = Vue.compile('<div><span>{{ msg }}</span></div>')

  new Vue({
    data: {
      msg: 'hello'
    },
    render: res.render,
    staticRenderFns: res.staticRenderFns
  })
~~~

#### Vue.observable(object)

让一个对象可响应。Vue 内部会用它来处理 data 函数返回的对象

##### 源码
~~~js
 function observe (value, asRootData) {
    if (!isObject(value) || value instanceof VNode) {
      return
    }
    var ob;
    if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
      ob = value.__ob__;
    } else if (
      shouldObserve &&
      !isServerRendering() &&
      (Array.isArray(value) || isPlainObject(value)) &&
      Object.isExtensible(value) &&
      !value._isVue
    ) {
      ob = new Observer(value);
    }
    if (asRootData && ob) {
      ob.vmCount++;
    }
    return ob
  }
~~~
调用了 通過 new Observer() 在 Observer 内部通过 walk 方法 调用 defineReactive$$1 进行对象响应式处理


##### 使用 

~~~js
  const state = Vue.observable({ count: 0 })
  const Demo = {
    render(h) {
      return h('button', {
        on: { click: () => { state.count++ }}
      }, `count is: ${state.count}`)
    }
  }
~~~

#### Vue.version

提供 Vue 的版本号

~~~js
  Vue.version = '2.6.12';
~~~
