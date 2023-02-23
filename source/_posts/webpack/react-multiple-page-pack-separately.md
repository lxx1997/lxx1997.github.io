---
title: React 多页面应用 - 实现多页面应用每个页面可以单独打包 及 gitlab CI/CD 发版配置
cover: /assets/blogCover/39_80002807.png
date: 2023-02-23 15:30:48
updated: 2023-02-23 15:30:48
categories:
  - [webpack]
  - [react]
  - [gitlab]
tags:
  - webpack
  - react
  - JavaScript
  - gitlab
---

书接上回 [React 多页面应用 - 路由配置](/2023/02/20/webpack/react-multiple-page-router/)

这次我们来实现一些不一样的需求，这是在日常工作中遇到的

首先我们来描述一下我们想要实现的需求

首先在这个项目中有多个项目（a,b,c,d...）,假如我只改了a项目的代码，按照我们之前的配置，发版的时候会把所有的项目都一起发上去，这样一个问题是会造成资源浪费（CDN 需要重新缓存），另一个问题是如果有修改到公共方法，会对未修改的项目造成影响，这个时候的需求是只发a项目相关的代码，其他项目的代码不会发上去。

接下来我们来看实现这个需求

## 实现项目单独打包

在上一个项目的基础上，我们可以发现多页面打包的基础是在 打包的时候配置的多入口，那么只需要把原来的多入口变成单入口，就可以实现按需打包了

所以在上一个项目的基础上，把 `config.entry` 和 `config.plugins` 的内容单独抽离出来，然后在 overrideConfig 方法内动态传入需要打包的组件入口名称，然后根据传入的组件名称动态获取 `entry` 和 `plugins` 的内容。具体实现代码如下

~~~js
// config-overrides.js

const { override } =  require("customize-cra");
const htmlWebpackPlugin = require("html-webpack-plugin")

const entry = {
  main: "./src/index.js",
  page1: "./src/pages/page1/index.js",
  page2: "./src/pages/page2/index.js"
}

const computedPluginList = (types) => {
  let pluginList = []
  for(let i = 0; i < types.length; i++) {
    switch (types[i]) {
      case "main": 
        pluginList.push(new htmlWebpackPlugin({
          title: "main",
          template: "./public/index.html",
          filename: "main.html",
          chunks: ["main"]
        }))
        break;
      case "page1": 
        new htmlWebpackPlugin({
          title: "Page1",
          template: "./public/index.html",
          filename: "page1.html",
          chunks: ["page1"]
        })
        break;
      case "page2": 
        new htmlWebpackPlugin({
          title: "Page2",
          template: "./public/index.html",
          filename: "page2.html",
          chunks: ["page2"]
        })
        break;
      default:
        break;
    }
  }
  return pluginList
}
const overrideConfig = (paths) => (config) => {
  const innerEntry = {}
  if(paths) {
    for(let i = 0; i < paths.length; i++) {
      innerEntry[paths[i]] = entry[paths[i]]
    }
  } else {
    innerEntry.entry = entry
  }

  config.output = {
    filename: "[name].[fullhash].js",
    path: __dirname + '/dist',
  }

  config.plugins.push(...computedPluginList(paths))
  return config
}
module.exports = override(overrideConfig(["page1", "main"]))
~~~

通过上述操作，我们可以实现根据传入的项目包的名称进行按需运行及按需打包

**但是，这并不是最终的解决方案**,我们不可能每次发版或者每次进行开发都要修改这个文件，这个操作太过繁琐，一旦忘了修改，就会发生比较严重的问题，这个时候需要对这个功能进行优化

## 项目单独打包优化

在经过诸多讨论后，最后敲定的优化方案是 本地开发时，运行所有的项目，在进行发版的时候根据 tag 名进行各个项目发版

#### package.json 文件修改

首先在 script 内新增一个命令 `set:env`，这个命令会在 发版的时候用到，和 tag 一起用来设置发版的项目

