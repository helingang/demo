<template>
    <div class='left-nav'>
        <ul>
            <li>
                <router-link to='/'>
                    <i class="iconfont icon-navigoumai"></i>
                    <div>购买</div>
                </router-link>
            </li>
            <li>
                <router-link to='/*'>
                    <i class="iconfont icon-dianpu"></i>
                    <div>店铺</div>
                </router-link>
            </li>
            <li>
                <router-link to='/*'>
                    <i class="iconfont icon-shangpin-tianchong"></i>
                    <div>商品</div>
                </router-link>
            </li>
            <li>
                <router-link to='/*'>
                    <i class="iconfont icon-tongji"></i>
                    <div>统计</div>
                </router-link>
            </li>
            <li>
                <router-link to='/*'>
                    <i class="iconfont icon-yidongduanicon-"></i>
                    <div>会员</div>
                </router-link>
            </li>
            <li>
                <router-link to='/*'>
                    <i class="iconfont icon-shezhi-tianchong"></i>
                    <div>设置</div>
                </router-link>
            </li>
        </ul>
    </div>
</template>
<script>
export default {
    name: 'leftNav',
    data () {
        return {
        }
    } 
}
</script>
<style>
.left-nav{
    width:5%;
    font-size:16px;
    height:100%;
    background-color: #1D8ce0;
    float:left;
    
}
.iconfont{
    font-size:28px;
}
.left-nav ul{
    padding:0px;
    margin: 0px;
}
.left-nav li{
    list-style: none;
    text-align: center;
    border-bottom:1px solid #20a0ff;
    padding:10px;
    transition: opacity .4s;
}
.left-nav li:hover{
    opacity: 0.8;
}
.left-nav li > a{
    text-decoration: none;
    color:#fff;
}
</style>


