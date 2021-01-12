---
title: javascript-data-methods
date: 2020-12-16 13:59:28
categories: JavaScript
tags:
    - JavaScript
    - array
    - method
---

#### 全局函数（function）

  * decodeURI()  解码某个编码的URI
  * encodeURI()  把字符串编码为URI
  * decodeURIComponent()   解码一个编码的URI组件
  * encodeURIComponent()   把字符串编码为URI组件
  * escape()  对字符串进行编码
  * eval()   计算javascript字符串并把它作为脚本来执行
  * isFinite()  检查某个值是否为有穷大的数
  * isNaN()  检查某个值是否是数字
  * Number()   把对象的值转化为数字
  * parseFloat()   解析一个字符串并返回一个浮点数
  * parseInt() 解析一个字符串并返回一个整数
  * String()  把对象的值转为字符串
  * unescape()  对由escape()编码的字符串进行解码

#### 数组（Array）

  * concat()   连接两个或者更多的数组，并返回结果
  * copyWithin(target, start, end)  将数组的指定位置拷贝元素到数组的另一个指定位置中 （target 指的是元素复制的位数， start指的是元素开始复制的位置，end指的是元素结束复制的位数）
  * entries()  返回一个数组的迭代对象，包含数组的键值对[index, vlaue]
  * every()  检测数组元素的每个元素是否符合条件，如果都满足条件， 返回true，如果不满足返回false
  * some() 检测数值中某个元素是否符合条件，如果有一个符合，返回true，如果全不符合，返回false
  * fill()  使用一个固定值来填充数组
  * filter()  用于筛选数组，返回符合条件的一个新的数组
  * find()  返回符合传入测试的数组元素
  * findIndex()  返回符合传入测试数组元素的索引
  * forEach()  数组的每一个元素都执行一次回调函数
  * map() 循环遍历数组中的每一个值，可以用于修改数组
  * from()   Array.from() 通过给定的对象创建一个数组
  * indexOf() 搜索数组中国的元素，并返回所在位置
  * includes() 判断一个数组是否包含一个指定的值
  * isArray() 判断对象是否是数组
  * join()  把数组中的元素以某个标识拼接为字符串
  * keys()   返回数组的可迭代对象，包含原始数组的键(key)
  * lastIndexOf()  搜索数组中的元素，并返回它最后出现的位置
  * pop()  删除数组中的最后一个元素，并返回删除的元素
  * push()   向数组的末尾添加一个或多个元素，并返回新的长度
  * reduce() 计算元素，可以用于计算数组，筛选，遍历，从左到右
  * reduceRight()  计算元素，可以用于计算数组，筛选，遍历，从右到左
  * reverse()   反转数组的元素顺序
  * shift()   删除并返回数组的第一个元素
  * slice(start, end)  选取数组的一部分，并选取一个新数组
  * sort() 对元素数组进行排序， 可以自定义排序规则
  * splice(index,  many,  item)   从数组中添加和删除元素
  * toString()  将数组转化为字符串，并返回结果
  * unshift()  向数组开头添加一个或多个元素，并返回新的长度
  * valueOf()  返回数组对象的原始值

