---
title: Deno 学习
date: 2020-06-16 16:25:19
tags:
    - deno
    - nodeJs
---

**首先我们先谈一下nodeJs的无法忽视的问题**

* nodeJs对于 ES6的新的语法特性 Promise接口 和async函数 和ES模块 的支持并不理想, NodeJs 必须支持回调函数(callback) 导致异步接口会有promise 和回调函数两种写法,同时NodeJs自己的模块格式 CommonJs和ES模块不兼容

* nodeJs 的模块管理工具 `npm` 的逻辑越来越复杂, 模块安装目录极其庞大,难以管理, nodeJs 几乎没有安全措施,用户只要下载了外部模块,就只好任凭别人代码在本地运行,进行各种读写操作

**什么是Deno**

* Deno和nodeJs一样,也是一个服务器运行,但是支持多种语言,可以直接运行在JavaScript,TypeScript和WebAssembly程序

* 并且内置了V8引擎,用来解释JavaScript,同时,也内置了tsc引擎,解释TypeScript,使用Rust语言开发, 由于Rust原生支持WebAssemly, 所以它也能直接运行WebAssemly

* Rust 提供了许多现成的模块，对Deno项目来说，可以节约很多开发时间

* Deno 只有一个可执行文件，所有操作都通过这个文件完成，支持跨平台

* Deno具有安全控制，默认下脚本不具有读写权限，如果脚本未授权就读写文件系统或者网络就会报错，必须使用参数，显示打开权限才可以

~~~js
  --allow-read：打开读权限，可以指定可读的目录，比如--allow-read=/temp。
  --allow-write：打开写权限。
  --allow-net=google.com：允许网络通信，可以指定可请求的域，比如--allow-net=google.com。
  --allow-env：允许读取环境变量
~~~

* Deno支持Web Api 尽量保持和浏览器一致，提供了window这个全局对象，同时支持fetch，webCrypto，worker等web标准，同时也支持onload，onunload，addEventListener等时间的操作函数，另外 **Deon的所有异步操作都返回Promise**

* Deno只支持ES模块。和浏览器的模块加载规则一致，没有npm和npm_modules目录，没有require()命令，也不需要package.json
所有的模块通过URL加载，比如 `import { bar } from "https//foo.com/bar.ts"`(绝对URL)或者 `import { bar } from "./foo/bar.ts"`(相对URL)，因此Deno不需要一个中心化的模块储存系统，可以从任何方式加载模块
Deno 下载模块以后，会有一个总的目录，在本地缓存模块，因此可以离线使用

* Deno 只支持从URL 加载模块，导致nodeJs 的模块加载写法都会失效，Deno的所有模块都要通过入口脚本加载，不能通过模块名加载，所以必须带有脚本后缀名

* Deno 原生支持TypeScript语言，可以直接运行，不必显示转码
他的内部会根据文件名后缀判断，如果是`.ts`后缀名，就先调用TS编译器，将其编译成JavaScript 如果是.js后缀名，就直接传入V8引擎运行

* Deno内置了开发中需要的各种功能，不需要外部工具，打包、格式清理、测试、安装、文档生成、liniting、脚本编辑成可执行文件

~~~js
  deno bundle：将脚本和依赖打包
  deno eval：执行代码
  deno fetch：将依赖抓取到本地
  deno fmt：代码的格式美化
  deno help：等同于-h参数
  deno info：显示本地的依赖缓存
  deno install：将脚本安装为可执行文件
  deno repl：进入 REPL 环境
  deno run：运行脚本
  deno test：运行测试
~~~

#### 安装Deno

Shell (Mac, Linux):

~~~js
  curl -fsSL https://deno.land/x/install/install.sh | sh
~~~

PowerShell (Windows):

~~~js
  iwr https://deno.land/x/install/install.ps1 -useb | iex
~~~

Homebrew (Mac):

~~~js
  brew install deno
~~~

Chocolatey (Windows):

~~~js
  choco install deno
~~~

Scoop (Windows):

~~~js
  scoop install deno
~~~

Build and install from source using Cargo

~~~js
  cargo install deno
~~~

**查看版本**

~~~js
  deno --version
~~~

命令行直接deno 就会进入 REPL环境

~~~js
  deno
  > console.log(1,2,3)
  1 2 3
  undefined
  >
~~~

**运行脚本**

~~~js
  $ deno run \
  https://deno.land/std/examples/curl.ts \
  https://example.com
~~~

上面的例子中， Deno执行远程脚本curl.ts,用这个脚本去抓取网址example.com,但是会提示没有网络通讯权限，给予Deno网络通信权限，就可以顺利执行

~~~js
  $ deno run --allow-net \
  https://deno.land/std/examples/curl.ts \
  https://example.com
~~~