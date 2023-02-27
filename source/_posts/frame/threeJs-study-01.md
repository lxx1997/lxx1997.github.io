---
title: threeJs 学习之路 - 创建画布及绘制图形
date: 2021-08-15 09:38:18
tags:
    - threeJs
    - webgl
    - JavaScript
cover: /assets/blogCover/MIKU花(4)_78753717_p1.png
---

> **因为threeJs 版本在不断更新，所以本文可能部分 api 被替换，如果出现问题，请百度或者查找官方文档对应api**


## 初始化
#### 引入

引入的话可以采用 npm 引入 或者直接通过 CDN 方式引入
* npm 引入
  ~~~js
    npm install three

    // 引入
    const THREE = require("three")

    import THREE from "three"
  ~~~

* CDN 方式引入

  [CDN地址](https://www.bootcdn.cn/three.js/)

  ~~~html
    <script src="https://cdn.bootcdn.net/ajax/libs/three.js/r128/three.js"></script>
  ~~~

#### 创建画布

  ~~~js
    // 创建场景
    const scene = new THREE.Scene()
    // 创建一个摄像机
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth/window.innerHeight, 1, 1000)
    // 实例化渲染器
    const renderer = new THREE.WebGLRenderer()
    // 设置渲染大小
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.render(scene, camera)
    document.body.appendChild(renderer.domElement)
  ~~~

  编写完上述代码后应该会出现一个黑色区域，这个就是threeJs创建的 canvas 画布

#### 绘制元素

###### 绘制一个正方体

  创建一个立方体 需要一个 `BoxGeometry` 对象，这个对象包含了立方体所有的定点(vertices)和面(faces)

  然后对于这个立方体给一个材质，这里我们采用 `MeshBasicMaterial` 方法，并设置一个默认颜色

  接下来需要一个网格（Mesh），这个网格包含了 几何体及其材质的对象，然后通过 `Scene` 中的 `add` 方法添加到页面上，如果与摄像机重叠，还需要移动摄像机的位置

  最后通过 `WebGLRenderer` 的 render 方法渲染

  如果想要动起来，这个时候需要我们更改摄像机或者立方体的位置,并通过定时器函数，重新渲染

  ~~~js
    var geometry = new THREE.BoxGeometry()
    var material = new THREE.MeshBasicMaterial({color: 0x00ff00})
    let cube = new THREE.Mesh(geometry, material)
    camera.position.z = 5
    // scene 为之前创建的 THREE.Scene() 实例
    scene.add(cube)
    // renderer.render(scene, camera)
    function render() {
      requestAnimationFrame(render)
      // 立方体旋转  旋转速度
      cube.rotation.x += 0.1
      cube.rotation.y += 0.1

      // 修改摄像机的位置
      // camera.position.set(x, y, z) 
      renderer.render(scene, camera)
    }
    render()
  ~~~

###### 绘制线条

  对于绘制线条 我们可以选择的材质只有 `LineBasicMaterial` 和 `LineDashedMaterial`

  定义好材质之后，我们需要一个带有定点的 `Geometry` 或者 `BufferGeometry`

  然后通过 `THREE.Vector3(x, y, z)` 定义线条的顶点，线条是画在连续的顶点之间的
  最后 通过 `THREE.Line(geometry, material)` 将材质和顶点联系起来

  ~~~js
    // LineDashedMaterial 创建 虚线性的 线条
    // LineBasicMaterial  创建 实线线条
    const material = new THREE.LineDashedMaterial({color: 0x0000ff})
    const points = []
    // 创建 3d 线条的各个顶点
    points.push(new THREE.Vector3(-10, 0, 20))
    points.push(new THREE.Vector3(0, 10, 20))
    points.push(new THREE.Vector3(10, 0, 20))
    // 通过 setFromPoints 设置线条的顶点
    const geometry = new THREE.BufferGeometry().setFromPoints(points)
    // 创建线条治理
    const line = new THREE.Line(geometry, material)
  ~~~

  
