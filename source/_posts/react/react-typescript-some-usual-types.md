---
title: React TypeScript 项目中一些常用的类型定义 
cover: /assets/blogCover/49566364_p0.jpg
date: 2023-04-16 18:01:33
updated: 2023-04-16 18:01:33
categories:
  - [TypeScript]
  - [react]  
tags:
  - TypeScript
  - react
  - types
---

一些常用的typescript 类型定义

#### 文件名 [name].d.ts

#### svg 文件

~~~js
declare module '*.svg' {
  import React = require('react')
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>
  const src: string
  export default src
}
~~~

这样定义完成后，svg 可以作为路径使用，也可以直接作为一个React Component 组件使用
