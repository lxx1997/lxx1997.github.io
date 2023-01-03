---
title: 移动端适配 - IOS 高版本无法下载之 navigator.share 使用
cover: /assets/blogCover/1620428630502.jpg
date: 2023-01-01 10:30:26
updated: 2023-01-01 10:30:26
categories:
    - [IOS]
    - [web]
    - [mobile]
    - [MobileAdaptation]
tags:
    - IOS
    - web
    - mobile
    - MobileAdaptation
---

在生产环境中，leader 发现了这样一个问题，在生产环境中，部分 IOS 用户在使用 chrome 时，无法正常下载，点击下载按钮时，没有反应，图片无法正常存储到用户手机上，经过排查后发现基本存在与 ios 15 版本以上

## 前因

之前我们的网站一直主打的是pc端浏览器的使用，但是现在移动端访问网站的用户，也占有一定比例，为了使这一部分能够正常使用，所以针对移动端浏览器访问的时进行了一定的适配和功能调整，以保证用户正常使用，文件下载采用的 `file-saver` 的 `saveAs` 方法来下载文件。在线上环境也正常运行了一年的时间

## 现象

针对 `Android` 用户基本上都能正常下载，但是针对 `IOS 15` 版本以上的用户，在使用 `chrome` 时无法正常下载，在针对竞品进行调研后发现他们使用的是 `navigator.share` 方法，调用浏览器的分享功能来保证能正常下载

## 使用 navigator.share

在 `MDN` 上是这样介绍的 *`Navigator.share()` 方法通过调用本机的共享机制作为 Web Share API 的一部分。*但是由于这是一个实验性的功能，所以浏览器兼容版本比较高，并不是所有浏览都支持，所以需要做一下兼容，不支持 `navigator.share`, 就使用之前的下载方法

~~~js
const sharePromise = window.navigator.share(data);
~~~

`data` 包含要共享的数据的对象。必须至少指定以下字段之一。可用选项包括：

* `url:` 要共享的 URL
* `text:` 要共享的文本
* `title:` 要共享的标题（**标题必传，否则无法正常使用**）
* `files:` 要共享的文件(**注意，这是一个数组**)

分享文件之前，先使用 navigator.canShare() 判断这个文件能否被分享

在使用中还需要注意 `IOS` 版本，我在使用中发现， 15 版本一下的 `navigator.canShare()` 可以通过，但是 `navigator.share` 会报错，所以在使用之前还需要做一下判断

## 完整代码

~~~js
let userAgent = navigator.userAgent.toLocaleLowerCase()
let ios = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
let android = navigator.userAgent.indexOf("Android") > -1 || u.indexOf("Linux") > -1
let versionArray = userAgent.match(/version\/([\d.]+).*mobile/)
// 获取当前ios 版本
let version = Number(versionArray && versionArray[1] && versionArray[1].split(".")[0])
let options = {
  title: "hello word",
  files: files
}
if(navigator.canShare && navigator.canShare(options)  && navigator.share && (ios && version >= 15 || android)) {
  try {
    navigator.share(options).then(res => {
      // 成功之后的其他操作
    }).catch(() => {
    // 旧版本的下载
    })
  } catch(error) {
    // 旧版本的下载
  }
} else {
  // 旧版本的下载
}
~~~

**补充一点：navigator.share在不刷新页面的时候只能调用一次，再次调用时 navigator.share 方法会拒绝此操作，所以需要做兼容**