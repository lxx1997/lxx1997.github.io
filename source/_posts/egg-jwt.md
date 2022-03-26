---
title: eggjs token验证(redis & jsonwebtoken)
date: 2020-04-10 01:33:58
tags:
      - eggjs
      - jsonwebtoken
      - redis
      - deepin
cover: '/assets/cover/20200225A1295.jpg'
---


## redis 使用

### 安装radis

**linux环境下安装radis**

sudo apt-get install redis-server

**检查redis服务器系统进程**

ps -aux|grep redis

**查看redis端口状态**

netstat -nlt|grep 6379

~~~js
// 启动
/etc/init.d/redis-server start
// 停用
/etc/init.d/redis-server stop
// 重启
/etc/init.d/redis-server restart
~~~

### 使用docker 安装redis

~~~js
// 下载版本
docker pull redis  // 默认会拉取最新版本的redis
 
docker images // 查看镜像是否安装成功

docker run -itd --name redis-test -p 6379:6379 redis // 启动redis容器 端口号为6379

docker start redis-test // 启动redis

docker stop redis-test // 关闭redis

docker restart redis-test // 重启redis
~~~

### eggjs 环境下使用redis和jsonwebtoken实现token验证

~~~js
npm install jsonwebtoken
~~~

## middleware中间件

​	jwt.js

~~~js
'use strict'
const fs = require('fs')
const path = require('path')
const jwt = require('jsonwebtoken') //引入jsonwebtoken

module.exports = (options, app) => {
  return async function userInterceptor(ctx, next) {
    let authToken = ctx.header.authorization // 获取header里的authorization
    if (authToken) {
      authToken = authToken.substring(7)
      const res = verifyToken(authToken) // 解密获取的Token
      if (res.corpid && res.userid) {
        // 如果需要限制单端登陆或者使用过程中废止某个token，或者更改token的权限。也就是说，一旦 JWT 签发了，在到期之前就会始终有效
        // 此处使用redis进行保存
        const redis_token = await app.redis.get('loginToken').get(res.corpid + res.userid) // 获取保存的token
        if (authToken === redis_token) {
          ctx.locals.corpid = res.corpid
          ctx.locals.userid = res.userid
          await next()
        } else {
          ctx.body = { code: 50012, msg: '您的账号已在其他地方登录' }
        }
      } else {
        ctx.body = { code: 50012, msg: '登录状态已过期' }
      }
    } else {
      ctx.body = { code: 50008, msg: '请登陆后再进行操作' }
    }
  }
}

// 解密，验证
function verifyToken(token) {
  const cert = fs.readFileSync(path.join(__dirname, '../public/rsa_public_key.pem')) // 公钥，看后面生成方法
  let res = ''
  try {
    const result = jwt.verify(token, cert, { algorithms: [ 'RS256' ] }) || {}
    const { exp } = result,
      current = Math.floor(Date.now() / 1000)
    if (current <= exp) res = result.data || {}
  } catch (e) {
    console.log(e)
  }
  return res
}
~~~

### 使用中间件

~~~js
// 方法一：在应用中使用中间件
config.middleware = [ 'jwt' ]

config.jwt = {
    enable: true,
    ignore: [ '/api/v1/test/', '/public/' ], // 哪些请求不需要认证
}

// 方法二：router中使用中间件
module.exports = app => {
  const jwt = app.middleware.jwt();
  app.router.get('/api/v1/test/', jwt, app.controller.test.test);
};
~~~

### 生成token

​	写在helper里面，方便调用

~~~js
// 方法一：在应用中使用中间件
config.middleware = [ 'jwt' ]

config.jwt = {
    enable: true,
    ignore: [ '/api/v1/test/', '/public/' ], // 哪些请求不需要认证
}
config.redis = {
    client: {
      host: '127.0.0.1',
      port: '6379',
      password: '',
      db: 0,
    },
  };
// 方法二：router中使用中间件
module.exports = app => {
  const jwt = app.middleware.jwt();
  app.router.get('/api/v1/test/', jwt, app.controller.test.test);
};
~~~

​	调用token生成方式

~~~js
// 方法一：在应用中使用中间件
config.middleware = [ 'jwt' ]

config.jwt = {
    enable: true,
    ignore: [ '/api/v1/test/', '/public/' ], // 哪些请求不需要认证
}

// 方法二：router中使用中间件
module.exports = app => {
  const jwt = app.middleware.jwt();
  app.router.get('/api/v1/test/', jwt, app.controller.test.test);
};
~~~

### 利用openssl生成私钥和公钥

~~~js
生成公钥：openssl genrsa -out rsa_private_key.pem 1024 
生成私钥: openssl rsa -in rsa_private_key.pem -pubout -out rsa_public_key.pem
~~~

