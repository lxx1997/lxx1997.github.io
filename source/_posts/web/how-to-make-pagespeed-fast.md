---
title: 最全的页面性能优化
cover: /assets/blogCover/1608136373106.jpg
date: 2022-06-24 22:20:06
updated: 2022-06-24 22:20:06
categories:
    - performance
tags:
    - performance
    - JavaScript
---

## 为什么要进行性能优化

我们会在什么时候对页面性能进行优化呢，在我的观点里大致有以下几个方面

* 页面加载时间较长，导致部分用户在页面还未加载完成之后便离开了页面，增加了用户的跳出率
* 因为 google 的搜索算法，对页面性能这一块有一定要求，如果页面性能较差，那么当用户搜索工具关键词时，页面的顺序就越靠下，这样针对用户自然搜索流量这一块会有很大影响
* 用户在使用工具时，可能会由于部分操作及代码实现的影响，导致用户使用时会比较卡顿，用户体验较差，降低用户留存

如果想要提高用户的留存率这一块的数据，那么增加用户流量及降低用户跳出率就比较重要了

## 怎么进行性能优化

我认为可以从以下几个方面来进行性能优化

* html 解析阶段

* javascript 加载阶段

* 页面渲染阶段

* 用户操作过程中

下面来分别介绍一下在各个阶段要具体要怎么做

### html 解析阶段

当浏览器请求到页面 html 的时候，会对html 进行解析，如果中间遇到 link 标签 或者 script 标签时，会去请求对应资源，并进行解析，在解析 css 文件的过程中，并不会阻止浏览器解析 html 文件，但是要注意，javascript 文件会阻止 css 和 html 文件的解析，所以尽量要把 javascript 文件访问 body 标签的最后，不要阻止html 和 css 的解析

在这个阶段我们可以通过以下几种方法提高页面速度

#### prefetch && preload

使用 prefetch 和 preload 方式 预加载文件，但是要注意这两个方法加载文件的优先级程度不同， **prefetch 的优先级最低，浏览器不会立即下载文件，而是会在空闲时间去下载文件**， **preload 的优先级最高，会立即去下载文件**，但是这两个方式都不会去解析文件，只是下载文件后存放本地，如果我们需要使用时就不必再次下载

*注意：由于浏览器对于同一个域名下请求的个数有限制，所以要谨慎使用prefetch 和preload 方法，如果一次性加载文件过多，反而会影响后续资源的获取，起到反优化的效果*

~~~html
<link rel="prefetch" href="https://www.template.com/assets/js/tempalte.js" as="type/javascript" />
<link rel="prefetch" href="https://www.template.com/assets/js/tempalte.css" as="type/style" />

<link rel="preload" href="https://www.template.com/assets/js/tempalte.js" as="type/javascript" />
<link rel="preload" href="https://www.template.com/assets/js/tempalte.css" as="type/style" />
~~~

#### DNS Prefetch，即DNS预获取

当浏览器加载文件时，会对地址进行 DNS 解析,获取地址对用的IP地址，虽然浏览器内部对这一部分操作进行过优化，会在一定时间内缓存 DNS 解析结果，但是 DNS 解析的时间还是比较长的，大概需要 20ms - 120ms 左右的时间，我们可以针对会使用的域名开启 dns 预解析操作，在浏览器空闲的时候，去解析 DNS,当我们使用的时候，就可以减少 dns 解析的时间操作，提高接口请求时间

~~~html
<!-- 开启 DNS 解析 content: off 关闭 on 打开 -->
<meta http-equiv="x-dns-prefetch-control" content="on">
<link rel="dns-prefetch" href="https://www.template.com">
~~~

但是要注意不要滥用预解析，如果短时间不需要的域名，可以不需要 dns 预解析


#### script 标签位置

浏览器在遇到script 标签时，会暂停解析 html 和 css 文件，转而去解析 js 内容，这样就阻止了页面的解析和渲染，所以尽量保证script 标签在 body 标签的末尾，减少 js 文件对html 文件解析的影响

#### 骨架屏

可以采用骨架屏的方式，防止用户因为看不到内容，从而离开页面

