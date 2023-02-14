---
title: 新型 Web 框架 - qwik
cover: /assets/blogCover/天使なミクさん_79993307.png
date: 2022-08-18 11:18:51
updated: 2022-08-18 11:18:51
categories:
    - [framework, Qwik]
tags:
    - framework
    - Qwik
    - JavaScript
    - JSX
---

{% post_link https://qwik.builder.io/docs/overview '文档地址' %} - {% post_link https://github.com/BuilderIO/qwik 'github' %}

Qwik 是一種新型 Web 框架，可以提供任何大小或複雜性的即時加載 Web 應用程序。您的網站和應用程序可以使用大約 1kb 的 JS（無論應用程序複雜性如何）啟動，並在規模上實現一致的性能。

## 语法

#### `component$`

Qwik 组件使用 `component$` API 声明

~~~js
const CounterCom = component$((props) => {
  return <div> component content </div>
})

const App = component$(() => {
  return <div>
    <CounterCom />
  </div>
})
~~~

使用 `component$` 定义的组件，`Qwik` 自动将其处理成懒加载组件，未使用，或者未出现页面上的时候，首屏加载时，并不会加载这个组件的js 

组件内部事件也可以采用懒加载的方式，只需要在事件名后面添加 `$` 符号

例如 `click` 事件，只有用户点击的时候，才会去加载 `click` 事件对应的事件内容


~~~js
const CounterCom = component$((props) => {
  const store = useStore({ count: 0 })
  return <button onClick$={() => store.count++}></button>
})

const App = component$(() => {
  return <div>
    <CounterCom />
  </div>
})
~~~

#### `useStore`

Qwik 提供了一个方法 `useStore`,可以给应用程序创建状态，返回的对象具有唯一 ID 的代理，当状态发生改变时，页面内容也会随之发生改变

~~~js
const CounterCom = component$((props) => {
  const store = useStore({ count: 0 })
  return <button onClick$={() => store.count++}></button>
})
~~~

* 使用 ref ·`useRef`

~~~JS
export function useRef<T = Element>(current?: T): Ref<T> {
  return useStore({ current });
}

const Cmp = component$(() => {
  const input = useRef<HTMLInputElement>();
  useClientEffect$(({ track }) => {
    const el = track(input, 'current')!;
    el.focus();
  });
  return (
    <>
      <input type="text" ref={input}/>
    </>
  )
});
~~~

* `useWatch`

`useWatch` 用来监控数据发生改变时，当数据发生改变就会执行useWatch 中的内容

`useWatch` 会在回调函数内传入一个track 参数，使用 track 函数来包装属性读取，只有使用 track 的属性发生变化，才会触发回调函数执行

~~~JS

  const store = useStore({ count: 0, doubleCount: 0 });

  useWatch$(({ track }) => {
    const count = track(store, "count");
    store.doubleCount = count * 2;
  })
~~~

以上操作只有当 count 的值发生变化时，才会触发 useWatch$ 回调函数，其他值变化并不会触发