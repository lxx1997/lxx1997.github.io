---
title: 一些不常用的事件监听方法
cover: /assets/blogCover/伏見稲荷_76903383.png
date: 2022-10-27 11:22:40
updated: 2022-10-27 11:22:40
categories:
  - [web document]
tags:
  - web
  - document
  - eventListener
---

## document

#### selectionchange

可以获取到点击的文字所在元素对象及点击或者选中文字起始位置和结束位置

*应该是只针对 文字，我点击图片没有触发时间，点击文字时间正常触发*
~~~js
// addEventListener version
document.addEventListener('selectionchange', () => {
  console.log(document.getSelection());
  /**
   * anchorNode: text
   * anchorOffset: 4
   * baseNode: text
   * baseOffset: 4  选中起始位置
   * extentNode: text 选中起始元素
   * extentOffset: 4  选中结束位置
   * focusNode: text 选中结束元素
   * focusOffset: 4
   * isCollapsed: true
   * rangeCount: 1
   * type: "Caret"
   */
});

// onselectionchange version
document.onselectionchange = () => {
  console.log(document.getSelection());
};
~~~

通过下方代码操作可以改变选中位置
~~~js
let selection = document.getSelection()!
const range = document.createRange();
selection.removeAllRanges();
range.selectNodeContents(node);
range.setStart(textNode,start)
range.setEnd(textNode,start)
range.collapse(false);
selection.addRange(range);
~~~

#### compositionStart

可以监控到用户使用中文输入法输入

#### CompositionEnd

可以监控到用户结束中文输入法输入

#### input

元素添加了 `contenteditable` 属性后，可以监控到用户输入
`nativeEvent` 上的 inputType 可以判断用户当前输入状态
* deleteContentBackward 删除鼠标选中的字符或后方字符
* deleteContentForward 删除鼠标选中的字符或前方字符
* insertText 添加文字

