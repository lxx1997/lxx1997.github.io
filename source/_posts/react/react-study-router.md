---
title: 重拾 react - React-Router
date: 2020-08-28 11:52:22
updated: 2020-08-28 11:52:22
tags:
    - react
    - router
    - JavaScript
cover: /assets/blogCover/MIKU花(4)_78753717_p1.png
---

  由于最近一段时间一直在使用vue做项目，最近打算重拾react，在此记录react的点滴学习，实时更新

## 插件使用

  插件： `react-router-dom`

  安装： `npm install -S react-router-dom`

  使用： `import {Router} from 'react-router-dom'`



## Router 配置的方法

  * 第一种

  ~~~js
    import { Redirect } from 'react-router'
    React.render((
      <Router>
        <Route path="/" component={App}>
          <IndexRoute component={Dashboard} />
          <Route path="about" component={About} />
          <Route path="inbox" component={Inbox}>
            <Route path="/messages/:id" component={Message} />

            {/* 跳转 /inbox/messages/:id 到 /messages/:id */}
            <Redirect from="messages/:id" to="/messages/:id" />
          </Route>
        </Route>
      </Router>
    ), document.body)
  ~~~

  * 第二种

  ~~~js
    const routeConfig = [
      { path: '/',
        component: App,
        indexRoute: { component: Dashboard },
        childRoutes: [
          { path: 'about', component: About },
          { path: 'inbox',
            component: Inbox,
            childRoutes: [
              { path: '/messages/:id', component: Message },
              { path: 'messages/:id',
                onEnter: function (nextState, replaceState) {
                  replaceState(null, '/messages/' + nextState.params.id)
                }
              }
            ]
          }
        ]
      }
    ]

    React.render(<Router routes={routeConfig} />, document.body)
  ~~~

## 组件类型

  * Router 最外层路由，包裹所有的路由 `HashRouter` 哈希路由 `BrowserRouter` 历史路由 

  * Route 路由页面地址

  * Link 路由跳转

  * IndexRoute 用来设置一个默认路由

  * Redirect 路由重定向

  * Switch 有`Switch`标签，则其中的`Route`在路径相同的情况下，只匹配第一个，这个可以避免重复匹配

  * IndexLink 只有定义的路由被渲染后才激活

## 导航路由

  * 历史路由模式

  ~~~js
    // somewhere like a redux/flux action file:
    import { browserHistory } from 'react-router'
    browserHistory.push('/some/path')
  ~~~

  * 哈希路由模式

  ~~~js
    // somewhere like a redux/flux action file:
    import { HashHistory } from 'react-router'
    HashHistory.push('/some/path')
  ~~~

