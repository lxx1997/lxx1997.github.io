---
title: Vue keep-alive 组件状态缓存
date: 2021-01-04 17:35:02
categories: Vue
tags:
    - Vue
---

  这段时间做项目时，老板要求要缓存一些页面的表单数据，于是想到了 vue 的 keep-alive ，在使用时，自己也犯了一些错误，在此记录一下

#### 首次使用

  在阅读文档的时候，没有理解文档的内容，keep-alive 组件，vue官方文档给的解释是 *匹配首先检查组件自身的name选项，如果name选项不可用，则匹配他的局部注册名称*，但是不知怎的被我理解成为了 *路由配置的name属性*，结果闹了一个大乌龙

  然后，自己怎么测试都发现不能缓存页面状态，最后使用**面向百度编程**找到了自己的错误

#### 如何使用

  为了方便我们不用新增一个组件，就把组件的name添加到 keep-alive 组件中，在这里我采用了一个取巧的方法

  **保证组件的 name 属性与对应路由的 name 属性保持一致**

  1. 提取我们所需要的路由对象

  这个方法根据我们传入的路由名称 动态提取出我们需要的路由对象，而不是获取所有的路由对象

  ~~~js
    function handleGetRoutes(routeName) {
      let routeObj = Object.create(null)
      asyncRoutes.map((item) => {
        if (item.name === routeName) {
          routeObj = item
        }
        return item
      })
      return routeObj
    }
  ~~~

  通过递归的方法获取到所有的 name 属性
  ~~~js
    const routes = handleGetRoutes('Classify')
    let includes = []
    this.handleGetRouteName(routes, includes)

    handleGetRouteName(obj, arr) {
        if (
          obj.children &&
          obj.children instanceof Array &&
          obj.children.length > 0
        ) {
          const length = obj.children.length
          for (let i = 0; i < length; i++) {
            this.handleGetRouteName(obj.children[i], arr)
          }
        }
        arr.push(obj.name)
      },
  ~~~

  最后在 keep-alive 组件中使用

  ~~~html
    <keep-alive :include="includes">
      <router-view></router-view>
    </keep-alive>
  ~~~

#### 其他用法

1. 生命周期函数  `activated,deactivated`

2. include
    include 表示只有匹配到的组件才会被缓存
3. exclude
    exclude 表示只有匹配到的组件才不会被缓存
 `include`和`exclude`允许组件有条件的缓存，有三种表示方式
 ~~~html
 <!-- 字符串 -->
  <keep-alive include="a,b">
    <component :is="view"></component>
  </keep-alive>
  
 <!-- 正则表达式 -->
  <keep-alive :include="/a|b/">
    <component :is="view"></component>
  </keep-alive>
  
 <!-- 数组 -->
  <keep-alive :include="['a','b']">
    <component :is="view"></component>
  </keep-alive>
 ~~~

4. max 

  max 表示 最大缓存组件个数，缓存组件达到最大个数后，添加新的缓存组件，最久未被访问的实例会被销毁掉

