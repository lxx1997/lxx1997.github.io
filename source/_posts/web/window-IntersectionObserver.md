---
title: window.IntersectionObserver
date: 2023-02-14 10:54:06
updated: 2023-02-14 10:55:18
tags:
    - JavaScript
cover: /assets/blogCover/天使なミクさん_79993307.png
---

## window.IntersectionObserver

IntersectionObserver 提供了一种异步观察观察目标元素与其祖先元素或者顶级文档交叉状态的方法，即目标元素元素出现或者隐藏的时候就会触发

#### 使用

~~~js
    var observe = new IntersectionObserver(callback， options)
~~~

* callback 

    回调函数，当我们监听的元素触发到阈值的时候会触发回调函数，callback 会有两个参数 entries 和 observer， entries 是一个数组返回触发监听的目标元素

* options

    * root

        root 属性是目标元素的祖先元素，如果未传入值则默认使用顶级文档视窗

    * rootMarign

        计算交叉时添加到root边界和的矩形偏移量，所有偏移量均可用像素或者百分比
        
        主要作用是缩小或者扩大根元素的判定范围

    * thresholds

        一个包含阈值的列表，按照升序排列，列表中每个阈值都是监听对象的交叉区域与边界区域的比率，当监听对象的任何阈值被越过时，都会生成一个通知，如果未传入值，则默认为0

        例如 [0, 0.25, 0.5, 0.75, 1]表示当目标对应比例在目标元素可见时，触发回调函数

#### 方法

* disconnect

    停止监听工作

* observe

    添加监听目标元素并进行监听

* takeRecords

    返回所有观察目标的 intersectionObserverEntry 对象数组

* unobserve

    停止监听特定目标元素


#### IntersectionObserverEntry

~~~js
{
    time: 3893.92, // 可见性发生变化的时间，是一个高精度时间戳，单位为毫秒
    target: element // 被观察的目标元素，是一个 DOM 节点对象
    rootBounds: ClientRect { // 根元素的矩形区域的信息，getBoundingClientRect()方法的返回值，如果没有根元素（即直接相对于视口滚动），则返回null
        bottom: 920,
        height: 1024,
        left: 0,
        right: 1024,
        top: 0,
        width: 920
    },
    boundingClientRect: ClientRect { // 目标元素的矩形区域的信息
        // ...
    },
    intersectionRect: ClientRect { // 目标元素与视口（或根元素）的交叉区域的信息
        // ...
    },
    intersectionRatio: 0.54, // 目标元素的可见比例，即intersectionRect占boundingClientRect的比例，完全可见时为1，完全不可见时小于等于0
}
~~~

#### 使用 IntersectionObserver

~~~js
// 创建 IntersectionObserver 实例
var observe = new IntersectionObserver((entries) => {
    console.log(entries)
}, {
    root: document.getElementById("app"),
    rootMargin: "0px 0px 0px 0px",
    thresholds: [0, 0.25, 0.5, 0.75, 1]
})

// 添加目标对象
observe.observe(element)

// 停止监听
observe.unobserve(element)

// 断开链接
observe.disconnect()
~~~

#### 我们可以解决什么问题

* 图片或者资源懒加载问题，使用 IntersectionObserver 可以监听到图片元素是否滚动到页面上，从而可以实现预加载和懒加载

* 元素曝光统计，我们在实际需求中可能需要统计或者计算元素是否曝光在页面上，然后向后台发送统计事件，这样可以方便产品对页面内容进行调整

* 其他计算，比如我们可能需要判断某个元素是否出现在页面上，然后再进行特殊的计算，如果这些计算数量较少，我们可以不做任何关注，但是如果页面上存在大量的这样的计算，我们需要实现按需计算，这个时候就可以使用 IntersectionObserver 监听元素是否出现在页面，来进行计算，从而减少浏览器内存消耗，提高用户体验




