---
title: 前端 - 文字换行
cover: /assets/blogCover/1578912686790.jpg
date: 2023-01-18 09:38:33
updated: 2023-01-18 09:38:33
categories:
  - web
tags:
  - web
  - JavaScript
  - css
---

#### white-sapce

`white-sapce` 可以通过 `nowrap` 或者 `wrap` 来控制一行文字在超出文本框长度时是否换行

* `normal`: 默认。空白会被浏览器忽略。
* `pre`: 空白会被浏览器保留。其行为方式类似 `HTML` 中的 `pre` 标签。
* `nowrap`: 文本不会换行，文本会在在同一行上继续，直到遇到 `br` 标签为止。
* `pre-wrap`: 保留空白符序列，但是正常地进行换行。
* `pre-line`: 合并空白符序列，但是保留换行符。
* `inherit`: 规定应该从父元素继承 `white-space` 属性的值。

`word-break` 可以设置文字换行时是 自动换行还是 强制换行

* `normal`: 只在允许的断字点换行(浏览器保持默认处理)
* `break-word`: 在长单词或URL地址内部进行换行
* `break-all`: 强制换行，会打断英文单词

#### 文本超出隐藏

~~~css
white-space: nowrap;
overflow: hidden;
text-overflow: hidden;
~~~


#### 文本超出显示省略号

~~~css
white-space: nowrap;
overflow: hidden;
text-overflow: ellipsis;
~~~


#### 多行文本超出显示省略号

~~~css
overflow : hidden;
text-overflow: ellipsis;
display: -webkit-box;
-webkit-line-clamp: 2;
-webkit-box-orient: vertical;
~~~

但是这种操作具有浏览器兼容性问题，在部分浏览器上并不适用，所以还有另一种解决方案，可以通过计算的方式来添加省略号
[这是代码](/assets/demo/clamp.js)

~~~js
import clamp from "clamp" // 首先引入js
clamp(domEle, {
  clamp: 2,
  splitOnChars: ["。", ".", "-", "–", "—", " "]
})
~~~

通过以上操作，会将domEle 里面的文本超出两行时会显示省略号，如果遇到一行无法完整显示的词，会根据splitOnChars 里面的参数判断是否需要将单词拆开换行

也可以通过修改 clamp 参数来控制显示行数
