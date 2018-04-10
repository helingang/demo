<template>
    <div id="header">

        <!-- 内容信息区 -->
        <div class="content-wrapper">

            <!-- 头像 -->
            <div class="avatar">
                <img :src="seller.avatar" alt="" width="64" height="64">
            </div>

            <!-- 详细信息 -->
            <div class="content">

                <!-- 商家名称 -->
                <div class="title">
                    <span class="brand"></span>
                    <span class="name" v-text='seller.name'></span>
                </div>

                <!-- 快递描述 -->
                <div class="description">
                    {{ seller.description }} / {{ seller.deliveryTime }}分钟送达
                </div>

                <!-- 活动区 -->
                <div v-if='seller.supports' class="supports">
                    <span class="icon" :class='classMap[seller.supports[0].type]'></span>
                    <span class="text">{{ seller.supports[0].description }}</span>
                </div>

                <!-- 活动浮层 -->
                <div v-if='seller.supports' class="support-count" @click='showDetail'>
                    <span class="count">{{ seller.supports.length }}个</span>
                    <span class='iconfont icon-arrow-right-copy-copy-copy'></span>
                </div>

            </div>
        </div>
        <!-- 公告区 -->
        <div class="bulletin-wrapper" @click='showDetail'>
            <span class='icon '></span><span class="text">{{ seller.bulletin }}</span>
            <span class="arrow iconfont icon-arrow-right-copy-copy-copy"></span>
        </div>

        <!-- header的背景 -->
        <div class="background">
            <img :src="seller.avatar" alt="" width="100%" height="100%">
        </div>

        <!-- 浮层 -->
        <transition name='detail'>
            <div class="detail" v-show='detailShow'>
                <div class="detail-wrapper clearfix">
                    <!-- 浮层主内容 -->
                    <div class="detail-main">
                        <h1 class="name">{{ seller.name }}</h1>
                        <div class="star-wrapper">
                            <star :size='48' :score='seller.score' tag='div'></star>
                        </div>
                        <titleline :name="'优惠信息'"></titleline>
                        <ul v-if='seller.supports' class='supports'>
                            <li class='supports-item' v-for='(item,index) in seller.supports' :key='index'>
                                <span class='icon' :class='classMap[seller.supports[index].type]'></span>
                                <span class='text'>{{ item.description }}</span>
                            </li>
                        </ul>
                        <titleline :name="'商家公告'"></titleline>
                        <p class="bulletin">{{ seller.bulletin }}</p>
                    </div>
                </div>
                <div class="detail-close iconfont icon-cha" @click='hideDetail'></div>
            </div>
        </transition>
    </div>
</template>

<script>
import Star from '@/components/common/star/star.vue';
import Titleline from '@/components/common/titleline/titleline.vue';
export default {
    data(){
        return {
            detailShow: false
        };
    },
    components: {
        Star,
        Titleline
    },
    props: {
        seller: {
            type: Object,
            require: true
        }
    },
    methods: {
        showDetail(){
            this.detailShow = true;
        },
        hideDetail(){
            this.detailShow = false;
        }
    },
    created(){
        this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
    }
};
</script>

