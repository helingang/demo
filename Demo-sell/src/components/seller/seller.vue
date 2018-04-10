<template>
    <div class="seller" ref="sellerwrapper">
        <div class="seller-content">
            <div class="overview">
                <h1 class="title">{{ seller.name }}</h1>
                <div class="description">
                    <star :size='36' :score='seller.score' class="star"></star>
                    <span class="text">({{ seller.ratingCount }})</span>
                    <span class="text">月售{{ seller.sellCount }}单</span>
                </div>
                <ul class="remark">
                    <li class="block">
                        <h2>起送价</h2>
                        <div class="content">
                            <span class="stress">{{ seller.minPrice }}</span>
                            <span class="unit">元</span>
                        </div>
                    </li>
                    <li class="block">
                        <h2>商家配送</h2>
                        <div class="content">
                            <span class="stress">{{ seller.deliveryPrice }}</span>
                            <span class="unit">元</span>
                        </div>
                    </li>
                    <li class="block">
                        <h2>平均配送时间</h2>
                        <div class="content">
                            <span class="stress">{{ seller.deliveryTime }}</span>
                            <span class="unit">元</span>
                        </div>
                    </li>
                </ul>
                <div class="follow" @click.stop.prevent='toggleFollow'>
                    <div class="icon iconfont" :class="{'icon-xihuan': isLike === true,'icon-xihuan-xianxing': isLike === false}"></div>
                    <div class="data" :class="{'like': isLike === true,'nolike': isLike === false}">{{ followText }}</div>
                </div>
            </div>
            <Split></Split>
            <div class="supports-wrapper">
                <div class="supports">
                    <div class="title">公告与活动</div>
                    <p class="data">{{ seller.bulletin }}</p>
                </div>
                <ul class="description">
                    <li v-for='(sup,index) in seller.supports' :key="index" class="item">
                       <Icon :size='1' :type='classMap[sup.type]' class="icon"></Icon>
                       <span class="desc">{{ sup.description}}</span>
                    </li>
                </ul>
            </div>
            <Split></Split>
            <div class="seller-real">
                <div class="title">商家实景</div>
                <div class="images" ref='imageswrapper'>
                    <ul>
                        <li v-for="(pic, index) in seller.pics" :key="index" class="item">
                            <img :src="pic" alt="" width="120" height="90">
                        </li>
                    </ul>
                </div>
            </div>
            <Split></Split>
            <div class="seller-info">
                <div class="title">商家信息</div>
                <div class="desc">
                    <div class="info" v-for="(info, index) in seller.infos" :key="index">{{ info }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import BScroll from 'better-scroll';
import Star from '@/components/common/star/star.vue';
import Split from '@/components/common/split/split.vue';
import Icon from '@/components/common/icon/icon.vue';
import {saveToLoacl, loadFromLocal} from '@/common/js/store.js';
export default {
    name: 'seller',
    data(){
        return {
            isLike: (() => {
                return loadFromLocal(this.seller.id, 'isLike', false);
            })()
        };
    },
    props: {
        seller: {
            type: Object
        }
    },
    components: {
        Star,
        Split,
        Icon
    },
    methods: {
        _initScroll(){
            if (!this.sellerScroll){
                this.sellerScroll = new BScroll(this.$refs.sellerwrapper, {
                    click: true
                });
                this.imagesScroll = new BScroll(this.$refs.imageswrapper, {
                    click: true,
                    scrollX: true
                });
            } else {
                this.sellerScroll.refresh();
                this.imagesScroll.refresh();
            }
        },
        toggleFollow(){
            this.isLike = !this.isLike;
            // 根据 id 保存 isLike 到 window.localStorage.__seller__ 中
            saveToLoacl(this.seller.id, 'isLike', this.isLike);
            console.log(window.localStorage);
        }
    },
    computed: {
        followText(){
            let str = '';
            if (this.isLike){
                str = '已关注';
            } else {
                str = '未关注';
            }
            return str;
        }
    },
    created(){
        this.$nextTick(() => {
            this._initScroll();
        });
        this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
    },
    watch: {
        // watch seller的值变换时初始化BScroll
        'seller': function(){
            this.$nextTick(() => {
                this._initScroll();
            });
        }
    }
};
</script>

<style lang='less'>
@rem: 36rem;
.seller{
    position: fixed;
    top: 174px;
    bottom: 0;
    width: 100%;
    overflow: hidden;
}
.seller .overview{
    position: relative;
    padding: 18px;
    border-top: .5/@rem solid rgba(7, 17, 27, .1);
}
.seller .overview .title{
    margin-bottom: 8px;
    font-size: 14px;
    color: rgb(7, 17, 27);
    line-height: 14px;
}
.seller .overview .description{
    font-size: 0;
    padding-bottom: 18px;
    border-bottom: .5/@rem solid rgba(7, 17, 27, .1);
}
.seller .overview .description .star{
    display: inline-block;
    vertical-align: top;
    margin-right: 8px;
}
.seller .overview .description .text{
    display: inline-block;
    margin-right: 12px;
    font-size: 10px;
    color: rgb(77, 85, 93);
    line-height: 18px;
}
.seller .overview .remark{
    display: flex;
    padding-top: 18px;
}
.seller .overview .remark .block{
    flex: 1;
    text-align: center;
}
.seller .overview .remark .block h2{
    margin-bottom: 4px;
    font-size: 10px;
    line-height: 10px;
    color: rgb(147, 153, 159);
    font-weight: normal;
}
.seller .overview .remark .block .content{
    font-size: 0;
}
.seller .overview .remark .block .content .stress{
    display: inline-block;
    font-size: 24px;
    font-weight: 200;
    color: rgb(7, 17, 27);
    line-height: 48px;
}
.seller .overview .remark .block .content .unit{
    display: inline-block;
    font-size: 10px;
    font-weight: 200;
    color: rgb(7, 17, 27);
    line-height: 48px;
}
.seller .overview .follow{
    position: absolute;
    right: 18px;
    top: 18px;
    text-align: center;
}
.seller .overview .follow .icon{
    margin-bottom: 4px;
    font-size: 24px;
    color: rgb(240, 20, 20);
    line-height: 24px;
}
.seller .overview .follow .data{
    font-size: 10px;
    color: rgb(77, 85, 93);
    line-height: 10px;
}
.seller .overview .follow .data.like{
    font-weight: 800;
}
.seller .supports-wrapper{
    padding: 18px;
}
.seller .supports-wrapper .supports{
    padding-bottom: 16px;
    border-bottom: .5/@rem solid rgba(7, 17, 27, .1);
}
.seller .supports-wrapper .supports .title{
    margin-bottom: 8px;
    font-size: 14px;
    color: rgb(7, 17, 27);
    line-height: 14px;
    font-weight: 700;
}
.seller .supports-wrapper .supports .data{
    padding: 0 12px;
    font-size: 12px;
    font-weight: 200;
    color: rgb(240, 20, 20);
    line-height: 24px;
}
.seller .supports-wrapper .description .item{
    border-top: .5/@rem solid rgba(7, 17, 27, .1);
    padding: 16px 12px;
    font-size: 0;
}
.seller .supports-wrapper .description .item .icon{
    display: inline-block;
    vertical-align: top;
    width: 16px;
    height: 16px;
    margin-right: 6px;
}
.seller .supports-wrapper .description .item .desc{
    display: inline-block;
    font-size: 12px;
    font-weight: 200;
    color: rgb(7, 17, 27);
    line-height: 16px;
}
.seller .seller-real{
    padding: 18px 0 18px 18px;
}
.seller .seller-real .title{
    margin-bottom: 12px;
    font-size: 14px;
    color: rgb(7, 17, 27);
    line-height: 14px;
    font-weight: 700;
}
.seller .seller-real .images{
    position: relative;
    left: 0;
    top: 0;
    height: 90px;
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
}
.seller .seller-real .images ul{
    float: left;
    height: 90px;
    // width: 2000px;
    font-size: 0;
}
.seller .seller-real .images .item{
    display: inline-block;
    margin-right: 6px;
    width: 120px;
    height: 90px;
}
.seller .seller-real .images ul li.item:last-child{
    margin-right: 0;
}
.seller .seller-info{
    padding: 18px;
}
.seller .seller-info .title{
    margin-bottom: 12px;
    font-size: 14px;
    color: rgb(7, 17, 27);
    line-height: 14px;
    font-weight: 700;
}
.seller .seller-info .desc .info{
    padding: 16px 12px;
    font-size: 12px;
    font-weight: 200;
    color: rgb(7, 17, 27);
    line-height: 16px;
    border-top: .5/@rem solid rgba(7, 17, 27, .1);
}
</style>