#### 时间对象（Date）

  ##### 方法
    * date.Date()   返回当日的日期和事件
    * date.getDate()   从Date对象中返回一个月的某一天
    * date.getDay()    从Date对象中返回一周中的某一天
    * Date.getMonth()   返回Date对象的月份（0-11）真实月份需要加
    * date.getFullYear()   返回四位数字的年份
    * date.getYear()   返回两位数字的年份
    * date.getHours()   返回对象的小时数
    * date.getMinutes()  返回对象的分钟数
    * date.getSeconds()  返回对象的秒数
    * date.getMilliseconds()   返回对象的毫秒数
    * date.getTime()  返回1970年1月1日至今的毫秒数
    * date.getUTCDate()   从Date对象中返回世界时一个月的某一天
    * date.getUTCDay()    从Date对象中返回世界时一周中的某一天
    * date.getUTCMonth()   返回Date对象的世界时月份（0-11）真实月份需要加
    * date.getUTCFullYear()   返回世界时四位数字的年份
    * date.getUTCYear()   返回世界时两位数字的年份
    * date.getUTCHours()   返回对象世界时的小时数
    * date.getUTCMinutes()  返回对象世界时的分钟数
    * date.getUTCSeconds()  返回对象世界时的秒数
    * date.getUTCMilliseconds()   返回对象世界时的毫秒数
    * date.parse()    获取1970年1月1日午夜到制定日期（字符串）的毫秒数
    * date.setDate()   设置某一天
    * date.setFullYear()  设置Date对象的年份
    * date.setMonth()   设置月份
    * date.setHours() 设置日期的小时
    * date.setMillisecoends()   设置毫秒数
    * date.setTime()  以毫秒设置date对象
    * date.setMinutes()   设置分钟
    * date.setSeconds()  设置秒
    * date.toDateString()   把对象的日期部分转化为字符串
    * date.toJSON()  以json数据格式返回日期字符串
    * date.toLocaleDateString()   根据本地时间格式，把Date对象的日期部分转为字符串
    * date.toLocaleTimeString()   根据本地时间格式，把Date对象的日期部分转为字符串
    * date.toLocaleString()   根据本地时间格式，把Date对象转为字符串
    * date.valueOf()    返回date对象的原始值
  
  ##### 简单的时间函数
    * 获取当前日期

    ~~~js
      //  以年月日格式获取时间
      getNewDate() {
        var date = new Date()
        date.setTime(date.getTime())// 获取上个月的日期（这一行去掉就是获取今天计算机上的日期了）
        var now = date
        var year = now.getFullYear() // 年
        var month = now.getMonth() + 1 // 月
        var day = now.getDate() // 日
        var clock = year + '-'
        if (month < 10) { clock += '0' }
        clock += month + '-'
        if (day < 10) { clock += '0' }
        clock += day
        return clock
      }
      // 以年月日 时分秒获取时间
      // fmt 为传入的日期格式 
      // yyyy-MM-dd hh:mm:ss  年月日 时分秒
      // yyyy-MM-dd  年月日
      getNowTime(fmt) {
        var date = new Date()
        var o = {
          'M+': date.getMonth() + 1, // 月份
          'd+': date.getDate(), // 日
          'h+': date.getHours(), // 小时
          'm+': date.getMinutes(), // 分
          's+': date.getSeconds(), // 秒
          'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
          'S': date.getMilliseconds() // 毫秒
        }
        if (/(y+)/.test(fmt)) { fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length)) }
        for (var k in o) { if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length))) }
        return fmt
      }
    ~~~

    * 获取当前日期之前或者之后一段时间的日期

    ~~~js
      // 通过setTime将时间设置为当前时间100分钟之后，然后获取设置之后的时间
      getTime() {
        var date = new Date()
        date.setTime(date.getTime + 1000 * 60 * 100)
        var newDate = date.getFullYear() + '-' + (Number(date.getMonth()) + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
      }
    ~~~

    * 比较两个时间的大小

    ~~~js
      // 比较传入的时间大小 时间格式为 yyyy-MM-dd hh:mm:ss
      // 通过date.parse()获取传入时间的毫秒数， 通过new Date() 转化为日期格式，在进行大小比较
      Compare(time1, time2) {
        const date1 = new Date(Date.parse(time1.replace(/-/g, '/')))
        const date2 = new Date(Date.parse(time2.replace(/-/g, '/')))
        if (date1 > date2) {
          return '时间1 大于 时间2'
        } else {
            return '时间2 大于 时间1'
        }
      }
    ~~~



    * 计算所选时间是第几周(当前月第几周，当前年份第几周)

    ~~~js
      getYearWeek(year,month,date){
        /*  
          dateNow是当前日期 
          dateFirst是当年第一天  
          dataNumber是当前日期是今年第多少天  
          用dataNumber + 当前年的第一天的周差距的和在除以7就是本年第几周  
        */      
        let dateNow = new Date(year, parseInt(month) - 1, date);
        let dateFirst = new Date(year, 0, 1);
        let dataNumber = Math.round((dateNow.valueOf() - dateFirst.valueOf()) / 86400000);
        return Math.ceil((dataNumber + ((dateFirst.getDay() + 1) - 1)) / 7);        
      }
      getMonthWeek(year,month,date){
        /*  
          month = 6 - w = 当前周的还有几天过完(不算今天)  
          year + month 的和在除以7 就是当天是当前月份的第几周  
        */      
        let dateNow = new Date(year, parseInt(month) - 1, date);
        let w = dateNow.getDay();//星期数
        let d = dateNow.getDate();
        return Math.ceil((d + 6 - w) / 7);      
      }
    ~~~


#### 数学对象（Math）

  * Math.E	返回算术常亮e，即自然对数的底数（约等于2.718）
  * Math.LN2   返回2的自然对数（约等于0.693）
  * Math.LEN10 返回10的自然对数（约等于2.302）
  * Math.LOG2E 返回以2为底的e的对数（约等于1.414）
  * Math.LOG10E 返回以10为底的e的对数（约等于0.434）
  * Math.PI       返回圆周率（约等于3.14159）
  * Math.SQRT1_2  返回 2 的平方根的倒数（约等于 0.707）
  * Math.SQRT2  返回 2 的平方根（约等于 1.414）
  * Math.abs()   返回数的绝对值
  * Math.acos() 返回数的反余弦值
  * Math.asin() 返回数的反正弦值
  * Math.atan()  以介于 -PI/2 与 PI/2 弧度之间的数值来返回 x 的反正切值
  * Math.atan2(y,x)   返回从 x 轴到点 (x,y) 的角度（介于 -PI/2 与 PI/2 弧度之间）
  * Math.ceil()   向上取整
  * Math.cos()    返回余弦值
  * Math.exp()   返回e的指数
  * Math.floor()   向下取整
  * Math.log()   返回自然数的对数
  * Math.max(x, y)  返回最大值
  * Math.min(x, y)  返回最小值
  * Math.pow(x, y) 返回x的y次幂
  * Math.random()  返回0~1之间的随机数
  * Math.round()  把数四舍五入为最接近的整数
  * Math.sin()   返回数的正弦
  * Math.sqrt()   返回数的平方根
  * Math.tan()  返回角的正切
  * Math.toSource() 返回对象的源代码
  * Math.valueOf()   返回Math对象的原始值

#### 字符串对象（String）

  * charAt()   返回指定位置的字符
  * charCodeAt()  返回指定位置的字符的Unicode编码
  * concat()   连接两个或者更多字符串，并返回新的字符串
  * fromCharCode()  将Unicode编码转为字符
  * indexOf() 返回某个指定的字符串值在字符串首次出现的位置
  * includes() 查找字符串中是否包含指定的字符串
  * lastIndexOf() 从后向前搜索字符串，并从起始位置(0)开始返回字符串最后出现的位置
  * match()   查找找到一个或者多个正则表达式匹配
  * repeat()   复制字符串指定次数，并将它们连接在一起返回
  * replace()  在字符串中查找匹配的字符串，并替换与正则表达式匹配的字符串
  * search()   查找与正则表达式相匹配的值
  * slice()   提取字符串的片段，并在新的字符串中返回被提取的部分
  * split()  把字符串分割为字符串数组
  * startsWith()   查看字符串是否以指定的子字符串开头
  * substr(start, num)  从起始索引号提取字符串中指定数目的字符
  * substring(start,end)  提取两个字符串索引之间的字符
  * toLowerCase()    将字符串转化为小写
  * toUpperCase()    将字符串转化为大写   
  * trim()   去除字符串两边的空白
  * toLocaleLowerCase()  根据本地主机的语言环境把字符串转化为小写
  * toLocaleUpperCase()  根据本地主机的语言环境把字符串转换为大写
  * toString()   返回一个字符串
  * valueOf()   返回某个字符串对象的原始值

  * anchor(text)    创建一个HTML锚  <a name="text"></a>
  * big()  用大号字体显示字符串
  * blink()   闪动文本  (不能用于IE,Chrome,或者Safari)
  * bold()   使用粗体显示字符串
  * fixed()   用打字机文本显示字符串
  * fontcolor()   用指定的颜色来显示字符串
  * fontsize()   使用指定的尺寸来显示字符串
  * italics()   使用斜体显示字符串
  * link()    将字符串显示为连接
  * small()   使用小字号来显示字符串
  * strike()   用于显示加删除线的字符串
  * sub()  把字符串显示为下标
  * sup()  把字符串显示为上标

#### async await

  ​	  async用于申明一个function是异步的，而await用于等待一个异步方法执行完成，await只能出现在async之后

  ##### async

  ​	  async 定义的函数是一个promise对象，如果函数中return 一个直接良，async会把这个直接量通过peomise.resolve()封装成Promise对象

    async函数返回的是一个Promise对象，所以最外层不能用await获取其返回值，可以用过原始的.then()链来处理这个Promise对象

  ​	  Promise 的特点——无等待，所以在没有 `await` 的情况下执行 async 函数，它会立即执行，返回一个 Promise 对象，并且，绝不会阻塞后面的语句。这和普通返回 Promise 对象的函数并无二致

  ##### await

  ​	  await是个运算符，用于组成表达式，await表达式的运算结果取决于它等的东西

  ​	  如果它等到的不是一个Promise对象，那await表达式的运算结果就是它等到的东西

  ​	  如果他等到的是一个Promise对象，await会阻塞后面的代码，等着Promise对象resolve 然后得到resolve的值，作为await表达式的运算结果

  ​	  async函数调用不会造成阻塞，它内部所有的阻塞都被封装在一个Promise对象中异步执行

  ##### async/await 帮我们干了啥

  ​	  async会将气候的函数的返回值封装成一个Promise对象，而await会等待这个Promise完成，并将其resolve的结果返回出来

  ~~~js
  function takeLongTime() {
    return new Promise(resolve => {
        setTimeout(() => resolve("long_time_value"), 1000);
    });
  }
  takeLongTime().then(v => {
      console.log("got", v);
  });
  ~~~

  ~~~js
  function takeLongTime() {
    return new Promise(resolve => {
        setTimeout(() => resolve("long_time_value"), 1000);
    });
  }
  async function test() {
    const v = await takeLongTime();
    console.log(v);
  }
  test();
  ~~~

  ##### async/await的优势在与处理then链

  ​	  单一的Promise并不能发现async/await的优势，如果处理多个Promise组成的then链时，优势就能体现出来了

    假设一个业务分多个步骤完成，每个步骤都是异步的，而且依赖于上一个步骤的结果，如果使用setTimeout来模拟异步操作

  ~~~js
    /**
     * 传入参数 n，表示这个函数执行的时间（毫秒）
     * 执行的结果是 n + 200，这个值将用于下一步骤
     */
    function takeLongTime(n) {
        return new Promise(resolve => {
            setTimeout(() => resolve(n + 200), n);
        });
    }

    function step1(n) {
        console.log(`step1 with ${n}`);
        return takeLongTime(n);
    }

    function step2(n) {
        console.log(`step2 with ${n}`);
        return takeLongTime(n);
    }

    function step3(n) {
        console.log(`step3 with ${n}`);
        return takeLongTime(n);
    }
    // setTimeOut
    function doIt() {
      console.time("doIt");
      const time1 = 300;
      step1(time1)
          .then(time2 => step2(time2))
          .then(time3 => step3(time3))
          .then(result => {
              console.log(`result is ${result}`);
              console.timeEnd("doIt");
          });
    }
    doIt();
    // async/await
    async function doIt() {
      console.time("doIt");
      const time1 = 300;
      const time2 = await step1(time1);
      const time3 = await step2(time2);
      const result = await step3(time3);
      console.log(`result is ${result}`);
      console.timeEnd("doIt");
    }

    doIt();
  ~~~

  ​	现在把业务要求改一下，仍然是三个步骤，但每一个步骤都需要之前每个步骤的结果

  ~~~js
    async function doIt() {
        console.time("doIt");
        const time1 = 300;
        const time2 = await step1(time1);
        const time3 = await step2(time1, time2);
        const result = await step3(time1, time2, time3);
        console.log(`result is ${result}`);
        console.timeEnd("doIt");
    }

    // setTimeOut
    function doIt() {
      console.time("doIt");
      const time1 = 300;
      step1(time1)
          .then(time2 => {
              return step2(time1, time2)
                  .then(time3 => [time1, time2, time3]);
          })
          .then(times => {
              const [time1, time2, time3] = times;
              return step3(time1, time2, time3);
          })
          .then(result => {
              console.log(`result is ${result}`);
              console.timeEnd("doIt");
          });
    }
  ~~~

#### 获取屏幕宽高

  ##### 获取屏幕高度方法

    - document.body.clientWidth ==> BODY对象宽度  
    - document.body.clientHeight ==> BODY对象高度  
    - document.documentElement.clientWidth ==> 可见区域宽度  
    - document.documentElement.clientHeight ==> 可见区域高度  
    - 网页可见区域宽： document.body.clientWidth  
    - 网页可见区域高： document.body.clientHeight  
    - 网页可见区域宽： document.body.offsetWidth (包括边线的宽)  
    - 网页可见区域高： document.body.offsetHeight (包括边线的高)  
    - 网页正文全文宽： document.body.scrollWidth  
    - 网页正文全文高： document.body.scrollHeight  
    - 网页被卷去的高： document.body.scrollTop  
    - 网页被卷去的左： document.body.scrollLeft  
    - 网页正文部分上： window.screenTop  
    - 网页正文部分左： window.screenLeft  
    - 屏幕分辨率的高： window.screen.height  
    - 屏幕分辨率的宽： window.screen.width  
    - 屏幕可用工作区高度： window.screen.availHeight  
    - 屏幕可用工作区宽度： window.screen.availWidth  

  ##### 部分jQuery函数  

    - $(window).height() 　//浏览器时下窗口可视区域高度   
    - $(document).height()　　　　//浏览器时下窗口文档的高度   
    - $(document.body).height()　　　　　　//浏览器时下窗口文档body的高度   
    - $(document.body).outerHeight(**true**)　//浏览器时下窗口文档body的总高度 包括border padding margin   
    - $(window).width() 　//浏览器时下窗口可视区域宽度   
    - $(document).width()//浏览器时下窗口文档对于象宽度   
    - $(document.body).width()　　　　　　//浏览器时下窗口文档body的高度   
    - $(document.body).outerWidth(**true**)　//浏览器时下窗口文档body的总宽度 包括border padding  

  ##### HTML精确定位:scrollLeft,scrollWidth,clientWidth,offsetWidth   

    - scrollHeight: 获取对象的滚动高度。   
    - scrollLeft:设置或获取位于对象左边界和窗口中目前可见内容的最左端之间的距离   
    - scrollTop:设置或获取位于对象最顶端和窗口中可见内容的最顶端之间的距离   
    - scrollWidth:获取对象的滚动宽度   
    - offsetHeight:获取对象相对于版面或由父坐标 offsetParent 属性指定的父坐标的高度   
    - offsetLeft:获取对象相对于版面或由 offsetParent 属性指定的父坐标的计算左侧位置   
    - offsetTop:获取对象相对于版面或由 offsetTop 属性指定的父坐标的计算顶端位置   
    - event.clientX 相对文档的水平座标   
    - event.clientY 相对文档的垂直座标   
    - event.offsetX 相对容器的水平坐标   
    - event.offsetY 相对容器的垂直坐标   
    - document.documentElement.scrollTop 垂直方向滚动的值   
    - event.clientX+document.documentElement.scrollTop 相对文档的水平座标+垂直方向滚动的量 

