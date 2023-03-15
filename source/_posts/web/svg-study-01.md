---
title: 矢量图形 SVG 学习之路 --- 基础版
date: 2020-07-29 14:33:53
updated: 2020-07-29 14:33:53
tags:
    - svg
cover: /assets/blogCover/MIKU花(4)_78753717_p1.png
---

  SVG意为可缩放矢量图形（Scalable Vector Graphics）
  SVG使用XML格式定义图像

  **如何定义一个SVG图像**

  ~~~xml
    <?xml version="1.0" standalone="no"?>

    <svg width="100%" height="100%" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <path d="M200 200
      C153 334 151 334 151 334
      C151 339 153 344 156 344
      C164 344 171 339 171 334
      C171 322 164 314 156 314
      C142 314 131 322 131 334
      C131 350 142 364 156 364
      C175 364 191 350 191 334
      C191 311 175 294 156 294
      C131 294 111 311 111 334
      C111 361 131 384 156 384
      C186 384 211 361 211 334
      C211 300 186 274 156 274" style="fill:white;stroke:red;stroke-width:2;"></path>
    </svg>
  ~~~

#### 在HTML页面中使用SVG

  * 使用embed标签

  <embed> 标签被所有主流的浏览器支持，并允许使用脚本。

  当在 HTML 页面中嵌入 SVG 时使用 <embed> 标签是 Adobe SVG Viewer 推荐的方法！然而，如果需要创建合法的 XHTML，就不能使用 <embed>。任何 HTML 规范中都没有 <embed> 标签。

  ~~~html
    <embed src="rect.svg" width="300" height="100" 
    type="image/svg+xml"
    pluginspage="http://www.adobe.com/svg/viewer/install/" />
    <!-- pluginspage 属性指向下载插件的 URL。 -->
  ~~~

  * 使用object标签

  <object> 标签是 HTML 4 的标准标签，被所有较新的浏览器支持。它的缺点是不允许使用脚本。

  假如您安装了最新版本的 Adobe SVG Viewer，那么当使用 <object> 标签时 SVG 文件无法工作（至少不能在 IE 中工作）！

  ~~~html
  <object data="rect.svg" width="300" height="100" 
    type="image/svg+xml"
    codebase="http://www.adobe.com/svg/viewer/install/" />
  <!-- codebase 属性指向下载插件的 URL。 -->
  ~~~

  * 使用iframe标签

  <iframe> 标签可工作在大部分的浏览器中

  ~~~html
    <iframe src="rect.svg" width="300" height="100"></iframe>
  ~~~

  #### SVG图像图形

  * svg矩形 <rect>
  * svg圆形 <circle>
  * svg椭圆 <ellipse>
  * svg线 <line>
  * svg折线 <polyline>
  * svg多边形 <polygon>
  * svg路径 <path>
  * style 矩形样式
      * fill 定义矩形的填充颜色
      * stroke-width 矩形边框的宽度
      * stroke 矩形边框的颜色
      * fill-opacity 定义填充颜色透明度 合法范围 0 - 1
      * stroke-opacity 定义笔触颜色透明度 合法范围 0 - 1
    
  **SVG矩形**

    rect标签可以用来创建矩形，以及矩形的变种

    ~~~xml
      <?xml version="1.0" standalone="no"?>
      <svg width="100%" height="100%" version="1.1"
      xmlns="http://www.w3.org/2000/svg">
        <rect width="300" height="100"
        style="fill:rgb(0,0,255);stroke-width:1;
        stroke:rgb(0,0,0)"/>
      </svg>
    ~~~

    * width 矩形的高度和宽度
    * height 矩形的宽度
    * x 定义矩形的左侧位置
    * y 定义矩形的右侧位置
    * rx ry 属性可使矩形产生圆角

  **SVG圆形**

    circle 标签可用来创建一个圆

    ~~~xml
      <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
        <circle cx="100" cy="50" r="40" stroke="black"
        stroke-width="2" fill="red"/>
      </svg>
    ~~~

    * cx, cy 定义圆点的x和y坐标，如果省略cx和cy，圆的中心会被设置为（0,0）
    * r 定义圆的半径

  **SVG椭圆**

    ellipse 标签用来创建一个椭圆

    椭圆有不同的x和y半径，而圆的x和y的半径是相同的

    ~~~xml
      <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
        <ellipse cx="240" cy="100" rx="220" ry="30" style="fill:purple"/>
        <ellipse cx="220" cy="70" rx="190" ry="20" style="fill:lime"/>
        <ellipse cx="210" cy="45" rx="170" ry="15" style="fill:yellow"/>
      </svg>
    ~~~

    * cx 定义椭圆中心的x坐标
    * cy 定义椭圆中心的y坐标
    * rx 定义椭圆水平半径
    * ry 定义椭圆垂直半径

  **SVG直线**

    line 元素用来创建一个直线

    ~~~xml
      <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
        <line x1="0" y1="0" x2="200" y2="200"
        style="stroke:rgb(255,0,0);stroke-width:2"/>
      </svg>
    ~~~

    * x1 在x轴定义线条开始的地方
    * y1 在y轴定义线条开始的地方
    * x2 在x轴定义线条结束的地方
    * y2 在y轴定义线条结束的地方

  **SVG多边形**

    polyline 用来创建含有不少于三个边的图形，多边形是由直线组成的，其形状是封闭的

    ~~~xml
      <svg  height="210" width="500">
        <polygon points="200,10 250,190 160,210"
        style="fill:lime;stroke:purple;stroke-width:1"/>
      </svg>
    ~~~

    points 属性定义多边形的每个角的x和y坐标

    * fill-rule
      SVG图片填充规则通过fill-rule来指定

      fill-rule 用于指定使用哪一种算法去判断画布上的某区域是否属于该图形内部

      * `nonzero` 字面意思上是非零， 按照这个规则 要判断一个点是否在图形内，则从该点做任意方向的一条射线，然后检测射线与图形路径的交点情况，从零开始计数，如果从左向右穿过射线则计数加一，从右到左穿过射线则计数减1 如果结果为0则认为点在图形外部，否则认为在内部
      * `evenodd` 字面意思是“奇偶”。按该规则，要判断一个点是否在图形内，从该点作任意方向的一条射线，然后检测射线与图形路径的交点的数量。如果结果是奇数则认为点在内部，是偶数则认为点在外部。
  
  **SVG曲线**

    polyline 用于创建任何只有直线的形状

    ~~~xml
    <!-- 折线型曲线 -->
      <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
        <polyline points="20,20 40,25 60,40 80,120 120,140 200,180"
        style="fill:none;stroke:black;stroke-width:3" />
      </svg>
    <!-- 楼梯型曲线 -->
      <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
        <polyline points="0,40 40,40 40,80 80,80 80,120 120,120 120,160" style="fill:white;stroke:red;stroke-width:4" />
      </svg>
    ~~~

  **SVG路径**

    path 元素用于定义一个路径

    * M = moveto  移动到
    * L = lineto  线路到
    * H = horizontal lineto  水平线到
    * V = vertical lineto  垂直线到
    * C = curveto   曲线
    * S = smooth curveto  平滑曲线
    * Q = quadratic Bézier curve  二次Bézier曲线
    * T = smooth quadratic Bézier curveto  光滑二次Bézier曲线
    * A = elliptical Arc  椭圆弧
    * Z = closepath  闭合路径

    以上所有命令均允许小写字母。大写表示绝对定位，小写表示相对定位

    ~~~xml
      <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
        <path id="lineAB" d="M 100 350 l 150 -300" stroke="red"
        stroke-width="3" fill="none" />
        <path id="lineBC" d="M 250 50 l 150 300" stroke="red"
        stroke-width="3" fill="none" />
        <path d="M 175 200 l 150 0" stroke="green" stroke-width="3"
        fill="none" />
        <path d="M 100 350 q 150 -300 300 0" stroke="blue"
        stroke-width="5" fill="none" />
        <!-- Mark relevant points -->
        <g stroke="black" stroke-width="3" fill="black">
          <circle id="pointA" cx="100" cy="350" r="3" />
          <circle id="pointB" cx="250" cy="50" r="3" />
          <circle id="pointC" cx="400" cy="350" r="3" />
        </g>
        <!-- Label the points -->
        <g font-size="30" font="sans-serif" fill="black" stroke="none"
        text-anchor="middle">
          <text x="100" y="350" dx="-30">A</text>
          <text x="250" y="50" dy="-10">B</text>
          <text x="400" y="350" dx="30">C</text>
        </g>
      </svg>
    ~~~

    **SVG文本**

    text 用于定义文本

    ~~~xml
      <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
        <text x="0" y="15" fill="red">I love SVG</text>
      </svg>
    ~~~

    * x 表示x轴的起始点
    * y 表示y轴的起始点
    * transform 动画

#### SVG 样式设置

  **Stroke 属性**

  * stroke stroke 属性定义了一条线，文本或元素轮廓颜色

  * stroke-width 属性定义了线 文本或者元素轮廓的厚度

  * stroke-linecap 属性定义了不同类型的开放路径的终结  可选参数  butt,round,square

  ~~~xml
    <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
      <g fill="none" stroke="black" stroke-width="6">
        <path stroke-linecap="butt" d="M5 20 l215 0" />
        <path stroke-linecap="round" d="M5 40 l215 0" />
        <path stroke-linecap="square" d="M5 60 l215 0" />
      </g>
    </svg>
  ~~~

  * stroke-dasharray 用于创建虚线 
  
  ~~~xml
    <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
      <g fill="none" stroke="black" stroke-width="4">
        <path stroke-dasharray="5,5" d="M5 20 l215 0" />
        <path stroke-dasharray="10,10" d="M5 40 l215 0" />
        <path stroke-dasharray="20,10,5,5,5,10" d="M5 60 l215 0" />
      </g>
    </svg>
    <!-- 注：stroke-dasharray: [实，虚，实，虚，实，虚，实，虚 ··· ···] -->
  ~~~