<style lang='less'>
@rem: 36rem;
#header{
    position: relative;
    color: #fff;
    background-color: rgba(7, 17, 27, .5);
    overflow: hidden;
}
#header .content-wrapper{
    position: relative;
    width: 100%;
    height: 106px;
    box-sizing: border-box;
    padding: 24px 12px 18px 24px;
    font-size: 0;
}
#header .content-wrapper .avatar{
    display: inline-block;
    vertical-align: top;
}
#header .content-wrapper .avatar img{
    width: 64px;
    height: 64px;
    border-radius: 4px;
}
#header .content-wrapper .content{
    width: 180px;
    display: inline-block;
    margin-left: 16px;
}
#header .content-wrapper .content .title{
    margin-top: 2px;
    margin-bottom: 8px;
}
#header .content-wrapper .content .title .brand{
    display: inline-block;
    vertical-align: top;
    margin-right: 6px;
    width: 30px;
    height: 18px;
    background: url('./brand@2x.png') no-repeat left top/30px 18px;
}
#header .content-wrapper .content .title .name{
    display: inline-block;
    font-size: 16px;
    font-weight: blod;
    line-height: 18px;
}
#header .content-wrapper .content .description{
    margin-bottom: 10px;
    font-size: 12px;
    line-height: 12px;
}
#header .content-wrapper .content .supports .icon{
    display: inline-block;
    vertical-align: top;
    margin-right: 4px;
    width: 12px;
    height: 12px;
    background-size: 12px 12px;
    background-repeat: no-repeat;
    background-position: left top;
}
#header .content-wrapper .content .supports .icon.decrease{
    background-image: url('./decrease_1@2x.png')
}
#header .content-wrapper .content .supports .icon.discount{
    background-image: url('./discount_1@2x.png');
}
#header .content-wrapper .content .supports .icon.guarantee{
    background-image: url('./guarantee_1@2x.png');
}
#header .content-wrapper .content .supports .icon.invoice{
    background-image: url('./invoice_1@2x.png');
}
#header .content-wrapper .content .supports .icon.special{
    background-image: url('./special_1@2x.png');
}
#header .content-wrapper .content .supports .text{
    display: inline-block;
    font-size: 10px;
    line-height: 12px;
}
#header .content-wrapper .content .support-count{
    position: absolute;
    box-sizing: border-box;
    right: 12px;
    bottom: 18px;
    height: 24px;
    padding: 0px 8px;
    line-height: 24px;
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 14px;
    border: 1px solid #fff;
    text-align: center;
    box-sizing: border-box;
}
#header .content-wrapper .content .support-count .count{
    display: inline-block;
    vertical-align: top;
    margin-right: 2px;
    font-size: 10px;
}
#header .content-wrapper .content .support-count .iconfont{
    display: inline-block;
    font-size: 10px;
}
#header .bulletin-wrapper{
    position: relative;
    padding: 0 22px 0 12px;
    height: 28px;
    line-height: 28px;
    background-color: rgba(7, 17, 27, .2);
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    font-size: 10px;
}
#header .bulletin-wrapper .icon{
    display: inline-block;
    vertical-align: top;
    margin-top: 7.5px;
    width: 22px;
    height: 12px;
    background: url('./bulletin@2x.png') no-repeat left top/22px 12px;
}
#header .bulletin-wrapper .text{
    width: 100%;
    vertical-align: top;
    margin: 0 4px;
    // font-size: 10px;
}
#header .bulletin-wrapper .iconfont{
    position: absolute;
    height: 100%;
    margin-right: 12px;
    top: 0;
    right: 0;
    font-size: 12px;
}
#header .background{
    position: absolute;
    z-index: -1;
    top: 0;
    left: 0;
    width: 100%;
    height: 80%;
    filter: blur(10px);
}
// sticky footer布局↓
#header .detail{
    position: fixed;
    z-index: 100;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background: rgba(7, 17, 27, .8);
}
#header .detail.detail-enter-active,.detail.detail-leave-active{
    transition: opacity .2s;
}
#header .detail.detail-enter,.detail.detail-leave-to{
    opacity: 0;
}
#header .detail .detail-wrapper{
    width: 100%;
    min-height: 100%;
}
#header .detail .detail-wrapper .detail-main{
    width: cale(100% - 64px);
    margin-top: 64px;
    padding: 0 32px 64px 32px;
}
#header .detail .detail-close{
    position: relative;
    width: 32px;
    height: 32px;
    margin: -64px auto;
    clear: both;
    font-size: 32px;
}
// sticky footer布局↑
#header .detail .detail-wrapper .detail-main .name{
    line-height: 16px;
    text-align: center;
    font-size: 16px;
    font-weight: 700;
}
#header .detail .detail-wrapper .detail-main .star-wrapper{
    margin-top: 16px;
    margin-bottom: 28px;
    text-align: center;
}
#header .detail .detail-wrapper .detail-main ul.supports{
    width: calc(100% - 24px);
    padding: 0 12px;
}
#header .detail .detail-wrapper .detail-main ul.supports li.supports-item{
    margin-bottom: 12px;
    overflow: hidden;
}
#header .detail .detail-wrapper .detail-main ul.supports li.supports-item:last-of-type{
    margin-bottom: 0;
}
#header .detail .detail-wrapper .detail-main ul.supports li.supports-item .icon{
    float: left;
    margin-right: 6px;
    width: 16px;
    height: 16px;
    background-size: 16px 16px;
}
#header .detail .detail-wrapper .detail-main ul.supports li.supports-item .icon.decrease{
    background-image: url('./decrease_2@2x.png')
}
#header .detail .detail-wrapper .detail-main ul.supports li.supports-item .icon.discount{
    background-image: url('./discount_2@2x.png');
}
#header .detail .detail-wrapper .detail-main ul.supports li.supports-item .icon.guarantee{
    background-image: url('./guarantee_2@2x.png');
}
#header .detail .detail-wrapper .detail-main ul.supports li.supports-item .icon.invoice{
    background-image: url('./invoice_2@2x.png');
}
#header .detail .detail-wrapper .detail-main ul.supports li.supports-item .icon.special{
    background-image: url('./special_2@2x.png');
}
#header .detail .detail-wrapper .detail-main ul.supports li.supports-item .text{
    float: left;
    font-size: 12px;
    line-height: 16px;
}
#header .detail .detail-wrapper .detail-main .bulletin{
    padding: 0 12px;
    width: calc(100% - 24px);
    font-size: 12px;
    font-weight: 200;
    line-height: 24px;
}
</style>
