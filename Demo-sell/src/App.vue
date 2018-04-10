<template>
    <div id="app">
        <v-header :seller='seller'></v-header>
        <div class="tab">
            <div class="tab-item">
                <router-link to="/goods">商品</router-link>
            </div>
            <div class="tab-item">
                <router-link to="/ratings">评论</router-link>
            </div>
            <div class="tab-item">
                <router-link to="/seller">商家</router-link>
            </div>
        </div>
        <keep-alive>
            <router-view :seller="seller"></router-view>
        </keep-alive>
    </div>
</template>

<script>
    import axios from 'axios';
    import Header from './components/header/header';
    import {urlParse} from './common/js/util.js';
    const ERR_OK = 0;
    export default {
        data(){
            return {
                seller: {
                    // 拿到url中id的value
                    id: (() => {
                         let queryParam = urlParse();
                         return queryParam.id;
                    })()
                }
            };
        },
        created(){
            axios.get('/api/seller?id=' + this.seller.id)
            .then(res => {
                if (res.data.errno === ERR_OK){
                    // es6的方法(合并),防止id被丢弃
                    // Object.assign(finalObject, obj1, obj2);
                    this.seller = Object.assign({}, this.seller, res.data.data);
                    // console.log(this.seller.id);
                };
            })
            .catch(er => {
                alert('网络异常了');
            });
        },
        name: 'app',
        components: {
            'v-header': Header
        }
    };
</script>

<style lang='less'>
@rem: 36rem;
html, body{
    line-height: 1;
    font-weight: 200;
    font-family: 'Microsoft yahei', 'PingFang SC', 'STHeitiSC-Light', arial;
}
#app .tab{
    display: flex;
    box-sizing: border-box;
    width: 100%;
    height: 40px;
    line-height: 40px;
    border-bottom: .5/@rem solid rgba(7, 17, 27, .1);
}
#app .tab .tab-item{
    flex: 1;
    text-align: center;
}
#app .tab .tab-item > a{
    display: block;
    font-size: 14px;
    color: rgb(77, 75, 93);
}
#app .tab .tab-item > a.active{
    color: rgb(240, 20, 20);
}
</style>
