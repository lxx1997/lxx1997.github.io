---
title: vue3 组合式Api setup
cover: /assets/cover/20200225A1295.jpg
date: 2022-08-02 15:03:31
updated: 2022-08-02 15:03:31
categories:
    - Vue3
tags:
    - Vue3
    - JavaScript
---

## 什么是组合式API

`组合式API` 主要是为了把相同的逻辑关注点收集在一起，使得逻辑处理更加清晰和方便。

针对 `vue2` 的组件选项来说，（`data`, `computed`, `methods`, `watch`）等组件存在，导致我们在修改同一个逻辑关注点的之后需要不停地跳转相关的代码块，代码碎片化，使得我们理解和维护复杂组件变得困难。

在 `vue3`组件中，这个位置称为 `setup`

这个是 `Vue3` 新增的一个选项 `setup` 选项会在组件被创建之前执行，一旦 `props` 解析完成，`setup` 就会被作为 `组合式Api` 的入口，也就是说 `setup` 执行的时机要比 `vue2` 的 `beforeCreate` 要早，此外 `setup` 中应避免使用 `this` 且因为调用发生在 `data`，`computed`，`methods` 之前，所以无法在 `setup` 中获取

既然 setup 中无法获取到 data，computed 中的内容，那么我们怎么创建和监控变量变化，且组件内能获取到呢？

`setup` 接收 `props` 和 `context`
  * props 是父元素传递过来的 props
  * context 是当前组件实例上下文

`setup` 函数 return 出一个对象，这个对象可以被组件直接获取到，相当于 `data` 和 `methods` 的集团体

怎么保证 setup 返回的变量是响应式的呢？ `vue3` 提供了一些 hooks，可以让我们创建响应式的变量

## hooks

#### setup 内部的钩子函数
  * onBeforeMount // 页面挂载钩子函数
  * onMounted
  * onBeforeUpdate  // 页面更新钩子函数
  * onUpdated
  * onBeforeUnmount  // 页面销毁钩子函数
  * onUnmounted
  * onErrorCaptured  // 页面错误事件钩子函数
  * onRenderTracked
  * onRenderTriggered // 跟踪虚拟 DOM 重新渲染时调用
  * onActivated  //  keep-alive 缓存的组件激活时调用
  * onDeactivated  // keep-alive 缓存的组件失活时调用

  这些钩子函数的触发时机和在组件内部触发时机一致

#### 带 ref 的响应式变量

在 Vue3 中，我们可以通过 ref hooks 创建一个响应式变量，ref 接收参数并将其包裹在一个带有 value property 的对象中返回，然后可以使用该 property 访问或更改响应式变量的值

之所以把值封装在对象中，主要是因为字符串和数字这些基本类型时通过值传递的，通过对象封装后，可以在整个对象安全的传递，不用担心失去响应式

~~~html
  <div>{{ title }}</div>
~~~

~~~js
  setup(props, context) {
    const title = ref("setup component")

    const changeTitle = function(val) {
      title.value = val
    }

    setTimeout(() => {
      title.value = "setup component changed"
    }, 3000)
    return {
      title,
      changeTitle
    }
  }
~~~

在上述实例中，我们可以发现，在3s 过后，页面上显示的内容发生变化，而且setup return 出来的属性和方法在组件的其他选项中都可以通过 this 来访问到

#### watch 响应式处理

如果我们想要在 setup 选项中监听属性的变化，可以通过 watch hooks 方法监听属性变化

watch 接受三个参数，监听对象，回调函数，配置选项

配置选项同组件中的 watch 选项，同样包含 deep 和 immediate 属性，而且还额外接受一个 flush 选项

flush 选项有三个值
* pre 默认值，指定回调在渲染前被调用
* post 将回调推迟到渲染之后，这时候可以获取页面 dom 元素
* sync 回调同步调用，不过会比较消耗性能

~~~js
watch(obj, (newValue, oldValue) => {}, {deep?: true, immediate?: true, flush?: "pre" | "post" | "sync"})
~~~

下面这个例子，当 setTimeout 方法执行完成后，由于改变了 title 的值， 触发了 watch 函数，我们打开 console 就可以发现打印了title 改变之前的值和 修改之后的值

~~~js
  setup(props, context) {
    const title = ref("setup component")

    setTimeout(() => {
      title.value = "setup component changed"
    }, 3000)

    watch(title, (n, o) => {
      console.log(n, o)
    })
    return {
      title
    }
  }
~~~

如果我们想要监控多个数据源的变化，可以在watch 的时候 watch 监听对象传入一个数组，同理，当数组内的任意一个元素发生变化时，都会触发watch 函数，而且 watch 回调函数中传入的值也是以数组的形式存在的

~~~js
  const firstName = ref('')
  const lastName = ref('')

  watch([firstName, lastName], (newValues, prevValues) => {
    console.log(newValues, prevValues)
  })

  firstName.value = 'John' // logs: ["John", ""] ["", ""]
  lastName.value = 'Smith' // logs: ["John", "Smith"] ["John", ""]
~~~

如果在监控多个数据源变化时，针对多个数据源修改时是同步修改，并不涉及到 setTimeout 等异步操作时，watch 会把这些更改合并成一次操作，会将所有修改的值一起返回给回调函数

watch hooks 还可以通过回调函数的第三个参数来清除副作用，这个参数会在 watch hooks 被停止或者销毁时，或者副作用重新执行时触发


~~~js
  setup(props, context) {
    const title = ref("setup component")

    setTimeout(() => {
      title.value = "setup component changed"
    }, 3000)

    watch(title, (n, o, onInvalidate) => {
      console.log(n, o)
      onInvalidate(() => {
        // 处理副作用方法
      })
    })
    return {
      title
    }
  }
~~~

类似的方式还有一个 **`watchEffect`** 方法

#### watchEffect

在使用 watchEffect 的时候，会自动执行传入的函数，并且响应式的追踪依赖，并且在依赖发生变更操作时，重新运行传入的函数