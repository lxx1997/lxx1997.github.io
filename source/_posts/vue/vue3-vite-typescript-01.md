---
title: Vue3 + Vite + TypeScript 项目实战 -----（一）搭建项目
date: 2021-01-15 22:56:10
categories:
    - [Vue3]
    - [vite]
    - [TypeScript]
tags:
    - Vue3
    - vite
    - TypeScript
cover: /assets/blogCover/MIKU花(4)_78753717_p1.png
---

Vue3 新版出来了这么久，虽然之前也有联系过搭建，但是并没有测试过多的东西，趁着闲暇时间，打算从头采坑，记录自己的 Vue 3.0 的爬坑历程

#### 搭建项目

  本次项目搭建采用尤雨溪大大开发的 Vite，这是尤大最近开发出的新的 Web 开发工具具有以下优点

  * 快速的冷启动
  * 即时的模块热更新
  * 真正的按需编译

  使用 vite 极大的提高了前端的开发性能及开发速度

  **全局安装 Vite**
  ~~~js
    // 全局安装 vite-app
    npm i -g vite-app

    // 创建项目
    npm init vite-app <project-name>

    cd project-name

    yarn || npm install
  ~~~

#### 安装 必要第三方插件

  **安装 TypeScript**

  ~~~js
    npm install -D typescript
  ~~~

  根目录(src)下新增 shim.vue.d.ts 文件

  ~~~js
    declare module '*.vue' {
      import { Component } from 'vue'
      const component: Component
      export default component
    }

    // 或者
    declare module '*.vue' {
      import Vue from 'vue'
      // const component: defineComponent<{},{},any>
      export default Vue
    }
  ~~~

  修改 main.js 为 main.ts

  并修改 index.html 文的引用

  **安装 vue-router**

  vue3.0 最好安装最新的版的 vue-router，版本错误的话无法使用路由进行跳转

  ~~~js
    npm install vue-router@4
  ~~~

  然后在 src 目录下新建 router 目录，在目录下新建 index.ts 文件

  从 vue-router 引入 `createRouter` 和 `createWebHashHistory`(或者`createWebHistory`)
  ~~~js
    import {createRouter, createWebHashHistory} from 'vue-router'
  ~~~

  然后新建 一个 route对象，存放路由配置，使用 createRouter 方法 创建 router 对象，最后通过 export default 导出

  ~~~js
    const routes = [
      {
        path: '/',
        component: () => import('../views/home/index.vue'),
        redirect: '/index',
        children: [
          {
            path: '/login',
            component: () => import('../views/login/index.vue')
          },
        ]
      },
    ]

    var router = createRouter({
      history: createWebHashHistory(),
      routes
    })

    export default router
  ~~~

  在 mian.ts 对象中 通过 import 引入，并用 Vue 的 use 方法 注册到 Vue 实例上

  ~~~js
    import router from './router'
    createApp(App).use(router).mount('#app')
  ~~~

  **使用 Vue 状态管理工具 Vuex**

  ~~~js
    // 安装
    npm install vuex@next

    // 使用
    // /src/store/index.ts
    import Vuex from 'vuex'
    const store = new Vuex.Store({
      // ...
      modules: {},
      state: () => {
        return {
          name: 'lxx'
        }
      },
      mutations: {},
      actions: {},
      getters: {}
    })

    export default store

    // 注册
    import store from './store'
    createApp(App).use(router).use(store).mount('#app')
  ~~~

  **使用 sass 语法**

  ~~~js
    // 安装 sass
    yarn add sass

    // 安装完成之后 将 sass 从 dependencies 移动到 devDependencies
    // 使用时 在 style 后加 lang="scss"
  ~~~

如果想要对 Vite 构建的 Vue3.0应用进行新的配置，首先需要在根目录创建一个 `vite.config.js` 文件
#### 配置路径别名

~~~js
  const path = require("path")

  function resolve(dir) {
    return path.join(__dirname, dir)
  }

  module.export = {
    alias: {
      '/@/': resolve('src')
    }
  }
~~~

此时访问 src 目录下的文件就可以通过 `/@/`来进行访问

~~~js
  // 访问 src 目录下的 component 目录下的 index 文件
  import Component from '/@/component'
~~~

为什么要使用 `/@/` 而不是直接 `@/` 呢，在这里 Vite 的[官方配置](https://vitejs.dev/config/#alias)给我们做了解释

_当别名为文件系统路径的时候，请使用绝对路径，相对别名值将按原样使用，并不会解析为文件路径_，所有要使用 `/@/` 来代表绝对路径

