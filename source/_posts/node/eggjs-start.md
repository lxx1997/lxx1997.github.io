---
layout: post
title: eggjs-start
date: 2020-03-25 19:41:08
categories:
    - eggjs
comments: true
tags:
    - eggjs
    - nodejs
    - backEnd
cover: /assets/blogCover/MIKU花(4)_78753717_p1.png
---
## eggjs 定义

###  设计原则

​	egg的产检机制有很高的可扩展性，一个插件只做意见事情，egg通过框架聚合这些插件，并根据自己的业务场景定制配置，可以降低应用的开发成本

### 其他框架的差异

#### express

​	express是node.js社区广泛使用的框架，简单且扩展性强，适合做个人项目，但框架本身缺少约定，标准的MVC模型会有各种千奇百怪的写法，egg按照约定进行开发，奉行约定优先配置，团队协作成本低

#### sails

​	sails和egg一样奉行【约定优与配置】的框架，扩展性也非常好，但是相比egg，sails支持Blueprint REST API、WhaterLine这样可扩展的ORM、前端集成、websocket等，但是这些功能都是优Sails提供的，但egg不直接提供功能，只是集成各种功能插件，比如实现egg'-blueprint,egg-waterline这样的插件，在使用sails-egg框架整合这些插件

### 特性

* 提供基于egg定制上层框架的能力
* 高度可扩展的插件机制
* 内置多进程管理
* 基于Koa开发，性能优异
* 框架稳定，测试覆盖率高
* 渐进式开发

### 异步编程模型

​	nodejs是一个异步的世界，官方API支持的都是以callback的形式的异步编程模型，这种会存在一些问题

* callback hell: 最臭名昭著的callback嵌套问题
* release zalgo: 异步函数中可能同步调用callback返回数据，带来不一致性

​       异步解决方案

* promise

* async function

  在async function中，我们可以通过await关键字等待一个Promise被resolve

~~~js
const fn = async function() {
  const user = await getUser();
  const posts = await fetchPosts(user.id);
  return { user, posts };
};
fn().then(res => console.log(res)).catch(err => console.error(err.stack));
~~~

### Koa

​	koa 是一个新的web框架，由express幕后原班人马打造，致力于成为web应用和api开发领域中的一个更小更富有表现力更健壮基石

#### middleware

​	中间件，所有请求经过一个中间件的时候都会执行两次，koa模型可以非常方便的实现后置处理逻辑

#### context

​	和express只有request和response两个对象不同，koa增加了一个context的对象，作为这次请求的上下文对象，我们可以把一次请求相关的上下文都挂载到这个对象上

​	同时context上也挂在了request和response两个对象，提供了大量的便捷方式辅助开发

~~~js
get request.query
get request.hostname
set response.body
set response.status
~~~

#### 异常处理

​	通过同步方式编写异步代码带来的另外一个非常大的好处就是异常处理，使用try...catch就可以将按照规范编写的代码的所有错误都可以捕获到，这样我们可以很便捷的编写一个自定义的错误处理中间件

~~~js
async function onerror(ctx, next) {
  try {
    await next();
  } catch (err) {
    ctx.app.emit('error', err);
    ctx.body = 'server error';
    ctx.status = err.status || 500;
  }
}
~~~

​	只需要将这个中间件放到其他中间件之前，就可以捕获它们所有的同步或者异步代码中抛出的异常

### 扩展

​	在基于egg的框架或者应用中，我们可以通过定义 *app/extend/{application,content,request,response}.js*来扩展koa中对应的四个对象圆形，可以快速增加更多的辅助方法，列入在*app/extend/context.js*中写入一下代码

~~~js
// app/extend/context.js
module.exports = {
  get isIOS() {
    const iosReg = /iphone|ipad|ipod/i;
    return iosReg.test(this.get('user-agent'));
  },
};
~~~

​	在controller中，我们就可以使用到刚才定义的这个便捷属性了

~~~js
// app/controller/home.js
exports.handler = ctx => {
  ctx.body = ctx.isIOS
    ? 'Your operating system is iOS.'
    : 'Your operating system is not iOS.';
};
~~~

#### 插件

​	在express和koa中，经常会引入许许多多的中间件来提供各种各样的功能，列入引入koa-session提供session的支持，引入koa-bodyparser来解析请求body，egg提供一共更加强大的插件机制，让这些地理领域的功能模块可以更加容易编写

* extend：扩展基础对象上下文，提供各种工具类和属性
* middleware：增加一共或多个中间件，提供请求的前置和后置处理逻辑
* config：配置各个环境下插件自身的默认配置项

