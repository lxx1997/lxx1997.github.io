---
title: 重新学习vue2 - 发现隐藏其中的细节 - part1
cover: /assets/blogCover/Day18 I’m Not Human_100789898.png
date: 2022-07-07 15:56:07
updated: 2022-07-07 15:56:07
comments: true
categories:
    - Vue
tags:
    - Vue
    - JavaScript
    - relearn
---
1. computed 属性默认是只有 getter 属性的，也就是说我们只能获取到computed 属性的值，但是无法修改它，但是我们可以手动的设置 setter 属性，这样就可以手动赋值了
    ~~~js
    export default {
      computed() {
        fullName: {
          set: function (val) {
            let name = val.split(" ")
            this.firstName = name[0]
            this.secondName = name[1]
          },
          get: function () {
            return this.firstName + " " + this.secondName
          }
        }
      }
    }
    ~~~

2. v-for 和 v-if 为什么不推介一起使用

    这个是因为 v-for 和 v-if 的优先级问题，vue 会先进行 v-for 循环渲染元素，最后在进行 v-if 控制是否显示元素，会造成无谓的资源浪费

    可以采用 v-show 代替 v-if 或者使用计算属性来代替 v-if， 只渲染我们想渲染的元素

3. key attribute 用来表示这个元素是完全独立的，和其他元素不同，在日常操作中可以用来强制刷新元素内容，只需要修改元素的key，就会重新去渲染元素

    我之前用过 v-if 和 $nextTick 来强制重新渲染元素内容，很明显使用上述方法是一种很方便的操作

4. v-for 可以使用 `in` 或者 `of` 来作为分隔符

5. v-for 遍历对象时 `v-for="(value, name, index) in obj"` 三个值 分别为 值，键，和 索引

6. vue 中可以使用 template 标签，该标签类似 react 中的`<></>`和`React.Fragment`,在实际渲染中并不会被渲染出来

7. 如果我们想要在点击事件中访问原始的 dom 时间，可以将特殊的变量 `$event` 传到方法中

8. 事件修饰符
    * `.stop`  阻止事件冒泡
    * `.prevent`  阻止默认事件
    * `.capture`  事件捕获的时候触发，如果点击的是子元素，会先于子元素事件触发
    * `.self`  只有当 `event.target` 是元素自身时触发，点击子元素时不会触发
    * `.once`  只会触发一次
    * `.passive`  和 `.prevent` 相反，不会阻止默认事件触发

    **使用修饰符的时候，顺序很重要，代码会以同样的顺序产生，例如`v-on:click.prevent.self` 会阻止所有点击，而 `v-on:click.slef.prevent` 只会阻止元素对自身的点击**

8. 按键修饰符
    * .enter
    * .tab
    * .delete (捕获“删除”和“退格”键)
    * .esc
    * .space
    * .up
    * .down
    * .left
    * .right
    * 支持按键码
    * 可以通过全局的 `config.keyCodes` 自定义按键修饰符别名
    ~~~js
      Vue.config.keyCodes.f1 = 112
    ~~~

9. 系统修饰键 (_修饰键在和其他事件一起使用的时候，需要同时触发才行，否则并不会单独触发修饰键_)
    * .ctrl
    * .alt
    * .shift
    * .meta

10. `.exact` 精确修饰符，允许我们控制精确的系统修饰符组合触发的事件

11. `<input v-model="toggle" type="checkbox" true-value="yes" false-value="no" />` 此时 `toggle` 会取 对应的 `true-value` 和 `false-value` 的值

12. `v-model.lazy` 默认情况下，`v-model` 会在input 事件触发后将输入框的值与数据同步，添加`lazy` 修饰符后，从而转为在 `change` 事件之后触发

13. `v-model.number` 会自动将用户输入的值转为数值类型

14. `v-model.trim` 会自动去除用户输入内容两端的空格

15. 自定义组件中的 `data` 必须是一个函数，是为了保证每次创建组件的时候都能拿到一个独立的数据，否则，重复创建组件时，组件内的数据由于有同一个引用地址，会互相干扰

