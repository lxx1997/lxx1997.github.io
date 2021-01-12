---
title: 跟着 Vue 源码学习 Vue api
date: 2021-01-09 22:17:53
categories: Vue
tags:
    - Vue
    - Api
---

此篇文章用来记录 Vue 中 Api 在 Vue 源码中的具体实现方法，以便更好的理解 Vue 的各种 Api 的使用方法

#### 全局配置

Vue 的全局配置参数是存放在 `config` 里面的，我们可以通过修改 config 中的 properties

~~~js
  Config = {
    // user
    optionMergeStrategies: { [key: string]: Function };
    silent: boolean;
    productionTip: boolean;
    performance: boolean;
    devtools: boolean;
    errorHandler: ?(err: Error, vm: Component, info: string) => void;
    warnHandler: ?(msg: string, vm: Component, trace: string) => void;
    ignoredElements: Array<string | RegExp>;
    keyCodes: { [key: string]: number | Array<number> };

    // platform
    isReservedTag: (x?: string) => boolean;
    isReservedAttr: (x?: string) => boolean;
    parsePlatformTagName: (x: string) => string;
    isUnknownElement: (x?: string) => boolean;
    getTagNamespace: (x?: string) => string | void;
    mustUseProp: (tag: string, type: ?string, name: string) => boolean;

    // private
    async: boolean;

    // legacy
    _lifecycleHooks: Array<string>;
  }
~~~

##### 1. silent

  silent 配置 主要用于判断是否输出 Vue 所有的日志和警告
  * 默认为 false 不取消日志和警告输出
  * 设置为 true  取消日志和警告输出
~~~js
  var hasConsole = typeof console !== 'undefined';
  // hasConsole 用于判断 window对象中 是否包含有 console 这个属性
  if (hasConsole && (!config.silent)) {
    console.error(("[Vue warn]: " + msg + trace));
  }
~~~

##### 2. optionMergeStrategies

  