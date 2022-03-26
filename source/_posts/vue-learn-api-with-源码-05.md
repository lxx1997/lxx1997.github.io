---
title: 跟着 Vue源码学习 Vue api 系列 (五) - 选项 / 组合 & 其他
date: 2021-01-28 14:03:16
categories: Vue源码
tags:
    - Vue
    - 源码
cover: '/assets/cover/20200225A1295.jpg'
---

#### parent

主要用来存储 Vue 组件的父组件

#### mixins

混入，主要用来开发 Vue组件中的可复用的功能

##### 源码

~~~js
  if (child.mixins) {
    for (var i = 0, l = child.mixins.length; i < l; i++) {
      parent = mergeOptions(parent, child.mixins[i], vm);
    }
  }
~~~

Vue 在合并选项的时候 判断力 mixins 属性是否存在，如果存在，通过递归调用的方法合并到当前组件上

##### 使用

~~~js
  var mixin = {
    create() {
      console.log('create')
    },
    methods: {
      getInfo() {
        console.log('getInfo')
      }
    }
  }
  export default {
    mixins: [mixin]
  }
~~~

#### extends

##### 源码
具体理解可以参考 [Vue.extend](/lxx1997.github.io/2021/01/20/vue-learn-api-with-源码-02/#Vue-extend)
~~~js
  if (child.extends) {
    parent = mergeOptions(parent, child.extends, vm);
  }
~~~

##### 使用

~~~js
  var extend = {
    create() {
      console.log('create')
    },
    methods: {
      getInfo() {
        console.log('getInfo')
      }
    }
  }
  export default {
    extends: extend
  }
~~~

#### provide/inject
  * `provide`   `Object | () => Object`
  * `inject`    `Array<string> | [key:string]: string | Symbol | Object`

父组件通过 provide 提供依赖，子孙组件通过 inject 将依赖注入到当前组件

~~~js
  // 在 mergeOptionStract 配置中， provide 通过mergeData方法从父组件中绑定到子组件
  function initProvide (vm) {
    var provide = vm.$options.provide;
    if (provide) {
      vm._provided = typeof provide === 'function'
        ? provide.call(vm)
        : provide;
    }
  }
  function initInjections (vm) {
    var result = resolveInject(vm.$options.inject, vm);
    if (result) {
      toggleObserving(false);
      Object.keys(result).forEach(function (key) {
        /* istanbul ignore else */
        {
          defineReactive$$1(vm, key, result[key], function () {
            warn(
              "Avoid mutating an injected value directly since the changes will be " +
              "overwritten whenever the provided component re-renders. " +
              "injection being mutated: \"" + key + "\"",
              vm
            );
          });
        }
      });
      toggleObserving(true);
    }
  }
  // 处理实例上的 inject 方法 返回处理之后的对象
  function resolveInject (inject, vm) {
    if (inject) {
      // inject is :any because flow is not smart enough to figure out cached
      var result = Object.create(null);
      var keys = hasSymbol
        ? Reflect.ownKeys(inject)
        : Object.keys(inject);

      for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        // #6574 in case the inject object is observed...
        if (key === '__ob__') { continue }
        var provideKey = inject[key].from;
        var source = vm;
        while (source) {
          if (source._provided && hasOwn(source._provided, provideKey)) {
            result[key] = source._provided[provideKey];
            break
          }
          source = source.$parent;
        }
        if (!source) {
          if ('default' in inject[key]) {
            var provideDefault = inject[key].default;
            result[key] = typeof provideDefault === 'function'
              ? provideDefault.call(vm)
              : provideDefault;
          } else {
            warn(("Injection \"" + key + "\" not found"), vm);
          }
        }
      }
      return result
    }
  }
~~~

##### 使用

~~~js
  //  父组件
  export default {
    data() {
      return {
        bar: 342
      }
    }
    provide: {
      foo: 'bar',
      bar: this.bar
    }
  }
  // 子组件
  export default {
    inject:['foo','bar']
  }
