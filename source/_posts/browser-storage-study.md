---
title: 浏览器存储方式学习  cookie, session, localstorage, indexedDB
date: 2020-07-22 15:27:33
tags:
      - browser
      - localStorage
      - indexedDB
cover: '/assets/cover/20200225A1295.jpg'
---

#### 浏览器存储方式

 * cookie： cookie相当于客户端和服务器之间进行信息交互的一个标识，每次客户端访问服务器的时候都会携带上cookie，这样服务器就可以知道是谁来访问了。

 * Storage: Storage 是专门为浏览器存储提供的数据存储机制，分为localStorage和sessionStorage, 保存的数据以键值对的形式存在，并且以文本格式保存

 * indexedDB: indexedDB是运行在浏览器上的非关系型数据库, 一般来说是没有存储上限的, 不仅可以存储字符串, 还可以存储二进制数据



#### Cookie

  cookie的本职工作并非本地存储,而是维持状态，它是浏览器存储在用户机器上的一个小文本，大小不能超过4K

  cookie根据过期时间分为两类：会话cookie和持久cookie

  * 会话cookie是一种临时cookie，当用户退出浏览器，会话cookie就会被删除

  * 持久cookie则会存储在硬盘中，保存时间更长，浏览器关闭并不会删除cookie，通常持久性cookie会维护某一个用户周期性访问服务器配置文件或者登陆信息

  **访问方式**

  通过`document.cookie`来设置或获取cookie的值

  产生Cookie的服务器可以向set-Coolie响应首部添加一个domain属性来控制那些站点可以看到这个cookie

  ~~~js
    Set-Cookie:name="losstie"domain="m.baidu.com"
  ~~~

  **属性**

  * path参数告诉浏览器cokie的路径，默认情况下，cookie属于当前页面

  * secure 设置里secure，cookie只有在https协议加密的情况下才会发送给服务端

  * HttpOnly 禁止javascript操作cookie（避免跨域脚本xss攻击，通过javascript的document.cookie 无法访问带有HttpOnly标记的cookie）

  **第三方cookie**

  第三方cookie就是cookie的域和地址栏中的域，这种cookie通常悲痛在第三方广告网站，用于跟踪用户的浏览记录，并根据手机的用户浏览习惯，给用户推送相关广告

  **劣势**

  * cookie 存储信息少，不能超过4K，当cookie超过4KB是，会面临被裁剪的命运

  * 每次请求都会携带在http头中，过量的cookie会损耗性能

  * cookie会紧跟域名，同一个域名下的所有请求都会携带cookie

  * 不安全，服务器没法分辨用户和攻击者，攻击者可以读取网络上其他用户信息，包含HTTP Cookie的所有内容，以便进行中间攻击，使用跨站点脚本技术可以窃取cookie

#### Web Storage

  **localStorage**

  localStorage是持久化的本地存储，存储在其中的数据永远不会过期，只能手动删除，遵循同源策略

  **sessionStorage**

  sessionStorage是临时性的本地存储，会话级别，当页面或者会话结束时，存储内容也随之被释放，遵循同源策略，但是要保证在同一个窗口，否则无法共享内容

  ~~~js
    // localStorage
    保存数据：localStorage.setItem(key, value)
    读取数据：localStorage.getItem(key)
    移除数据：localStorage.removeItem(key)
    清除所有数据：localStorage.clear()
    得到某个索引的key：localStorage.key(index)

    // sessionStorage
    保存数据：sessionStorage.setItem(key, value)
    读取数据：sessionStorage.getItem(key)
    移除数据：sessionStorage.removeItem(key)
    清除所有数据：sessionStorage.clear()
    得到某个索引的key：sessionStorage.key(index)
  ~~~

  web storage 存储容量大，根据浏览器的不同，存储容量乐意达到5~10M之间 chrome，Firefox，edge都是5M，而且仅位于浏览器端，不与服务端发生通信

