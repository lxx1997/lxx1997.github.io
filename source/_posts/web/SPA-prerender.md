---
title: SPA-prerender
date: 2022-04-23 22:39:08
updated: 2022-04-23 22:39:08
categories:
    - SEO
    - [gitlab]
tags:
    - react
    - Vue
    - SEO
    - Javascript
    - gitlab
cover: /assets/blogCover/Day18 I’m Not Human_100789898.png
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

#### 问题

<!-- gitlab 发版 无法 postbuild -->
Q: 在日常发版过程中通常会采用自动化发版，我们公司采用的是 gitlab 的 CI/CD 环境进行发版，最后进行postbuild 操作的时候 发现无法预渲染，要怎么解决

A: 虚拟环境的话，可以采用 puppeteer 来模拟浏览器环境
puppeteer 是 Node.js 的一个库可以用来模拟 chrome 环境
~~~yml
// gitlab-ci.yml
apt-get install -yq gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget #install dependencies for puppeteer, which is a dependency for react-snap

sh ./bash.sh #運行自定義腳本以更改 react-snap 上的選項以使其工作
~~~
運行自定義腳本以更改 react-snap 上的選項以使其工作
~~~sh
# bash.sh
# modifies react-snap defaultOptions to add the --no-sandbox and --disable-setuid-sandbox flags so that puppeteer/chromium can run in the codebuild standard image
sed -i "s/puppeteerArgs: \[\],/puppeteerArgs: \[\"--no-sandbox\", \"--disable-setuid-sandbox\"\],/" ./node_modules/react-snap/index.js
echo changed arguments in react-snap
~~~

~~~json
  "reactSnap": {
    "include": [ // 需要进行预渲染的页面
      "/prerender.html",
    ],
    "puppeteerArgs": [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-web-security" // 允许 接口跨域进行请求
    ],
    "viewport": { // 预渲染的页面宽高，可以控制移动端适配和web端适配
      "width": 1400,
      "height": 850
    },
    "userAgent": "ReactSnap", // 环境，可以通过这个来区分是否是处于预渲染环境
    "crawl": false,
    "concurrency": 1,
    "inlineCss": false,
    "removeStyleTags": true,
    "skipThirdPartyRequests": false,
    "puppeteerIgnoreHTTPSErrors": true
  }
~~~

<!-- spa 单页面涉及到多语言 -->

Q: 页面存在国际化语言，页面再进行预渲染之后，在线上环境会出现文字先消失在出现的问题要怎么解决

A: 因为预渲染主要是把 页面渲染完成之后的内容重新写到html 里面，并不包含js文件，加载页面时，会去获取多语言文件，在多语言文件获取之前，通过key 去拿对应的文案时会获取不到，所以就变成了空白，文件加载完成之后，这个时候多语言文案就可以正常拿到了

可以采用先加载多语言文件再渲染页面的方式，或者再打包时就把对应多语言打包进去，放到window 对象上

~~~js
loadLanguageJson(language).then(() => {
  const rootElement:HTMLElement = document.getElementById("root")!;
    if (rootElement.hasChildNodes()) {
        hydrate(<React.StrictMode>
          <App />
        </React.StrictMode>, rootElement);
    } else {
      render(<React.StrictMode>
        <App />
      </React.StrictMode>, rootElement);
    }
  }
)
~~~
