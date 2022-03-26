---
title: 面试题解析 - other people
date: 2021-01-06 10:44:55
categories: 面试
tags:
    - 面试
    - web
    - node
    - JavaScript
    - http
    - Vue
    - react
cover: '/assets/cover/20200225A1295.jpg'
---

  在公众号看到了一位大佬分享的自己的多家大公司的面试经历，看了一遍面试问题，深感自己在各方面的不足，所以诞生了这篇文章，分析一下大佬的面试题以及答案

  [公众号原文转载地址](https://mp.weixin.qq.com/s/bjD9_tNJX1fVuzZEHWRRNw)
  [掘金原文地址](https://juejin.cn/post/6912268021381726221)

  1. 原生js怎么实现拖放

  **answer:** 
    * 首先给要实现的拖拽的元素的 `draggable` 属性设置为true
    * 使用时间监听 `addEventListener` 监听元素的 `dragstart`, `dragend`, `dragover`, `dragleave`, `dragenter`, `drop` 等事件
      * dragstart 被拖动的元素，开始拖放触发
      * dragend   拖放的对象元素，拖放操作结束
      * dragover  拖放过程中鼠标经过的元素，被拖放的元素正在本元素范围内移动(一直)
      * dragleave  拖放过程中鼠标经过的元素，被拖放的元素离开本元素范围
      * dragenter  拖放过程中鼠标经过的元素，被拖放的元素“开始”进入其它元素范围内（刚进入）
      * drag  被拖放的元素，拖放过程中
      * drop  拖放的目标元素，其他元素被拖放到本元素中
    [参考示例](https://blog.csdn.net/weixin_45761317/article/details/103430200)
  **优化：** 卡顿的话可以添加 css 属性，来使元素移动更加流畅 `transition: tranform, opacity 0.5s,0.5s ease,ease`

  2. react-dnd拖放的核心API
    [参考文章](https://blog.csdn.net/sinat_17775997/article/details/88727672)
  **未完待续**

  3. 如何实现路由监听（vue）

    * 组件内可以使用 `watch`  监听 `$route` 对象
    * 全局监听路由 `beforeEach`, `afterEach`
    * 组件内部监听路由变化 `beforeRouteEnter`, `beforeRouteLeave`, `beforeRouteUpdate`
    * 路由的独享钩子函数 `beforeEnter`
#### 相关书籍连接

  [红宝书第四版](https://www.ituring.com.cn/book/2472)
  [js灵魂之问(上)](https://juejin.cn/post/6844903974378668039)
  [js灵魂之问(中)](https://juejin.cn/post/6844903986479251464)
  [js灵魂之问(下)](https://juejin.cn/post/6844904004007247880)
  [css世界](https://www.cssworld.cn/)
  [flex小青蛙](http://flexboxfroggy.com/)
  [flex阮一峰博客](http://www.ruanyifeng.com/blog/2015/07/flex-grammar.html)
  [卡颂的react技术揭秘](https://react.iamkasong.com/)
  [若川的源码系列](https://juejin.cn/user/1415826704971918/posts)
  [难凉热血的vue源码分析](https://nlrx-wjc.github.io/Learn-Vue-Source-Code/)
  [数据结构与算法之美](https://time.geekbang.org/column/intro/100017301)
  [政采云团队的博客--算法篇](https://101.zoo.team/)
  [天天的前端算法总结](https://juejin.cn/post/6900698814093459463)
  [ssh的前端算法进阶指南](https://juejin.cn/post/6847009772500156429)
  [修言算法小册](https://juejin.cn/book/6844733800300150797)
  [谢希仁的计算机网络](https://item.jd.com/12219883.html)
  [神三元的http灵魂之问](https://juejin.cn/post/6844904100035821575)
  [浏览器专栏](https://time.geekbang.org/column/intro/100033601)
  [nginx笔记](https://blog.csdn.net/qq_42813491/article/details/103117799?ops_request_misc=%25257B%252522request%25255Fid%252522%25253A%252522160938095216780302981460%252522%25252C%252522scm%252522%25253A%25252220140713.130102334.pc%25255Fblog.%252522%25257D&request_id=160938095216780302981460&biz_id=0&utm_medium=distribute.pc_search_result.none-task-blog-2~blog~first_rank_v2~rank_v29-1-103117799.pc_v2_rank_blog_default&utm_term=nginx)
  [linux笔记](https://blog.csdn.net/qq_42813491/article/details/88379799)
