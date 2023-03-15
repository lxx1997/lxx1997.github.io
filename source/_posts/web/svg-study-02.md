---
title: 矢量图形 SVG 学习之路 --- 进阶版
date: 2020-07-30 14:42:26
updated: 2020-07-30 14:42:26
tags:
    - svg
cover: /assets/blogCover/MIKU花(4)_78753717_p1.png
---

#### SVG 滤镜

  SVG可用的滤镜有以下几种

  * feBlend - 与图像相结合的滤镜
  * feColorMatrix - 用于彩色滤光片转换
  * feComponentTransfer
  * feComposite
  * feConvolveMatrix
  * feDiffuseLighting
  * feDisplacementMap
  * feFlood
  * feGaussianBlur
  * feImage
  * feMerge
  * feMorphology
  * feOffset - 过滤阴影
  * feSpecularLighting
  * feTile
  * feTurbulence
  * feDistantLight - 用于照明过滤
  * fePointLight - 用于照明过滤
  * feSpotLight - 用于照明过滤

  您可以在每个 SVG 元素上使用多个滤镜！
  

####  SVG 模糊效果

  **<defs>和<filter>**

  所有互联网的SVG滤镜定义在<defs>元素中。<defs>元素定义短并含有特殊元素（如滤镜）定义。
  <filter>标签用来定义SVG滤镜。<filter>标签使用必需的id属性来定义向图形应用哪个滤镜？

  **<feGaussianBlur>**

  <feGaussianBlur>用于创建模糊效果

  ~~~js
    <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
      <defs>
        <filter id="f1" x="0" y="0">
          <feGaussianBlur in="SourceGraphic" stdDeviation="15" />
        </filter>
      </defs>
      <rect width="90" height="90" stroke="green" stroke-width="3"
      fill="yellow" filter="url(#f1)" />
    </svg>
  ~~~

  * filter 元素`id`属性属性定义了一个滤镜的唯一名称
  * <feGaussianBlur> 元素定义模糊效果
  * `in="SourceGraphic"` 这个部分定义了由整个图像创建效果
  * `stdDeviation` 属性定义模糊量
  * <rect>元素的滤镜属性用来把元素链接到`"f1"`滤镜

#### SVG 阴影

  **<defs>和<filter>**

  所有互联网的SVG滤镜定义在<defs>元素中。<defs>元素定义短并含有特殊元素（如滤镜）定义。
  <filter>标签用来定义SVG滤镜。<filter>标签使用必需的id属性来定义向图形应用哪个滤镜？ 

  **feOffset**

  <feOffset>元素是用于创建阴影效果。我们的想法是采取一个SVG图形（图像或元素）并移动它在xy平面上一点儿。
  第一个例子偏移一个矩形（带<feOffset>），然后混合偏移图像顶部（含<feBlend>）

  ~~~js
    <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
      <defs>
        <filter id="f1" x="0" y="0" width="200%" height="200%">
          <feOffset result="offOut" in="SourceGraphic" dx="20" dy="20" />
          <feBlend in="SourceGraphic" in2="offOut" mode="normal" />
        </filter>
      </defs>
      <rect width="90" height="90" stroke="green" stroke-width="3"
      fill="yellow" filter="url(#f1)" />
    </svg>
  ~~~

  feColorMatrix 的 matrix 是一个 4*5 的矩阵。前面 4 列是颜色通道的比例系数，最后一列是常量偏移。

  上面公式中的 rr 表示 red to red 系数，以此类推。c1~c4 表示常量偏移。

  第一个 4*5 矩阵为变换矩阵，第二个单列矩阵为待变换对象的像素值。右侧单列矩阵为矩阵 1 和 2 的点积结果。

  这个变换矩阵看起来比较复杂，在实践上常使用一个简化的对角矩阵，即除了 rr/gg/bb/aa 取值非零外，其余行列取值为 0，这就退化成了简单的各颜色通道的独立调整。

  `feColorMatrix`的语法:

  <filter id="f1" x="0%" y="0%" width="100%" height="100%">  
    <feColorMatrix   
      result="original" id="c1" type="matrix"   
      values="1 0 0 0 0    
              0 1 0 0 0   
              0 0 1 0 0   
              0 0 0 1 0" />  
  </filter>
  上述`feColorMatrix`过滤器的类型值为matrix，除此之外，还有saturate（饱和度）和hueRotate（色相旋转），取值比较简单，这里不做说明。

  显然当变换矩阵为单位对角矩阵时，变换结果和原值相等。

#### SVG渐变

  渐变是从一种颜色到另一种颜色的平滑过渡，另外把多个元素的过渡应用到同一个元素上

  渐变主要有两种类型

  * linear
  * Redial

  **SVG线性渐变**

    `linearGradient` 泳衣定义线性渐变

    `linearGradient`必须套嵌在`defs`标签内部， 线性渐变可定义水平、垂直、或角渐变

    * 当y1和y2相等 x1和x2不同时，可创建水平渐变
    * 当x1和x2相等 y1和y2不同时，可创建垂直渐变
    * 当x1和x2不同 y1和y2不同时，可创建角形渐变

    ~~~xml
      <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:rgb(255,255,0);stop-opacity:1" />
            <stop offset="100%" style="stop-color:rgb(255,0,0);stop-opacity:1" />
          </linearGradient>
        </defs>
        <ellipse cx="200" cy="70" rx="85" ry="55" fill="url(#grad1)" />
      </svg>
    ~~~

    * `linearGradient` 标签的id属性可为渐变定义一个唯一的名称
    * `linearGradient` 标签的x1，y1，x2，y2属性自定义渐变开始和结束位置
    * 渐变颜色范围可由两种或多种颜色组成，每种颜色通过一个stop标签来规定，offset属性用来定义渐变开始和结束位置
    * 填充属性吧ellipse元素连接到次渐变
    * `text` 元素用来添加一个文本

  **SVG放射性渐变**

    `redialGradient` 元素用于定义放射性渐变

    `redialGradient` 标签必须嵌套在defs的内部，defs标签是definitions的缩写，他可对诸如渐变之类的特殊元素进行定义

    ~~~xml
      <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
        <defs>
          <radialGradient id="grad1" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" style="stop-color:rgb(255,255,255);
            stop-opacity:0" />
            <stop offset="100%" style="stop-color:rgb(0,0,255);stop-opacity:1" />
          </radialGradient>
        </defs>
        <ellipse cx="200" cy="70" rx="85" ry="55" fill="url(#grad1)" />
      </svg>
    ~~~

    * `redialGradient` 标签的id属性可为渐变定义一个唯一的名称
    * cx、cy和r属性定义最外层圆，fx和fy定义最内层圆
    * 渐变颜色返回可有两个或两个以上的颜色组成，每种颜色用一个`stop`标签指定，offset标签用于定义渐变色开始和结束的位置
    * 填充属性把ellipse元素连接到渐变