---
title: 用typescript来写eggjs
date: 2020-05-27 09:41:28
tags:
      - typescript
      - eggjs
cover: '/assets/cover/20200225A1295.jpg'
---

由于用javasript的某种限制和不足，所以决定使用typescript来写eggjs


#### 初始化typescript

~~~js
npm init egg --type=ts
~~~

#### 使用数据库

~~~js
npm i --save egg-sequelize mysql2
~~~

/config/plugins.ts
~~~js
sequlize: {
    enable: true,
    package: 'egg-sequelize',
  },
~~~
/config/config.default.ts
~~~js
config.sequelize = {
    dialect: 'mysql',
    host: 'localhost',
    port: 3306,
    password: '123456',
    database: 'eic-egg',
    timezone: '+08:00',
  };
~~~
