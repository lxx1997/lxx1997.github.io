---
title: golang-切割字符串和拼接字符串
date: 2020-11-12 14:07:23
tags:
    - golang
cover: /assets/blogCover/MIKU花(4)_78753717_p1.png
---

今天在Leecode上面练习用go语言做题，偶遇一题
  #### 剑指 Offer 58 - II. 左旋转字符串
  字符串的左旋转操作是把字符串前面的若干个字符转移到字符串的尾部。请定义一个函数实现字符串左旋转操作的功能。比如，输入字符串"abcdefg"和数字2，该函数将返回左旋转两位得到的结果"cdefgab"

  示例：
  ~~~js
    输入: s = "abcdefg", k = 2
    输出: "cdefgab"
  ~~~

然后我想起来前些天偶然遇到的一个题，有用到这部分的知识

然后我急忙把对应代码复制过来，然后点击提交，令人激动的是竟然成功了，但是运行内存及时间太不理想


提交时间 提交结果 运行时间  内存消耗   语言
16分钟前	 通过	  72 ms	    9.1 MB	  Go

代码如下
~~~go
func reverseLeftWords(s string, n int) string {
	var char int = n
	for char < len(s) {
		newstr = newstr + string(s[char])
		char++
	}
	var char2 int = 0
	for char2 < n {
			newstr =  newstr + string(s[char2])
			char2++
	}
	return newstr
}
~~~

然后我就打算使用golang自带的字符串切割的方法

结果还是比较理想的

提交时间 提交结果 运行时间  内存消耗   语言
几秒前	  通过	   0 ms	   3.5 MB	    Go

代码差不多只有一行
~~~go
func reverseLeftWords(s string, n int) string {
	return string([]byte(s)[n:]) + string([]byte(s)[:n])
}
~~~

#### 字符串切割  string([]byte(s)[n:m])
`string([]byte(s)[n:m])`  : 

首先是通过byte方法将字符串转为字节
* `s`代表需要转换的字符串
* `n`代表切割的起始位置，省略代表从第0位开始
* `m`代表切割的终点位置，省略代表到末尾结束
* 最后通过string()方法再将字节转为字符串

*但是这种方法并不适用于带有中文的字符串*

`string([]rune(s)[n:m])`
首先是通过byte方法将字符串转为字节
* `s`代表需要转换的字符串
* `n`代表切割的起始位置，省略代表从第0位开始
* `m`代表切割的终点位置，省略代表到末尾结束
* 最后通过string()方法再将字节转为字符串
