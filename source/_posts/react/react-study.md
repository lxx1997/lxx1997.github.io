---
title: 重拾 react
date: 2020-08-28 15:11:36
updated: 2020-08-28 15:11:36
tags:
    - react
    - JavaScript
cover: /assets/blogCover/MIKU花(4)_78753717_p1.png
---

  由于最近一段时间一直在使用vue做项目，最近打算重拾react，在此记录react的点滴学习，实时更新

## 生命周期

  * routerWillLeave 路由跳转前确认

    * `return false` 取消本次跳转
    * `return` 返回提示信息，在离开Route前提示用户进行确认

    ~~~js
      import { Lifecycle } from 'react-router'
      const Home = React.createClass({
        // 假设 Home 是一个 route 组件，它可能会使用
        // Lifecycle mixin 去获得一个 routerWillLeave 方法。
        mixins: [ Lifecycle ],
        routerWillLeave(nextLocation) {
          if (!this.state.isSaved)
            return 'Your work is not saved! Are you sure you want to leave'
        },
      })
    ~~~
    