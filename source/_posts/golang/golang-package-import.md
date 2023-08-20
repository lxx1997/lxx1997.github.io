---
title: Golang学习 - 项目中，不同package的包内容引入
cover: /assets/blogCover/初音ミク_83523978.png
date: 2023-08-13 20:46:47
updated: 2023-08-13 20:46:47
categories:
  - golang
tags:
  - golang
---

在刚开始学习`golang`语言的时候，我们肯定会学习到如何创建一个`go`程序，并且使用使它能够成功运行，但是项目内容多一点涉及到多个包的时候，这个时候我们在 `packge main` 中引入其他 `package` 的内容时，可能会感到疑惑而不知该如何引入，在此记录一下需要如何引入

## 框架前提

  使用g`o mod` 进行项目管理,因此初始的时候通过 `go mod init <project-name>` 创建一个基础的 `mod`，在项目中定义的`package`都可以用这个来引入

  ~~~go
    go mod init gin-web
  ~~~

## 项目架构

* main.go

~~~go
package main

import (
	"gin-web/routes"

	"github.com/gin-gonic/gin"
)

func main() {
    r := gin.Default()

    // 导入路由定义
    routes.ImportRoutes(r)

    r.Run(":8080")
}

~~~

* routes.go

需要注意的是因为`package` 是 `routes` ，所以需要创建一个`routes` 目录用来防止 `routes.go` 文件，否则引入的时候会报错

~~~go
package routes

import (
	"gin-web/handler"

	"github.com/gin-gonic/gin"
)

func ImportRoutes(r *gin.Engine) {
    r.GET("/", handler.HelloHandler)
}

~~~

* handles.go

注意事项同 `routes.go`

~~~go
package handler

import (
	"github.com/gin-gonic/gin"
)

func HelloHandler(c *gin.Context) {
    c.JSON(200, gin.H{
        "message": "Hello, Gin!",
    })
}

~~~

**需要注意的事，提供给其他`package`使用的属性和方法，首字母必须大写，否则其他`package`无法访问到**

## 项目启动

~~~sh
  go run main.go
~~~

启动成功后，访问 `localhost:8080` 地址，如果能正常访问代表程序没有问题