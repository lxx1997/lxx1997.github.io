---
title: web - H5 移动端适配问题
cover: /assets/blogCover/【楽曲】ダンスフィッシュ_82256105_p1.png
date: 2022-11-23 16:09:03
updated: 2022-11-23 16:09:03
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

## IOS 移动端适配

#### 唤起键盘输入时，页面底部的输入框无法浮动到键盘上方

[参考文章](https://juejin.cn/post/7105950857014804516)

这个出现的原因主要是 IOS 和 Andriod 的 适配不同

Andriod 的情况比较好理解。软键盘弹出后，实际webview被挤压了，变短了，相当于浏览器变小了，变成 原本高度 - 软键盘高

IOS 发布了 8.2 版本之后，与androids的不同，软键盘弹出，并不是挤压webview，webview的高度不会发生变化，而软键盘更像是一个悬浮在weview上的东西，并不会影响webview的实际高度，是“盖”上去的。这样就造成了我们目前所看到的情况，输入框被键盘遮挡，无法看到用户输入的内容

所以可以看到，我们在IOS上聚焦某个输入框，是会自动让页面发生滚动，以展示聚焦的输入框，此时页面的滚动，实际上是webview自身发生了移动。

这里可以采用的方法有两种

第一种是用户聚焦于输入框的时候，设置window 或者页面区域主动向上方滚动一定距离（例如软键盘高度），当用户失去焦点时，在滚动回原来的位置

第二种是改变 输入框所在元素的高度，使得输入框能够正常显示出来，当用户失去焦点时，在还原回原来的高度

~~~js
  const handleBlur = (e: any) => {
    // 获取浏览器类型
    let { ios } = utils.myBrowserOS()
    if(ios) {
      setTimeout(function(){
        element.style.height = "100%"
      }, 100)
    }
  }

  const handleFocus = (e: any) => {
    let { ios } = utils.myBrowserOS()
    if(ios) {
      setTimeout(function(){//设置一个计时器，时间设置与软键盘弹出所需时间相近
       element.style.height = (window.innerHeight - 330) + "px"
      }, 100)
    }
  i

~~~

#### IOS Safari 浏览器 canvas 写入图片过大，会造成页面重复刷新

  [参考文章](https://discussions.apple.com/thread/4975106)

  您的網頁在桌面上表現良好並不能保證它在 iOS 上也能表現良好。請記住，iOS 使用 EDGE（低帶寬、高延遲）、3G（高帶寬、高延遲）和 Wi-Fi（高帶寬、低延遲）連接到互聯網。因此，您需要最小化網頁的大小。在您的網頁中包含未使用或不必要的圖像、CSS 和 JavaScript 會對您的網站在 iOS 上的性能產生不利影響。

  由於 iOS 上的可用內存，它可以處理的資源數量有限制：

  解碼後的 GIF、PNG 和 TIFF 圖像的最大尺寸對於內存小於 256 MB 的設備是 3 兆像素，對於內存大於或等於 256 MB 的設備是 5 兆像素。也就是說，確保  `width * height ≤ 3 * 1024 * 1024`

  適用於 RAM 小於 256 MB 的設備。請注意，解碼後的尺寸遠大於圖像的編碼尺寸。

  使用子採樣時，JPEG 的最大解碼圖像大小為 32 兆像素。由於二次採樣，JPEG 圖像可以高達 32 兆像素，這允許 JPEG 圖像解碼為像素數的十六分之一的大小。大於 2 兆像素的 JPEG 圖像被二次採樣，即解碼為縮小的尺寸。JPEG 子採樣允許用戶查看來自最新數碼相機的圖像。

  對於內存小於 256 MB 的設備，畫布元素的最大尺寸為 3 兆像素，對於內存大於或等於 256 MB 的設備，畫布元素的最大尺寸為 5 兆像素。如果未指定，畫布對象的高度和寬度為 150 x 300 像素。
  
  每個頂級入口點的 JavaScript 執行時間限制為 10 秒。如果您的腳本執行時間超過 10 秒，iOS 上的 Safari 會在您代碼中的隨機位置停止執行腳本，因此可能會導致意外後果。施加此限制是因為 JavaScript 執行可能會導致主線程阻塞，因此當腳本運行時，用戶無法與網頁進行交互。閱讀“在 iOS 上調試 Web 內容”了解如何在 iOS 上調試 JavaScript。

  一次可以打開的最大文檔數在iPhone 上是八個，在iPad 上是九個。


## Andriod 移动端适配


## 共用的适配方式

#### 在滚动的元素内部 有 pisition: fixed; 元素，点击到改元素，无法进行滑动

在 IOS 可以采用在 `pisition: fixed;` 元素外包一层 `pisition: sticky;` div，可以实现

其他的话要触发浏览器默认的滚动（window，document.body）而非 元素的 overflow 属性才可以滑动
