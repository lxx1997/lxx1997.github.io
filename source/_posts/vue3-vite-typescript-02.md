---
title: Vue3 + Vite + TypeScript 项目实战 -----（二）使用 Vue3 新特性
date: 2021-01-17 22:24:46
categories: vue3 vite ts
tags:
    - Vue3
    - vite
    - TypeScript
---
---

#### Vue3 新特性

##### 全局 Vue Api 实例修改

旧版 Vue 没有全局 api 实例，通过 new Vue 创建，创建全局组件或者指令通常采用一下方式

~~~js
  Vue.component('componentName', {
    data: () => {return {}},
    create() {}
  }
  Vue.directive('focus', {
    inserted: el => el.focus()
  })
~~~



Vue3.0 新增了 createApp 方法，该方法返回一个 Vue 实例，使我们可以创建多个 Vue 实例

##### 生命周期函数 hooks

  * onBeforeMount  取代 ~~beforeMount~~
  * onMounted  取代 ~~mounted~~
  * onBeforeUpdate  取代 ~~beforeUpdate~~
  * onUpdated  取代 ~~updated~~
  * onBeforeUnmount  取代 ~~beforeUnmount~~
  * onUnmounted  取代 ~~unmounted~~
  * onRenderTriggered  取代
  * onRenderTracked  取代
  * onErrorCaptured   取代 ~~errorCaptured~~
