---
title: HTML 标签及函数
date: 2020-08-11 10:09:34
tags:
    - html
    - function
---

#### HTML全局属性

  * accesskey 规定激活元素的快捷键，使元素获得焦点（Opera浏览器不支持此选项）

    以下元素支持accesskey a, area, button, input, label, legend 以及 textarea

  * contenteditable 规定元素内容是否可编辑，如果元素未设置contenteditable 属性，那么元素将会从其父元素继承该属性

    `contenteditable = true | false`
  
  * contextmenu 规定 div 元素的上下文菜单。上下文菜单会在用户右键点击元素时出现，contextmenu 属性的值是要打开的 menu 元素的 id，**目前只有fireFox支持**

    ~~~html
      <div contextmenu="mymenu">
        <menu type="context" id="mymenu">
          <menuitem label="Refresh"></menuitem>
          <menuitem label="Twitter"></menuitem>
        </menu>
      </div>
    ~~~
    

  * data-* 用来嵌入自定义数据，赋予我们在所有 HTML 元素上嵌入自定义 data 属性的能力，属性名不应该包含任何大写字母，并且在前缀 "data-" 之后必须有至少一个字符

  * dir 属性规定元素内容的文本方向 `ltr`: 从左到右 `rtl`: 从右到左

    *dir属性在以下标签中无效base, br, frame, frameset, hr, iframe, param 以及 script*

  * draggable 规定元素是否可拖拽 `true|false|auto`

    *在使用时要和函数连用`ondragstart`,`ondragover`,`ondrop`*

    ~~~html
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
        <style>
          html,body{
            width: 100%;
            height: 100%;
          }
          #div{
            position: absolute;
            top: 200px;
            border: 1px solid rebeccapurple;
            height: 20px;
            width: 100px;
          }
        </style>
      </head>
      <body >
        <div id="div" ondrop="drop(event)" ondragover="allowDrop(event)"></div>
        <p id="drag" draggable="true" dropzone="link" ondragstart="drag(event)">3242342342</p>
        <script>
          function drag(e) {
            console.log(e)
            e.dataTransfer.setData('Text', e.target.id)
          }
          function drop(e) {
            var data = e.dataTransfer.getData("Text");
            e.target.appendChild(document.getElementById(data));
            e.preventDefault();
          }
          function allowDrop(e) {
            e.preventDefault();
          }
        </script>
      </body>
      </html>
    ~~~

    *在与contenteditable连用时不起作用*

  * dropzone 拖动数据会产生被拖动数据的副本
      
    * `copy`	拖动数据会产生被拖动数据的副本。
    * `move`	拖动数据会导致被拖动数据被移动到新位置。
    * `link`	拖动数据会产生指向原始数据的链接。
    
    *暂无浏览器支持*

  * hidden 规定元素是否显示 是布尔属性 hidden属性可以用于防止用户查看元素，知道匹配某些条件

    *在 XHTML 中，属性简写是禁止的，hidden 属性必须定义为 `<element hidden="hidden">`*

  * lang 规定了元素内容的语言 `zh,en`

    *lang 属性在以下标签中无效：`<base>, <br>, <frame>, <frameset>, <hr>, <iframe>, <param> 以及 <script>`。*

  * spellcheck 规定是否对元素进行拼写和语法检查

    * input 元素中的文本值（非密码）
    * `<textarea>` 元素中的文本
    * 可编辑元素中的文本

  * tabindex 规定元素的 tab 键控制次序（当 tab 键用于导航时）

    *以下元素支持 tabindex 属性：`<a>, <area>, <button>, <input>, <object>, <select> 以及 <textarea>`,几乎所有浏览器均 tabindex 属性，除了 Safari*

  * translate 规定不应翻译某些元素

    *所有主流浏览器都无法正确地支持 translate 属性,请使用 class="notranslate" 替代*

