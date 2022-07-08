---
title: 生成 github SSH key
cover: /assets/cover/20200225A1295.jpg
date: 2022-07-08 14:19:07
updated: 2022-07-08 14:19:07
categories:
  - git
tags:
  - git
  - linux
---

#### 生成 SSH key

打开 git bash 命令行工具 输入一下命令，自动生成 ssh key 地址

~~~js
  ssh-keygen -t ed25519 -C "your_email@example.com"
~~~

可以通过命令行直接复制 ssh key 的内容

~~~js
  clip < ~/.ssh/id_ed25519.pub
~~~

复制成功之后，可以将 ssh key 复制到 github 的ssh key 上

#### 和 github 链接

执行以下命令

~~~js
  ssh-add ~/.ssh/id_ed25519

  // 或者
  echo $SSH_AGENT_SOCK
~~~

如果执行不成功，可能是 ssh-add 未开启，可以通过命令行查看是否开启ssh-add 服务
~~~js
  ps -ef | grep ssh
~~~

#### 开启 ssh-add 服务
~~~js
cd ~/.ssh
eval $(ssh-agent)
~~~
执行完上述命令后就可以进行ssh 链接
