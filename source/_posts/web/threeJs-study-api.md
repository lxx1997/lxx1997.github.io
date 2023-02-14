---
title: threeJs 学习之路 - API 及 参数传递
date: 2021-08-15 09:53:24
tags:
cover: /assets/blogCover/MIKU花(4)_78753717_p1.png
---

* THREE.Scene() 创建场景对象
  方法
  * add 添加物体，会被添加到坐标为 (0, 0, 0)的位置上

* THREE.PerspectiveCamera()

  这个对象是 threeJs 中相机的其中一种 *透视摄像机*
  参数有四个
  * **视野角度** 表示在显示器上看到的场景的范围，值是一个角度（值会 mod 360）
  * **长宽比** 长宽比的值会影响我们渲染物体的是否是正常的还是拉伸的，压扁的
  * **远剪切面** 
  * **近剪切面** 物体所在的位置比摄像机的远剪切面远或者所在位置比近剪切面近的时候，该物体超出的部分将不会被渲染到场景中，根据我们渲染的物体的z轴的值和摄像机的z轴位置来决定的

  
* THREE.WebGLRenderer()

  创建一个渲染器实例
  **属性**
  * domElement 渲染器生成的dom元素，通过 appendChild 方法插入到页面中
  * setSize(width, height, updateStyle) 第二个参数决定是否以较低的分辨率来渲染
  * render(scene, camera)  渲染场景和摄像机
