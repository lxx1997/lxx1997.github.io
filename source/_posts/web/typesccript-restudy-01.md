---
title: typescript - 重新学习 - part 01
cover: /assets/blogCover/1578912686790.jpg
date: 2022-12-02 10:45:05
updated: 2022-12-02 10:45:05
categories:
  - TypeScript
tags:
    - TypeScript
    - ES6
---

## 使用

#### 安装

~~~cmd
npm install -g typescript
~~~

#### 运行

我们创建一个 `.ts` 文件，并写入代码，但是这个文件无法直接运行，需要经过typescript 编译过之后才能运行

tsc 会把 `.ts` 文件编译成 `.js` 文件，这样浏览器就能识别了

~~~cmd
# 编译
tsc sample.ts
# 运行
node smaple.js
~~~

## JavaScript 迁移

首先我们需要在 js 项目中安装 `typescript` 和 `ts-loader`,用于运行和打包时编译 ts 文件

~~~cmd
npm install typescript ts-loader source-map-loader
~~~

同时需要配置 webpack.config.js