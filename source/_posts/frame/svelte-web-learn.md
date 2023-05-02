---
title: Svelte - 前端框架学习
cover: /assets/blogCover/1578912686790.jpg
date: 2023-04-26 22:48:55
updated: 2023-04-26 22:48:55
categories:
  - [web]
  - [frame]
  - [svelte]
tags:
  - web
  - frame
  - svelte
  - JavaScript
  - TypeScript
---

## 什么是 Svelte

Svelte 是一个构建 web 应用程序的工具。传统框架如 React 和 Vue 在浏览器中需要做大量的工作，而 Svelte 将这些工作放到构建应用程序的编译阶段来处理。

需要注意，Svelte 是一款编译器。它可以将按照规定语法编写的代码打包成浏览器能运行的项目。
和其他前端框架一样，同样也是使用 HTML 、CSS 和 JavaScript 进行开发。

## 使用

### 创建项目

~~~js
npm create svelte@latest myapp // 在这一步,我们可以选择创建的项目类型，例如 是否默认使用 TypeScript，是否默认添加 eslint，pre-commit 等
cd myapp
npm install
npm run dev
~~~

### 创建一个 Svelte 组件

Svelte 组件需要我们创建 `.svelte` 文件，类似于 Vue，一个 `.svelte` 文件 可以看做是一个单独的组件

`.svelte` 文件 包含三个部分

* script

类似于 Vue 的 Script 标签，可以指定语言 `lang="ts"`,主要用来定义变量和方法，可以在 当前文件内使用

* style

样式文件，用来编写页面的css 样式

* document

文本节点，和 Vue 不同的是，可以不用包裹在template 组件内，可以直接写

~~~svelte
<div>{count}</div>

<script>
  let count = 1
</script>

<style>
  div {
    color: red;
  }
</style>
~~~

### 语法

#### 创建变量

创建变量和 js 创建变量一至，再dom 节点只能给使用的时候 `{}` 包括起来，当发生变化的时候，会重新进行编译，对应dom会自动更新成最新的数据

~~~svelte
<div class="pratice">
	{ count }
</div>
<script lang="ts">
	let count = 1
	setTimeout(() => {
		count = 233
	}, 3000)
</script>
~~~

上述页面会在页面初始渲染后，三秒后从 1 变成 233

#### 添加事件

1. 点击事件 `on:click`

#### 样式修改

和正常样式编写一样

#### 组件使用

使用组件时，需要在 `script` 内引入 组件

使用的时候，直接使用即可，**另外需要注意的是，组件内的标签样式和组件外的标签样式是互相隔离的**


### 进阶操作

#### 向标签内加入 HTML

在 SSvelte 中，可以使用 `{@html ...}`标签来插入html

但是 Svelte 不会对插入的html文本进行任何处理，也就是说我们需要自己进行转码，否则会遭到 XSS 攻击

~~~svelte
<p>{@html html文本}</p>
~~~

#### 反应式声明（类似于computed） `$: `

使用 `$: varible = 表达式`，当表达式涉及到的变量发生改变时，变量会自动发生改变

~~~svelte
<script>
$: add = count + 1
</script>
~~~

当count 的值发生变化时， add 的值也会自动发生变化

**补充**

也可以在 `$: `后面跟一个代码块，代码块内涉及到的变量的值发生变化时，会重新执行代码块内的内容，因此需要注意在代码块内尽量不要修改变量值，或者添加终结运行判断，以免造成无限循环

~~~svelte
<script>
// type1
$: console.log(count)
// type2
$: {
  console.log(count)
}
// type3
$: if(count >= 10) {
  count--
}
</script>
~~~

#### 数组和对象更新

由于 Svelte 的反应性是由赋值语句触发的，因此直接修改对象属性或者使用数组中会修改原数组内容的方法时，不会触发应用的引用进行更新

~~~svelte
<script>
let num = [1]
num.push(2) // 不会更新
num = [...num, 2] // 会更新
</script>

<div>
  {obj.foo.bar}
</div>
<script lang="ts">
	let obj = {
		foo: {
			bar: "bar"
		}
	}
	let foo = obj.foo

	setTimeout(() => {
		foo.bar = "foo"  // 不会触发 object.foo.bar 的更新
		obj.foo.bar = "foo"  // 会触发 object.foo.bar 的更新
	}, 3000)
</script>
~~~

#### 组件 props

通过 export 关键字 来定义 props字段

~~~svelte
<script>
export let count

// 添加默认值
export let count = 1
</script>

// 组件传递值
<Counter count={1} />

// 批量传递值
<Counter {...props} />
~~~

#### 语法判断

* 判断语法

判断语法需要使用 if 和 else 或者 else if 关键字，下面是具体使用示例

