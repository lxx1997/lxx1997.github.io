---
title: window.postMessage跨域的使用方式
date: 2021-05-04 23:23:18
tags:
    - JavaScript
cover: '/assets/cover/20200225A1295.jpg'
---

最近忙着工作的事情，好久没有更新博客了，正好最近要做的一个功能，最后决定使用 postMessage 进行解决

具体的使用场景是我这边打开新的窗口的时候需要向新的窗口传递一些数据

首先从网上摘取一些针对 postMessage 介绍
>window.postMessage() 方法可以安全地实现跨源通信。通常，对于两个不同页面的脚本，只有当执行它们的页面位于具有相同的协议（通常为https），端口号（443为https的默认值），以及主机  (两个页面的模数 Document.domain设置为相同的值) 时，这两个脚本才能相互通信。window.postMessage() 方法提供了一种受控机制来规避此限制，只要正确的使用，这种方法就很安全。

#### 父窗口如何传递参数

打开窗口的方式有一下几种 `iframe`的`contentWindow`属性、执行`window.open`返回的窗口对象、或者是命名过或数值索引的`window.frames`,此处暂时先介绍 `window.open()`

父窗口获取打开新窗口对象

~~~js
  const open = window.open('http://www.baidu.com', "_blank")
~~~

postMessage 有三个参数
~~~js
  open.postMessage(message, targetOrigin, [transfer]);
~~~
* `message` 是传递的数据 一般来说是一个对象用来传递当前`postMessage`类型，以及要传递的数据，因为可以通过 `postMessage` 多次传递，但是调用的事件监听方法都是同一个，所以最好要加一个状态进行区分
* `targetOrigin` 代表接受域名， 可以是 `"*"` 代表所有域名都可以，也可以是一个url，代表特定域名可以接受
* `transfer` 是一串和message 同时传递的 Transferable 对象. 这些对象的所有权将被转移给消息的接收方，而发送一方将不再保有所有权。

postMessage 在使用的时候需要在需要接收数据的窗口中定义一个事件监听函数 `message`, 注意这个方法需要挂载到 `·indow` 上面, 我最开始给挂载到 `document`, 结果怎么都触发不了，尴尬

postMessage 传递的 message 数据在 回调函数参数的 data上

~~~js
  window.addEventListener('message', (res) => {
    console.log(res)
  })
~~~

#### 子窗口获取父窗口

* window.opener 方法
* message 回到函数参数的 resource 属性，返回父窗口的引用

#### 问题

* 使用window.open 打开新窗口会被拦截？

~~~js
  const open = window.open('about:blank')
  open.location.href = "http://www.baidu.com"
~~~




