---
title: TypeScript 学习之路进阶版 - 扩展
date: 2020-06-29 19:39:30
tags:
    - typescript
---

#### 代码检查

 eslint 能够发现一些tsc不会关心的错误，检查出一些潜在的问题

 **TypeScript中使用Eslint**

  **eslint安装**

  ~~~js
    npm install eslint -S
  ~~~

  由于ESLint 默认使用`Espree`进行语法解析，无法识别TypeScript中的一些语法，因此我们需要安装`@typescript-eslint/eslint-plugin`, 他作为eslint默认规则的补充，提供了一些额外的适用于ts语法的规则

  ~~~js
    npm install --save-dev @typescript-eslint/eslint-plugin
  ~~~
<!-- more -->
  **创建配置文件**

  ESLint 需要配置文件来决定对哪些规则进行检查配置文件的名称一般是`.eslintrc.js`或`.eslintrc.json`

  当运行ESLint的时候检查一个文件，他会首先尝试读取到文件的目录下的配置文件，然后一级一级往上查找，将所找到的配置合并起来

  在根目录创建一个`.eslintrc.js`

  ~~~js
    module.exports = {
      parser: '@typesript-eslint/parser',
      plugins: ['@typescript-eslint'],
      rules: {
        // 禁止使用var
        'no-var': 'error',
        // 优先使用interface 而不是type
        '@typescript-eslint/consistent-type-difinitions': [
          'error',
          'interface'
        ]
      }
    }
  ~~~

  以上配置中，指定了两个规则，其中`no-var` 是ESLint原生规则，`@typescript-eslint/consistent-type-definitions` 是 `@typescript-eslint/elsint-plugin` 新增的规则

  规则的取值一般是一个数组，其中一项是 `off`,`warn`,`error`中的一个，表示关闭，警告和报错，后面的项都是该规则的其他配置

  关闭、警告和报错的含义如下：
  * 关闭： 禁用此规则
  * 警告： 代码检查的时候输出错误信息，但是不会影响到exit code
  * 报错： 发现错误时，不仅会输出错误信息而且exit code 将被设为 1（一般exit code 不为0 则表示执行出现错误）