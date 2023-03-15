---
title: Vue 组件之间通讯的各种情况
date: 2021-01-07 21:11:23
updated: 2021-01-07 21:11:23
categories:
    - Vue
tags:
    - Vue
    - component
cover: /assets/blogCover/MIKU花(4)_78753717_p1.png
---

我们都知道 Vue 的两大核心是**组件化**和**数据驱动**，在 Vue 中，组件之间的值传递是一种十分常见的事情，那么你到底知道多少种组件的值传递的方法呢，接下来由我来带领大家了解一下

#### Vue 组件之间的关系

Vue 的组件根据其在页面上的位置，我认为大致可以分为以下几种:

##### 父子组件

  什么是父子组件呢？ 假如现在页面中有一个根组件`ParentComponent`,现在我们需要在这个根组件中加入其他内容，例如一张图片，一段具有事件和样式的文字等，我们可以假设这个加入内容的组件名称为`ChildrenComponent`, 这个新加入的组件`ChildrenComponent` 相对与 `ParentComponent`就是子组件, `ParentComponent` 就是 `ChildrenComponent` 的父组件，如下所示

  ~~~html
    <parent-component>
      <children-component></children-component>
    </parent-component>
  ~~~

##### 兄弟组件

  什么是兄弟组件呢？以上面的父子组件为例，假如现在加入的不是一个组件，而是加入多个组件，加入的这些组件之间的关系就是兄弟组件的关系

  ~~~html
    <parent-component>
      <children-component></children-component>
      <children-component></children-component>
      <children-component></children-component>
    </parent-component>
  ~~~


##### 非父子，兄弟关系的组件

  这种组件的关系是怎么形成的呢，可能就是位于不同父组件下的子组件之间的关系

  ~~~html
    <parent-component>
      <children-component></children-component>
    </parent-component>
    <other-component></other-component>
  ~~~

  比如这种，`children-component` 和 `other-component` 之间的关系都是即非父子，兄弟关系组件

当然以上说法都不是特别组件，因为 Vue 是一个单页面组件，都位于同一个根组件下面，所以 Vue 中的组件之间都或多或少都是有一些关系

#### Vue 组件之间的通讯

上面介绍完了组件，我们现在介绍一下不同组件之间应该如何通讯

##### 父子组件 

  1. Vue 组件上有个特殊的属性 `Props` 可以取到通过 `v-bind`指令或者直接通过 属性 传值 传递过来参数，通常用于**父子组件传值** 

  ~~~html
    <parent-component>
      <children-component :type="type" name="name"></children-component>
    </parent-component>
  ~~~
  此时子组件可以通过 `props` 来获取父组件传递过来的参数

  ~~~js
    // children-component
    export default {
      // 第一种 (不推介，因为没有类型检测，不利于开发)
      props: ['type', 'name'],
      // 第二种 (推介，可以检查通过 props 传递过来值的类型，利于排错和开发)
      props: {
        type: {
          type: Array,  // 如果需要兼容多重类型检查可以使用数组 [Array, Object, String]
          default: () => {
            return []
          }
        },
        name: {
          type: String,
          default: ''
        }
      }
    }
  ~~~

  2. 子组件向父组件传值可以采用 `$emit()` 来发送事件，父组件采用 `v-on` 来监听事件发生

  ~~~js
    // 子组件
    export default {
      mounted() {
        this.$emit('change')
      }
    }
  ~~~
  ~~~html
    <parent-component>
      <!-- v-on: 也可以简化成 @ -->
      <children-component v-on:change="handleChange"></children-component>
    </parent-component>
  ~~~
  当然我们也可以采用 `v-model` 来传递参数，但是此时子组件必须要用 `props` 接收 一个名叫 `value` 的值，当事件触发时，把新的值通过自定义的 `input` 事件抛出

  因为 `v-model` 等价 `v-bind:value` 和 `v-on:input`

  3. `$parent` 和 `$children` 也可以实现父子组件之间传值

  > 但是 Vue 并不推介我们使用这种方法来进行父子组件传值通讯，只是作为访问组件的应急方法，更推介采用 props 和events(`$emit`,`$on`)

  4. 父子组件之间也可以通过 `$refs` 方法来进行通讯

  在子组件上添加属性 `ref` 值为 `refValue`, 父组件可以通过 `this.$refs[refValue]` 或者 `this.$refs.refValue` 来访问和调用子组件上面的方法和值

  **注意：** 使用 `$ref` 获取子组件必须是子组件已经在页面中加载成功了，即在 除`beforeCreate`, `created`, `destoryed` 生命周期函数以外的其他声明周期调用，如果组件是手动控制显示和隐藏，即使用 `v-if`，此时可以采用 `this.$nextTick(() => {this.$refs[refValue]})` 方法来访问子组件的方法

##### 兄弟组件之间的传值

  1. 通过共有的父组件来进行传值

  子组件通过 `$emit` 方法调用父组件的方法，然后通过父组件来调用其他的子组件来实现兄弟组件之间之间传值

  2. 通过 `$parent` 方法 

  同父子组件传值，可以使用，但是不推介

