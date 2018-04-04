# 在vue-cli中发送和接收json
## 创建json数据
## `webpackpack.dev.conf.js`中发送json
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
## `vue`组件中使用`axios`接收json
```
import axios from 'axios'
export default {
    name: 'App',
    created () {
        axios.get('http://127.0.0.1:8080/api/ratings')
            .then(res => {
                console.log(res)
            })
    }
}
```