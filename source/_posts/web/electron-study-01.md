---
title: electron - 使用javascript编写pc应用 - 01
date: 2020-08-20 09:30:05
tags:
    - electron
    - JavaScript
    - html
    - css
cover: '/assets/cover/20200225A1295.jpg'
---

  在[electron官网](https://www.electronjs.org/)根据文档指示，下载了一个electron模板并安装依赖成功运行

  练习项目[git地址](https://github.com/lxx1997/react-electron-app)



## 版本发布

  插件： `electron-packager`

  安装： `npm install -g electron-packager`

  打包： `package": "electron-packager ./ demo_app --platform=win32 --out ../demo_app_release --version 1.4.13 --overwrite --icon=./images/app.ico`

## 模块

  electron 提供了许多api来方便我们调用

  ####  Dialog模块

  * showOpenDialog(_browserWindow_, options, _callback_)
    * `_browserWindow_` BrowserWindow (可选)


## 打包

  Q:  react 文件打包之后，访问index.html,文件报错找不到js和css文件

  A:  react 路由模式由 history模式修改为 hash模式, package.json 里面添加配置 `homePage: '.'`

  Q:  使用electron打包，窗口白屏，无法加载文件

  A:  将package.json, electron的入口文件，（以及预加载文件preload.js）复制到react打包后的项目 build文件夹中，
      然后修改electron的入口文件
      electron.js

      ~~~js
        const {app, BrowserWindow} = require('electron')
        const path = require('path')
        const url = require('url')
        // const { url } = require('inspector')
        function createWindow () {
          // 隐藏菜单栏
          // Menu.setApplicationMenu(null)
          const mainWindow = new BrowserWindow({
            width: 800,
            height: 600,
            // icon: path.join(__dirname, '/assets/img/2.jpg'),
            // title: 'this is a electron'
            webPreferences: {
              javascript: true,
              plugins: true,
              nodeIntegration: true, // 是否集成 Nodejs
              webSecurity: false,
              preload: path.join(__dirname, 'preload.js')
            }
          })

          // and load the index.html of the app.
          // mainWindow.loadFile(path.join(__dirname, 'index.html'))

          // Open the DevTools.
          // mainWindow.webContents.openDevTools()

          // mainWindow.loadURL('http://localhost:3000/')
          // 加载应用----react 打包

        　　mainWindow.loadURL(url.format({
          　　pathname: path.join(__dirname, './index.html'),
          　　protocol: 'file:',
          　　slashes: true
        　　}))
        }

        app.whenReady().then(() => {
          createWindow()
          console.log('ready')
          app.on('activate', function () {
            if (BrowserWindow.getAllWindows().length === 0) createWindow()
          })
        })

        app.on('window-all-closed', function () {
          if (process.platform !== 'darwin') app.quit()
        })
      ~~~