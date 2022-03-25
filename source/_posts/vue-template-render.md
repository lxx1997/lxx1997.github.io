---
title: 02 - Vue源码解读-渲染模型
date: 2020-12-17 15:01:25
categories: Vue
tags:
    - Vue
    - JavaScript
---

1. 判断元素

  vue 本质上是使用 HTML 字符串作为模板，将字符串模板转化为 AST(抽象语法树) ,再转换成 VNode

  - 模板 -> AST
  - AST -> VNode
  - VNode -> DOM

  最消耗性能的是字符串解析(模板 -> AST)

  > 小例子： let s = "1 + 2 * (3 + 4 * (5 + 6))" 得到结果
  > 建议：将字符串表达式转化为波兰式表达式，使用栈结构来运算
  > ~~~js

  > ~~~

  vue源码如何区分HTML标签和自定义组件?

    **vue源码把所有可用的HTML标签都存起来**
  
  使用柯里化操作将需要遍历的 HTML 标签存储起来

  ~~~js
    function makeMap(keys) {
      const obj = Object.create(null)
      keys.map(item => {
        obj[item] = true
        return item
      })
      return function(key) {
        return !!obj[key]
      }
    }
    let htmlkey = ['p','div','a','ul','li','ol','dl']
    const htmlMap = makeMap(htmlkey)
    htmlMap('div') // true
    htmlMap('img') // false
  ~~~

  > [函数柯里化](/lxx1997.github.io/2020/12/17/fucntion-currying/)

2. 虚拟 DOM 的 render 方法

  vue项目 模板转化为抽象语法树
    - 页面一开始加载需要渲染
    - 每一个属性(响应式)数据在发生变化时要渲染
    - watch，computed
  每次需要渲染的时候，模板就会被解析一次

  render 的作用是将虚拟DOM 转化为真正的DOM

    - 虚拟DOM 可以降级理解为AST
    - 一个项目运行的时候，模板是不会变得，就表示AST是不会变得
    - 将虚拟DOM 缓存起来，生成一个函数，只需要传入参数，就可以的到真正的DOM
  ~~~html
    <div id="app">
      <div>
        <div>
          {{name}} {{behavior}}
        </div>
        <div>
          {{other.name}} {{other.behavior.name}} {{other.behavior.time}}
        </div>
      </div>
      <p>人员：{{name}}</p>
      <p>行为：{{behavior}}</p>
    </div>
  ~~~
  ~~~js
    function JGVue(options) {
      this._data = options.data
      this._template = document.querySelector(options.el) // vue 中这里是DOM
      this.mount() // 挂载
    }

    JGVue.prototype.mount = function() {
      // 需要提供一个render方法生成虚拟dom
      this.render = this.createRenderFn()
      this.mountComponent()
    }
    JGVue.prototype.mountComponent = function() {
      // 执行mountComponent
      let mount = () => {
        // 调用update方法渲染dom
        this.update(this.render())
      }
      mount.call(this) // 本质上应该交给watcher来调用，此操作并不会改变this的指向
    }
    /*
      * 在真正的 vue 中使用了 二次提交的设计结构
      * 1 在页面中 DOM 和虚拟 DOM 是一一对应的关系
      *   数据发生变化的时候，就会通过 diff 方法 对比需要更新的虚拟  DOM 节点，更新  DOM 
      *   凡是解析就会涉及到 AST
      * 2 现有AST和数据生成VNode
      * 3 将新的VNode 和旧的 VNode 比较(diff)更新(update)
    */
    // 生成render 函数，缓存抽象语法树（使用虚拟DOM来模拟）
    JGVue.prototype.createRenderFn = function() {
      // 获取抽象语法树
      let ast = getVnode(this._template)
        console.log(ast)
      // Vue: 将AST + data => VNode
      return function render() {
        // 将带坑的VNode (ast) 转化为真正的带数据的VNode
        let _temp = combine(ast, this._data)
        console.log(_temp)
        return _temp
      }
    }
    // 将虚拟DOM渲染到页面中 diff算法就在这里
    JGVue.prototype.update = function(data) {
      let dom = parseVnode(data)
      let app = document.getElementById("app")
      let parent = app.parentNode
      parent.replaceChild(dom, app)
    }
    // node 为页面中真实的 DOM 节点
    // 使用递归的方法提取出 DOM 节点中所有的子孙节点
    // Vue源码中使用 栈 的方式
    // 由HTML DOM -> VNode， 将这个函数当做compiler函数
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
    // 将带有‘{{}}’的虚拟DOM和传入的data数据结合起来，生成带有数据的DOM树
    function combine(node, data) {
      let _type = node.type
      let _data = node.data
      let _value = node.value
      let _tag = node.tag
      let _children = node.children
      let _vnode = null
      // 判断nodeType类型
      if(_type === 1) { // 元素节点
        _vnode = new VNode(_tag, _data, _value, _type)
        // 然后处理元素节点的所有自节点
        _children.map(item => _vnode.children.push(combine(item, data)))
      } else if(_type === 3) { // 文本节点
        _value = _value.replace(curlyRE, (_, g) => {
            /* 
              * 第一个参数是正则表达式匹配到的东西
              * 第二个参数及以后是第 n-1 个分组
            */
            const split = createSplitAttribute(g.trim())
            return split(data)
          });
        // 文本节点没有 tag 属性 data属性
        _vnode = new VNode(_tag, _data, _value, _type)
      }
      return _vnode
    }
    // 将虚拟dom 转化为真实DOM
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
          dom.appendChild(parseVnode(children[i]))
        }
      } else if(type === 3) {
        dom = document.createTextNode(tag)
        dom.nodeValue = value
        dom.nodeType = type
      }
      return dom
    }
    // 使用柯里化 存储需要替换的内容
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
          console.log(res, prop)
          res = res[prop]
        }
        return res
      }
    }
    const options = {
      el: '#app',
      data: {
        name: '优·库里伍德·海尔赛兹',
        behavior: '吃橘子',
        other: {
          name: '相川步',
          behavior: {
            name: '约的人',
            time: '12m'
          }
        }
      }
    }
    const curlyRE = /\{\{(.+?)\}\}/g
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
    let app = new JGVue(options)
  ~~~
