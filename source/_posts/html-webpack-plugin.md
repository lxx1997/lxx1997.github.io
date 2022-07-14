---
title: html-webpack-plugin
cover: /assets/cover/20200225A1295.jpg
date: 2022-07-13 11:19:44
updated: 2022-07-13 11:19:44
categories:
tags:
  - webpack
  - JavaScript
  - html
  - react
---

在日常工作中遇到了需要打包成多页面的需求，由于每个页面的标题，描述以及一些seo和推广上的不一样，采用了 `html-webpack-plugin` 这个插件，在这里记录一下踩过的坑，以便后续查看和翻阅


## 简单的使用

#### 安装插件

~~~js
  yarn add html-webpack-plugin -D
~~~

#### 使用

~~~js
  // package.json
  const HtmlWebpackPlugin = require("html-webpack-plugin")

  module.exports = {
    plugins: [
      new HtmlWebpackPlugin()
    ]
  }
~~~