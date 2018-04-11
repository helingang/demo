# 一个移动端音乐的webApp项目
## 需求分析
1. 登录模块
2. 推荐页面: 轮播图, 歌单详情, 随机播放
3. 歌手页面: 歌手列表, 字母定位, 歌手详情, 随机播放
4. 排行页面: 排行列表, 榜单详情
5. 搜索页面: 根据歌曲和歌手搜索, 热门搜索, 搜索历史, 搜索结果播放
6. 播放器页面: 图片, 歌词, 进度条, 收藏, 快进等
7. 播放列表: 随机播放, 删除歌曲, 收藏歌曲, 添加歌曲
8. 用户中心: 我喜欢的, 最近听的, 随机播放全部
## 遇到和解决的问题
1. 不能引入`common`中的文件
```
// webpack.base.conf.js的resolve中添加
resolve: {
    // 作用是在引入时可以省略后缀名
    extensions: ['.js', '.vue', '.json'],
    // 别名
    alias: {
        // 表示引入vue时直接可以from vue
        'vue$': 'vue/dist/vue.esm.js',
        // 解析src下的common目录,如果路径中含有common,则会解析成src/common
        'common': resolve('src/common'),
        '@': resolve('src'),
    }
},

// resolve的作用,返回当前目录并拼接
function resolve (dir) {
    return path.join(__dirname, '..', dir)
}
```


## 小知识点
1. `router-link`的激活类名
默认是`router-link-active`,可以在`index.js`的`new router`中通过`linkActiveClass: 'active'`修改

2. `router-link`的解析的标签名称
在标签中添加`tag='div'`

3. jsonp
动态创建script标签,src指向服务端地址<br>[以百度搜索为例的jsonp请求](../Demo-ajax/jsonp.html)

4. `encodeURIComponent(str)`
将字符串作为URI进行编码

5. `slot`
slot被外部引入这个组件标签中的DOM所替代

6. `v-if`一种添加的时机
当通过ajax或者jsonp得到数据并赋值给对象之后,再渲染DOM
