---
title: js 判断图片是否完全加载完成
date: 2020-05-05 10:01:12
tags:
      - JavaScript
---
[原文网址](https://www.cnblogs.com/huanghuali/p/10310691.html "js图片处理")
在日常写代码的时候，我们有时候会遇到当图片未加载完成时，会发生高度塌陷，如果这个时候我们获取元素高度的时候获取到的不是元素真正的高度，会造成样式紊乱

#### window.onload 和ready的区别
图片从网络环境下载到本地是需要时间的，当图片灭有下载完的时候，使用js获取到元素的宽高将是0
* jquery中的ready方法只是dom元素结构加载完成，便视为完全加载完成，但是此时图片并未加载完成，此时宽高还是0
* js的window.onload是指dom生成和资源加载出来后才会执行onload函数

#### 方法一
~~~js
$('img').load(function() {

})
~~~

缺点是每加载一个图片，回调函数就会执行一次
#### 方法二
~~~js
var imgNum = $('img').length
$('img').load(function() {
    if(imgNum) {
        // 加载完成执行方法
    }
})
~~~
缺点是由于图片是从缓存文件里面拿，load方法根本不执行，只有请求新图片的时候才会走load
#### 方法三

利用图片未加载完成时宽高为0来判断图片加载情况
~~~js
var t_img; // 定时器
var isLoad = true; // 控制变量
// 判断图片加载状况，加载完成后回调
isImgLoad(function(){
 // 加载完成
});
// 判断图片加载的函数
function isImgLoad(callback){
  // 注意我的图片类名都是cover，因为我只需要处理cover。其它图片可以不管。
  // 查找所有封面图，迭代处理
  $('.cover').each(function(){
  // 找到为0就将isLoad设为false，并退出each
    if(this.height === 0){
      isLoad = false;
      return false;
    }
  });
 // 为true，没有发现为0的。加载完毕
  if(isLoad){
  clearTimeout(t_img); // 清除定时器
  // 回调函数
  callback();
  // 为false，因为找到了没有加载完成的图，将调用定时器递归
  }else{
    isLoad = true;
    t_img = setTimeout(function(){
    isImgLoad(callback); // 递归扫描
    },500); // 我这里设置的是500毫秒就扫描一次，可以自己调整
  }
}
~~~

