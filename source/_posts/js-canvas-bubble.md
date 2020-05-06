---
title: 使用canvas绘制碰撞球
date: 2020-05-06 10:48:06
tags:
      - canvas
      - javascript
---

**实现步骤**
* 绘制canvas，并将canvas的宽高设置为品目的宽高
    *由于canvas是行内元素，行内元素一般都有自己的行高等，所以一般会出现横向滚动条，此时需要将canvas设置为块级元素或者行内块状元素*
* 设置canvas的宽高跟随屏幕大小的变化而变化，使用window.onresize监听屏幕变化
* 设置画布属性(canvas.getContext() 2d or 3d)
* 填充颜色 (canvas.fillStyle())
* 首先绘制出一个圆形，设置圆心位置，半径，和园的角度
    *canvas.arc(x,y,r,deg1,deg2,true/false) canvas.fillStyle() 填充颜色*
* 将绘制圆形的方法进行封装成一个类，通过调用这个类来循环生成圆形
* 绘制圆形的运行轨迹，在封装好的类的基础上添加一个移动方法，然后设置定时器，每隔固定时间清除canvas并重新绘制
* 调整圆形运行轨迹，当圆形触边的时候，使圆形发生反弹
    *触及x轴，y的移动方向相反，触及y轴，x轴的移动方向相反*

<!--- more --->

**实现代码**
~~~html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>canvas-球体运动</title>
    <style>
        * {
            margin: 0;
            padding: 0;
        }
        #canvas {
            display: block;
        }
    </style>
</head>
<body>
    <canvas id="canvas"></canvas>
    <script>
        const canvas = document.querySelector('#canvas')
        const w = window.innerWidth
        const h = window.innerHeight
        canvas.width = w
        canvas.height = h
        const ct = canvas.getContext("2d")
        ct.fillStyle="white"
        ct.fillRect(0,0,w,h)
        let bubbleArray = []
        class Bubble {
            constructor() {
                this.init()
            }
            init() {
                this.r = Math.random() * 5 + 3
                this.x = Math.random() * w 
                this.y = Math.random() * h
                this.xt = Math.random() * 2 < 1 ? -Math.random() * 2 - 1 : Math.random() * 2 + 1 
                this.yt = Math.random() * 2 < 1 ? -Math.random() * 2 - 1 : Math.random() * 2 + 1
                this.color = `rgb(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255})`
            }
            drawer() {
                ct.beginPath()
                ct.arc(this.x,this.y,this.r,0, Math.PI*2)
                ct.fillStyle=this.color
                ct.fill()
            }
            move() {
                if(this.x+this.r >= w || this.x - this.r < 0) {
                    this.xt = -this.xt
                }
                if(this.y+this.r >= h || this.y - this.r < 0) {
                    this.yt = -this.yt
                }
                this.x += this.xt
                this.y += this.yt
                this.drawer()
            }
        }
        for (let i = 0; i < 500; i++) {
            const buble = new Bubble()
            buble.init()
            buble.drawer()
            bubbleArray.push(buble)
        }
        setInterval(() => {
            ct.clearRect(0,0,w,h)
            for (let i = 0; i < bubbleArray.length; i++) {
                bubbleArray[i].move()
            } 
        },10)
    </script>
</body>
</html>
~~~
