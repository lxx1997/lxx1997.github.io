---
title: H5基于canvas实现电子签名并生成PDF文档
date: 2020-12-14 17:15:09
tags:
    - JavaScript
    - canvas
cover: '/assets/cover/20200225A1295.jpg'
---

转载[前端大全](https://mp.weixin.qq.com/s/OTFufemlMW7XhjS2zIrHhw)

## 前言
电子签名通俗来说就是通过技术手段实现在电子文档上加载电子形式的签名，其作用类似于纸质合同上的手写签名或加盖的公章。虽然电子签名多年来合法性一直遭到质疑，但其在企业工作流审批、请柬、单据保全等场景应用广泛，最近的项目中就有这样一个手写签名并生成PDF文件的需求。

## 实现思路

使用canvas来实现手写签名的功能，然后将canvas转化为图片，贴在签名的位置；
将整个需要生成文档的dom区域使用html2canvas插件转成一张大图；
使用JsPDF插件将上述图片生成PDF文档；
对于文件内容较多的情况，需要合理选择分页位置；
生成签名
1. 在tsx中定义canvas画布
~~~html
 <canvas className={styles.canvas} ref={canvasDom} width="350" height="150" />
~~~
注意：Canvas的宽高必须要使用内联样式定义，这是因为Canvas标签有自己的默认宽高300px×150px。它内联样式定义的width和height是绘画区域（画布）实际宽度和高度，绘制的图形都是在这个上面。如果在style外链文件中定义其width和height，那么这个width和height是Canvas在浏览器中被渲染的高度和宽度。如果Canvas中没有直接定义width和height没或值不正确，就会被设置成默认值{width:300px，height:150px}。所以，如果你在style中外链文件中设置了canvas {width: 200px; height: 200px;}，却没有直接在canvas上定义画布宽高，那么此时你输出canvas.height 值依旧为150，canvas.width值依旧为300。也就是一块150×300的画布在200×200的区域渲染，因而图片会出现拉伸、变形等现象。

2. 定义签名函数
~~~js
 const writing = (
    beginX: number,
    beginY: number,
    stopX: number,
    stopY: number,
    ctx: any,
  ) => {
    ctx.beginPath();  // 开启一条新路径
    ctx.globalAlpha = 1;  // 设置图片的透明度
    ctx.lineWidth = 3;  // 设置线宽
    ctx.strokeStyle = 'red';  // 设置路径颜色
    ctx.moveTo(beginX, beginY);  // 从(beginX, beginY)这个坐标点开始画图
    ctx.lineTo(stopX, stopY);  // 定义从(beginX, beginY)到(stopX, stopY)的线条（该方法不会创建线条）
    ctx.closePath();  // 创建该条路径
    ctx.stroke();  // 实际地绘制出通过 moveTo() 和 lineTo() 方法定义的路径。默认颜色是黑色。
  };
~~~
3. 注册监听事件
~~~js
    let beginX: number, beginY: number;
    const canvas: HTMLCanvasElement = canvasDom.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    canvas.addEventListener('touchstart', function(event: any) {
      event.preventDefault(); // 阻止在canvas画布上签名的时候页面跟着滚动
      beginX = event.touches[0].clientX - this.offsetLeft; 
      beginY = event.touches[0].pageY - this.offsetTop;
    });
    canvas.addEventListener('touchmove', (event: any) => {
      event.preventDefault(); // 阻止在canvas画布上签名的时候页面跟着滚动
      event = event.touches[0];
      let stopX = event.clientX - canvas.offsetLeft;
      let stopY = event.pageY - canvas.offsetTop;
      writing(beginX, beginY, stopX, stopY, ctx);
      beginX = stopX; // 这一步很关键，需要不断更新起点，否则画出来的是射线簇
      beginY = stopY;
    });
~~~
注意：

在注册“touchstart”和“touchmove”事件时，需要阻止默认事件，否则页面会跟着手势上下滑动。
移动端的每个触摸事件对象中都包括了touches这个属性，它用于描述位于屏幕上的所有手指的一个列表，获取当前事件对象我们习惯性的使用event = event.touches[0],而在PC端则不需要这么操作。
offsetLeft值跟offsetTop值跟父级元素没关系，而是跟其上一级的定位元素(除position:static外的所有定位如fixed,relative,absolute元素)有关系。若上一级定位元素都没有除position:staice外的定位，则这个偏移量是相对于body而言的。
需要理清移动端事件对象的几个属性，⏬
![图片](/lxx1997.github.io/assets/blogImg/h5-canvas-electric-sign2pdf-2.jpg)
clientX/clientY: 触摸位置距离当前body可视区域的x,y坐标;
pageX/pageY: 对于整个页面来说，触摸位置距离body左上角的x,y坐标，包括被scrollTop和scrollLeft的值；
screenX/screenY: 触摸位置距离显示器左边和顶部的x,y距离。
所以，在获取结束点坐标的时候，如果当前页面没有出现滚动条，使用clientY和pageY计算差别不大，如果页面比较长，出现了滚动条，那么就必须要使用pageY来计算。clientX同理，但是移动端通常横向滚动的场景不多，所以用clientX来计算即可。


在签名（touchmove）这个动作过程中，我们需要不断的更新起点位置，否则画出来是这样🔽
![图片](/lxx1997.github.io/assets/blogImg/h5-canvas-electric-sign2pdf1.jpg)
图片其实这个原理和微积分很相似，线段本质上就是由无穷多个小线段组成，宏观一点来看可以把线段当成一个个长度很小的小线段首尾相连构成。所以我一直觉得编程编到最后就是考验一个人的数学能力，交并集、逻辑思维、算法等都能看到数学的身影。最后生成签名如下：图片
![图片](/lxx1997.github.io/assets/blogImg/h5-canvas-electric-sign2pdf.png)

生成PDF文档
html2canvas是一款将HTML代码转换成Canvas的插件，因此需要用一个div包裹住需要打印的内容区域，获得这个dom节点。
~~~js
  html2Canvas(dom, {
    allowTaint: true,
    width: dom.offsetWidth, //设置获取到的canvas宽度
    height: dom.offsetHeight, //设置获取到的canvas高度
    x: 0, //页面在水平方向滚动的距离
    y: 0, //页面在垂直方向滚动的距离
  })
~~~
注意：此处需要设置width和height及x,y，否则当页面内容只有一页的时候没有问题，但是若页面内容有很多页的时候，就会出现生成的图片只有一小部分有内容的现象。问题就出现在这个配置参数上，若没有设置宽高，则默认只取当前视口的内容，丢弃掉其他超出当前视口的内容。
设置打印参数：
~~~js
const print = () => {
    let dom: HTMLElement = pdfDom.current;
    html2Canvas(dom, {
      allowTaint: true,
      width: dom.offsetWidth, //设置获取到的canvas宽度
      height: dom.offsetHeight, //设置获取到的canvas高度
      x: 0, //页面在水平方向滚动的距离
      y: 0, //页面在垂直方向滚动的距离
    }).then((canvas: HTMLCanvasElement) => {
      let canvasWidth = canvas.width;
      let canvasHeight = canvas.height;
      let pageHeight = (canvasWidth / 592.28) * 841.89; // 一页A4 pdf能显示的canvas高度
      let imgWidth = 595.28; // 设置图片宽度和A4纸宽度相等
      let imgHeight = (592.28 / canvasWidth) * canvasHeight;//等比例换算成A4纸的高度
      let totalHeight = imgHeight; // 需要打印的图片总高度，初始状态和图片高度相等
      let pageData = canvas.toDataURL('image/png', 1.0);
      let PDF = new JsPDF('p', 'pt', 'a4', true);
      if (totalHeight < pageHeight) { //
        PDF.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight); // 从顶部开始打印
      } else {
        let top = 0;   // 打印初始区域
        while (totalHeight > 0) {
          PDF.addImage(pageData, 'JPEG', 0, top, imgWidth, imgHeight);  // 从图片顶部往下top位置开始打印
          totalHeight -= pageHeight;
          top -= 841.89;
          if (totalHeight > 0) {
            PDF.addPage();
          }
        }
      }
      PDF.save('test.pdf');
    });
  };
~~~
选择分页位置

按照上述步骤生成了一份PDF文档，但是当PDF页数有很多的时候，会有这样的问题
![图片](/lxx1997.github.io/assets/blogImg/h5-canvas-electric-sign2pdf3.png)
可以看到，分页的时候从这段文字这里懒腰截断了。这显然不是我们想要看到的效果，如何解决这个问题呢？🤔

PDF文档页数较少的情况
可以在开发测试的时候预先在将要分页的地方插入一个padding，就是提前预留分页位置

PDF文档页数较多
对于这种情况，笔者尝试遍历要打印的dom节点的子节点，将每一页所能打印的dom节点高度累加，若超过了页面所能承载的最大高度，则将最后一个节点增加padding，打印完毕将样式还原。这种方法因为要计算每个dom节点的高度，非常耗性能，也要求页面dom元素的颗粒度较细，否则会出现一个页面有大块空白，完全无法模拟出word生成pdf的那种效果，所以就不展开讨论了。如若有读者有比较好的解放方案，欢迎不吝赐教，感谢~❤️