#### HTML事件属性

  * **Window 事件属性**  针对 window 对象触发的事件（应用到 <body> 标签）

    onload  页面结束加载之后触发

    onresize  浏览器窗口被调整大小时触发

    onunload  一旦页面已下载时触发（或者浏览器窗口已被关闭）

  * **Form 事件** 由 HTML 表单内的动作触发的事件（应用到几乎所有 HTML 元素，但最常用在 form 元素中）

    onblur  元素失去焦点时运行的脚本

    onchange  元素值被改变时运行的脚本

    onfocus  当元素获得焦点时运行的脚本

    onselect  在元素中文本被选中后触发

    onsubmit  在提交表单时触发

  * **keyboard 事件**

    onkeyup 用户释放按键时触发

    onkeydown 用户按下按键时触发

    onkeypress 用户敲击按钮时触发

  * **mouse 事件**

    onclick  元素发生鼠标点击时触发

    ondbclick  元素发生鼠标双击时触发

    ondrag, ondragend, ondragstart ondrop, ondragenter, ondragerleave, ondragover  元素拖拽时触发

    onmousedown  按下鼠标按钮时触发

    onmouseup  释放鼠标按钮时触发

    onmousemove  鼠标指针移动到元素上触发

    onmouseover  鼠标指针移出到元素上触发

    onmousewheel  鼠标滚轮正在滚动时运行的脚本

    onscroll  当元素滚动条被滚动时运行的脚本

  * **Media 事件**

    onabort  在退出时运行的脚本

    oncanplay  当文件就绪可以开始播放时运行的脚本(缓冲已足够开始时)

    onwaiting  当媒介已停止播放单打算继续播放时

