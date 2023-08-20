---
title: 使用js压缩图片
date: 2020-08-10 10:17:32
updated: 2020-08-10 10:17:32
tags:
    - JavaScript
    - canvas
cover: /assets/blogCover/Day18 I’m Not Human_100789898.png
---

  压缩图片的方式主要是使用了canvas进行了一次转码和压缩
  使用的方法
  * var fr =  FileReader()
  * fr.readAsDataURL(file)
  * Image()
  * canvas.toDataURL(imgType, quality)

#### FileReader() 函数

  * 使用

  ~~~js
    var reader = new FileReader()
    reader.onload = function(e) {
      console.log(e.target.result)
    }
    reader.readAsText(file)
  ~~~

    
  
  * 属性

    **error**

      返回读取文件时的错误信息
    
    **onabort**

      包含在终止事件被触发时执行的事件处理程序，举例，当读取文件的过程中需要中止时。

    **onload**

      当`FileReader`读取文件的方式为`readAsArrayBuffer`,`readAsBinaryString`, `readAsDataURL` 或者 `readAsText` 的时候，会触发一个 `load` 事件。从而可以使用  `FileReader.onload` 属性对该事件进行处理。
    
    **readyState**

      提供 FileReader 读取操作时的当前状态

    **result**

      返回文件的内容。只有在读取操作完成后，此属性才有效，返回的数据的格式取决于是使用哪种读取方法来执行读取操作的。

      一个字符串或者一个ArrayBuffer ，这取决于读取操作是使用哪种方法来进行的

  * 方法

    **abort()**

    abort方法可以取消FileReader的读写操作，触发之后readyState为已完成(DONE)
  
    **readAsArrayBuffer()**

    FileReader 接口提供的`readAsArrayBuffer` 用于启动读取指定的`Blob`或者`File`的内容，当操作完成时，`readyState`变成`done`并且触发`loadend`事件，result属性中将包含一个ArrayBuffer对象表示所读取文件的数据

    **readAsBinaryString()**

    `readAsBinaryString` 方法读取指定的`blob`或者`File`的内容，当操作完成时，`readyState`变成`done`并且触发`loadend`事件，result属性中将包含一个ArrayBuffer对象表示所读取文件原始二进制格式

    *该方法已从 FileAPI 标准移除，请使用 FileReader.readAsArrayBuffer() 代替。*

    **readAsDataURL()**

    `readAsDataURL` 方法会读取指定的 `Blob` 或 `File` 对象。读取操作完成的时候，`readyState` 会变成已完成DONE，并触发 `loadend` 事件，同时 `result` 属性将包含一个data:URL格式的字符串（base64编码）以表示所读取文件的内容

    **readAsText()**
  
    `readAsText` 方法可以将 `Blob` 或者 `File` 对象转根据特殊的编码格式转化为内容(字符串形式)

    这个方法是异步的，也就是说，只有当执行完成后才能够查看到结果，如果直接查看是无结果的，并返回undefined

    必须要挂载 实例下的 onload 或 onloadend 的方法处理转化后的结果

    转化完成后， readyState 这个参数就会转换 为 done 即完成态， event("loadend") 挂载的事件会被触发，并可以通过事件返回的形参得到中的 FileReader.result 属性得到转化后的结果

    ~~~js
      // [encoding] 编码类型， 可选
      FileReader.readAsText(blob[, encoding]);
    ~~~

  #### 开始进行图片压缩

    * 首先，创建一个input输入框用来上传文件

    ~~~html
      <input type="file" multiple="" id="file" />
      <input type="button" value="提交" onclick="handleChoose()">
    ~~~

    * 获取上传的文件

    ~~~js
      const handleChoose = function() {
        const file = Array.from(document.getElementById('file').files)
        const filePath = document.getElementById('file').value
        const imgBox = document.getElementById('img')
        const imgs = []
        file.map(item => {
          let reader = new FileReader()
          const img = document.createElement('img')
          // 将file文件 转码为base64
          reader.readAsDataURL(item)
          // FileReader插件转码成功之后
          reader.onload = function() {
            img.src = reader['result']
            console.log(img.src, 123)
            const imgType = img.src.split(';')[0].split(':')[1]
            imgBox.appendChild(img)
            const callback = function(data) {
              console.log(data, 456)
            }
            scaleImage(img.src, imgType, callback)
          }
          // FileReader插件转码失败
          reader.onerror = function(e) {
            console.log(e)
          }
          // FileReader插件转码成功
          reader.onloadend = function(e) {
          }
        })
      }
    ~~~

    * 进行图片压缩

    ~~~js
      function scaleImage(base64Url, imgType, callback ) {
        const img = new Image()
        img.src= base64Url
        img.onload = function() {
          let _this = this
          let width = _this.width
          let height = _this.height
          let quality = 0.7
          let canvas = document.createElement('canvas')
          let ctx = canvas.getContext('2d')
          let canvasW = document.createAttribute('width')
          let canvasH = document.createAttribute('height')
          canvasW.nodeValue = width
          canvasH.nodeValue = height
          canvas.setAttributeNode(canvasW)
          canvas.setAttributeNode(canvasH)
          ctx.drawImage(_this, 0, 0, width, height)
          let base64 = canvas.toDataURL("image/jpeg", quality)
          // toDataUrl
          // 图片格式默认为 image/png
          // 在指定格式为image/jpeg 或image.webp得情况下，可以从0,1的区间内压缩图片质量，如果超出取值范围，将会使用默认值0.92
          callback(base64)
        }
      }
    ~~~

