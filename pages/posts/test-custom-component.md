---
title: React
date: 2025-03-17
updated: 2025-03-17
categories: React
tags:
  - React
top: 2
---
## jsx语法

就是在js中可以直接写html标签.

## 组件定义和组件传参

react中有两种定义组件的方式，function和class。组件中的属性或者state数据改变之后组件会重新渲染

- 父传子

  使用props属性
- 子传父

  方法调用
- 非相关组件

  使用context或者redux实现

## function(函数式)定义的组件

```
在react16.8之前的版本中没办法再function定义的组件中设置局部状态，但是16.8之后的版本中新增了hooks，可以通过它为function定义的组件设置局部状态和模拟生命周期
```

hooks的实现原理是数组结合闭包

#### hooks

- useState

  可以在function定义的组件中设置局部状态数据

  ```jsx
  function Demo() {
      // hooks只能在function定义的组件内使用
      // useState接收一个初始值作为参数
      //    返回一个数组
      //        参数一 表示可以使用的state的名字
      //        参数二 是一个function，表示改变数据的方法
      return <></>
  }
  ```
- useEffect

  副作用，用来在function定义的组件中模拟组件的生命周期

  useEffect接收两个参数，参数一表示回调函数，参数二是一个依赖数组。参数二有以下常见的几种形式：

  1. 参数二为空数组：那么参数一的回调函数在组件初始化的时候只执行一次。componentDidMount
  2. 参数二为存在数据的数组：那么参数一的回调函数在数组中的任意一个数据改变的时候执行。componentDidUpdate
  3. 参数二不存在：那么每一次组件更新的时候回调函数都会执行

  参数一中的回调函数可以返回一个function，这个返回的function在组件销毁的时候执行一次
- useReducer

  是react中另一种状态管理方案。使用的是单向数据流的机制，通过dispatch派发action改变数据

  useReducer接收两个参数，参数一是一个reducer函数、参数二是一个初始状态数据；返回一个数组，数组的第一项是状态数据，第二项是dispatch方法。如果要改变数据，只能通过dispatch派发一个action实现

  每一个action需要包含一个type属性，用来表示数据改变的方式
- useContext

  获取context上下文中的参数
- useRef

  获取dom元素

  - 受控组件和非受控组件

    比如input输入框的值和state数据进行了绑定，这就是受控组件

    input输入框的值没有和state数据进行绑定，在触发事件的时候通过dom元素获取值那么就是非受控组件
- useCallback

  作用是缓存一个function，接收两个参数。参数一是一个回调函数，参数二是一个依赖数组。建议在组件中可以多使用，用来做优化
- useMemo

  作用是缓存一个值。参数一是一个回调函数，参数二是一个依赖数组
- memo

  用来对组件做优化的时候使用。memo的作用是对组件做缓存，如果组件接收的属性不发生改变，那么组件不会重新渲染

#### 全局API

- refs，在class定义的组件中用来获取dom元素

## class(类组件)定义的组件

class定义组件，又叫类组件。这种组件可以有自己的局部状态和生命周期

class定义的组件都需要继承自Component或者PureComponent(相当于function定义的组件中为组件添加memo效果)

#### state状态数据

class定义的组件可以有局部状态

改变状态使用this.setState方法。setState是异步的，其实它可以接收两个参数。

参数一 表示要改变的数据

参数二 表示数据改变之后的回调函数

状态或者属性属性数据改变之后组件会重新渲染(执行render函数)

#### this指向问题

#### 组件生命周期

## 脚手架(CRA)和单文件组件

目前官方提供的脚手架是cra(create-react-app)

```bash
npx create-react-app first-react-app-demo # 创建项目
cd first-react-app-demo
npm start # 启动
```

#### vite搭建react项目

https://cn.vitejs.dev/

```bash
npm create vite@latest
```

## 路由

https://v5.reactrouter.com/ 路由5.x的版本，需要安装以下react17的版本

```bash
npm i react-router-dom@5 # 安装指定的版本
npm i react@17 react-dom@17 # 安装react17的版本
```

修改index.js中的代码，改成react17中的初始化方法

```js
import React from "react";
import ReactDOM from "react-dom";
import { HashRouter as Router } from "react-router-dom";
import "./index.css";
import App from "./App";

ReactDOM.render(
  // Router 放在最外层，所有的路由中的组件都需要放在Router节点内容，一个项目只能有一个Router
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);
```

#### 常见的api

- Route

  用来表示路径对应的组件

  - path，路径
  - component，对应的组件
  - render，渲染函数

  设置路径对应组件有三种方式

  1. component属性，可以在组件中直接获取路由属性信息
  2. render方法
  3. 子节点
- Link

  生成跳转连接

  to表示跳转链接。可以写成字符串，或者对象。对象的时候，常见的属性有

  - pathname，路径
  - search，url中传递的参数，刷新之后还在
  - state，state中传递的参数。刷新之后消失
- useLocation

  获取当前的location信息
- useHistory

  获取历史记录信息
