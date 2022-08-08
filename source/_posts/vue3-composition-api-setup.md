---
title: vue3 组合式Api setup
cover: /assets/cover/20200225A1295.jpg
date: 2022-08-02 15:03:31
updated: 2022-08-08 15:03:31
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

## 参数

#### props

setup 接受两个参数，第一个参数是props，且是响应式的，传入新的props 时，会被一起更新 **因为是响应式的，所以无法直接使用解构赋值，会失去响应式**

~~~js
// 父组件
/**
 * 父组件向子组件传递一个 props title 属性，并且这个属性会在 3s 后发生变化
 */
export default {
  setup() {
    const title = ref("hhhhhh")
    setTimeout(() => {
      title.value = "this is new title"
    }, 3000);
    watch(title, (n, o) => {
      console.log(n, o)
    })
    return { title }
  }
}
// 子组件
/**
 * 子组件这里必须要在props 属性上添加需要接受的属性，否则setup 中的 props 无法接受到
 * 当props 属性发生变化时，使用 watch 监听可以再次被触发，但是页面上内容不会发生变化，这是因为我们直接取的 props 里面的属性值，不具备响应式
 */
export default {
  props: {
    title: {
      type: String,
      default: ""
    }
  },
  setup(props, context) {
    console.log(props.title)
    watch(props, (n, o) => {
      console.log(props.title)
    })
    let { title } = props
    return {
      title: props.title,
      computedTitle: title
    }
  }
}
~~~

如果我们想要对 props 进行解构操作，可以使用 `toRefs` 函数来完成此操作

下面代码我们会发现当 props 中的 title 属性发生变化后， 组件内 title 并不会跟随变化，而 computedTitle 则会跟随props 中的 title 属性发生变化

~~~js
export default {
  props: {
    title: {
      type: String,
      default: ""
    }
  },
  setup(props, context) {
    console.log(props.title)
    watch(props, (n, o) => {
      console.log(props.title)
    })
    let { title } = toRefs(props)
    return {
      title: props.title,
      computedTitle: title
    }
  }
}
~~~
如果 title 是可选的 prop，则传入的 props 中可能没有 title 。在这种情况下，toRefs 将不会为 title 创建一个 ref 。你需要使用 toRef 替代它

toRef 的作用相当于把 对象中的属性转化为 ref 类的属性，且与对象相关联，当对象中对应属性发生变化时, toRef 中的内容会同步发生改变

~~~js
  setup(props, context) {
    let name = toRef(props, "name") // name 会跟随 props 中的 name 属性变化而同步更新
    return {
      name: name 
    }
  }
~~~

#### context

context 是一个普通 JavaScript 对象，不是响应式的，因此可以使用 解构操作

暴露了其它可能在 setup 中有用的值：

* attrs 类似于 $attrs
* slots 类似于 $slots
* emit 类似于 $emit
* expose 公共property

slots 和 attrs 是有状态的对象，跟随组件本身的更新而更新，避免使用解构赋值，如果想要根据 attrs 和 solts 更改应用富足用，应该在 onBeforeUpdate 钩子中执行操作

#### return

setup return 出来的值可以在模板和组件中直接使用

如果父组件想要访问子组件 setup 中的 property，可以使用 expose 方法暴露出去

~~~js
export default {
  setup(props, { expose }){
    let count = ref(0)
    const changeCount = () => ++count.value
    expose({
      changeCount
    })
    return {
      count
    }
  }
}
~~~

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

  这些钩子函数接受一个回调函数，当钩子函数被调用时，将会被执行

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

~~~js
export default {
  setup(props, context) {
    const title = ref("setup component")

    setTimeout(() => {
      title.value = "setup component changed"
    }, 3000)

    watch(title, (n, o) => {
      console.log(n, o)
    })

    watchEffect(() => {
      console.log(title.value)
    })
    return {
      title
    }
  }
}
~~~

上述代码执行完成后，我们会发现在控制台会首先输出  `setup component`， 然后 3s 过程会同时输出 `setup component changed`，这个是因为 `watchEffect` 会立即执行，但是因为依赖没有变更，所以就是初始值，3s 后，依赖发生了变更，这时 `watch` 和 `watchEffect` 同时触发

watchEffect 在执行完成后，会有一个返回值，我们可以通过这个返回值来停止监听,但是需要注意的是，watchEffect 还是会立即执行，只是当依赖方式变化时，不会再次触发

~~~js
export default {
  setup(props, context) {
    const title = ref("setup component")

    setTimeout(() => {
      title.value = "setup component changed"
    }, 3000)

    const stop = watchEffect(() => {
      console.log(title.value)
    })
    stop()
    return {
      title
    }
  }
}
~~~

#### computed 计算属性

~~~js
setup(props, context) {
  const title = ref("setup component")

  setTimeout(() => {
    title.value = "setup component changed"
  }, 3000)

  let computedTitle = computed(() => title.value + "abcd")

  return {
    title,
    computedTitle
  }
}
~~~

访问 computed 值的时候和 访问响应式变量的值一样，都是通过 `.value` 来获取到

#### provide && inject

vue3 暴露出了两个方法 `provide` 和 `inject` 两个方法，这两个方法和 组件内的 provide和inject 方法等同

provide 传入两个参数，第一个参数是属性名，第二个参数是属性值
~~~js
setup(props, context) {
  provide("name", "lxx")
  provide("age", 26)
}
~~~

inject 传入两个参数，第一个参数是属性名，第二个参数是默认值
~~~js
setup(props, context) {
  inject("name", "lxx")
  inject("age")
}
~~~

但是通过上述创建的 provide 和 inject 之间不是响应式的，也就是说如果provide 的值改变并不会触发 inject 的值变化，
provide 可以使用 ref 和 reactive 方法创建响应式的 provide

~~~js
setup(props, context) {
  const count = ref(0)
  provide("name", "lxx")
  provide("age", count)
}
~~~

#### 模板引用(ref="")

~~~html
<template> 
  <div :ref="root">This is a root element</div>
</template>

<script>
  import { ref, onMounted } from 'vue'

  export default {
    setup() {
      const root = ref(null)

      onMounted(() => {
        // DOM 元素将在初始渲染后分配给 ref
        console.log(root.value) // <div>This is a root element</div>
      })

      return {
        root
      }
    }
  }
</script>
~~~

当页面加载完成后，会自动将 div 绑定给 root

如果需要使用 v-for 绑定多个标签，可以创建响应式数组或者响应式对象来实现