##### 非父子，兄弟关系的组件

  1. Vuex  Vue 状态管理工具

  可以使用 Vue 的状态管理工具来进行传值

  ~~~js
    // store.js
    /**
      * state: 存储状态管理对象及数据
      * mutations: 同步修改 state 的属性的值，同时只有 mutations 能够修改 state 的值 使用时通过 commit 来调用
      * actions: 异步修改 state 的属性的值，通过调用 mutations 的方法来修改 通过 dispatch 方法调用
      */ 
    export default {
      state: {
        type：1
      },
      mutations: {
        setType(state, type) {
          state.type = type
        },
      },
      actions: {
        setType({commit}, type) {
          commit('setType', type)
        }        
      }
    }
    // a 组件
    export default {
      mounted() {
        this.$store.dispatch('setType', 1)
      }
    }
    // b 组件
    export default {
      mounted() {
        this.$store.state.type
      }
    }
  ~~~

  关于 Vuex 的更多使用方法请百度查找官方使用文档

  2. Vue bus  也叫**中央事件总线**

  定义一个全局的 Vue，通过挂载到 window 对象或者 Vue 实例上面，此时可以通过 Vue bus 的 `$emit` 和 `$on` 方法来进行事件传递

  ~~~js
    // 第一种
    var bus = new Vue()
    // 发送事件
    bus.$emit('patch')
    // 接收事件
    bus.$on('patch)
    // 第二种 
    Vue.$bus = new Vue()
    // 发送事件
    Vue.$bus.$emit('patch')
    // 接收事件
    Vue.$bus.$on('patch)
  ~~~

#### 进阶方法

以上都是一些比较简单的组件之间传值的方法，相信在座的各位基本上都用到过，接下来介绍一些比较高端的方法，这些方法我们可能没有用过，也可能没有听说过，接下来让我来带领大家去了解他们，使用他们

##### $attrs 和 $listeners

  此方法适用于多层父子组件结构进行通讯，因为层级过多，此时使用 `$emit` 和 `$on` 方法来进行传值，你需要在需要通讯的两个祖孙组件之间的每个组件都要写上重复的 `$emit` 和 `$on`, 增加事件追踪难度，同时难以阅读

  此时可以采用 `$attrs` 和 `$listeners`来进行传值

  这种方法所采用的办法就是将祖父组件的 传给 父组件的 属性和监听事件传递给孙组件

  **默认情况下父作用域的不被认作 props 的 attribute 绑定 (attribute bindings) 将会“回退”且作为普通的 HTML attribute 应用在子组件的根元素上**

  ~~~html
  <!-- 函数我就不写了，只是做一个简略的展示 -->
    <!-- grandfather 组件 -->
    <grand-father>
      <a-parent :a="a = 4444" :b="b = 5555" @getData="handleGetData" @passData="handlePassdata"></a-parent>
    </grand-father>

    <!-- parent 组件 -->
    <a-parent>
      <b-children v-bind="$attrs" v-on="$listeners"></b-children>
    </a-parent>
    <script>
      ...
      // 默认情况下父作用域的不被认作 props 的 attribute 绑定 (attribute bindings) 将会“回退”且作为普通的 HTML attribute 应用在子组件的根元素上
      props:[] // 注意如果在此处使用了props接收了参数， 则通过 v-bind 传递给子组件的 $attrs 中就会缺失对应参数
      mounted() {
        console.log(this.$attrs)  // {a: 4444, b: 55555}
        // 如果此时props 接收了 参数 a 那么 console 的值为 { b: 55555 }
        console.log(this.$listeners) // { getData: f(), passData: f()}
      }
      ...
    </script>

    <!-- children 组件 -->
    <input v-model="$attrs.a" @input="passData($attrs.a)"  />
    <script>
      ...
      
      mounted() {
        console.log(this.$attrs)  // {a: 4444, b: 55555}
        // 如果此时 props 接收了 参数 a 那么 console 的值为 { b: 55555 }
        // a 的值 也可以通过 $emit 方法传递给祖组件
        console.log(this.$listeners) // { getData: f(), passData: f()}
      }
      methods: {
        passData(val) {
          // 此处发送的事件名称需要与祖组件监听方法一致 即 @passData
          this.$emit('passData', val)
        }
      }
      ...
    </script>
  ~~~

##### provide 和 inject

  父组件通过 `provide` 提供变量，子组件通过 `inject` 注入变量，不管子组件多深，只要调用了 `inject` 就可以注入 `provide` 中的数据，而不是局限于只能从当前父组件的 `prop` 属性来获取数据，只要在父组件的生命周期内，子组件都可以调用

  ~~~html
    <!-- grandfather 组件 -->
    <grand-father>
      <a-parent></a-parent>
    </grand-father>
    <script>
      ...
      provide: {
        test: 'test'
      }
      ...
    </script>

    <!-- parent 组件 -->
    <a-parent>
      <b-children></b-children>
    </a-parent>

    <!-- children 组件 -->
    <input v-model="$attrs.a" @input="passData($attrs.a)"  />
    <script>
      ...
      inject:['test']
      ...
    </script>
  ~~~

##### boradcast 和 dispatch

  这种方法我不太了解，贴上代码，大家自己体会 (＾－＾)
  
  vue1.0中提供了这种方式，但vue2.0中没有，但很多开源软件都自己封装了这种方式，比如min ui、element ui和iview等。

  比如如下代码，一般都作为一个mixins去使用, broadcast是向特定的父组件，触发事件，dispatch是向特定的子组件触发事件，本质上这种方式还是on和emit的封装，但在一些基础组件中却很实用。
  ~~~js
    function broadcast(componentName, eventName, params) {
      this.$children.forEach(child => {
        var name = child.$options.componentName;

        if (name === componentName) {
          child.$emit.apply(child, [eventName].concat(params));
        } else {
          broadcast.apply(child, [componentName, eventName].concat(params));
        }
      });
    }
    export default {
      methods: {
        dispatch(componentName, eventName, params) {
          var parent = this.$parent;
          var name = parent.$options.componentName;
          while (parent && (!name || name !== componentName)) {
            parent = parent.$parent;

            if (parent) {
              name = parent.$options.componentName;
            }
          }
          if (parent) {
            parent.$emit.apply(parent, [eventName].concat(params));
          }
        },
        broadcast(componentName, eventName, params) {
          broadcast.call(this, componentName, eventName, params);
        }
      }
    };

  ~~~