16. `v-model` 在自定义组件中使用相当于 `v-bind:value` 和 `v-on:change` 的组合

17. 可以通过组件的 model 属性改变 v-model 的默认属性和事件绑定
~~~js
export default {
  model: {
    prop: 'checked',
    event: 'change'
  },
  mounted() {
    console.log(this.checked)
    this.$emit("change", "val")
  },
}
~~~

18. `<component v-bind:is="CustomComponent"></component>` 通过 `v-bind:is` 可以自定义组件，组件会跟随 `CustomComponent` 的值变化而变化

19. 传入一个对象的所有 property, 组件内部可以直接通过 示例中 `post` 拿到对应的属性
    ~~~js
      <component v-bind="post"></component>
    ~~~

20. props 验证

    ~~~js
      export default {
        props: {
          propA: {
            type: String,
            default: "",
            require: false,
            validator() {

            }
          }
        }
      }
    ~~~
    * `type` props 参数类型 `String`, `Number`, `Boolean`, `Array`, `Object`, `Date`, `Function`, `Symbol`, 或者自定义的构造函数
    * `default` 默认值，引用类型数据 需要使用函数并且通过return 返回默认引用类型
    * `require` 是否必须传 默认为 `false`
    * `validator` 自定义效验规则

21. 禁用 `Attribute` 继承，可以设置 `inheritAttrs` false 来之根元素继承 `Attribute`

    具体表现为 如果设置为 `false` 子组件不会渲染 `attribute`， `true` 会在子组件上渲染 `attribute`

22. **父级模板里的所有内容都是在父级作用域中编译的；子模板里的所有内容都是在子作用域中编译的。**

23. `slot` 缩写 `v-slot:` -> `#`
    * **后备内容** 如果我们没有向插槽内提供内容，此时将会显示后备内容 `<slot>默认内容</slot>`
    * **具名插槽** `<slot name="header"></slot>` `<slot-component v-slot:header></slot-component>`
    * **作用域插槽**
        插槽内部
        ~~~vue
        <template>
          <div>
            <slot v-bind:user="user">
            </slot>
          </div>
        </template>
        ~~~
        外部使用
        ~~~vue
        <template>
          <div>
            <slot v-slot:default="slotProps">
              {{ slotProps.user.firstName }}
            </slot>
          </div>
        </template>
        ~~~

        如果有多个插槽
        ~~~vue
        <template>
          <div>
            <slot v-slot:default="slotProps">
              {{ slotProps.user.firstName }}
            </slot>
            <slot v-slot:other="otherSlotProps">
              {{ slotProps.user.firstName }}
            </slot>
          </div>
        </template>
        ~~~

24. 子组件可以通过 `$root` 来访问和修改根组件的实例及方法

25. `provide`, `inject`

    **`provide`** 选项允许和指定提供给后代组件的数据和方法

    ~~~js
      provide: function() {
        return {
          a: function() {},
          b: 0
        }
      }
    ~~~

    **`inject`** 允许子元素接受 `provide` 提供的 `provide`

    ~~~js
      inject: ['a', 'b']
    ~~~

    但是出于设计考虑， 这些数据不是响应式的，而且会对重构及代码复用有很大的影响

26. `X-Template` `x-template` 需要定义在 Vue 所属的 DOM 元素外。
    ~~~html
      <script type="text/x-template" id="hello-world-template">
        <p>Hello hello hello</p>
      </script>
    ~~~
    ~~~js
      Vue.component('hello-world', {
        template: '#hello-world-template'
      })
    ~~~

