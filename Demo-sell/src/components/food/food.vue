<template>
    <transition name='showFlag'>
        <div v-show="showFlag" class="food" ref="foodwrapper">
            <div>
                <div class="return iconfont icon-fanhui" @click="hide"></div>
                <div class="food-info">
                    <div class="img">
                        <img :src="food.image" alt="" width='100%' class="title">
                    </div>
                    <div class="info">
                        <div class="name">{{ food.name }}</div>
                        <div class="rate">
                            <span class="sellcount">月售{{ food.sellCount }}份</span>
                            <span class="rating">好评率{{ food.rating }}%</span>
                        </div>
                        <div class="price">
                            <div class="now">¥{{ food.price }}</div>
                            <div class="old" v-show="food.oldPrice">¥{{ food.oldPrice }}</div>
                        </div>
                        <Cartcontrol :food="food" v-show="food.count && food.count > 0" class="btn-Cartcontorl"></Cartcontrol>
                        <div class="btn-addtoshopcart" @click.stop.prevent='addFood($event)' v-show="!food.count || food.count === 0">加入购物车</div>
                    </div>
                </div>
                <Split></Split>
                <div class="food-description">
                    <div class="title">商品介绍</div>
                    <div class="desc">{{ foodInfo }}</div>
                </div>
                <Split></Split>
                <div class="rating">
                    <div class="title">商品评价</div>
                    <Ratingselect :ratings="food.ratings" :selectType="selectType" :onlyContent="onlyContent" :desc="desc" @ratingTypeSelect="change1" @contentToggle="change2"></Ratingselect>
                    <div class="rating-wrapper">
                        <ul v-show="food.ratings && food.ratings.length">
                            <li v-show="needShow(rating.rateType, rating.text)" class="rating-item" v-for="(rating,index) in food.ratings" :key="index">
                                <div class="user">
                                    <span class="name">{{ rating.username }}</span>
                                    <img class="avatar" width="12" height="12" :src="rating.avatar" alt="">
                                </div>
                                <div class="time">{{ rating.rateTime | formatDate }}</div>
                                <p class="text">
                                    <span class="iconfont" :class="{'icon-haoping-yuankuang': rating.rateType === 0,'icon-chaping-yuankuang': rating.rateType === 1,'on': rating.rateType === 0,'off': rating.rateType === 1}"></span>
                                    <span class="data" v-show="rating.text">{{ rating.text }}</span>
                                    <span class="data" v-show="!rating.text">该用户未评论</span>
                                </p>
                            </li>
                        </ul>
                        <div v-show="!food.ratings || !food.ratings.length" class="no-rating">暂无评价</div>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
import Vue from 'vue';
import BScroll from 'better-scroll';
import Cartcontrol from '@/components/common/cartcontrol/cartcontrol.vue';
import Split from '@/components/common/split/split.vue';
import Ratingselect from '@/components/common/ratingselect/ratingselect.vue';
import {formatDate} from '@/common/js/date.js';

const ALL = 2;
const POSITIVE = 0;
const NEGATIVE = 1;

export default {
    filters: {
        formatDate(time){
            var date = new Date(time);
            return formatDate(date, 'yyyy-MM-dd hh:mm');
        }
    },
    data(){
        return {
            showFlag: false,
            selectType: ALL,
            onlyContent: true,
            desc: {
                all: '全部',
                positive: '推荐',
                negative: '吐槽'
            }
        };
    },
    props: {
        // 点击的食物
        food: {
           type: Object
        },
        selectFoods: {
            type: Array
        }
    },
    computed: {
        rateGood(){
            let a = 0;
            this.food.ratings.forEach(rate => {
                if (rate.rateType === 0){
                    a++;
                }
            });
            return a;
        },
        selectRateClass(){
            return 'rating-' + this.selectRate;
        },
        foodInfo(){
            if (this.food.info){
                return this.food.info;
            } else {
                return '暂无';
            }
        }
    },
    methods: {
        show(){
            // 在show的时候,界面才被渲染,此时initscroll时机正好
            this.showFlag = true;
            // 在show的时候,初始化变量
            this.selectType = ALL;
            this.onlyContent = false;

            this.$nextTick(() => {
                this._initScroll();
            });
        },
        hide(){
            this.showFlag = false;
        },
        addFood(e){
            if (!this.food.count){
                Vue.set(this.food, 'count', 1);
            } else {
                this.food.count++;
            }
            this.selectFoods.push(this.food);
        },
        _initScroll(){
            if (!this.foodFlagScroll){
                this.foodFlagScroll = new BScroll(this.$refs.foodwrapper, {
                click: true
                });
            } else {
                this.foodFlagScroll.refresh();
            }
        },
        change1(x){
            // console.log(x);
            this.selectType = x;
        },
        change2(x){
            this.onlyContent = x.onlyContent;
        },
        needShow(type, text){
            this.$nextTick(() => {
                this._initScroll();
            });
            if (this.onlyContent && !text){
                return false;
            }
            if (this.selectType === ALL){
                return true;
            } else {
                return type === this.selectType;
            }
        }
    },
    components: {
        Cartcontrol,
        Split,
        Ratingselect
    }
};
</script>

