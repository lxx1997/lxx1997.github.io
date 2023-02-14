---
title: 重新学习vue2 - 发现隐藏其中的细节 - part2
cover: /assets/blogCover/MIKU花(4)_78753717_p1.png
date: 2022-07-19 15:04:48
updated: 2022-07-19 15:04:48
categories:
    - Vue
tags:
    - Vue
    - JavaScript
    - relearn
---

1. **filter(过滤器)**
    ~~~html
      <p>{{ message | capitalize }}</p>
      <div v-bind:id="rawId | formatId"></div>
    ~~~
    ~~~js
      filter: {
        capitalize: function(val) {
          return val
        }
      }
    ~~~

    **过滤器可以串联，值从左向右传递**