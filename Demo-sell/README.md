
# 一个外卖订单的webApp项目
## Vue.js 和 Vue-cli 脚手架
1. 初步了解和熟悉项目目录结构
2. 初步了解和熟悉组件化和模块化的开发方式
3. 初步了解SPA开发模式

## Vue-router
1. 了解和熟悉Vue-router和axios请求

## eslint
1. 规范和养成代码编写风格

## better-scroll
1. 熟悉使用BS插件进行滚动

## less和stylus
1. 熟悉less和stylus两种预处理

## 遇到和解决的一些问题: 
1. 服务端模拟发送请求
在`webpackpack.dev.conf.js`中发送json
```
const express = require('express')
var appData = require('../data.json');
var seller = appData.seller;
var apiRoutes = express.Router();

devServer: {
    ...
    before(apiRoutes){
        apiRoutes.get('/api/seller', function(req, res){
            res.json({
                errno: 0,
                data: seller
            });
        });
    }
}
```
2. BScroll无法滚动界面
布局应当是父级有固定**高度或宽度**且超出隐藏,子级被内容撑开,在BS初始化的时候会计算父级和自己的高度和宽度,因此来决定是否可以滚动,因此初始化的**时机**很重要,一般在钩子函数`mounted`或`created`中使用`this.$nextTick()`或`setTimeout`来执行`initScroll`方法

3. BS滚动到某个对象上
```
// better-scroll方法动画滚动到指定对象上
this.foodsScroll.scrollToElement(el, 20);
```
4. 在绑定on命令
在绑定class或者src的时候经常忘记加:

5. eslint
忽略某种规则,可以在`.eslintrc.js`的`rules`中进行修改

6. 模块化开发的思想
将能够复用的组件放在公共目录中,将能复用的一些js方法也放在公共目录中,以便在vue组件中引入并使用

7. 父子组件的数据通信
父组件data中对象在子组件中使用
```
// 父组件中传参到子组件
<parent :seller='seller'></parent>

// 子组件中使用props获取
props: {
    seller: {
        type: Object
    }
}

// 如果子组件改变了这个值,则需要在子组件中这个对象改变之后添加事件
this.value = newValue;
this.$emit('eventName', newValue);

// 在父组件的子组件标签中添加绑定事件
@eventName='funcName'

// 在父组件的methods中添加funcName方法来获取子组件改变的值value
funcName(newValue){
    this.value = newValue;
}

