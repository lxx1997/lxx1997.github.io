---
title: Swiper - 一些常用的属性及方法
cover: /assets/blogCover/MIKU×Kyoto_76886013.png
date: 2023-01-18 14:45:31
updated: 2023-01-18 14:45:31
categories:
  - [web]
  - [thirdPartPlugin]
tags:
  - web
  - thirdPartPlugin
  - JavaScript
  - react
  - Vue
---

## 介绍

Swiper - is the free and most modern mobile touch slider with hardware accelerated transitions and amazing native behavior. It is intended to be used in mobile websites, mobile web apps, and mobile native/hybrid apps.

Swiper - 是免費且最現代的移動觸摸滑塊，具有硬件加速轉換和驚人的本機行為。它旨在用於移動網站、移動網絡應用程序和移動原生/混合應用程序。

Swiper is not compatible with all platforms, it is a modern touch slider which is focused only on modern apps/platforms to bring the best experience and simplicity.

Swiper 並非與所有平台兼容，它是一種現代觸摸滑塊，僅專注於現代應用程序/平台，以帶來最佳體驗和簡單性。

## 使用

Swiper 应该是最常用的滑块插件了，兼容了 Vue， react， Angular， solid， svelte 等三方框架，里面有很多属性和方法，里面有很多方法我们其实并不会遇到，有些方法很长用到，如果每次去查文档会浪费很多时间，在这里把一些常用的方法记录一下，方便下次查阅

#### 属性

* slidesPerView: number 在屏幕内显示多少个组件，组件宽度会平分当前屏幕宽度
* spaceBetween: number 组件之间的距离
* initialSlide: number 当前选中 (活跃) 的组件
* loop: boolean 是否循环
* centeredSlides: boolean 是否居中显示，如果设置为 true 的 在滑动时最开始和最后的组件可以滑动到页面中央
* isBeginning: boolean 可以用来判断是否是开头
* isEnd: boolean 可以判断是否结尾
~~~js
  const onSlideChange = (slider: any) => {
    if(slider) {
      setShowStart(!slider.isBeginning)
      setShowEnd(!slider.isEnd)
    }
  }
~~~

#### 方法

* slideTo 跳转到第几个滑块
* onSwiper 可以获取 Swiper 实例（vue 和 react 中）