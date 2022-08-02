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
