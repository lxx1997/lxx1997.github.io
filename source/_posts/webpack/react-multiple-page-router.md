---
title: React 多页面应用 - 路由配置
cover: /assets/blogCover/MIKU11th_70481322.png
date: 2023-02-20 10:41:26
updated: 2023-02-21 10:41:26
categories:
  - [webpack]
  - [react]
tags:
  - webpack
  - react
  - JavaScript
---

[项目地址](https://github.com/lxx1997/react-multiple-page-router)
## 创建项目

~~~cmd
  create-react-app react-multiple-page-router
~~~

## 打包环境配置

~~~cmd
yarn add customize-cra react-app-rewired -D
~~~

修改 `package.json`

~~~js
// package.json

"scripts": {
  "start": "react-scripts start",
  "build": "react-scripts build",
  "test": "react-scripts test",
  "eject": "react-scripts eject"
},

// 更换为

"scripts": {
  "start": "react-app-rewired start",
  "build": "react-app-rewired build",
  "test": "react-app-rewired test",
  "eject": "react-app-rewired eject"
},
~~~

添加 config-overrides.js

~~~js
const { override } =  require("customize-cra");
const overrideConfig = () => (config) => {
  return config
}
module.exports = override(overrideConfig())
~~~

## 多页面配置

在 `src` 目录下新建 `pages` 文件夹用来存放多页面入口

在 `pages` 目录下新建 `pages1`, `pages2` 目录，并创建入口文件

引入 `HtmlWebpackPlugin` 组件

~~~cmd
yarn add html-webpack-plugin -D
~~~

修改 `config.overrides.js` 配置多页面打包

~~~js
const { override } =  require("customize-cra");
const htmlWebpackPlugin = require("html-webpack-plugin")
const overrideConfig = () => (config) => {
  config.entry = {
    main: "./src/index.js",
    page1: "./src/pages/page1/index.js",
    page2: "./src/pages/page2/index.js"
  }

  config.output = {
    filename: "[name].[fullhash].js",
    path: __dirname + '/dist',
  }

  config.plugins.push(
    new htmlWebpackPlugin({
      title: "main",
      template: "./public/index.html",
      filename: "main.html",
      chunks: ["main"]
    }),
    

    new htmlWebpackPlugin({
      title: "Page1",
      template: "./public/index.html",
      filename: "page1.html",
      chunks: ["page1"]
    }),
    
    new htmlWebpackPlugin({
      title: "Page2",
      template: "./public/index.html",
      filename: "page2.html",
      chunks: ["page2"]
    })
  )
  return config
}
module.exports = override(overrideConfig())
~~~

## 路由配置

引入 `react-router-dom`

~~~cmd
yarn add react-router-dom -D
~~~

在 `pages1`,`pages2` 页面添加路由组件

~~~jsx
// page1/index.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import reportWebVitals from '../../reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
~~~

~~~jsx
// page1/App.jsx
import './App.css';
import { Routes, Route, NavLink } from "react-router-dom"
import Test from '../../components/Test';

function App() {
  return (
    <div className="App">
      <h1>Page2</h1>
      <NavLink to={"/test"}>Test</NavLink>
      <Routes>
        <Route path="/test" element={<Test />} />
      </Routes>
    </div>
  );
}

export default App;
~~~

~~~jsx
// page2/index.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import reportWebVitals from '../../reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
~~~

~~~jsx
// page2/App.jsx
import './App.css';
import { Routes, Route, NavLink } from "react-router-dom"
import About from '../../components/About';
import Home from '../../components/Home';

function App() {
  return (
    <div className="App">
      <h1>Page2</h1>
      <NavLink to={"/home"}>Home</NavLink>
      <NavLink to={"/about"}>About</NavLink>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </div>
  );
}

export default App;
~~~

这样就可以切换路由了

## 存在问题

* **路由跳转后，刷新页面后，可能会无法定位到对应的路由**
