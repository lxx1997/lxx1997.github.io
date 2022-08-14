---
title: vue3 状态管理工具 - pinia
cover: /assets/cover/20200225A1295.jpg
date: 2022-08-11 15:19:53
updated: 2022-08-11 15:19:53
categories:
    - [Vue3]
tags:
    - Vue3
---

`Vue3` 出来都有一年多了，生态系统相对来说都慢慢变得完善起来了，像针对 `vue2` 的 `vue-router` 路由组件，`vuex` 状态管理工具都开始适应 `vue3` 了

这里就介绍 针对 `vue3` 的状态管理工具 `vuex5` 又叫 `pinia`

## 与 vuex4 和 vuex3 对比

* mutations 不再存在。他们经常被认为是 非常 冗长。他们最初带来了 devtools 集成，但这不再是问题。
* 无需创建自定义复杂包装器来支持 TypeScript，所有内容都是类型化的，并且 API 的设计方式尽可能利用 TS 类型推断。
* 不再需要注入、导入函数、调用函数、享受自动完成功能！
* 无需动态添加 Store，默认情况下它们都是动态的，您甚至都不会注意到。请注意，您仍然可以随时手动使用 Store 进行注册，但因为它是自动的，您无需担心。
* 不再有 modules 的嵌套结构。您仍然可以通过在另一个 Store 中导入和 使用 来隐式嵌套 Store，但 Pinia 通过设计提供平面结构，同时仍然支持 Store 之间的交叉组合方式。 您甚至可以拥有 Store 的循环依赖关系。
* 没有 命名空间模块。鉴于 Store 的扁平架构，“命名空间” Store 是其定义方式所固有的，您可以说所有 Store 都是命名空间的。

## 使用

#### 安装 `pinia`

~~~js
npm install pinia

yarn add pinia
~~~

#### 在 Vue 中注册

~~~js
import { createPinia } from "pinia"

createApp(App).use(createPinia()).mount('#app')
~~~

#### 创建一个store

`pinia` 提供了一个方法 `defineStore` 来定义一个 Store

`defineStore` 需要我们传入两个参数，第一个参数是 `name`, 这个值是唯一的，第二个参数是 Store 的值，包含 `state`, `getters`, `actions`

~~~js
import { defineStore } from "pinia"

const useCountStore = defineStore("name", {
    state: () => {
        return {
            // state 值
            count: 1
        }
    },
    getters: {
        getCount(state) {
            return state.count
        }
    },
    actions: {
        addCount() {
            this.count++
        }
    }
})
~~~

#### 组件内使用

* `setup components`
在 setup component 内可以直接使用

~~~html
<script setup>
    const countStore = useCountStore()
    console.log(countStore.count) // 1

    console.log(countStore.getCount) // 1
    countStore.addCount()
</script>
~~~

需要注意的是，**不能对 `store` 进行解构赋值，因为这会破坏 `store` 的响应式**

如果想要对 store 进行解构赋值，可以采用 `storeToRefs`,它将为任何响应式属性创建 refs。 当您仅使用 store 中的状态但不调用任何操作时，这很有用
~~~html
<script setup>
    import { storeToRefs } from "pinia"
    const countStore = useCountStore()
    const { count, getCount } = storeToRefs(countStore)
</script>
~~~

## 属性

#### state

state 用来定义应用程序状态开始，在 `pinia` 中状态是一个返回初始状态函数

~~~js
import { defineStore } from "pinia"

const useCountStore = defineStore("name", {
    state: () => {
        return {
            // state 值
            count: 1
        }
    }
})
~~~

如果想要重置 `Store` 的状态，可以调用 `$reset` 方法

~~~js
useCountStore.$reset()
~~~

**不在 `setup()` 中使用**

可以使用 `mapState` 将状态映射为只读属性

~~~js
    export default {
        computed: {
            ...mapState(useCountStore, options)
        }
    }
~~~

`options` 有两种类型

* 数组类型 如果是数组类型的话，其内的元素是需要映射的属性名，例如我们想要映射 state 的 count 的值 `...mapState(useCountStore, ["count"])`,组件内可以直接使用 `this.count` 访问

* 对象类型 对象类型的话，key 是组件内访问时的属性名，key 所对应的值是 Store state 里面的值

~~~js
    export default {
        computed: {
            ...mapState(useCountStore, {
                aliasCount: "count", // 组件内访问时 this.aliasCount,相当于访问 store 的 count 属性
                doubleCount: (state) => state.count * 2 // 类似于 Store 的 getters 属性
            })
        }
    }
~~~
