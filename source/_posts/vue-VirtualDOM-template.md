---
title: 01 - Vue源码解读-数据驱动-dom生成
date: 2020-12-16 10:54:22
categories:
    - Vue
tags:
    - Vue
    - JavaScript
cover: '/assets/cover/20200225A1295.jpg'
---

本片文章根据bilibili [vue源码分析](https://www.bilibili.com/video/BV1LE411e7HE) 视频练习及知识点记录

## 模仿vue原理 实现简单的DOM模板替换

~~~html
  <div id="app">
    <div>
      <div>
        {{name}} is {{behavior}}
      </div>
    </div>
    <p>人员：{{name}}</p>
    <p>行为：{{behavior}}</p>
  </div>
~~~
~~~js
  let data = {
    name: 'SoulReader',
    behavior: 'writing'
  }
  /*
    * 惰性匹配 .+? 匹配所有包含在{{}}里面的元素分组
    * 贪婪匹配 .+ 匹配包含在{{}}里面的元素 会忽略中间的{{}}部分
  */
  const curlyRE = /\{\{(.+?)\}\}/g

  function compiler(template, data) {
    const tempChilen = template.childNodes
    const length = tempChilen.length
    for(let i = 0; i < length; i++) {
      const nodeType = tempChilen[i].nodeType
      /* 
        * nodeType
        * 1 代表元素节点
        * 2 代表文本节点
      */
      if(nodeType === 3) { // 代表是文本节点
        /*
          * nodeValue 只有文本节点才有，nodeName只有元素节点才有
        */
        tempChilen[i].nodeValue = tempChilen[i].nodeValue.replace(curlyRE, (_, g) => {
          /* 
            * 第一个参数是正则表达式匹配到的东西
            * 第二个参数及以后是第 n-1 个分组
          */
          return data[g.trim()]
        });
      } else if(nodeType === 1) {
        compiler(tempChilen[i], data)
      }
    }
  }
  const node = document.getElementById('app')
  console.log(node)
  /*
    * 不能直接用获取到的 node 因为 DOM 是引用类型
    * 需要利用 DOM 元素自带的 cloneNode 方法复制出一个新的node节点
    * 参数传 true 表示复制当前节点的所有子孙节点，否则只复制当前节点 
  */
  const copyNode = node.cloneNode(true)
  compiler(copyNode, data)
  console.log(copyNode)
  /*
    * 调用 DOM 元素自带的 replaceChild( newNode, oldNode) 替换子节点方法
  */
  app.parentNode.replaceChild(copyNode, node)
~~~

> **模板**   要求一直在内存中 *不会发生变化*
> **数据**   数据发生变化后，会引起 DOM 的变化
> **DOM**    由模板和数据生成的
> **页面**   由 DOM 产生

对 DOM 渲染方法进行封装

~~~html
  <div id="app">
    <div>
      <div>
        {{name}} {{behavior}}
      </div>
    </div>
    <p>人员：{{name}}</p>
    <p>行为：{{behavior}}</p>
  </div>
~~~
~~~js
  /*
    * Vue源码习惯
    * 1 内部的数据使用 _ 开头
    * 2 只读数据用 $ 开头
  */
  function LikeVue(options) {
    this._el = options.el
    this._data =  options.data
    this.$el = this._templateDOM = document.querySelector(this._el)
    this.$parent =  this._templateDOM.parentNode
    this.render()
  }
  function compiler(template, data) {
    const tempChilen = template.childNodes
    const length = tempChilen.length
    for(let i = 0; i < length; i++) {
      const nodeType = tempChilen[i].nodeType
      if(nodeType === 3) { // 代表是文本节点
        /*
          * nodeValue 只有文本节点才有，nodeName只有元素节点才有
        */
        tempChilen[i].nodeValue = tempChilen[i].nodeValue.replace(curlyRE, (_, g) => {
          /* 
            * 第一个参数是正则表达式匹配到的东西
            * 第二个参数及以后是第 n-1 个分组
          */
          return data[g.trim()]
        });
      } else if(nodeType === 1) {
        compiler(tempChilen[i], data)
      }
    }
  }
  // 渲染
  LikeVue.prototype.render = function() {
    this.compiler()
  }
  // 编译
  LikeVue.prototype.compiler = function() {
    let template = document.querySelector(this._el)
    compiler(template, this._data)
    this.update(template)
  }
  // 更新DOM
  LikeVue.prototype.update = function(template) {
    this.$parent.replaceChild(template, document.querySelector(this._el))
  }
  const options = {
    el: '#app',
    data: {
      name: '优·库里伍德·海尔赛兹',
      behavior: '吃橘子'
    }
  }
  const curlyRE = /\{\{(.+?)\}\}/g
  let Vue = new LikeVue(options)
~~~

对函数进行改造，使其能够转换DOM中多层嵌套的对象，例如`other.behavior.name`

~~~js
  // 修改data对象里面的属性为多层嵌套
  data: {
    name: '优·库里伍德·海尔赛兹',
    behavior: '吃橘子',
    other: {
      name: '相川步',
      behavior: {
        name: '魔装少女',
        time: '12min'
      }
    }
  }
  // 新增一个函数用来处理模板中多层嵌套的对象
  function splitAttribute(data, g) {
    let res = data
    // 1.
    // g.split('.').map(item => {
    // 当对一个变量赋值对象时，是对象的引用，变量中的某个值发生变化，对象中对应的值也会发生变化
    // 但是给变量重新赋值对象，并不会造成原先对象的值发生变化，因为此时变量的引用已经发生变化，不在指向源对象
    //   res = res[item]
    // })

    //2.
    let paths = g.split('.')
    let prop
    while(prop = paths.shift()) {
      res = res[prop]
    }
    return res
  }
  // 修改正则表达式替换函数的回调函数的返回值
  tempChilen[i].nodeValue = tempChilen[i].nodeValue.replace(curlyRE, (_, g) => {
    return splitAttribute(data, g.trim())
  });
~~~

**函数柯里化**

  目的是为了缓存一些内容，减少解析
  * 柯里化: 一个函数原本有多个参数，传入一个参数，生成一个新函数，由新函数来接收剩余的参数，运行得到结果
  * 偏函数: 一个函数原本有多个参数，传入一部分参数，生成一个新函数，由新函数来接收剩余的参数，运行得到结果
  * 高阶函数: 一个函数，参数是一个函数，该函数对参数函数进行加工，得到加工后的函数
~~~js
  function createSplitAttribute(g) {
    let paths = g.split('.')
    return function splitAttribute(data) {
      let res = data
      // g.split('.').map(item => {
      //   res = res[item]
      // })
      //2.
      let prop
      while(prop = paths.shift()) {
        // 当对一个变量赋值对象时，是对象的引用，变量中的某个值发生变化，对象中对应的值也会发生变化
        // 但是给变量重新赋值对象，并不会造成原先对象的值发生变化，因为此时变量的引用已经发生变化，不在指向源对象
        res = res[prop]
      }
      return res
    }
  }

  // 调用
  const split = createSplitAttribute(g.trim())
  return split(data)
~~~

#### 虚拟DOM 

  思路和深拷贝类似
  1. 将 真正的DOM 转化为 虚拟DOM

  ~~~js
    // 虚拟DOM 减少了回流和重绘 提高了速度
    /*
      * <div /> => {tag: 'div'}
      * <div title="1" class="c" /> => {tag: 'div',data: {title: '1', class: 'c'}}
      * <div><div /></div> => {tag: 'div', children: [{tag: 'div'}]}
    */
    class VNode {
      /*
        * tag: node.nodeValue
        * data: node.attributes => obj => {node.attribute.nodeName: node.attribute.nodeValue}
      */
      constructor(tag, data, value, type) {
        this.tag = tag && tag.toLowerCase()
        this.data = data
        this.value = value
        this.type = type
        this.children = []
      }
      appendCild(vnode) {
        this.children.push(vnode)
      }
    }
    // node 为页面中真实的 DOM 节点
    // 使用递归的方法提取出 DOM 节点中所有的子孙节点
    // Vue源码中使用 栈 的方式
    function getVnode(node) {
      let nodeType = node.nodeType
      let _vnode = null
      // 判断nodeType类型
      if(nodeType === 1) { // 元素节点
        let nodeName = node.nodeName
        // 获取 node 元素的 所有 attribute 属性， 是一个伪数组，需要转换成 对象
        let attrs = node.attributes
        let _attrs = Object.create(null)
        for(let i = 0; i < attrs.length; i++) {
          _attrs[attrs[i].nodeName] = attrs[i].nodeValue
        }
        _vnode = new VNode(nodeName, _attrs, undefined, nodeType)
        // 然后处理元素节点的所有自节点
        let childNodes = node.childNodes
        for(let i = 0; i < childNodes.length; i++) {
          _vnode.appendCild(getVnode(childNodes[i]))
        }
      } else if(nodeType === 3) { // 文本节点
        // 文本节点没有 tag 属性 data属性
        _vnode = new VNode(undefined, undefined, node.nodeValue, nodeType)
      }
      return _vnode
    }
    let app = document.querySelector('#app')
    let app1 = getVnode(app)
    console.log(app1)
  ~~~

  2. 将 虚拟DOM 转化为 真正的DOM
  ~~~js
    function parseVnode(vnode) {
      const {tag, data, type, value, children} = vnode
      let dom = null
      if(type === 1) {
        dom = document.createElement(tag)
        for(let key in data) {
          dom.setAttribute(key, data[key])
        }
        dom.nodeType = type
        for(let i = 0; i < children.length; i++) {
          // dom.append(parseVnode(children[i]))
          dom.appendChild(parseVnode(children[i]))
        }
      } else if(type === 3) {
        dom = document.createTextNode(tag)
        dom.nodeValue = value
        dom.nodeType = type
      }
      return dom
    }
    const dom = parseVnode(app1)
    console.log(dom, 'dom')
  ~~~

 