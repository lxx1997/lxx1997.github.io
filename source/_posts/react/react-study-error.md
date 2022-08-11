---
title: react - 学习之路 - 问题解决集锦
date: 2020-09-18 09:49:13
tags:
    - react
cover: '/assets/cover/20200225A1295.jpg'
---

* Q: 如何将带有html标签的字符串以html的形式在div等元素中显示出来

 A: 使用元素的 `dangerouslySetInnerHTML` 可以将带有html标签的字符串转化为html
  ~~~html
    dangerouslySetInnerHTML={{ __html:item.content}}（vue中直接使用v-html就可以成功转化）
  ~~~