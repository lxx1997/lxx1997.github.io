---
title: 第三方插件安装采坑  -  01
date: 2020-08-19 17:16:20
tags:
    - npm
---

  此博客用来记录使用第三方插件安装及使用的时候采坑记录

####  electron

  安装 `npm install`

  * 报错

  ~~~js
    Error: read ECONNRESET
    # 或者
    Error: Electron failed to install correctly ...
  ~~~

  * 解决方式

  ~~~js
  // 设置镜像
  set "ELECTRON_MIRROR=http://npm.taobao.org/mirrors/electron"
  // 安装
  npm install
  ~~~
