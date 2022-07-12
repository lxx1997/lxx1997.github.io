---
title: 重新学习vue2 - 发现隐藏其中的细节 - part1
cover: /assets/cover/20200225A1295.jpg
date: 2022-07-07 15:56:07
updated: 2022-07-07 15:56:07
categories:
tags:
  - vue
  - JavaScript
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

