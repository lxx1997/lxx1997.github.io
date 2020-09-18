--- 
title: react - 学习之路 - 配置
date: 2020-09-18 09:53:38
tags:
---

  Q: 如何配置路径别名

  A: 
  * 前置条件 安装 `npm react-app-rewired --save-dev`

    根目录（即src所在目录）创建`config-overrides.js`, 添加如下内容

    ~~~js
      const { override, fixBabelImports, addWebpackAlias } = require('customize-cra')
      const path = require('path')
      function resolve(dir) {
          return path.join(__dirname, '.', dir)
      }
      module.exports = override(
          addWebpackAlias({
              ["@"]: path.resolve(__dirname, "src")
          })
      )
    ~~~

    修改 `package.json` 中的启动命令

    ~~~js
      "script": {
        "dev": "react-app-rewired start"
      }
    ~~~
    
    修改完成之后重新启动
