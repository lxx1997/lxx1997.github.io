---
title: 关于在eggjs中使用mysql进行数据处理
date: 2020-4-12 12:05:35
tags:
      - eggjs
      - mysql
      - docker
cover: '/assets/cover/20200225A1295.jpg'
---


## 使用docker 安装mysql 数据库

~~~cmd
docker pull mysql // 默认拉取最新版本的mysql  mysql:5.7  拉取版本号为5.7的mysql

docker docker run -p 3306:3306 --name mysql-test  mysql:5.7  // 创建mysql容器 并启动

docker start mysql-test //开启mysql 服务
docker stop mysql-test // 关闭mysql 服务
docker restart mysql-test // 重启mysql 服务
~~~

## eggjs 使用mysql

** 安装mysql插件 **

~~~js
npm install egg-mysql --save
~~~

** 在plugin.js 和 config.default.js 配置mysql **

~~~js
// plugin.js
module.exports = {
  mysql: {
    enable: true,
    package: 'egg-mysql',
  },
};
// config.default.js
module.exports = appInfo => {
  const config = exports = {};

  config.mysql = {
    client: {
      host: 'localhost',  //链接地址
      port: '3306',  // 端口号
      user: 'root',  // 用户名
      password: '123456', // 密码
      database: 'eic-egg',  // 数据库
    },
  };
  // 解决跨域问题
  config.cors = {
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
  };
  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};
~~~
## 在项目中使用mysql

** 查询 **
~~~js
// 支持自定义查询语句 变量使用?代替
app.mysql.query('sql语句', [value1, value2, ...])

eg: app.mysql.query('select * from `user` where id = ? & name = ?', [id, name])
~~~
** 插入 **

~~~js
app.mysql.insert('table', Object)
~~~
