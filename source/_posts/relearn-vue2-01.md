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

2. v-for 和 v-if 为什么不推介一起使用

这个是因为 v-for 和 v-if 的优先级问题，vue 会先进行 v-for 循环渲染元素，最后在进行 v-if 控制是否显示元素，会造成无谓的资源浪费

可以采用 v-show 代替 v-if 或者使用计算属性来代替 v-if， 只渲染我们想渲染的元素

3. key attribute 用来表示这个元素是完全独立的，和其他元素不同，在日常操作中可以用来强制刷新元素内容，只需要修改元素的key，就会重新去渲染元素

我之前用过 v-if 和 $nextTick 来强制重新渲染元素内容，很明显使用上述方法是一种很方便的操作

4. v-for 可以使用 `in` 或者 `of` 来作为分隔符

5. v-for 遍历对象时 `v-for="(value, name, index) in obj"` 三个值 分别为 值，键，和 索引

6. vue 中可以使用 template 标签，该标签类似 react 中的`<></>`和`React.Fragment`,在实际渲染中并不会被渲染出来