#### indexedDB

  indexedDB是一个运行在浏览器上的非关系型数据库，一般来说是没有存储上限的，不仅可以存储字符串，还可以存储二进制数据

  indexedDB 允许存入大量数据，提供查找接口，还能建立索引，就数据库类型而言，indexedDB 不属于关系型数据库（不支持sql查询语句），更接近NoSQL数据

  **特点**

  * 键值对储存， indexedDB内部采用对象仓库（object store）存放数据

  * 异步，indexedDb操作时不会锁死浏览器，用户依然可以进行其他操作

  * 支持事务，只要有一步失败，整个事务就都取消，数据库回滚到事务发生之前的状态，不存在之改写一部分数据的情况

  * 同源限制，每一个数据库对应创建他的域名，网页只能访问自身域名下的数据库，而不能访问跨域的数据库

  * 存储空间大

  * 支持二进制存储

  **操作**

  ~~~js
    // 建立打开 indexedDB

    window.indexedDB.open('testDB')

    // 关闭indexedDB 

    indexdb.close()

    // 删除indexedDB
     
     indexedDB.deleteDatabase(indexdb)
  ~~~

  **基本概念**

  indexedDB是一个比较复杂的API,涉及不少概念，它把不同的实体，抽象成一个个对象接口

  * **数据库**  数据库是一系列相关的容器，每个域名（协议+端口+域名）都可以新建任意多个数据库， 同时indexedDB数据库有版本的概念，同一时刻只能有一个版本的数据库存在，如果要修改数据库结构，只能通过升级数据库版本完成

  * **对象仓库**  每个数据库包含若干个对象仓库， 类似于关系型数据库的表格

  * **数据记录**  对象仓库保存的数据记录，每个记录类似于关系型数据库的行，但是只有逐渐和数据体两部分，主键用来建立默认索引，必须是不同的

  * **索引**  为了加速数据的检索，可以在对象仓库里面，为不同的属性建立索引

  * **事务**  数据记录的读写和删改都要通过事务完成。事务对象提供`error`,`about`和`complete`三个事件，用来监听操作结果

  **操作流程**

  * 打开数据库

    ~~~js
      // 打开数据库
      var request = window.indexedDB.open(databaseName, version)
      // 改方法接受两个参数，第一个参数是字符串，表示数据库的名字，如果指定的数据不存在，就会创建新的数据库，第二个是整数，表示数据库版本，如果省略，
      // indexedDB.open()返回一个IDBRequest对象。这个对象通过三个事件error,success,upgradeneeded 处理数据库的操作结果
      // error 事件表示打开数据库失败
      request.onerror = function(event) {
        console.log('数据库打开失败')
      }
      // success 事件表示成功打开的数据
      var db
      request.onsuccess = function(event) {
        db.request.result
        console.log('数据库打开成功')
      } 
      // success 事件表示成功打开的数据 此时通过request对象的result属性拿到数据库对象
      var db
      request.onsuccess = function(event) {
        db.request.result
        console.log('数据库打开成功')
      } 
      // upgradeneeded 事件如果指定的版本号大于数据的实际版本号，就会发生数据库升级事件 此时通过request对象的result属性拿到数据库对象
      var db;
      request.onupgradeneeded = function (event) {
        db = event.target.result;
      }
    ~~~

  * 新建数据库

    新建数据库和打开数据库是同一个操作，如果指定的数据库不存在就会创建，后续的操作主要是在`upgradeneeded`事件的监听函数里面完成，因为这时版本从无到有，所以会触发这个事件

    通常新建数据库之后，第一件事是新建对象仓库（即新建表）

    ~~~js
      request.onupgradeneeded = function(event) {
        db = event.target.result
        var objectStore = db.createObjectStore('person', {keyPath: 'id'})
      }
    ~~~

    上述代码，数据库新建成功之后，新增一张叫做person的表格，主键是id

    更好的写法是先判断一下这张表格是否存在，如果不存在再新建

    ~~~js
      request.onupgradeneeded = function (event) {
        db = event.target.result
        var objectStore;
        if(!db.objectStoreNames.contains('person')) {
          objectStore = db.createObjectStore('person', {keyPath: 'id'})
        }
      }
    ~~~

    如果数据记录里面没有适合主键的属性，那么可以让indexedDB自动生成主键

    ~~~js
      var objectStore = db.createObjectStore('person', {autoIncrement: true})
    ~~~

    新建对象仓库之后，可以新建索引

    ~~~js
      request.onupgradeneeded = function(event) {
        db = event.target.result
        var objectStore = db.createObejctStore('person', {keyPath: 'id'})
        objectStore.createIndex('name', 'name', {unique: false})
        objectStore.createIndex('email', 'email', {unique: false})
      }
    ~~~
  
  * 新增数据

    新增数据指的是向对象仓库写入数据记录，这需要通过事务完成

    ~~~js
      function add() {
        var request = db.transaction(['person'], 'readwrite')
          .objectStore('person').add({id: 1, name: '张三', 'age': 24, email: 'zhangsan@example.com'})

        request.onsuccess = function (event) {
          console.log("数据写入成功")
        }

        request.onerror = function(event) {
          console.log("数据写入失败")
        }
      }

      add()
    ~~~

    写入数据需要新建一个事务，新建事务时必须指定表格名称和操作模式("只读","读写")，新建事务后，通过`IDBTransaction.objectStore(name)`方法拿到IDBObjectStore对象，在通过表格对象的add()方法，向表格写入一条数据

    写入是一个异步操作，通过监听连接对象的`success`事件和`error`事件，了解事件是否写入成功

  * 读取数据

    读取数据也是通过事务完成

    ~~~js
      function read() {
        var transaction = db.transaction(['person'])
        var objectStore = transaction.objectStore('person')
        // objectStore.get(1) 参数是主键的值
        var request  = objectStore.get(1)

        request.onerror = function(event) {
          console.log("事务失败")
        }

        request.onsuccess = function(event) [
          if(request.result) {
            console.log('name:' + request.result.name)
            console.log('age:' + request.result.age)
            console.log('email:' + request.result.email)
          } else  {
            console.log('没有获取到数据')
          }
        ]
      }
    ~~~
  * 遍历数据

    遍历数据表格的所有记录，要使用指针对象IDBCursor

    ~~~js
      function readAll() {
        var objectStore = db.transaction('person').objectStore('person')

        objectStore.openCursor().onsuccess = function(event) {
          var cursor = event.target.result
          if(cursor) {
            console.log('Id: ' + cursor.key);
            console.log('Name: ' + cursor.value.name);
            console.log('Age: ' + cursor.value.age);
            console.log('Email: ' + cursor.value.email)
            cusor.continue()
          } else {
            console.log('没有更多数据了！')
          }
        }
      }
      readAll()
    ~~~

    上述代码中，新建指针对象的openCursor()方法是一个异步操作，所以要监听success时间

  * 更新数据

    更新数据用IDBObject.put()方法

    ~~~js
      function update() {
        var request = db.transaction(['person'], 'readwrite')
          .objectStore('person')
          .put({id: 1, name: '李四'， age: 35, email: 'lisi@example.com'})

        request.onsuccess = function (event) {
          console.log('数据更新成功')
        }
        request.onerror = function(event) {
          console.log('数据更新失败')
        }
      }

      update()
    ~~~

  * 删除数据

    IDBOjectStore.delete()方法用于删除记录

    ~~~js
      function remove() {
        var request = db.transaction(['person'], 'readwrite')
          .objectStore('person')
          .delete(1)
        request.onsuccess = function (event) {
          console.log('数据删除成功');
        }
      }
      remove()
    ~~~

  * 使用索引
    索引的意义在于，可以让你搜索任意字段，也就是说从任意字段拿到数据记录。如果不建立索引，默认只能搜索主键（即从主键取值）
    ~~~js
      objectStore.createIndex('name', 'name', { unique: false });

      var transaction = db.transaction(['person'], 'readonly');
      var store = transaction.objectStore('person');
      var index = store.index('name');
      var request = index.get('李四');

      request.onsuccess = function (e) {
        var result = e.target.result;
        if (result) {
          // ...
        } else {
          // ...
        }
      }
    ~~~

    **myself understand**

    * 使用 `window.indexedDB.open(databaseName, version)` 创建数据库的时候如果数据库不存在，会触发 `onupgradeneeded` 方法

    * 如果 创建数据库的时候数据库已存在, 会触发 `onsuccess`方法

    * 在实际应用中，我们应该先触发一次`onupgradeneeded`来创建数据库和我们所需要的表

    * 然后在`onsuccess`方法中实现自己想要实现的方法

    * 表格的增删一般在数据库版本变更的时候操作 即在`onupgradeneeded`方法中

    * 数据的增删查等操作一般在`onsuccess`方法中实现，此时不能涉及到数据库版本变更，否则会报错