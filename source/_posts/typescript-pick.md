---
title: typescript - Pick
date: 2020-12-02 10:21:41
tags:
cover: '/assets/cover/20200225A1295.jpg'
---

#### 什么是Pick

就是从一个符合类型中，取出几个想要的类型的组合

~~~ts
  type Pick<T, K extends keyof T> = {
    [key in k]: T[key]
  }

  interface TState {
    name: string;
    age: number;
    like: string[]
  }
  // if i just want one or two attribute of TState
  // we can use Pick to get the attribute we want

  interface  TSingleState extends Pick<TState, 'name' | 'age'> {}
~~~

泛型中的extends 并不是用来继承的，而是用来约束类型的，所以`K extends keyof T`，应该是说key被约束在T的key中，不能超出这个范围

[原文链接](https://blog.csdn.net/qq_28992047/article/details/106879772)
