---
title: 我的闲暇联系之作  uni-app  && eggjs
date: 2020-05-14 10:15:40
toc: true
tags:
      - uni-app
      - eggjs
      - TypeScript
      - colorui
cover: '/assets/cover/20200225A1295.jpg'
---

### 前端
  前端主要使用 (_typescript 已废弃_)javascript 和uniapp进行搭建框架和代码实现，页面结构使用uniapp的样式组件color-ui，图标库使用阿里巴巴矢量图标库
  前端git地址: [eggjs-uniapp](https://github.com/lxx1997/eggjs-uniapp)


#### 前端使用技术及bug

##### typescript 使用

* this的使用

~~~ts
 this  => (this as any)
~~~

* interface
  接口，用于明确的强制一个类去符合某种契约，它描述了类的共有部分，而不是共有和私有俩部分
  **如果使用构造器去定义一个接口并驶入定义一个类去实现折扣时，就会得到一个错误**因为当一个类实现了一个接口时，只会对实例部分进行类型检查，**constructor**存在于类的静态部分，所以不在检查范围

~~~ts
  interface ClockInterface {
      currentTime: Date; 
      setTime(d: Date):void; // 在接口中描述一个方法，在类里实现它
    // new (hour: number, minute: number); // 构造函数定义一个接口会导致Clock会报错
  }
  
  class Clock implements ClockInterface {
      // private currentTime: Date = new Date(); // 报错，接口描述了类的公共部分，而不是公共和私有两部分
      currentTime: Date = new Date(); 
      constructor(h: number, m: number) { }
      setTime(d:Date){ this.currentTime = d; }
  }
~~~

#### 前端进度

**2020-05-17**  更换了ui插件 uview 由于typescript对于插件引入不行，决定更换语言 换成javascript，进行项目重构和页面复制


**2020-05-19**  完成作者作品列表和作品详情页面

### 后台
  后台主要使用eggjs 以及各种第三方插件
  后台git地址: [eggjs-node](https://github.com/lxx1997/eggjs-node)

#### 后台插件使用

* mysql使用: 参考文章 [egg-mysql](/2020/04/12/eggjs-mysql/)

* redis使用: 参考文章 [egg-redis](/2020/04/10/egg-jwt/)

* 身份验证 token: 参考文章 [身份验证](/2020/04/10/egg-jwt/)
#### 后台进度

**2020-04~2020-05-18**  注册，登录，token验证，用户个人信息获取，用户个人信息修改

**2020-05-19**  编写小说上传接口 