~~~svelte
// if 语句
{#if 判断语句 }
  执行代码
{/if}

// if else 语句
{#if 判断语句 }
  执行代码
{:else}
  执行代码
{/if}

// if else-if 语句
{#if 判断语句 }
  执行代码
{:else if 判断语句}
  执行代码
{:else}
  执行代码
{/if}
~~~

上述代码会根据 判断语句的执行结果显示不同的内容

* 循环语法

Svelte 中循环语句使用 `each ... as ...` 的格式， each 后面跟的是循环对象，as 后面是循环中使用的变量

~~~svelte
{#each list as item, index}
  <p>{item} and {index}</p>
{/each}
~~~

如果需要类似于vue 和 react 添加 key 值,作用和vue react 中保持一致，告诉是什么地方需要改变

~~~svelte
{#each list as item, index (item.name)}
  <p>{item.name} and {index}</p>
{/each}
~~~

* 同步语法

Svellte 还实现了同步机制，可以直接在渲染时获取 Promise 的结果和报错，并且在结果未返回时，添加占位，类似于 React 的 Suspennse 组件

~~~svelte
{#await promise}
  promsie 结果未返回时占位组件
{:then res}
  promsie 成功结果返回时占位组件
{:catch err}
  promsie 失败结果返回时占位组件
{/await}
~~~

也可以部分简写成一下格式


~~~svelte
{#await promise then res}
  promsie 成功结果返回时占位组件
{/await}
~~~

#### 事件绑定

* 注册事件 `on:事件名`
* 事件修饰符
  * preventDefault  阻止默认事件
  * stopPropagation  阻止冒泡
  * passive
  * capture 事件触发机制（冒泡还是捕获）
  * once  事件只触发一次
  * self  仅当点击元素本身才会触发
  ~~~svelte
  <div on:click|preventDefault|capture={handleClick}></div>
  ~~~
* 组件内触发事件(emit)

  ~~~svelte
  <script>
    import { createEventDispather } from "svelte"
    const dispatch = createEventDispather()
   // 调用该方法时，会自动发送事件，父级需要定义一个事件来接收参数 -->
    function dispatchMessage(type, data) {
      dispatch(type, data)
    }
  </script>
  ~~~
* 事件转发（子组件一步步向上传递）
  ~~~svelte
  // 正常情况下，父组件也需要像子组件一样，通过 dispatch 把事件向上传递，但是 Svelte 提供了一种更方便的方法
  <Child on:message></Child>
  // 父组件会自动把message 事件向上传递
  ~~~

#### svelte 绑定  (bind:属性)

* 属性绑定
  * bind:value  input value绑定，类似于 vue v-model 数据双向绑定，任意一个变化都会导致另一个发生变化
  * bind:checked input 复选框选中状态

#### 生命周期
  
  * onMount 在组件首次呈现到 DOM 后运行
  * onDestroy 组件被销毁时执行
  * beforeUpdate 组件渲染完成前执行
  * afterrUpdate 组件渲染完后前执行
  * tick

### Svelte 扩展

#### Svelte 状态管理工具（store）

创建一个Store

~~~js
import { writable } from "svelte/store"

export const countStore = writable(0)
~~~

通过上述代码创建了一个 初始值为 0 的Store

Svelte 为 Store 提供了三种方法。方便我们订阅和修改Store 的值

* subscribe(fn: void)  添加订阅事件，会把store 的值当做fn 的参数传递过来，会返回一个函数，调用函数会自动取消当前订阅
* update  更新，可以传递一个值或者一个函数
* reset  初始化

**另外可以直接使用 $count 来访问 count 的值**

Svelte 提供了多种创建 Store 方法

* writable 可读写，用户可以调用update 或者set 方法修改
* readable 只读，不可以修改,支持两个参数，第一个参数是默认值，第二个参数为一个函数，主要用来随时修改 readable 的值，会返回一个函数，用来清除当前函数的副作用(闭包，垃圾清除)

~~~js
import { readable } from "svelte/store"

export time = readable(new Date(), function start(set) {
  let interval = setInterval(() => set(new Date()), 1000)
  return () => {
    clearInterval(interval)
  }
})
~~~

* derived stores派生,可以用来定义一个依赖于其他 store 的 store，这样当依赖的store 发生变化的时候，自身也会发生变化

~~~js

import { readable, derived } from "svelte/store"

export time = readable(new Date(), function start(set) {
  let interval = setInterval(() => set(new Date()), 1000)
  return () => {
    clearInterval(interval)
  }
})
let now = new Date()

export const elapsed = derived(time, $time => Math.round(($time - start) / 1000)
~~~

当然我们也可以利用store 的 订阅和更新方法，自定义一个带有各类事件的Store，这样代码会更加简洁，复用起来也更加方便

~~~js
function createCount() {
	const { subscribe, set, update } = writable(0);

	return {
		subscribe,
		increment: () => update(n => n + 1),
		decrement: () => update(n => n - 1),
		reset: () => set(0)
	};
}
~~~

以上代码定义了一个初始账为 0 的Store，并且带有加和减操作函数

#### Svelte 标签 class 属性定义

有以下几种方式

~~~svelte
<!-- 第一种 -->
<p class="pragraph"></p>
<!-- 第二种 -->
<p class="{active ? 'active' : ""}"></p>
<!-- 第三种 -->
<p class:active="{active}"></p>
<!-- 在第三种情况下，如果属性名和变量名相同，且无其他特殊判断时，可以简写成以下格式 -->
<p class:active></p>
~~~

#### Svelte slot 组件

Svelte 有以下几种slot组件

* 默认slot 组件

  写在子组件标签内部，不符合其他slot 类型的都会默认写到 默认slot组件所在位置

  ~~~svelte
    <div class="box">
      <slot></slot>
    </div>
  ~~~

* 命名 slot 组件, 带有名称 Slot 组件，对应名称的slot 组件会自动添加到对应的位置

  ~~~svelte
    <!-- Box -->
    <div class="box">
      <slot name="header"></slot>
    </div>
    <!-- Parent -->
    <div>
      <Box>
        <slot slot="header">
          this is header
        </slot>
      </Box>
    </div>
  ~~~
