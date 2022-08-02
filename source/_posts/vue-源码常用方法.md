---
title: vue-源码
date: 2020-12-15 09:34:37
categories: Vue
tags:
    - Vue
    - SourceCode
cover: '/assets/cover/20200225A1295.jpg'
---

本片文章只用于引导自己如何对源码进行探索，因为看到源码的时候是一脸懵逼，完全不知道该从那个地方看起，所以用本篇文章记录一下自己的解读顺序，以免自己忘记


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

#### makeMap
  创建一个闭包判断函数，判断元素是否存在

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

#### remove

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

#### set

  ~~~js
    function set (target, key, val) {
      // 判断传入的 target 是否是 undefined 类型或者基础数据类型
      if (isUndef(target) || isPrimitive(target)
      ) {
        warn(("Cannot set reactive property on undefined, null, or primitive value: " + ((target))));
      }
      // 判断 target 是否是数组，以及 key 是否一个正常的数组序号
      if (Array.isArray(target) && isValidArrayIndex(key)) {
        target.length = Math.max(target.length, key);
        // 在数组的 key 位替换成 val
        target.splice(key, 1, val);
        return val
      }
      // target 为对象的话且 key 不是 Object 的属性，避免修改 Object 的属性，造成对象污染
      if (key in target && !(key in Object.prototype)) {
        target[key] = val;
        return val
      }
      // 每个被双向绑定的 数据 都有一个 __ob__ 对象
      var ob = (target).__ob__;
      // 如果 target 对象是 Vue 实例 或者 ob有值，则禁止向 Vue 实例上添加动态响应式属性
      if (target._isVue || (ob && ob.vmCount)) {
        warn(
          'Avoid adding reactive properties to a Vue instance or its root $data ' +
          'at runtime - declare it upfront in the data option.'
        );
        return val
      }
      // 如果不是 Vue 实例 直接添加属性
      if (!ob) {
        target[key] = val;
        return val
      }
      // 在对象上定义被动特性
      defineReactive$$1(ob.value, key, val);
      // 触发 通知事件
      ob.dep.notify();
      return val
    }
  ~~~