27. `transition` 过渡动画
    * `v-enter` 定义进入过渡的开始状态。在元素被插入之前生效，在元素被插入之后的下一帧移除
    * `v-enter-active` 定义进入过渡生效时的状态。在整个进入过渡的阶段中应用，在元素被插入之前生效，在过渡/动画完成之后移除。这个类可以被用来定义进入过渡的过程时间，延迟和曲线函数。
    * `v-enter-to` 定义进入过渡的结束状态。在元素被插入之后下一帧生效 (与此同时 v-enter 被移除)，在过渡/动画完成之后移除。
    * `v-leave` 定义离开过渡的开始状态。在离开过渡被触发时立刻生效，下一帧被移除。
    * `v-leave-active` 定义离开过渡生效时的状态。在整个离开过渡的阶段中应用，在离开过渡被触发时立刻生效，在过渡/动画完成之后移除。这个类可以被用来定义离开过渡的过程时间，延迟和曲线函数。
    * `v-leave-to` 定义离开过渡的结束状态。在离开过渡被触发之后下一帧生效 (与此同时 v-leave 被删除)，在过渡/动画完成之后移除。

    ![vue-transition](/assets/blogImg/vue-transition.png "vue-transition")

    **自定义动画类名**

    * `enter-class`
    * `enter-active-class`
    * `enter-to-class`
    * `leave-class`
    * `leave-active-class`
    * `leave-to-class`

    **显性的过渡持续时间**

    `<transition :duration="1000" />`
    
    `<transition :duration="{enter: 500, leave: 800}" />`

    **JavaScript 钩子**

    ~~~html
      <transition
        v-on:before-enter="beforeEnter"
        v-on:enter="enter"
        v-on:after-enter="afterEnter"
        v-on:enter-cancelled="enterCancelled"

        v-on:before-leave="beforeLeave"
        v-on:leave="leave"
        v-on:after-leave="afterLeave"
        v-on:leave-cancelled="leaveCancelled"
      >
      </transition>
    ~~~
    ~~~js
      // ...
      methods: {
        // --------
        // 进入中
        // --------

        beforeEnter: function (el) {
          // ...
        },
        // 当与 CSS 结合使用时
        // 回调函数 done 是可选的
        enter: function (el, done) {
          // ...
          done()
        },
        afterEnter: function (el) {
          // ...
        },
        enterCancelled: function (el) {
          // ...
        },

        // --------
        // 离开时
        // --------

        beforeLeave: function (el) {
          // ...
        },
        // 当与 CSS 结合使用时
        // 回调函数 done 是可选的
        leave: function (el, done) {
          // ...
          done()
        },
        afterLeave: function (el) {
          // ...
        },
        // leaveCancelled 只用于 v-show 中
        leaveCancelled: function (el) {
          // ...
        }
      }
    ~~~


28. `mixins` 混入选项合并
    * 数组对象会在内部进行合并，例如 `data`,属性名发生冲突时，以组件内属性优先
    * 钩子函数合并成数组，都会被调用，混入对象的钩子函数优先于组件内钩子函数调用
    * 值为对象时,将会被合并成为一个对象，且组件对象的键值对优先级更高

    **Vue.config.optionMergeStrategies** 可以通过次宣讲自定义逻辑合并逻辑

29. 自定义指令
    ~~~js
      directives: {
        focus: {
          inserted: function(el) {
            el.focus()
          }
        }
      }
    ~~~
    ~~~html
      <input v-focus />
    ~~~

    **钩子函数**
    * bind 绑定时调用，只调用一次
    * inserted 被绑定元素插入父节点时调用
    * update  所在组件更新时调用，**可能发生在子组件更新之前**
    * componentUpdated 所在组件和子组件全部更新后调用
    * unbind 指令与元素解绑时调用

    **钩子函数参数**
    * el 绑定的元素，可以用来操作 DOM
    * binding
        * name 指令名
        * value 指令绑定的值
        * oldValue  制定绑定的前一个值
        * expression 字符串形式的指令表达式 `="1 + 1"`
        * arg 传给指令的参数 `:foo`
        * modifiers 指令修饰符 `.foo`
    * vnode 当前虚拟节点
    * oldVnode 上一个虚拟节点

30. `functional` 函数式组件
    函数式组件没有响应式数据，也没有实例（没有 this 上下文）
    相反会有一个 `context` 参数 包含如下字段
    * props
    * children
    * slots
    * scopedSlots
    * data
    * parent
    * listeners
    * injections
