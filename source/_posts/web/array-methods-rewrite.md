---
title: 数组部分方法原理重写
cover: /assets/blogCover/初音ミク_83523978.png
date: 2023-04-08 17:11:23
updated: 2023-04-08 17:11:23
categories:
    - [web]
    - [JavaScript]
tags:
    - web
    - JavaScript
---

## map

~~~js
Array.prototye.map = function (cb) {
  if(typeof cb !== "function") {
    throw new Error("callback is not function")
    return
  }
  let arr = []
  for(let i = 0; i < this.length; i++) {
    arr.push(cb(this[i]))
  }
  return arr
}
~~~
## filter

~~~js
Array.prototye.filter = function (cb) {
  if(typeof cb !== "function") {
    throw new Error("callback is not function")
    return
  }
  let arr = []
  for(let i = 0; i < this.length; i++) {
    let flag = cb(this[i])
    if(flag) {
      arr.push(this[i])
    }
  }
  return arr
}
~~~

## reduce

~~~js
Array.prototye.
 = function (cb, total) {
  if(typeof cb !== "function") {
    throw new Error("callback is not function")
    return
  }
  for(let i = 0; i < this.length; i++) {
    total = cb(total, this[i])
  }
  return total
}
~~~

## some

~~~js
Array.prototye.some = function (cb) {
  if(typeof cb !== "function") {
    throw new Error("callback is not function")
    return
  }
  for(let i = 0; i < this.length; i++) {
    let flag = cb(this[i])
    if(flag) {
      return flag
    }
  }
  return false
}
~~~
## every

~~~js
Array.prototye.every = function (cb) {
  if(typeof cb !== "function") {
    throw new Error("callback is not function")
    return
  }
  for(let i = 0; i < this.length; i++) {
    let flag = cb(this[i])
    if(!flag) {
      return flag
    }
  }
  return true
}
~~~
