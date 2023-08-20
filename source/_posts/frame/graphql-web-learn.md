---
title: Graphql - 前端知识学习
cover: /assets/blogCover/Miku _ October_65437059.png
date: 2023-04-26 11:17:26
updated: 2023-04-26 11:17:26
categories:
  - [web]
  - [frame]
tags:
  - web
  - frame
  - graphql
  - JavaScript
  - Vue
---

## 个人的一些疑问

**前提：我一直没搞懂后端是如何根据传入的内容去查询的，后端数据库的表是如何设计的，如何根据传入的字段查找出对应的表中的数据，前端的参数传入还可以理解，后端的这一块是真的无法理解**

_补充说明_

**经过一段时间的仔细观看后发现，好像每个字段或者说字段所属的对象好像需要自己写查询方法，graphql提供了一些属性方便操作和查询(具体是否如此尚不清楚)**

~~~js
Query: {
  human(obj, args, context, info) {
    return context.db.loadHumanByID(args.id).then(
      userData => new Human(userData)
    )
  }
}
~~~
* obj 上一级对象，如果字段属于根节点查询类型通常不会被使用。
* args 可以提供在 GraphQL 查询中传入的参数。
* context 会被提供给所有解析器，并且持有重要的上下文信息比如当前登入的用户或者数据库访问对象。
* info 一个保存与当前查询相关的字段特定信息以及 schema 详细信息的值，更多详情请参考类型 GraphQLResolveInfo.

## Graphql 是什么

GraphQL 是一个用于 API 的查询语言，是一个使用基于类型系统来执行查询的服务端运行时（类型系统由你的数据定义）。GraphQL 并没有和任何特定数据库或者存储引擎绑定，而是依靠你现有的代码和数据支撑。

[官方文档](https://graphql.cn/learn/) 里面有非常细致的各种功能介绍

## Graphql 怎么使用

[不同语言使用示例](https://graphql.cn/code/)

## Graphql 在框架中如何使用

#### Vue

* [Vue Apllo](https://apollo.vuejs.org/zh-cn/guide/)

Apollo 是通过社区力量帮助你在应用中使用 GraphQL 的一套工具。它的 客户端和 服务端都非常有名。

通过这个，我们可以在 Vue 中直接使用 Graphql 进行数据查询