### JavaScript 解析阶段

在这个阶段，浏览器回去下载页面渲染所需要的 javascript 文件，解析，然后渲染到页面上，在这个阶段影响页面加载速度主要有以下几个方面：
1. 单个 js 文件过大，请求及解析文件耗时过大
2. 同一时间请求了过多的资源，导致网络被占用，进一步影响了页面加载

#### 采用不同域名加载静态资源

我们都知道浏览器对同一个域名下的请求个数有一定的限制，例如google 浏览器限制最大并发个数是6个，当同时发起的请求的个数超过6个时，只会有有6个发起请求，其他的处于 padding 状态，只有当请求完成时，才会有下一个请求开发发起请求。

因此我们可以采用通过不同域名来请求静态资源，例如 所有的 js 资源可以单独采用一个域名来进行，图片等媒体资源可以采用一个域名来访问，这个就不会因为同一时间内请求的资源过多，影响页面加载速度

#### CDN 缓存

当浏览器下载资源，会先通过 DNS 解析解析出资源所在主机的ip地址，然后去拉取资源，如果服务器刚好在用户所在城市附近，那么资源的加载速度并不会有多大影响，但如果距离过远，例如你人在北京，想要访问在美国的一台服务器上的资源，这个时候由于网络传输的印象，回导致资源获取延迟比较大。

这个时候就需要使用 CDN 缓存了， 这就是CDN的由来，分布式缓存服务器，主要功能是在转发、传输、链路抖动等情况下，最小化资源的时延，并保证信息的连续性和速度。

当我们访问资源，会首先向距离我们最近的 DNS 服务器发出资源请求，如果 这个DNS 服务器缓存有我们想要的资源，如果没有，则会向原服务器请求资源，然后返回给我们，这样一般就降低了资源在请求链路传输的延迟问题。

但是使用 DNS 缓存也会有一些弊端，因为资源都是已经缓存到 DNS 服务器上了，如果在资源缓存未失效的请求，资源进行了变更，这个时候用户访问到的又可能还是旧版资源，这个时候我们可以手动请求 DNS 缓存，但是这个方法不太方便，所以我们可以通过打包的方式，对静态资源添加 hash 后缀，这样每次发版或者更换资源，都会把地址专项新的地址，这样 CDN 就会重新对资源进行缓存
针对不能添加 hash 的文件，我们可以通过修改参数的方式来使 CDN 重新刷新缓存，例如
~~~js
// package.version 为 package.json 的版本号
let url = `http://www.example.com/useinfo?_v=${package.version}`
axios.get*(url)
~~~

这样当我们每次发版的时候，只需要修改一下版本号，就可以刷新 CDN 缓存了


#### 减少 javascript 包的体积

当 js 文件体积过大时，我们需要减少 javascript 包的大小，来减少js 加载时间和解析时间。

可以通过一下几种方式减少包的体积

* 分包
    我们可以通过打包的方式，来将一些第三方资源包打包到一个文件，因为这部分资源我们通常并不会经常修改，这样当我们发版的时候，如果第三方资源并没有发生变化，那么这一块的资源并不会清空 CDN 缓存
    ~~~js
        module.exports = {
            optimization: {
                splitChunks: {
                    chunks: "all",
                    cacheGroups: {
                        vendors: { 
                            test: /[\\/]node_modules[\\/]/,
                            name: "vendors",
                            priority: -10 
                        },
                        utilCommon: { 
                            name: "common",
                            minSize: 0,
                            minChunks: 2, 
                            priority: -20
                        }
                    }
                },
            }
        }
    ~~~

    这样所有的 node_modules 下需要打包的资源都会打包到 vendors js 文件里面

    如果是多页面应用还可以吧多次使用的资源的资源打包到同一个包里面，这样多个页面就可以共用这一个包

    ~~~js
        module.exports = {
            optimization: {
                splitChunks: {
                    chunks: "all",
                    cacheGroups: {
                        utilCommon: { 
                            name: "common",
                            minSize: 0,
                            minChunks: 2, 
                            priority: -20
                        }
                    }
                },
            }
        }
    ~~~

