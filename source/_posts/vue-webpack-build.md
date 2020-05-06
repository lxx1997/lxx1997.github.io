---
title: 从零开始搭建vue的webpack运行环境
date: 2020-05-05 00:29:21
tags: 
      - vue
      - webpack
---
### 初始化 运行环境

~~~js
npm init -y
// 初始化package.json文件
~~~

### 安装 (webpack和webpack-dev-server)

~~~js
// 安装webpack和webpack-dev-server
npm install -S webpack webapck-dev-server
~~~

<!---more--->


### 配置package.json 和webpack.config.js

~~~js
// package.json
"script": {
    //  本地运行环境 执行命令 npm run dev
    "dev": "webpack-dev-server --open --config webpack-dev-server",
    //  打包命令  npm run build
    "build": "webpack"
}
~~~

### 入口配置和出口环境配置

~~~js
// webpack.config.js
const path = require("path")
const config = {
    entry: {
        // 入口js配置
        app: './mian.js'
    },
    output: {
        path: path.join(__dirname, './dist'),
        pubilcPath: '/dist/',
        filename: './app.js'
    }
}
~~~

### css样式输出配置

~~~js
// 安装css-loader style-loader
npm install -S css-loader style-loader

//  webpack.config.js
module: {
    rules:[
        {
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
        }
    ]
}
~~~

**温馨提示：** *在配置文件中的modules对象的rules属性中，可以指定一系列的loaders,每个loader都必须包含test和use两个选项，当webpack编译过程中遇到require和import语句导入一个为.css的文件，将它通过css-loader转换，再通过style-loader转换，然后继续打包，**use选项的值可以是数组或者字符串，如果是数组，编译顺序就是从后往前编译** *

### 配置 将css整合并生成main.css文件

~~~js
// 安装 extract-text-webpack-plugin插件
npm install -S extract-text-webpack-plugin

// webpack.config.js 配置extract-text-webpack-plugin
{
    //  引入extract-text-webpack-plugin
    const ExtractTextPlugin = require("extract-text-webpack-plugin")
    module: {
        rules:[
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    use: 'css-loader',
                    fallback: 'style-loader'
                })
            }
        ]
    }
    plugins: [
        // 将整合后的css全部集中到dist目录下的mian.css文件中
        new ExtractTextPlugin("mian.css")
    ]
}

// 问题解决
error： Use Chunks.groupsIterable and filter by instanceof Entrypoint instead
method： extract-text-webpack-plugin版本过低，安装最新版本的extract-text-webpack-plugin
// 安装命令
npm install --save-dev extract-text-webpack-plugin@4.0.0-beta.0
~~~

### 在webpack中配置vue-loader对.vue格式的文件进行处理

​	*.vue文件需要安装vue-loader, vye-style-loader*

​	*es6语法需要安装babel-loader和babel*

~~~js
// 安装配置文件
npm install --save vue
npm install --save-dev vue-loader
npm install --save-dev vue-style-loader
npm install --save-dev vue-template-compiler
npm install --save-dev vue-hot-reload-api
npm install --save-dev babel
npm install --save-dev babel-loader
npm install --save-dev babel-core
npm install --save-dev babel-plugin-transform-runtime
npm install --save-dev babel-preset-es2015
npm install --save-dev babel-runtime
~~~

~~~js
//  webpack.config.js 进行配置
const VueLoaderPlugin = require('vue-loader/lib/plugin')
module: {
    rules: [
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          use: 'css-loader',
          fallback: 'style-loader'
        })
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loader: {
            css: ExtractTextPlugin.extract({
              use: 'css-loader',
              fallback: 'vue-style-loader'
            })
          }
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  },
      plugins:[
          new VueLoaderPlugin()
      ]
~~~

### vue文件注意事项

~~~js
 // index.html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <link rel="stylesheet" href="/dist/main.css">
</head>
<body>
  <div id="app"></div>
	//  type="text/javascript" 必须填写，负责会有部分代码无法识别
  <script type="text/javascript" src="/dist/main.js"></script>
</body>
</html>
~~~

### 设置文件导入省略后缀

~~~js
resolve: {
    // js,vue,json 文件可以省略后缀，会自动识别
    extensions: ['.js', '.vue', '.json'],
    // 设置别名 /src 可以直接用@代替
    alias: {
        '@': resolve('src')
    }
}
~~~

### 配置url-loader和file-loader来支持图片、字体等文件

~~~js
// 安装url-loader和file-loader
npm install -D url-loader file-loader

// webpack.config.js

rules: [
    {
        test: /\.(gif|jpg|png|woff|svg|ect|ttf)\??.*$/,
        loader: 'url-loader?limit=1024'
    }
]
// limit=1024 指小于1024b就以base64的形式加载

// vue中使用最好使用变量承载图片路径
~~~

### 项目打包依赖

~~~js
// 安装 webpack-merge 和 htm-webpack-plugin
npm install -D webpack-merge html-webpack-plugin

// 新建一个webpack.prod.config.js文件
var webpack=require('webpack');
var HtmlwebpackPlugin=require('html-webpack-plugin');
var ExtractTextPlugin=require('extract-text-webpack-plugin');
var merge=require('webpack-merge');
var webpackBaseConfig=require('./webpack.config.js');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
//清空基本配置的插件列表
module.exports=merge(webpackBaseConfig,{
output:{
publicPath:'/dist/',
// 将入口文件重命名为带有20位hash值的唯一文件
filename:'[name].[hash].js'
},
plugins:[
new ExtractTextPlugin({
// 提取css，并重命名为带有20位hash值的唯一文件
filename:'[name].[hash].css',
allChunks:true
}),
// 定义当前node环境为生产环境
new webpack.DefinePlugin({
'process.env':{
NODE_ENV:'"production"'
}
}),
// 压缩js
new UglifyJsPlugin(),
// 提取模板，并保存入口html文件
new HtmlwebpackPlugin({
filename:'index.html',
template:'./index.html',
inject:true
}),
]
});

// package.json 添加build设置
"build":"webpack --progress --hide-modules --config webpack.prod.config.js"
~~~

#### 报错解决

~~~js
htmlwebpackPlugin is not defined

报错是因为ejs文件的htmlwebpackPlugin拼写错误，换成htmlWebpackPlugin
~~~



