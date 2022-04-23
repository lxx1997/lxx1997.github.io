---
title: SPA-prerender
date: 2022-04-23 22:39:08
tags:
    - react
    - vue
    - seo
    - Javascript
cover: '/assets/cover/20200225A1295.jpg'
---

由于单页面应用只生成了一个HTML 文件，如果想要做 SEO 的话， H 标签，img 标签的 alt 这些并不会被爬虫抓取到，所以需要我们做预渲染，使得生成的html文件中包含需要 爬虫抓取的内容， react-snap 插件可以帮助实现这个操作

##  使用

#### 安装
~~~js
    yarn add --dev react-snap
~~~

#### package.json

~~~js
    "scripts": {
    "postbuild": "react-snap"
    }
~~~

#### 入口 (src/index.js)

~~~js
    import { hydrate, render } from "react-dom";

    const rootElement = document.getElementById("root");
    if (rootElement.hasChildNodes()) {
    hydrate(<App />, rootElement);
    } else {
    render(<App />, rootElement);
    }
~~~

在使用 build 打包的时候，打包完成之后会执行我们添加的 postbuild 命令，然后将root下面的内容添加到 #root dom 里面，这样爬虫就可以从页面上抓取到关键词