* 资源懒加载

    **这里主要以 vue 项目举例**

    假如我们的页面有多个路由，我们在访问其中一个路由的时候其实是不需要加载其他路由所需要的内容，这个时候可以使用懒加载的方式来减少首屏需要加载的资源

    ~~~js
    {
        name: "/home",
        component: () => import("./home.vue")
    }
    ~~~

    这个时候只有我们访问 /home 这个路由的时候才会加载 home 所需要的资源，
    
    针对同一个路由中 也需要懒加载的组件的组件可以使用以下方式

    ~~~vue
    <tempalte>
        <LazyLoad v-if="lazy" />
    </tempalte>

    <script>
    const LazyLoad = () => import("./LazyLoad.vue")
    export default {
        data() {
            return {
                lazy: false
            }
        }
    }
    </script>
    ~~~

    vue 在内部做过处理，只有当 lazy = true， 需要渲染 LazyLoad 组件时，才会加载对应资源

    通过以上操作，我们可以极大减少首屏加载所需要的资源大小，提高页面加载速度

* [Tree Shaking](https://www.webpackjs.com/guides/tree-shaking/)

    tree shaking 是一个术语，通常用于描述移除 JavaScript 上下文中的未引用代码。它依赖于 ES2015 模块系统中的静态结构特性，例如 import 和 export。这个术语和概念实际上是兴起于 ES2015 模块打包工具 rollup。

    使用了 tree shaking后， 如果一段代码我们并没有通过 import 方式引入，这段代码在打包的时候就不会打包进去，但是这个时候也会出现其他问题，因为在迭代过程中，可能之前我们引入了一些资源，但这些资源在后期迭代的过程中不在使用了，但是并没有从代码中移除，这个时候，这些资源也会被打包到代码中，并且项目越大，这种问题出现的几率越大。

    因此webpack 扩展了这个检测能力，主要通过 package.json 的 sideEffect 属性来标记

    当我们把 sideEffect 设置为 false 时， 代表所有的代码都不包含副作用，告诉 webpack 可以安全的删除所有的未使用的 export 导出。

    如果部分代码存在副作用，我们通过一个数组来过滤掉这部分存在副作用的代码。
    ~~~json
        {
            "version": "1.0.0",
            "sideEffect": false
        }


        {
            "version": "1.0.0",
            "sideEffect": [
                "./src/tool/effect.js"
            ]
        }
    ~~~

    我在对 vue 项目进行代码 treeshaking 的时候遇到过这样一个问题，打包没有问题，但是发到测试环境后看，页面样式发生了混乱，推测是 可能是由于 vue 文件进行 treeshaking 时，所以 就把 vue 文件标为 副作用文件，不进行treeshaking 

    ~~~json
        {
            "version": "1.0.0",
            "sideEffect": [
                "./src/tool/effect.js"，
                "*.vue",
                "*.less"
            ]
        }
    ~~~


* gzip 压缩

    资源在经过网关的时候可以开启 gzip 压缩，使用了 gzip 后，静态文件可以被压缩 3 - 10 倍左右

经过以上操作，可以极大减少用户请求页面加载资源大小，减少服务器带宽压力

### 页面渲染阶段

在页面渲染阶段 主要是用户让用户能够更快的看到页面，以及可操作，所以这个阶段就需要我们根据需求调整 资源加载 及 js 执行时间长度

* 延迟加载资源

对于部分第三方组件，例如支付，广告这些全局共用的js，可以等到使用的时候再去加载

* 从产品设计方面

针对部分阻塞页面加载及用户操作的资源可以通过用户的主动操作触发，而非页面一加载就执行

### 用户操作过程

再用户操作过程中，可能有些操作会需要大量计算，由于浏览器是单线程操作，长时间的计算将会阻止用户操作，造成页面出现卡顿的现状,我们可以通过采用分段计算和优化计算消毒，或者采用替代方法。

* 使用全局加载动画，告诉用户当前属于什么状态。

* canvas.toDataURL 可以采用 canvas.toBlob 方法替代（如果有使用的话）

* setTimeout， setInterval， requestAnimationFrame 等方式实现异步操作