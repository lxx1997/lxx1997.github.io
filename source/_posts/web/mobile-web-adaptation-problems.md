---
title: web - H5 移动端适配问题
cover: /assets/blogCover/1620654976678.jpg
date: 2022-11-23 16:09:03
updated: 2022-11-23 16:09:03
categories:
  - web
tags:
  - web
  - mobile
---

## IOS 移动端适配

#### 唤起键盘输入时，页面底部的输入框无法浮动到键盘上方

[参考文章](https://juejin.cn/post/7105950857014804516)

这个出现的原因主要是 IOS 和 Andriod 的 适配不同

Andriod 的情况比较好理解。软键盘弹出后，实际webview被挤压了，变短了，相当于浏览器变小了，变成 原本高度 - 软键盘高

IOS 发布了 8.2 版本之后，与androids的不同，软键盘弹出，并不是挤压webview，webview的高度不会发生变化，而软键盘更像是一个悬浮在weview上的东西，并不会影响webview的实际高度，是“盖”上去的。这样就造成了我们目前所看到的情况，输入框被键盘遮挡，无法看到用户输入的内容

所以可以看到，我们在IOS上聚焦某个输入框，是会自动让页面发生滚动，以展示聚焦的输入框，此时页面的滚动，实际上是webview自身发生了移动。

这里可以采用的方法有两种

第一种是用户聚焦于输入框的时候，设置window 或者页面区域主动向上方滚动一定距离（例如软键盘高度），当用户失去焦点时，在滚动回原来的位置

第二种是改变 输入框所在元素的高度，使得输入框能够正常显示出来，当用户失去焦点时，在还原回原来的高度

~~~js
  const handleBlur = (e: any) => {
    // 获取浏览器类型
    let { ios } = utils.myBrowserOS()
    if(ios) {
      setTimeout(function(){
        element.style.height = "100%"
      }, 100)
    }
  }

  const handleFocus = (e: any) => {
    let { ios } = utils.myBrowserOS()
    if(ios) {
      setTimeout(function(){//设置一个计时器，时间设置与软键盘弹出所需时间相近
       element.style.height = (window.innerHeight - 330) + "px"
      }, 100)
    }
  i

~~~

## Andriod 移动端适配


## 共用的适配方式

#### 在滚动的元素内部 有 pisition: fixed; 元素，点击到改元素，无法进行滑动

在 IOS 可以采用在 `pisition: fixed;` 元素外包一层 `pisition: sticky;` div，可以实现

其他的话要触发浏览器默认的滚动（window，document.body）而非 元素的 overflow 属性才可以滑动
