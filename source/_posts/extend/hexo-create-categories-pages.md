---
title: 创建默认的 hexo categories 首页
cover: /assets/blogCover/Day18 I’m Not Human_100789898.png
date: 2022-07-20 09:16:55
updated: 2022-07-20 09:16:55
categories:
  - hexo
tags:
  - hexo
---

正常我们创建一个新的 hexo 博客时 直接访问 categories 默认页面时是无法访问到的，如果我们想要访问到可以通过以下操作创建一个默认的 categories 默认页面，在生成页面时，categories 相关内容会自动写进去

~~~js
  hexo new page categories
~~~

categories 默认 md 文档中添加 `type: "categories"`

~~~markdown
---
title: categories
date: 2022-07-20 09:13:01
type: "categories"
---
~~~

创建 tags 默认页面类似，只需要把 `type: "categories"` 改为 `type: "tags"`