<style lang="less">
@rem: 36rem;
.food{
    position: fixed;
    z-index: 30;
    left: 0;
    top: 0;
    bottom: 48px;
    width: 100%;
    background-color: #f3f5f7;
}
.showFlag-enter-active, .showFlag-leave-active{
    transition: all .5s;
}
.showFlag-enter, .showFlag-leave-to{
    opacity: 0;
    left: 100%;
}
.food .return{
    position: absolute;
    z-index: 31;
    left: 0px;
    top: 0px;
    width: 20px;
    height: 20px;
    padding: 16px;
    color: #fff;
    font-size: 20px;
}
.food .food-info{
    background: #fff;
}
.food .food-info .img{
    font-size: 0;
    width: 100%;
    padding-top: 100% // 为图片缓存预留空间
}
.food .food-info .img .title{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
}
.food .food-info .info{
    position: relative;
    padding: 0 18px;
    padding-bottom: 18px;
}
.food .food-info .info .name{
    margin: 18px 0 8px 0px;
    font-size: 14px;
    font-weight: 700;
    color: rgb(7, 17, 27);
    line-height: 14px;
}
.food .food-info .rate{
    font-size: 10px;
    color: rgb(147, 153, 159);
}
.food .food-info .rate .sellcount{
    line-height: 10px;
    margin-right: 12px;
}
.food .food-info .price{
    font-size: 0;
    margin-top: 9px;
}
.food .food-info .price .now{
    display: inline-block;
    margin-right: 10px;
    font-size: 14px;
    font-weight: 700;
    color: rgb(240, 20, 20);
    line-height: 24px;
}
.food .food-info .price .old{
    display: inline-block;
    vertical-align: top;
    font-size: 10px;
    font-weight: 700;
    color: rgb(147, 153, 159);
    line-height: 24px;
    text-decoration: line-through;
}
.food .food-info .btn-addtoshopcart{
    position: absolute;
    right: 18px;
    bottom: 18px;
    padding: 6px 12px;
    width: 74px;
    height: 24px;
    box-sizing: border-box;
    background: rgb(0, 160, 220);
    border-radius: 24px;
    font-size: 10px;
    color: #fff;
    line-height: 12px;
}
.food .food-info .btn-Cartcontorl{
    position: absolute;
    right: 18px;
    bottom: 6px;
}
.food .food-description{
    padding: 18px;
    background: #fff;
}
.food .food-description .title{
    font-size: 12px;
    color: #000;
    margin-bottom: 6px;
}
.food .food-description .desc{
    margin-right: 8px;
    font-size: 12px;
    font-weight: 200;
    color: rgb(77, 85, 93);
    line-height: 24px;
}
.food .rating{
    padding-top: 18px;
}
.food .rating .title{
    margin: 0 18px;
    font-size: 14px;
    color: rgb(7, 17, 27);
}
.food .rating .rating-wrapper{
    padding: 0 18px;
}
.food .rating .rating-wrapper .rating-item{
    position: relative;
    padding: 16px 0;
    border-bottom: .5/@rem solid rgba(7, 17, 27, .2);
}
.food .rating .rating-wrapper .rating-item .user{
    position: absolute;
    right: 0;
    top: 16px;
    font-size: 0;
    line-height: 12px;
}
.food .rating .rating-wrapper .rating-item .user .name{
    display: inline-block;
    vertical-align: top;
    font-size: 10px;
    color: rgb(147, 153, 159);
    margin-right: 6px;
}
.food .rating .rating-wrapper .rating-item .user .avatar{
    border-radius: 50%;
}
.food .rating .rating-wrapper .rating-item .time{
    margin-bottom: 6px;
    font-size: 10px;
    color: rgb(147, 153, 159);
    line-height: 12px;
}
.food .rating .rating-wrapper .rating-item .text{
    line-height: 12px;
    font-size: 12px;
}
.food .rating .rating-wrapper .rating-item .text .iconfont{
    margin-right: 4px;
    font-size: 12px;
}
.food .rating .rating-wrapper .rating-item .text .iconfont.on{
    color: rgb(0, 160, 220);
}
.food .rating .rating-wrapper .rating-item .text .iconfont.off{
    color: rgb(147, 153, 159);
}
.food .rating .rating-wrapper .rating-item .text .data{
    color: rgb(7, 17, 27);
    font-size: 12px;
    color: rgb(7, 17, 27);
    line-height: 16px;
}
.food .rating .rating-wrapper .no-rating{
    padding: 16px 0;
    font-size: 12px;
    color: rgb(147, 153, 159);
}
</style>
