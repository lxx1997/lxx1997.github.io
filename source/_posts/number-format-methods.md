---
title: 一些惊艳的字符串处理方法
date: 2020-09-24 15:49:01
tags:
    - javascript
    - method
---

### 数字格式化

  描述：将一串`123483245678` 处理成为 `123,483,245,678`

  * eg1:
    自己写的一个比较麻烦的方法
    ~~~js
      // 只实现了整数，其他同理，最好在获取到参数之后进行验证，是否符合自己的需求
      function formatNumber(value) {
      console.log(value)
      let arrStr = []
      const arr = (value + '').split(',')
      for(let i = 0; i < arr.length; i++) {
        let index = 0
        for(let j = arr[i].length - 1; j >= 0;j--) {
          if(index !== 0 && index % 3 === 0) {
          arrStr= [',',...arrStr]
          }
          arrStr= [arr[i][j],...arrStr]
          index++
        }
      }
      return arrStr.join('')
    }
    formatNumber(1234567890)
    ~~~

  * eg2:
    **toLocaleString**
    ~~~js
    (123456789).toLocaleString('en-US')
    ~~~

  * eg3: 
    正则表达式
    ~~~js
      function formatNumber(str) {
        return str.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      }

      console.log(formatNumber("123456789"))
    ~~~

  * eg4:

    ~~~js
      function formatNumber(str) {
        let arr = [],
          count = str.length

        while (count >= 3) {
          arr.unshift(str.slice(count - 3, count))
          count -= 3
        }

        // 如果是不是3的倍数就另外追加到上去
        str.length % 3 && arr.unshift(str.slice(0, str.length % 3))

        return arr.toString()

      }
      console.log(formatNumber("1234567890"))
    ~~~
  
  * eg5:

    ~~~js
      function formatNumber(str) {

        // ["0", "9", "8", "7", "6", "5", "4", "3", "2", "1"]
        return str.split("").reverse().reduce((prev, next, index) => {
          return ((index % 3) ? next : (next + ',')) + prev
        })
      }

      console.log(formatNumber("1234567890"))
    ~~~

