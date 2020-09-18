---
title: react 项目中使用less
date: 2020-09-03 15:30:35
tags:
    - react
    - less
    - webpack
    - react-app-rewired
    - customize-cra
---

## 插件安装

  ~~~js
    npm install react-app-rewired customize-cra babel-plugin-import -D
  ~~~

  在项目根目录创建文件 config-overrides.js

  ~~~js
    const {...} = require('customize-cra');
    module.exports = override(
        ...
    );
  ~~~

## react 按需加载配置

  ~~~js
    const { override, fixBabelImports } = require("customize-cra");
    module.exports = override(
        fixBabelImports('import', {
            libraryName: 'antd',
            libraryDirectory: 'es',
            style: true,//或者css, true代表运用less
        }),
    );
  ~~~

  修改package.json

  ~~~js
    "scripts": {
      "start": "react-app-rewired start",
      "build": "react-app-rewired build",
      "test": "react-app-rewired test",
      "eject": "react-app-rewired eject"
    },
  ~~~

  编译less文件

  ~~~js
    yarn add --dev less less-loader //less-loader用5.0版本，高版本停用了一些配属性//config-overrides.js内容
    const { override,addLessLoader} = require("customize-cra");module.exports = override(
  　　　addLessLoader({
          javascriptEnabled: true,
          modifyVars: {}
      }),
    );
  ~~~

  * 装饰器

  ~~~js
    npm install -D @babel/plugin-proposal-decorators
    //config-overrides.js
    const { override, addDecoratorsLegacy} = require('customize-cra');
    module.exports = override(
      addDecoratorsLegacy()
    );  
  ~~~
## 问题解决

  * 出现如下报错

    ValidationError: Invalid options object. Less Loader has been initialized using an options object that does not match the API schema.
    options has an unknown property 'modifyVars'. These properties are valid:
    object { lessOptions?, prependData?, appendData?, sourceMap?, implementation? }。

    **解决方案**
    将
    ~~~js
      addLessLoader({
        javascriptEnabled: true,
        modifyVars: {}
      }),
    ~~~
    修改为
    ~~~js
      addLessLoader({
        lessOptions: {
          javascriptEnabled: true,
          modifyVars: {}
        }
      }),
    ~~~