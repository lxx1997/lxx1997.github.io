---
title: 重新学习vue2 - 发现隐藏其中的细节 - part1
cover: /assets/cover/20200225A1295.jpg
date: 2022-07-07 15:56:07
updated: 2022-07-07 15:56:07
categories:
tags:
  - vue
  - JavaScript
---

1. computed 属性默认是只有 getter 属性的，也就是说我们只能获取到computed 属性的值，但是无法修改它，但是我们可以手动的设置 setter 属性，这样就可以手动赋值了

~~~js
export default {
  computed() {
    fullName: {
      set: function (val) {
        let name = val.split(" ")
        this.firstName = name[0]
        this.secondName = name[1]
      },
      get: function () {
        return this.firstName + " " + this.secondName
      }
    }
  }
}
~~~