~~~json
{
  "script": {
    "set:env": "REACT_APP_PROJECT="
  }
}
~~~

#### gitlab-ci.yml 文件修改

首先需要修改 gitlab-ci 文件内容，使其由原先的通过判断分支来发版，更改为判断 tag 名称发版，tag 需要定一个规则，用于区分正式，测试环境，我这边定义的规则 `V-[环境名称]-[version]-[project]`

在 `gitlab CI/CD` 进行发版时，首先需要获取到 tag 名，gitlab-ci 提供了 `$CI_COMMIT_REF_NAME` 可以访问到 tag 名

~~~yml
test:sync-to-s3:
  only:
    # tags
    # 测试环境
    - /V-T-US-.*/
  script:
    # build
    - echo ${CI_COMMIT_REF_NAME}
    - echo ${CI_COMMIT_REF_NAME##*-} #获取最后一个 - 后面的内容
~~~

修改了上述代码后，当我们打好以 `V-T-US-` 开头的 tag 后，会自动触发gitlab 的发版流程，执行过程中，会输出 当前tag 名称以及 project 名称。

获取完成之后，就需要根据获取到的工程名称，编写 node 代码，修改 package.json 与发包相关的 代码

首先创建 `updatePackage.sh`

~~~sh
# updatePackage.sh
PROJECT_NAME=default
if [ "$1" ];
then
    PROJECT_NAME=$1
fi
    node ./update.js $PROJECT_NAME ./package.json
~~~

在执行 `updatePackage.sh` 文件的时候，如果传入的有参数，则会 自动复制 PROJECT_NAME 变量，然后通过 node 执行 node 文件，并将传入的内容以及需要修改的文件路径传过去

**需要注意的是，这里的路径都是基于执行 `updatePackage.sh` 的位置来说的，而不是`updatePackage.sh` 文件的位置**

然后创建 `update.js` 文件，用来读取和修改 package.json

~~~js
// update.js
const fs = require('fs'); // 引入 fs 函数，用来读取文件
const arg = process.argv.splice(2); // 获取node 执行文件时传入的参数
const r = arg[arg.length - 1] // 获取 node 执行文件时传入的文件地址
const c = fs.readFileSync(r);
const json = JSON.parse(c);
const set_env = json.scripts['set:env']
const build_env = json.scripts['build:test']
json.scripts["build:test"] = set_env + arg[0] + " " + build_env // 修改 package.json 的打包命令
fs.writeFileSync(r, JSON.stringify(json, null, 2));
~~~

修改 `gitlab-ci.yml` 文件 执行 `updatePackage.sh` 文件

~~~yml
test:sync-to-s3:
  only:
    # tags
    # 测试环境
    - /V-T-US-.*/
  script:
    # build
    - echo ${CI_COMMIT_REF_NAME}
    - projectName=${CI_COMMIT_REF_NAME##*-} #设置变量 projectName
    - sh ./script/updatePackage.sh $projectName
~~~

## 扩展

  如果有预渲染页面的，也可以同 `updatePackage.sh` 文件来动态的修改需要预渲染的页面，修改 `gitlab-ci.yml` 文件来更新对应文件

  ~~~yml
    test:sync-to-s3:
      only:
        # tags
        # 测试环境
        - /V-T-US-.*/
      script:
        # build
        - echo ${CI_COMMIT_REF_NAME}
        - projectName=${CI_COMMIT_REF_NAME##*-} #设置变量 projectName
        - sh ./script/updatePackage.sh $projectName
        - aws s3 cp build/${projectName}.html s3://bucket_path/${projectName}.html # 上传对应文件到服务器
  ~~~

## 参考文章

* [在gitLab-CI-YML中獲取package.json的值](https://stackoverflow.com/questions/43165840/get-value-of-package-json-in-gitlab-ci-yml)
* [添加自定義環境變量](https://create-react-app.dev/docs/adding-custom-environment-variables/)
* [脚本实现版本号自动更新，不传参加1](https://juejin.cn/post/6960983079867383844)
