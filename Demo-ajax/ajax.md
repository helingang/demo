# 一个简单的懒加载和ajax应用
## 思路
1. 创建ajax函数
2. 发送ajax请求
3. 发送ajax请求时的条件
4. 获取ajax请求的返回值来绘制页面
    1. 如何获取最短的列表
    
## 创建ajax函数
1. ajax的函数需要哪些参数
    1. open时的参数:
        1. 请求类型`type`: `get`or`post`
        2. 请求地址`url`
    2. send时的参数data(适用于此接口):
        1. 第一个参数: 起始的下标start
        2. 第二个参数: 返回电影的个数count
    3. ajax请求成功或失败执行的函数:
        1. success
        2. error
2. 处理参数
    1. 处理初始json参数
    ```
    var type = json.type || 'GET';
    var url = json.url;
    var data = json.data || '';
    var success = json.success;
    var error = json.error;
    var dataType = json.dataType || 'json';
    ```
    2. 处理data参数并拼接到url中
    ```
    if(data){
        val val = '';
        for(var key in data){
            val += key + '=' + data[key] + '&';
        }
        data = val
        val += '_='+new Date().getTime();
        if(/get/i.test(type)){
            url += '?' + val;
            data = '';
        }
    }
    ```
    3. 发送并处理ajax返回值
    ```
    var xhr = new XMLHttpRequest();
    xhr.open( type , url , true);
    //在send之前设置请求头,POST请求下必须设置
    xhr.setRequsetHeader('content-Type','application/x-www-form-urlencoded);
    xhr.send( data );
    xhr.onreadystatechange = function(){
        if(this.readyState === 4){
            var status = this.status;
            if(status >= 200 && status <300){
                var res = this.responseText;
                if(dataType === 'json'){
                    res = JSON.parse(res);
                }
                success && success();
            }else{
                error && error();
            }
        }
    }
    
    ```
## 发送ajax请求
1. 发送请求
```
ajax({
    url : '',
    data : {
        start : s,
        count : c
    },
    success : function(data){
        //渲染函数处理ajax返回数据
        draw(data);
    }
})

```
2. 何时发送ajax
    1. 鼠标滚轮事件,并且当前文档滚动高度减test标签滚动高度小于300时发送请求
    ```$xslt
    var testTop = test.offsetTop;
    var nowTop = (document.documentElement.scrollTop || document.body.scrollTop) - window.innerHeight;
    if(testTop - nowTop < 300){
        ajax(...)
    }
    ```
    2. 滚动事件持续触发,可选择设置定时器设置触发时间
## 获取ajax返回值绘制页面
1. 绘制页面
```$xslt
//使用返回值的参数
let d = data[i];
let src = d.images.large;
let filmNerf = d.alt;
let filmName = d.title;
let filmYear = d.year;
let filmScore = d.rating.average;

```
2. 找到最短的列表
```$xslt
function indexOfShort(){
    //假设最短的列表的index和值
    var index = 0;
    var top = aList[0].clientHeight;
    for(var i=0,length=aList.length;i<length;i++){
        var h = aList[i].clientHeight;
        if(h < top){
            index = i;
            top = h;
        }
    }
    return index
}
```