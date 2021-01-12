---
title: HOW TO 制作一个简易的弹幕demo
date: 2020-08-13 15:21:48
tags:
    - HTML
    - JavaScript
---

  闲来无事，对于bili上面的弹幕感兴趣，于是自己打算尝试制作一个简单的弹幕系统

#### 页面布局

  首先先创建一个容器用来存放video播放器和弹幕发射器,注意要有一个遮罩层设置透明度为0,用来显示我们输入的弹幕,位于视频的上方,为了使视频的显示不那么突兀,我们可以把存放视频的容器的背景颜色设置成深色或者黑色



  ~~~html
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
      <style>
        .chat-bullet-container {
          width: 400px;
          height: 300px;
          position: absolute;
          top: 40px;
          left: 50%;
          transform: translateX(-50%);
        }
        .chat-bullet-video-container {
          width: 400px;
          height: 250px;
          background-color: rgb(0, 0, 0);
        }
        .chat-bullet-video-container video {
          max-width: 100%;
          max-height: 100%;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translateX(-50%) translateY(-62%);
        }
        .chat-bullet-video-container #chat-bullet-video-text {
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0);
        }
        .chat-text {
          position: absolute;
          top: 70px;
          left: 70px;
          color: #000000;
        }
      </style>
    </head>
    <body>
      <div class="chat-bullet-container">
        <!-- 播放 -->
        <div id="chat-bullet-video-container" class="chat-bullet-video-container">
          <video id="video" src="./demo.mp4" controls="true"></video>
          <div id="chat-bullet-video-text"></div>
        </div>
        <div class="chat-bullet-video-method">
          <!-- <input id="color" type="color"> -->
          <input id="chat-input" type="text">
          <button type="text" onclick="handleSend()">发送</button>
        </div>
      </div>
    </body>
    </html>
  ~~~

#### 功能实现

  接下来给弹幕发射器添加点击事件，点击的时候让我们发送的文字显示在视频上面

  获取遮罩层元素及其宽高,作为弹幕显示和滚动的限制条件

  ~~~js
    const chatContainer = document.getElementById('chat-bullet-video-text')
    const height = chatContainer.offsetHeight
    const width = chatContainer.offsetWidth
  ~~~

  为发送弹幕按钮添加点击事件,生成随机颜色和位置的弹幕，然后通过appendChild方法将生成的弹幕放到

  ~~~js
    function handleSend() {
      const input = document.getElementById('chat-input')
      const msg = input.value
      const text = document.createElement('span')
      text.innerHTML = msg
      let style = `position: absolute;
      top: ${Math.random() * height}px;
      right: 30px;
      color: rgb(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255});`
        this.element.setAttribute('style', style)
        this.chatContainer.appendChild(this.element)
    }
  ~~~

  这个时候当我们在输入框中输入内容的时候，点击发送的时候就会发现我们写的内容随机显示在视频上面

  接下来做的就是让弹幕能够动起来，本次实现的是从右向左移动

  但是弹幕不可能只发送一个，弹幕通常来说是很多个的，这个时候如何用上述的方法来添加弹幕和控制弹幕的话显然是不合理。

  这个时候我们应该做的是让每个添加的弹幕之间是独立的，互不影响的，能够独立运行，这时候我借鉴了之前学习canvas时使用的方法：创建一个class类，在这个类中实现弹幕的属性初始化，渲染，运行及删除事件

  ~~~js
    // 弹幕渲染及移动类
    class Chat {
      constructor(element, chatContainer, data) {
        this.element = element
        this.chatContainer = chatContainer
        this.init()
      }
      init() {
        this.ccx = this.chatContainer.offsetWidth
        this.ccy = this.chatContainer.offsetHeight
        // 弹幕速度
        this.s = Math.random() + 4
      }
      // 渲染带有样式的弹幕
      paint() {
        let style = `position: absolute;
      top: ${Math.random() * this.ccy}px;
      right: ${this.mx};
      color: rgb(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255});`
        this.element.setAttribute('style', style)
        this.chatContainer.appendChild(this.element)
        this.mx = -this.element.offsetWidth
        this.element.style.right = this.mx + 'px'
        this.element.style.display = 'none'
      }
      // 移动弹幕，使弹幕从右向左移动
      move() {
        this.mx = this.mx + this.s
        this.element.style.display = 'inline-block'
        this.element.style.right = this.mx + 'px'
      }
      delete(index) {
        if(this.mx >= this.ccx) {
          this.element.style.display = 'none'
        }
      }
    }
  ~~~


  点击事件也应该根据实际情况进行修改，同时定义一个数组用来存放我们添加的弹幕的类

  ~~~js
    const chartList = []
    function handleSend() {
      const input = document.getElementById('chat-input')
      const msg = input.value
      const text = document.createElement('span')
      text.innerHTML = msg
      const chat = new Chat(text, chatContainer, {color: 'red'})
      chat.paint()
      chartList.push(chat)
    }
  ~~~

  但是想要让弹幕动起来可不是那么简单的事情，因为我们上述操作只是使弹幕渲染到了视频上面，并没有使弹幕动起来，这时我们可以定义一个定时器，时间间隔要短，在定时器中我们循环存放弹幕的数组，调用弹幕自身的移动事件及删除事件

  ~~~js
    setInterval(() => {
      for(var i = 0; i < chartList.length; i++) {
        chartList[i].move()
        chartList[i].delete(i)
      }
    }, 100)
  ~~~