~~~

##### 高级使用技巧

利用 Symbol 传递

~~~js
  const s = Symbol()
  const Provider = {
    provide() {
      return {
        [s]: 'foo'
      }
    }
  }
  const Child = {
    inject:{
      s
    }
  }
~~~

inject 的值作为 props 和 data 的初始值

~~~js
  const child = {
    inject: ['foo'],
    props: {
      prop: {
        default: this.foo
      }
    },
    data() {
      bar: this.foo
    }
  }
~~~

#### name

  name 属性允许组件模板递归调用自身

#### delimiters

  改变 纯文本插入分隔符 默认为['{{','}}']

##### 源码
~~~js
  var defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;
  var regexEscapeRE = /[-.*+?^${}()|[\]\/\\]/g;

  var buildRegex = cached(function (delimiters) {
    var open = delimiters[0].replace(regexEscapeRE, '\\$&');
    var close = delimiters[1].replace(regexEscapeRE, '\\$&');
    return new RegExp(open + '((?:.|\\n)+?)' + close, 'g')
  });
~~~
##### 使用

~~~js
  new Vue({
    delimiters: ['${','}']  // Vue 进行字符串切割替换的时候将会仿照 es6 的模板字符串
  })
~~~

#### functional

函数元组件  无状态(data)，无上下文(this)，没有响应式数据，相当于只是一个渲染组件，渲染之后就不会发生变化

~~~js
  function createFunctionalComponent (Ctor,propsData,data,contextVm,children) {
    var options = Ctor.options;
    var props = {};
    var propOptions = options.props;
    if (isDef(propOptions)) {
      for (var key in propOptions) {
        props[key] = validateProp(key, propOptions, propsData || emptyObject);
      }
    } else {
      if (isDef(data.attrs)) { mergeProps(props, data.attrs); }
      if (isDef(data.props)) { mergeProps(props, data.props); }
    }

    var renderContext = new FunctionalRenderContext(
      data,
      props,
      children,
      contextVm,
      Ctor
    );

    var vnode = options.render.call(null, renderContext._c, renderContext);

    if (vnode instanceof VNode) {
      return cloneAndMarkFunctionalResult(vnode, data, renderContext.parent, options, renderContext)
    } else if (Array.isArray(vnode)) {
      var vnodes = normalizeChildren(vnode) || [];
      var res = new Array(vnodes.length);
      for (var i =
       0; i < vnodes.length; i++) {
        res[i] = cloneAndMarkFunctionalResult(vnodes[i], data, renderContext.parent, options, renderContext);
      }
      return res
    }
  }
~~~

##### 使用
  `context` 参数 字段详解
  * `props` 提供所有 props 对象
  * `children` VNode 子节点的数组
  * `slots` 一个函数，返回了包含所有插槽的对象
  * `scopedSlots` 一个暴露传入的作用域插槽的对象，也已函数形式暴露普通插槽
  * `data` 传给组件的整个数据对象，作为 createElement 函数的第二个参数传入组件
  * `parent` 对父组件的引用
  * `listeners` 一个包含了所有父组件为当前组件注册的时间监听器对象，这是data.on的一个别名
  * `injection` 注入的 `property`

~~~html
  <div id="app">
    <div>this is test for directive</div>
    <function-component :list="list" other="other">
        this is a slot {{list.name}}
        <div slot="default">
          this is slot default
        </div>
    </function-component>
  </div>
~~~

~~~js
  <script>
    Vue.component('function-component', {
      functional: true,
      props: {
        list: {
          type: Object,
          default: () => {
            return {}
          }
        }
      },
      render: function (createElement, context) {
        const header = context.scopedSlots.default()
        return createElement(
          'div', [
            createElement('div', [header[0]]),
            createElement('div', [header[1]])
          ] 
        )
      }
    })
    var app = new Vue({
      el: "#app",
      data: () => {
        return {
          test3: 4,
          testChild: 5,
          hide: true,
          list: {
            name: 'listName',
            value: 'listValue'
          }
        }
      },
      computed: {
        test() {
          return {
            test1: 4
          }
        }
      },
    })
  </script>