- withRouter

  可以把路由的属性信息映射到组件的属性上。是一个高阶组件，接收一个组件作为参数，把响应的新的属性或者方法添加到组件上

## redux

redux是一个状态管理插件，实现跨组件之间数据共享

redux遵循单向数据流的机制，在view视图中通过dispatch派发一个action改变数据，数据改变之后组件重新渲染

https://redux.js.org/

redux和vuex的最大区别就是，redux可以结合任何框架使用，但是vuex只能在vue中使用

#### 需要注意事项即面试问题点

1. action的type为什么不能重复

   因为每一次派发的时候每一个reducer都会接收到这个action，为了区分是怎么改变数据。所以action的type不能重复

   可以使用symbol这个数据类型或者为每一个action的type设置前缀

   action必须是一个简单的对象，不能是异步的。如果需要处理异步action，需要安装中间件redux-thunk
2. 单向数据流以及redux中的数据流向

   在view视图中通过dispatch派发一个action改变数据，数据改变之后组件重新渲染

   redux中的数据流向，在视图中dispatch派发一个action在reducer中改变数据
3. redux-thunk，是一个插件，用来解决异步action的问题。它只有十几行代码， 作用是判断当前dispatch的类型，如果是一个function，那么会等方法调用完成之后在派发；否则就直接派发

#### react-redux

是一个插件，用来实现redux和react项目的连接

- Provider

  数据提供者，实现redux数据和react项目的结合。一般放在项目的最外层组件之外
- connect

  实现redux数据到组件的属性上的映射。它是一个function，可以把redux数据和dispatch属性当参数映射到组件的属性上
- useSelector

  作用是获取redux中的state数据，只能在function定义的组件中使用
- useDispatch

  获取dispatch方法，只能在function定义的组件中使用

---

#### @reduxjs/toolkit

是目前官方推荐的写法，使用这个工具包可以快速的搭建redux应用

```bash
npm i @reduxjs/toolkit react-redux # 安装依赖
```

## antd

https://ant-design.gitee.io/

是一个ui组件库，是学习react一定要会的

```bash
npm i antd@4.1 # 安装ui组件库，因为4.2的版本需要react18
# 我们为了使用路由5的版本，降级了react为17的版本，所以antd需要安装小于4.2的版本
```

## 其他的扩展知识

#### mui

[MUI: The React component library you always wanted](https://mui.com/zh/)

一款其他的ui组件库，目前使用比较多

#### Framework7

[Framework7 React](https://framework7.io/react/)，也是移动端开发用

#### ionic

https://ionicframework.com/ 有vue、react、angular各种版本，移动端开发用

#### tailwindcss

是目前比较流行的一个纯css库，可以和任何项目结合。方便我们写css代码，目前很流行。是基于移动端优先的一个库

https://tailwindcss.com/

https://tailwindcss.com/docs/guides/vite vite创建的项目中使用

postcss是一个插件(平台)，作用是使用js处理css代码，帮我们生成文件

```bash
npm init vite@latest # 创建一个项目
cd my-project # 进入项目
npm install -D tailwindcss postcss autoprefixer # 安装依赖
npx tailwindcss init -p # 创建配置文件
```

#### 样式化组件

https://styled-components.com/ ，另一种定义组件的思想

```bash
npm i styled-components # 安装插件
```

## antd-pro

是蚂蚁金服出的一款基于umi和antd的中后台管理系统解决方案。可以帮助我们快速的实现管理系统的开发

#### umi

企业级的开发框架，内置了各种插件，可以让我们实现零配置的方案开始一个react项目开发

```bash
# 1. 初始化一个package.json文件
npm init -y
# 2. 安装umi文件 
npm i umi
# 3. 修改package.json文件，添加启动项
# 在scripts节点中添加  "dev": "umi dev"
# 启动项目
npm run dev
```

#### dva

数据管理插件，一个redux的封装

#### ts

TypeScript，ts还是js。ts是js的一个超集

https://www.typescriptlang.org/zh/

https://www.tslang.cn/

```bash
# 一下不需要你在自己的电脑上尝试
npm install -g typescript # 全局安装ts
tsc --init # 创建一个ts配置文件
```

https://www.bilibili.com/video/BV1H44y157gq ts视频，闲了再看

#### ts在react项目中使用

http://www.json2ts.com/ 可以把json数据转换为ts数据类型

在用ts做项目的时候，如果出现数据类型错误提示，可以使用any或者@ts-ignore来解决

#### antd-pro

企业级的中后台开发框架

权限判断如何实现：

每一个用户登录之后都会返回它的角色信息，我们前台页面根据用户的角色不一样，展示不同的页面效果

通过控制每一个角色可以访问的路由信息展示不同的效果，在路由配置的时候为当前路由添加验证就好

## Next.js

是一个react的服务器端渲染框架，和我们以前讲的客户端渲染不是一回事。

https://nextjs.org/

https://www.nextjs.cn/

```bash
npx create-next-app next-demo-app # 创建项目
```