#### 将弹幕与视频关联起来

  想要做成根据视频播放来显示历史弹幕就要将弹幕和视频当前播放时间进行关联

  ~~~js
    // 给视频添加监听事件，监听视频运行
    // video ended function
    video.addEventListener('ended', function() {
      console.log(video_Status)
    })
    // 监听视频播放，获取当前播放时间
    video.addEventListener('canplay', function() {
      console.log(this.duration)
    })
    // 监听视频播放，获取当前播放时间
    video.addEventListener('timeupdate', function() {
      currentTime = this.currentTime
    })
  ~~~

  获取到视频播放时间之后，接下来就是将时间和弹幕关联起来存储，如果没有后台的支持的话可以使用localStorage和indexedDB来存储数据，这里我推介使用indexedDB，因为可以练习一下indexedDB的知识，同时indexedDB的存储空间也比localStorage的存储空间要大很多

  首先检测indexedDB是否启用，同时创建所需要使用的数据库和表，设置主键
  ~~~js
    function checkIndexedDB(database, table) {
      const request = window.indexedDB.open(database, 3)
      request.onupgradeneeded = function(e) {
        const db = e.target.result
        if(!db.objectStoreNames.contains(table)) {
          const tables = db.createObjectStore(table, {
            keyPath: 'id', // 使用当前时间戳可以避免id重复
            autoIncreament: true
          })
        }
        console.log(123123)
        db.close()
      }
    }
  ~~~

  然后连接数据库，向表中插入数据

  ~~~js
    function linkIndexedDB(database, table) {
      const request = window.indexedDB.open(database)
      return new Promise((resolve, reject) => {
        request.onsuccess = function(e) {
        const db = e.target.result
          resolve(db)
        }
      })
    }
  ~~~
  同时将弹幕的print()进行修改，每创建一条弹幕就存储一次

  ~~~js
    // 渲染带有样式的弹幕
      paint() {
        console.log(currentTime, 'chat')
        let style = `position: absolute;
      top: ${Math.random() * this.ccy}px;
      right: ${this.mx};
      color: rgb(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255});`
        this.element.setAttribute('style', style)
        this.chatContainer.appendChild(this.element)
        this.mx = -this.element.offsetWidth
        this.element.style.right = this.mx + 'px'
        this.element.style.display = 'none'
        linkIndexedDB('test', 'chat').then(db => {
          console.log(db)
          const request = db.transaction(['chat'], 'readwrite').objectStore('chat')
              .add({id: Date.now(), element: this.element.innerHTML, style: style, currentTime: currentTime, createUser: 'lxx', speed: this.s})
          request.onsuccess = function(e) {
            console.log('添加成功')
            db.close()
          }
        })
      }
  ~~~

  未完待续。。。。。
