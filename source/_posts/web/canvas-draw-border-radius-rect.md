---
title: CANVAS 绘图小技巧 - 绘制一个带有圆角的矩形
cover: /assets/blogCover/1578912686790.jpg
date: 2023-01-11 17:59:18
updated: 2023-01-11 17:59:18
categories:
  - [web]
  - [canvas]
tags:
  - web
  - canvas
---

在工作中遇到了这样的一个问题，需要在下载的图片添加一些文字描述，这些文字有一个带有圆角的矩形背景。

主要实现方式是使用 `Canvas` 的 `lineTo` 方法和 `arcTo` 方法通过线条绘制出一个圆角矩形

#### moveTo(x, y)

`moveTo` 主要是将一个新的子路径的起始点移动到 (x, y) 坐标的方法。

它代表我们绘制的线条的起点

#### lineTo(x, y)

`lineTo` 主要是从当前绘制线条终点，连接到 (x, y) 坐标，绘制的是一条直线

#### arcTo(x1, y1, x2, y2, r)

`arcTo` 则是用来绘制圆弧的，将会根据 (x1, y1), (x2, y2) 点的相对位置以点 (x1, y1) 偏移半径 R 的距离画一个圆弧，这个圆弧与 (x1, y1)，(x2, y2) 的连线相切，并从切点连线到(x2,y2),

接下来上代码，可以画出一个 左上角和右下角都是圆角的矩形

~~~js
  const drawRoundRect = (ctx, x, y, w, h, r, color) => {
    var min_size = Math.min(w, h);
    if (r > min_size / 2) r = min_size / 2;
    // 开始绘制
    ctx.save()
    // 开始绘制
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w, y)
    ctx.lineTo(x + w, y + h - r)
    ctx.arcTo(x + w, y + h, x + w - r, y + h, r)
    ctx.lineTo(x + w - r, y + h)
    ctx.lineTo(x, y + h)
    ctx.arcTo(x, y, x + w, y, r)
    ctx.closePath();
    ctx.fillStyle = color
    ctx.fill()
    ctx.restore()
  }
  let canvas = document.getElementById("canvas")
  let ctx = canvas.getContext("2d")
  drawRoundRect(ctx, 20, 20, 50, 50, 8, "rgba(0,0,0,0.3)")
~~~

我们只需要传入canvas 的 context 属性以及起始点坐标，以及矩形宽高和圆角半径
