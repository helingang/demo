# 一个移动端音乐的webApp项目
## 页面效果
<img src="./demo/recommend-1.jpg" width='300'>
<img src="./demo/singer.jpg" width='300'>
<img src="./demo/singer-2.jpg" width='300'>
<img src="./demo/singer-3.jpg" width='300'>
<img src="./demo/rank.jpg" width='300'>
## 初始化项目和目录结构
1. 初始化项目目录并修改部分配置
```
vue init webpack vue-music
```
```
|-- build                           // 项目开发环境配置
|   |-- webpack.base.conf.js        // 基础环境变量
|   |-- webpack.dev.conf.js         // 开发环境变量
|   |...

// webpack.base.conf.js
// 添加别名
resolve: {
    extensions: ['.js', '.vue', '.json'],
    // 别名
    alias: {
        '@': resolve('src'),
        'api': resolve('src/api'),
        'base': resolve('src/base'),
        'vue$': 'vue/dist/vue.esm.js',
        'common': resolve('src/common'),
        'components': resolve('src/components')
    }
},

// webpack.dev.conf.js
// 初始化路由做准备
const express = require('express')
var apiRoutes = express.Router();
```
```
|-- config                          // 配置变量
|   |-- index.js                    // 配置开发模式或生产模式的变量
|   |...
// index.js
// 修改本地环境地址
host: '192.168.0.101'
```
```
|.eslintrc.js                 // eslint配置
|index.html                   // 入口页面
|package.json                 // 项目信息
|...
```
```
|-- src                        
|   |-- api                    // 存放接口的js
|   |-- base                   // 存放公共组件
|   |-- common                 // 存放公共的字体,css,image,js的文件
|   |-- components             // 存放业务组件
|   |-- router                 // 路由index文件
|   |-- store                  // vuex相关文件
|App.vue                       // 页面入口文件
|main.js                     // 程序入口文件
```

## 首页header的创建
1. 顶部是公共组件
2. 导航区是路由
3. 在App.vue中布局初始的结构,在components中新增Mheader组件,并引入到App.vue中
4. 在router下的index.js中配置路由环境
```
<div id="app">
    <!-- 顶部样式 -->
    <m-header></m-header>
    <!-- 导航栏 -->
    <tab></tab>
    <!-- 导航栏-路由区 -->
    <!-- keep-alive会将DOM缓存到内存中,刷新后清除 -->
    <keep-alive>
        <router-view></router-view>
    </keep-alive>
    <player></player>
</div>
```
```
export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            redirect: '/recommend'
        },
        {
            path: '/recommend',
            component: Recommend,
            children: [
                {
                    path: ':id',
                    component: Disc
                }
            ]
        },
        {
            path: '/singer',
            component: Singer,
            children: [
                {
                    // 注意子路由的路径参数
                    path: ':id',
                    component: SingerDetail
                }
            ]
        },
        {
            path: '/rank',
            component: Rank,
            children: [
                {
                    path: ':id',
                    component: TopList
                }
            ]
        },
        {
            path: '/search',
            component: Search
        }
    ]
});
```