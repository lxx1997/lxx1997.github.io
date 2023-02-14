---
title: 服务端 渲染 - nextjs
date: 2021-09-14 22:31:56
tags:
    - SSR
    - nextJs
    - JavaScript
    - React
cover: /assets/blogCover/MIKU花(4)_78753717_p1.png
---

## 初始化项目

~~~cmd
  npx create-next-app
  # or
  yarn create next-app
~~~

如果想要添加特殊配置有以下选择
* `--ts`，`--typescript` 使用TypeScript
* `-e`，`--example [name][github-url] `使用样例
* `--example-path`
* `--use-npm`


## 应用

#### 页面路由 Router

nextjs 路由匹配规则

* `/pages/example.js` | `/pages/example/index.js` 匹配路由 `/example`

* `/pages/example/[id].js` 匹配路由 `/example/1`

* `/pages/example/[...args].js` 匹配路由 `/example/1/2.../n`

* `/pages/example/[[...args]].js` 匹配路由 `/example/.../n`

~~~js
// /example/[id].js
// 路由为 /example/1
import { useRouter } from "next/dist/client/router";
const Index = (): JSX.Element => {
  const router = useRouter()
  const query = router.query  // {id: 1}
}

~~~