#### 标签

  * base 标签

    `<base href="http://www.baidu.com/static/">`

    `<base>` 标签为页面上所有链接规定默认地址和默认目标，在通常情况下浏览器会从单签文档的url中提取响应的元素来填写URL中的空白，但是`<base>`标签可以改变着一点，浏览器随后将不再使用当前文档的url，而是使用指定的基本url，包括`<a>`,`<img>`,`<link>`,`<form>`标签中的URL

    **`<base>`标签必须位于head元素内部**

  * basefont 标签

    `<basefont color="red" size="5">` 

    规定页面上默认字体颜色和字号, *主流浏览器暂不支持此标签*

  * blockquote 标签

   `<blockquote>` 标签定义块引用， 标签中的所有文本都会从常规文本中分离出去，经常左右两边有间距，而且有时会使用斜体，也就是说块引用拥有自己的空间

   把页面作为 strict XHTML 进行验证，那么 `<blockquote>` 元素必须包含块级元素

  * datalist 标签

    datalist 描述了input 标签的可能值

    ~~~html
      <input id="myCar" list="cars">
      <datalist id=cars>
        <option value="BMW">
        <option value="FORD">
        <option value="VOLVO">
      </datalist>  
    ~~~

    datalist 标签标签定义选项列表，与input元素配合使用，定义input可能的值，datalist及其元素不会被显示出来，仅仅是合法输入值列表， 用input的list属性来绑定datalist

  * del 删除线

  * details 标签

    用于描述文档或者文档某个部分的细节

    ~~~html
      <details>
        <summary>Copyright 2011.</summary>
        <p>All pages and graphics on this web site are the property of W3School.</p>
      </details>
    ~~~

    *目前只有 Chrome 支持 `<details>` 标签。*

  * dialog 标签 

    dialog 标签定义对话框或窗口是HTML5的新标签

  * embed 标签
  
    `<embed>` 标签定义嵌入的内容，比如插件。

    ~~~js
      <embed src="helloworld.swf" type="MIME_type" />
    ~~~

  * fieldset 标签

    ~~~html
      <form>
        <fieldset>
          <legend>health information</legend>
          height: <input type="text" />
          weight: <input type="text" />
        </fieldset>
      </form>
    ~~~

    `<fieldset>` 元素可将表单内的相关元素分组，将表单内容的一部分打包，生成一组相关表单的字段

    `<legend>` 标签为` <fieldset>` 元素定义标题。

  * figcaption 标签

    用作文档中插图的图像，带有一个标题

    ~~~html
      <figure>
        <figcaption>黄浦江上的的卢浦大桥</figcaption>
        <img src="shanghai_lupu_bridge.jpg" width="350" height="234" />
      </figure>
    ~~~

    `<figcaption>` 标签定义 figure 元素的标题,应该被置于 "figure" 元素的第一个或最后一个子元素的位置

  * frame 标签

    ~~~html
      <frameset cols="25%,50%,25%">
        <frame src="frame_a.htm" />
        <frame src="frame_b.htm" />
        <frame src="frame_c.htm" />
      </frameset>
    ~~~

    `<frame>` 标签定义 frameset 中的一个特定的窗口

  * frameset 标签

    frameset 元素可定义一个框架集。它被用来组织多个窗口（框架）。每个框架存有独立的文档

    * cols 定义框架集中列的数目和尺寸
    * rows 定义框架集中行的数目和尺寸

  * iframe 标签

    iframe 元素会创建包含另外一个文档的内联框架（即行内框架）

    * frameborder 规定是否显示框架周围的边框
    * height 规定iframe的高度
    * width 定义 iframe 的宽度
    * marginheight 定义 iframe 的顶部和底部的边距
    * marginwidth 定义 iframe 的左侧和右侧的边距
    * name 规定 iframe 的名称
    * scrolling `yes/no/auto` 规定是否在 iframe 中显示滚动条
    * src 规定在 iframe 中显示的文档的 URL

  * **img** 标签
    
    * alt 规定图像的替代文本
    * src 规定显示图像的 URL
    * height 定义图像的高度
    * width 设置图像的宽度
    * ismap 将图像定义为服务器端图像映射
    * usemap 将图像定义为客户器端图像映射

  * **input** 标签

    * accept 规定通过文件上传来提交的文件的类型
    * alt 定义图像输入的替代文本
    * autocomplete `on/off` 规定是否使用输入字段的自动完成功能
    * autofocus 规定输入字段在页面加载时是否获得焦点，（不适用于 type="hidden"）
    * checked 规定此 input 元素首次加载时应当被选中
    * disabled 当 input 元素加载时禁用此元素
    * form 规定输入字段所属的一个或多个表单
    * list 引用包含输入字段的预定义选项的 datalist
    * max 规定输入字段的最大值
    * min 规定输入字段的最小值
    * maxlength 规定输入字段中的字符的最大长度
    * multiple 如果使用该属性，则允许一个以上的值
    * name 定义 input 元素的名称
    * pattern 规定输入字段的值的模式或格式，通常用于表单输入内容验证是否规则
    * placeholder 规定帮助用户填写输入字段的提示
    * readonly 规定输入字段为只读
    * required 指示输入字段的值是必需的
    * size 定义输入字段的宽度
    * src 定义以提交按钮形式显示的图像的 URL
    * type `button/checkbox/file/hidden/image/password/radio/reset/submit/text/tel/email/teatarea/radio` 规定 input 元素的类型
  
  * keygen 标签

    ~~~html
      <form action="demo_keygen.asp" method="get">
        Username: <input type="text" name="usr_name" />
        Encryption: <keygen name="security" />
        <input type="submit" />
      </form>
    ~~~

    `<keygen>` 标签规定用于表单的密钥对生成器字段。当提交表单时，私钥存储在本地，公钥发送到服务器

  * **link** 标签

    `<link>` 标签定义文档与外部资源的关系

    * href 规定被链接文档的位置
    * rel  `alternate/author/elp/icon/licence/next/pingback/prefetch/prev/search/sidebar/stylesheet/tag`  规定当前文档与被链接文档之间的关系
    * type 规定被链接文档的 MIME 类型

  * map 标签

    ~~~html
      <map name="planetmap" id="planetmap">
        <area shape="circle" coords="180,139,14" href ="venus.html" alt="Venus" />
        <area shape="circle" coords="129,161,10" href ="mercur.html" alt="Mercury" />
        <area shape="rect" coords="0,0,110,260" href ="sun.html" alt="Sun" />
      </map>
    ~~~

    定义一个客户端图像映射。图像映射（image-map）指带有可点击区域的一幅图像。

    `area` 元素永远嵌套在 `map` 元素内部。`area` 元素可定义图像映射中的区域

  * mark 标签

    `<mark>` 标签定义带有记号的文本。请在需要突出显示文本时使用 `<m>`标签

  * meta 标签

    `<meta>` 元素可提供有关页面的元信息（meta-information），比如针对搜索引擎和更新频度的描述和关键词,`<meta>` 标签位于文档的头部，不包含任何内容。`<meta>` 标签的属性定义了与文档相关联的名称/值对

    * content 定义与 http-equiv 或 name 属性相关的元信息
    * http-equiv `content-type/expires/refresh/set-cookie`  把 content 属性关联到 HTTP 头部
    * name 	`author/description/keywords/generator/revised/others` 把 content 属性关联到一个名称
    * scheme 定义用于翻译 content 属性值的格式
  
  * meter 标签

    使用meter 元素来度量给定范围内的数据

    ~~~html
      <meter value="3" min="0" max="10">十分之三</meter>
    ~~~

    `<meter>` 标签定义已知范围或分数值内的标量测量。也被称为 gauge（尺度）
  
  * object 标签

    向 HTML 代码添加一个对象
    ~~~html
      <object classid="clsid:F08DF954-8592-11D1-B16A-00C0F0283628" id="Slider1" width="100" height="50">
        <param name="BorderStyle" value="1" />
        <param name="MousePointer" value="0" />
        <param name="Enabled" value="1" />
        <param name="Min" value="0" />
        <param name="Max" value="10" />
      </object>
    ~~~