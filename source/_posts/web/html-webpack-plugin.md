---
title: html-webpack-plugin 的使用与进阶
cover: /assets/blogCover/1579266815338.jpg
date: 2022-07-13 11:19:44
updated: 2022-07-13 11:19:44
categories:
    - webpack
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
      new HtmlWebpackPlugin({
        template: "/public/index.html", // 模板
        filename: "template.html", // 输出文件名称
        chunks["template"] // 打包文件，与 entry 入口名相同
      })
    ]
  }
~~~

## 进阶操作

#### 自定义 meta 标签

在日常开发过程中，我们可能会遇到一些与seo 相关或者需要在页面头部添加 meta 标签，我们就可以采用 `html-webpack-plugin` 来动态的向同一个模板插入不同的meta标签

~~~js
  // package.json
  const HtmlWebpackPlugin = require("html-webpack-plugin")

  module.exports = {
    plugins: [
      new HtmlWebpackPlugin({
        template: "/public/index.html", // 模板
        filename: "template.html", // 输出文件名称
        chunks["template"], // 打包文件，与 entry 入口名相同
        meta: {
          description: "description",
          keyword: "keyword"
        }
      })
    ]
  }
~~~

以上代码会自动在打包之后的页面中添加 meta 标签

~~~html
<html>
  <head>
    <meta name="description" content="description" />
    <meta name="keyword" content="keyword" />
  </head>
</html>
~~~


#### 自定义 link 标签

~~~js
  // package.json
  const HtmlWebpackPlugin = require("html-webpack-plugin")

  module.exports = {
    plugins: [
      new HtmlWebpackPlugin({
        template: "/public/index.html", // 模板
        filename: "template.html", // 输出文件名称
        chunks["template"], // 打包文件，与 entry 入口名相同
        meta: {
          description: "description",
          keyword: "keyword"
        }，
        links: [
          {
            href: "http://template.com/assets/abc.css",
            type: "text/css"
          },
          {
            href: "http://template.com/assets/abc.css",
            ref: "alternate",
            hrefLang: "en",
          }
        ]
      })
    ]
  }
~~~

然后在模板页面可以解析 links 的内容在打包时动态生成我们所需要的的 link 标签

~~~html
<html>
  <head>
    <% for (var key1 in htmlWebpackPlugin.options.links) { %>
      <link <% for (key in htmlWebpackPlugin.options.links[key1]) { %> <%= key %>="<%= htmlWebpackPlugin.options.links[key1][key] %>"<% } %> />
    <% } %>
  </head>
</html>
~~~

在上述代码中，打包时首先会去拿取 `htmlWebpackPlugin.options.links` 中的内容进行遍历，然后根据 `links` 中元素的属性来动态生成link标签的 `href`,`type`,`ref` 等属性

**未完待续**