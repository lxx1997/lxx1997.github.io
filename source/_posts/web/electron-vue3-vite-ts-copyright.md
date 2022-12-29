---
title: 基于 electron 实现一个记录用户粘贴历史记录应用程序 之 基础环境搭建
cover: /assets/blogCover/1612283238139.jpg
date: 2022-12-15 09:59:59
updated: 2022-12-15 09:59:59
categories:
  - [electron]
  - [web]
  - [vue3]
  - [vite]
  - [TypeScript]
tags:
  - electron
  - web
  - Vue3
  - vite
  - TypeScript
---


之前一直使用 utools 工具中的 剪贴板，感觉这个功能十分好用，不用在费劲的去寻找自己之前copy 的记录，十分的方便

但是由于几个月前收费了，本着能白嫖就付钱的心理，所以就没有继续使用了。

最近偶然想要做一下这个功能，也可以学习一个 electron 和 vue3 的新知识

环境搭建可以参考一下[这个文章](https://segmentfault.com/a/1190000041852520)，这里有完整的搭建流程。

但是由于各个电脑的环境以及node， electron 等版本不一样的，所以还是会有一些不同，我只在这里简单的记录一下，并标注一下不同之处

## 环境

| 插件              | 版本         |
| ---:---          |    ---:----   |
|node   |     v16.14.0|
|yarn   |     v1.22.19|
|vue    |     v3.2.45|
|@vitejs/plugin-vue    |      4.0.0|
|electron     |     22.0.0|
|electron-builder     |     23.6.0|
|electron-devtools-installer     |    3.2.0|
|rimraf     |     3.0.2|
|typescript    |      4.9.3|
|vite     |     4.0.0|
|vite-plugin-electron     |     0.10.4|
|vite-plugin-electron-renderer   |      0.11.3|
|vue-tsc    |     1.0.11|


## 环境搭建

#### 初始化 vue3 + vite + ts 环境

~~~cmd
  yarn create vite todolist --template vue-ts
~~~

#### 初始化 electron 环境

~~~cmd
yarn add -D electron electron-builder rimraf vite-plugin-electron electron-devtools-installer
~~~

插件说明
* electron-builder：打包工具

* rimraf：快速删除文件或目录工具

* vite-plugin-electron：vite 结合 electron 的库，关于这个插件可以参见 Vite 与 Electron 无缝衔接

* electron-devtools-installer：electron 开发工具

* vite-plugin-electron 插件是将 vite 和 electron 结合在一起的，可以让我们非常方便的结合 electron 和 vue，需要做一些指定的配置。

#### 创建 electron 入口文件 electron.ts 和 预渲染 preload.ts

~~~ts
// electron.ts
const { app, BrowserWindow, Menu, globalShortcut } = require('electron');
const path = require('path');

const createWindow = () => {

  // 隐藏顶部菜单
  Menu.setApplicationMenu(null)
  const win = new BrowserWindow({
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
      preload: path.join(__dirname, './preload.ts'),
    },
  });
  if (app.isPackaged) {
    win.loadFile(path.join(__dirname, './index.html'));
  } else {
    // Use ['ENV_NAME'] avoid vite:define plugin
    const url = `http://127.0.0.1:5173/`;
    win.loadURL(url);
    // 添加快捷键
    globalShortcut.unregisterAll()
    globalShortcut.register('ctrl+q', function() {
      app.quit()
    })
    globalShortcut.register('ctrl+shift+i', function() {
      // 添加 devtools
      win.webContents.openDevTools()
    })
  }
};

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
~~~

~~~ts
// electron-preload/index.ts
const os = require('os');

console.log(os.platform()); // 测试打印一下系统平台
~~~

#### 配置 electron
在 tsconfig.json 中监听 electron 相关文件和提示

这个没有发生变化
~~~ts
"include": [..., "electron-main/**/*.ts", "electron-preload/**/*.ts"],
~~~
`vite.config.ts` 变化比较明显，首先 electronRenderer 引入插件变成了 `vite-plugin-electron-renderer`,其次是初始化的时候 electron 传入实例对象有变化
~~~ts
// vite.config.ts
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import * as path from 'path';
import electron from 'vite-plugin-electron';
import electronRenderer from 'vite-plugin-electron-renderer';

export default defineConfig({
  plugins: [
    vue(),
    electron({
      entry: {
        main: './electron.ts',
      },
    }),
    electronRenderer(),
  ],
  build: {
    emptyOutDir: false, // 必须配置，否则electron相关文件将不会生成build后的文件
  },
});
~~~

#### 配置打包命令

~~~json
// package.json
"script": {
  "build-electron": "rimraf dist && vite build && electron-builder"
}
~~~

其实在执行完上述内容后，基本上就可以正常运行和打包了
