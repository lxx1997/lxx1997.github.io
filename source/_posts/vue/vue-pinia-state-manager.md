---
title: vue3 状态管理工具 - pinia
categories:
  - - Vue3
tags:
  - Vue3
cover: /assets/blogCover/【寄稿】砂の惑星_76098630.png
date: 2022-08-11 15:19:53
updated: 2022-08-11 15:19:53
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


如果想要直接修改这些状态属性，类似 `this.count++`,可以使用 `mapWritableState` API

#### getters

`getters` 的使用 类似于 `state`，但是创建方式略有不同

getters 是一个有具体返回值的函数，这个函数可以是有 state的值或者其他 getters 中的值计算出来的结果


~~~js
import { defineStore } from "pinia"

const useCountStore = defineStore("name", {
    getters: {
        doubleCount: (state) => state.count * 2,
        othercount(state) {
            return this.doubleCount * state.count
        }
    }
})
~~~

在 setup 函数中使用时，可以直接通过 store 访问

非 setup 函数可以通过 mapState 方法注册到 computed 属性中

#### actions

actions 中的方法适合用来定义业务逻辑，而且是可以进行异步操作

在非 setup 函数中使用的时候可以通过 mapActions 映射出来

~~~js
    export default {
        methods: {
            ...mapActions(useCountStore, {
                changeCount: "count", 
            })
        }
    }
~~~

第二个参数传递的类型可以参考 mapState

在 setup 函数中，可以直接在 setup 中使用，也可以在组件中通过 store 对象调用

~~~js

    export default {
        setup(props) {
            let { todoItem } = toRefs(props)
            const todoList = useTodoListStore()

            const handleEdit = () => {
                todoList.updatedTodoList(todoItem.value.id, {
                    isEditing: true
                })
            }

            const handleDelete = () => {
                todoList.removeTodoList(todoItem.value.id)
            }

            const handleConfirm = () => {
                todoList.updatedTodoList(todoItem.value.id, {
                    content: value.value
                })
            }
            return {
                value,
                handleEdit,
                handleDelete,
                handleConfirm
            }
        }
    }
~~~

另外，针对 actions vuex 提供了一个 `$onAction` 方法来订阅action 及结果

当我们订阅一个 store 后，每触发一次 store 内部的 action 执行，都会触发一次回调函数，传递给它的回调在 action 之前执行。 after 处理 Promise 并允许您在 action 完成后执行函数。 以类似的方式，onError 允许您在处理中抛出错误。

~~~js
const unsubscribe = todoListStore.$onAction(
    ({
        name, // action 的名字
        store, // store 实例
        args, // 调用这个 action 的参数
        after, // 在这个 action 执行完毕之后，执行这个函数
        onError, // 在这个 action 抛出异常的时候，执行这个函数
    }) => {
        // 记录开始的时间变量
        const startTime = Date.now()
        // 这将在 `store` 上的操作执行之前触发
        console.log(`Start "${name}" with params [${args.join(', ')}].`)

        // 如果 action 成功并且完全运行后，after 将触发。
        // 它将等待任何返回的 promise
        after((result) => {
        console.log(
            `Finished "${name}" after ${
            Date.now() - startTime
            }ms.\nResult: ${result}.`
        )
        })

        // 如果 action 抛出或返回 Promise.reject ，onError 将触发
        onError((error) => {
        console.warn(
            `Failed "${name}" after ${Date.now() - startTime}ms.\nError: ${error}.`
        )
        })
    }
)

unsubscribe()
~~~