~~~

#### model

  * prop(可选) String
  * event(可选) String

  允许一个自定义组件在使用 `v-model` 时定制定制 prop 和 event，默认情况下，一个组件上的 `v-model` 会把 value 用作 prop 且把 input 用作 event，一些复杂的输入框可以使用 model 选项回避这些情况产生的冲突

##### 源码

~~~js
  function transformModel (options, data) {
    var prop = (options.model && options.model.prop) || 'value';
    var event = (options.model && options.model.event) || 'input'
    ;(data.attrs || (data.attrs = {}))[prop] = data.model.value;
    var on = data.on || (data.on = {});
    var existing = on[event];
    var callback = data.model.callback;
    if (isDef(existing)) {
      if (
        Array.isArray(existing)
          ? existing.indexOf(callback) === -1
          : existing !== callback
      ) {
        on[event] = [callback].concat(existing);
      }
    } else {
      on[event] = callback;
    }
  }
~~~
在设置值的时候通过一个 `||`(或) 来判断 model 是否赋值，否则取默认设置的 value 及 input

##### 使用

~~~html
  <input v-model="inputValue">
  <!-- input 组件内部 -->
  <script>
    export default {
      model: {
        prop: 'text'
        event: 'change'
      },
      props: {
        text: String
      },
      methods: {
        handleChange(value) {
          this.$emit('change', value)
        }
      }
    }
  </script>
~~~

#### inheritAttrs

  默认情况下父作用域的不被认作 props 的 attribute 绑定 (attribute bindings) 将会“回退”且作为普通的 HTML attribute 应用在子组件的根元素上。当撰写包裹一个目标元素或另一个组件的组件时，这可能不会总是符合预期行为。通过设置 inheritAttrs 到 false，这些默认行为将会被去掉。而通过 (同样是 2.4 新增的) 实例 property $attrs 可以让这些 attribute 生效，且可以通过 v-bind 显性的绑定到非根元素上

##### 源码

~~~js
  function updateAttrs (oldVnode, vnode) {
    var opts = vnode.componentOptions;
    if (isDef(opts) && opts.Ctor.options.inheritAttrs === false) {
      return
    }
    if (isUndef(oldVnode.data.attrs) && isUndef(vnode.data.attrs)) {
      return
    }
    var key, cur, old;
    var elm = vnode.elm;
    var oldAttrs = oldVnode.data.attrs || {};
    var attrs = vnode.data.attrs || {};
    // clone observed objects, as the user probably wants to mutate it
    if (isDef(attrs.__ob__)) {
      attrs = vnode.data.attrs = extend({}, attrs);
    }

    for (key in attrs) {
      cur = attrs[key];
      old = oldAttrs[key];
      if (old !== cur) {
        setAttr(elm, key, cur);
      }
    }
    // #4391: in IE9, setting type can reset value for input[type=radio]
    // #6666: IE/Edge forces progress value down to 1 before setting a max
    /* istanbul ignore if */
    if ((isIE || isEdge) && attrs.value !== oldAttrs.value) {
      setAttr(elm, 'value', attrs.value);
    }
    for (key in oldAttrs) {
      if (isUndef(attrs[key])) {
        if (isXlink(key)) {
          elm.removeAttributeNS(xlinkNS, getXlinkProp(key));
        } else if (!isEnumeratedAttr(key)) {
          elm.removeAttribute(key);
        }
      }
    }
  }
~~~

在更新的时候 判断一下 inheritAttrs 的值，如果为 false 直接返回

##### 使用

~~~js
  // 子组件
  export default {
    inheritAttrs: false
  }
~~~

#### comments

  主要作用是 是否保留渲染模板中的 HTML 注释