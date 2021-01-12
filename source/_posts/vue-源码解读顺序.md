---
title: vue-源码
date: 2020-12-15 09:34:37
categories: Vue
tags:
    - Vue
    - 源码
cover_picture: '/assets/blogImg/xmas_ico0.jpg'
---

本片文章只用于引导自己如何对源码进行探索，因为看到源码的时候是一脸懵逼，完全不知道该从那个地方看起，所以用本篇文章记录一下自己的解读顺序，以免自己忘记

### HOW TO UNDERSTAND VUE

  #### LIFECYCLE_HOOKS
  vue 钩子函数
  > beforeCreate
  > created
  > beforeMounte
  > mounted
  > beforeUpdate
  > updated
  > beforeDestory
  > destoryed
  > activated
  > deactivated
  > errorCaptured
  > serverPrefetch
### SOME USERFUL METHODS
  * 判断浏览器类型
  ~~~js
    // packages/vue-template-compiler/browser.js
    var inBrowser = typeof window !== 'undefined';
    var inWeex = typeof WXEnvironment !== 'undefined' && !!WXEnvironment.platform;
    var weexPlatform = inWeex && WXEnvironment.platform.toLowerCase();
    var UA = inBrowser && window.navigator.userAgent.toLowerCase();
    var isIE = UA && /msie|trident/.test(UA);
    var isIE9 = UA && UA.indexOf('msie 9.0') > 0;
    var isEdge = UA && UA.indexOf('edge/') > 0;
    var isAndroid = (UA && UA.indexOf('android') > 0) || (weexPlatform === 'android');
    // Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1
    var isIOS = (UA && /iphone|ipad|ipod|ios/.test(UA)) || (weexPlatform === 'ios');
    var isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge;
    var isPhantomJS = UA && /phantomjs/.test(UA);
    var isFF = UA && UA.match(/firefox\/(\d+)/);
  ~~~

  * 创建一个闭包判断函数，判断元素是否存在

  ~~~js
    // packages/vue-template-compiler/build.js
    function makeMap (str, expectsLowerCase) {
      var map = Object.create(null);
      var list = str.split(',');
      for (var i = 0; i < list.length; i++) {
        map[list[i]] = true;
      }
      return expectsLowerCase
        ? function (val) { return map[val.toLowerCase()]; }
        : function (val) { return map[val]; }
    }

    var isBuiltInTag = makeMap('slot,component', true)
    isBuiltInTag('slot') // true
  ~~~

  * 从数组中移除元素

  ~~~js
    // packages/vue-template-compiler/build.js
    function remove (arr, item) {
      if (arr.length) {
        var index = arr.indexOf(item);
        if (index > -1) {
          return arr.splice(index, 1)
        }
      }
    }
  ~~~
