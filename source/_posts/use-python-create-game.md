---
title: python学习之路----制作小游戏
date: 2020-06-04 17:38:00
tags:
      - python
      - pygame
---



**安装pygame**

~~~js
pip install pygame
~~~
**引入**
~~~js
import pygame
from pygame.locals import *
~~~
**初始化**
~~~js
pygame.init()
~~~

**创建一个窗口**
~~~js
screen = pygame.display.set_mode([800,600])
// 生成一个 宽800 高600大小的窗口
~~~
**使窗口正常工作**
~~~js
// pygame的作用就是为了创建游戏,需要与玩家不断互动,所以需要一个事件一直循环运行,使用while 执行事件循环
while True:
// 接下来增加事件处理器,pygame包含多种模块,使用paygame.event.get()方法获取所有事件的一个列表,使用for循环迭代处理这个列表中的每一个事件,如果看到quit事件,将while 判断设为false 结束while循环
for event in pygame.event.get():
  if event.type == pygame.QUIT:
    mRuning = False
    pygame.quit()
~~~

**翻转  flip**
对于pygame窗口显示的内容，screen对象中都会有这些内容的两个副本，可以看做一个当前屏和一个下一屏，当前屏使我们现在看到的，下一屏是完成翻转之后看到的,完成下一屏上的所有修改,再反转到下一屏,就能看到所有的改变,这样,我们对图形多次修改后flip到图形的新版本,而不是每次对图形做小小修改都更新提示,从而让动画更流程,更新速度更快

~~~py
screen.fill([255,255,255])
pygame.display.flip()
~~~

**插入图片  pygame.image**

~~~py
imageRect = pygame.image.load(imageUrl)
# 图片加载完成之后,我们需要将像素从一个地方复制到另一个地方,像素复制在编程中叫做 快移(blitting),帮助我们将一个图像从一个地方复制到另一个地方

screen.blit(imageRect, [0,0])
~~~

**音乐播放器**

pygame中有一个处理声音的模块,叫 pygame.mixer (混音器)
~~~py
soundTrack = pygame.mixer.music.load(wavFileName)
pygame.mixer.music.play()
~~~

**事件处理器**

在上面通过pygame,event.get() 获取到当前事件集

~~~py
# 退出
event.type == pygame.QUIT
# 键盘事件
event.type == pygame.KEYDOWN or pygame.KEYUP
  # 判断键盘值  eg: d键
  event.key == K_d  
# 鼠标事件  鼠标点击事件
event.type == pygame.MOUSEBUTTONDOWN
~~~

#### pygame  模块


模块名 |  功能
pygame.down | 访问光驱
pygame.cursors | 加载光标
pygame.display | 访问设备显示问题
pygame.draw | 绘制形状,线和点
pygame.event | 管理事件
pygame.font | 使用字体
pygame.image | 加载和存储图片
pygame.joystick | 使用手柄或类似的东西
pygame.key | 读取键盘按键
pygame.mixer | 读取声音
pygame.mouse | 鼠标
pygame.movie | 播放视频
pygame.music | 播放音频
pygame.overlay | 访问高级视频叠加
pygame.rect | 管理矩形区域
pygame.sndarray | 操作声音数据
pygame.sprite | 操作移动图像
pygame.surface | 管理图像和屏幕
pygame.time | 管理时间和帧消息
pygame.transform | 缩放和移动图像

有些模块可能在某些平台上不存在,可以用None来测试
~~~py
if pygame.transform is None:
  print 'The transform module is not available'
  exit()
~~~