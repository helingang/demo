<template>
    <div class="ratings" ref="ratingswrapper">
        <div class="ratings-content">
            <div class="overview">
                <div class="ov-left">
                    <h1 class="score">{{ seller.score }}</h1>
                    <div class="title">综合评分</div>
                    <div class="rank">高于周边商家{{ seller.rankRate }}</div>
                </div>
                <div class="ov-right">
                    <div class="score-wrapper">
                        <span class="title">服务态度</span>
                        <Star :size="36" :score="seller.serviceScore" class="star" tag='span'></Star>
                        <span class="score">{{ seller.score }}</span>
                    </div>
                    <div class="score-wrapper">
                        <span class="title">食物评分</span>
                        <Star :size='36' :score='seller.foodScore' class="star"></Star>
                        <span class="score">{{ seller.foodScore }}</span>
                    </div>
                    <div class="deliverytime">
                        <span class="title">送达时间</span>
                        <span class="time">{{ seller.deliveryTime }}分钟</span>
                    </div>
                </div>
            </div>
            <Split></Split>
            <RatingSelect :desc="desc" :onlyContent="onlyContent" :selectType="selectType" :ratings="ratings" @ratingTypeSelect="change1" @contentToggle="change2"></RatingSelect>
            <div class="ratings-wrapper">
                <ul v-show="ratings">
                    <li v-show="needShow(rating.rateType, rating.text)" v-for="(rating,index) in ratings" :key="index" class="item">
                        <div class="left">
                            <div class="avatar">
                                <img :src="rating.avatar" alt="" width="28" height="28">
                            </div>
                        </div>
                        <div class="right">
                            <div class="title">
                                <span class="name">{{ rating.username }}</span>
                                <span class="time">{{ rating.rateTime | formatDate }}</span>
                            </div>
                            <div class="rate">
                                <Star :size='24' :score='rating.score' tag='span' class="star"></Star>
                                <span class="deliverytime" v-show="rating.deliveryTime">{{ rating.deliveryTime }}分送达</span>
                            </div>
                            <p class="data">{{ rating.text }}</p>
                            <div class="content">
                                <span class="icon iconfont" :class="{'icon-haoping-yuankuang': rating.rateType === 0,'icon-chaping-yuankuang': rating.rateType === 1,'on': rating.rateType === 0,'off': rating.rateType === 1}"></span>
                                <span class="eats" v-for="(eat,index) in rating.recommend" :key="index">{{ eat }}</span>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
import RatingSelect from '@/components/common/ratingselect/ratingselect';
import Split from '@/components/common/split/split';
import Star from '@/components/common/star/star';
import axios from 'axios';
import BScroll from 'better-scroll';
import {formatDate} from '@/common/js/date.js';
let appData = require('../../../data.json');
const ERR_OK = 0;
const ALL = 2;
const POSITIVE = 0;
const NEGATIVE = 1;
export default {
    name: 'ratings',
    filters: {
        formatDate(time){
            var date = new Date(time);
            return formatDate(date, 'yyyy-MM-dd hh:mm');
        }
    },
    data(){
        return {
            ratings: [],
            desc: {
                all: '全部',
                positive: '满意',
                negative: '不满意'
            },
            onlyContent: false,
            selectType: ALL
        };
    },
    props: {
        seller: {
            type: Object
        }
    },
    components: {
        RatingSelect,
        Split,
        Star
    },
    created(){
        axios.get('/api/ratings')
        .then(res => {
            if (res.data.errno === ERR_OK){
                this.ratings = res.data.data;
            }
        });
    },
    mounted(){
        setTimeout(this._initScroll, 20);
    },
    methods: {
        _initScroll(){
            if (!this.ratingScroll){
                this.ratingScroll = new BScroll(this.$refs.ratingswrapper, {
                click: true
            });
            } else {
                this.ratingScroll.refresh();
            }
        },
        change1(x){
            // console.log(x);
            this.selectType = x;
        },
        change2(x){
            // console.log(x);
            this.onlyContent = x.onlyContent;
        },
        needShow(type, text){
            this.$nextTick(() => {
                this._initScroll();
            });
            if (this.onlyContent === true && !text){
                return false;
            }
            if (this.selectType === ALL){
                return true;
            } else {
                return type === this.selectType;
            }
        }
    }
};
</script>

<style lang='less'>
@rem: 36rem;
.ratings{
    position: absolute;
    width: 100%;
    top: 174px;
    bottom: 0;
    overflow: hidden;
}
.ratings .overview{
    display: flex;
    padding: 18px 24px 18px 0;
    border-top: .5/@rem solid rgba(7, 17, 27, .1);
}
.ratings .overview .ov-left{
    flex: 0 0 107px;
    width: 107px;
    text-align: center;
    border-right: .5/@rem solid rgba(7, 17, 27, .2);
}
.ratings .overview .ov-left .score{
    margin-bottom: 6px;
    font-size: 24px;
    color: rgb(255, 153, 0);
    line-height: 28px;
}
.ratings .overview .ov-left .title{
    font-size: 12px;
    color: rgb(7, 17, 27);
    line-height: 12px;
}
.ratings .overview .ov-left .rank{
    margin: 8px 0 6px 0;
    font-size: 10px;
    color: rgb(147, 153, 159);
    line-height: 10px;
}
.ratings .overview .ov-right{
    flex: 1;
    padding-left: 12px;
}
.ratings .overview .ov-right .score-wrapper{
    margin-bottom: 8px;
    font-size: 0;
}
.ratings .overview .ov-right .score-wrapper .title{
    display: inline-block;
    font-size: 12px;
    color: rgb(7, 17, 27);
    line-height: 12px;
}
.ratings .overview .ov-right .score-wrapper .star{
    display: inline-block;
    vertical-align: top;
    margin: 0 6px;
    line-height: 18px;
}
.ratings .overview .ov-right .score-wrapper .score{
    display: inline-block;
    font-size: 12px;
    color: rgb(255, 153, 0);
    line-height: 18px;
}
.ratings .overview .ov-right .deliverytime{
    font-size: 0;
}
.ratings .overview .ov-right .deliverytime .title{
    margin-right: 12px;
    display: inline-block;
    font-size: 12px;
    color: rgb(7, 17, 27);
    line-height: 12px;
}
.ratings .overview .ov-right .deliverytime .time{
    display: inline-block;
    font-size: 12px;
    color: rgb(147, 153, 159);
    line-height: 18px;
}
.ratings .ratings-wrapper{
    padding: 0 18px;
}
.ratings .ratings-wrapper .item{
    display: flex;
    padding: 18px 0;
    border-bottom: .5/@rem solid rgba(7, 17, 27, .1);
}
.ratings .ratings-wrapper .left{
    flex: 0 0 28px;
    width: 28px;
    margin-right: 12px;
}
.ratings .ratings-wrapper .left .avatar{
    width: 28px;
    height: 28px;
}
.ratings .ratings-wrapper .left .avatar img{
    width: 100%;
    height: 100%;
    border-radius: 50%;
}
.ratings .ratings-wrapper .right{
    flex: 1;
}
.ratings .ratings-wrapper .right .title{
    overflow: hidden;
}
.ratings .ratings-wrapper .right .title .name{
    float: left;
    font-size: 10px;
    color: rgb(7, 17, 27);
    line-height: 12px;
}
.ratings .ratings-wrapper .right .title .time{
    float: right;
    font-size: 10px;
    font-weight: 200;
    color: rgb(147, 153, 159);
    line-height: 12px;
}
.ratings .ratings-wrapper .right .rate{
    margin: 4px 0 6px 0;
    font-size: 0;
}
.ratings .ratings-wrapper .right .rate .star{
    display: inline-block;
    vertical-align: top;
    margin-right: 6px;
}
.ratings .ratings-wrapper .right .rate .deliverytime{
    display: inline-block;
    font-size: 10px;
    font-weight: 200;
    color: rgb(147, 153, 159);
    line-height: 12px;
}
.ratings .ratings-wrapper .right .data{
    margin-bottom: 8px;
    font-size: 12px;
    color: rgb(7, 17, 27);
    line-height: 18px;
}
.ratings .ratings-wrapper .right .content{
    font-size: 0;
}
.ratings .ratings-wrapper .right .content .icon{
    display: inline-block;
    vertical-align: top;
    font-size: 12px;
    line-height: 18px;
}
.ratings .ratings-wrapper .right .content .icon.on{
    color: rgb(0, 160, 220);
}
.ratings .ratings-wrapper .right .content .icon.off{
    color: rgb(183, 187, 191);
}
.ratings .ratings-wrapper .right .content .eats{
    display: inline-block;
    max-width: 52px;
    margin: 2px 0 2px 8px;
    font-size: 9px;
    padding: 0 6px;
    line-height: 14px;
    color: rgb(147, 153, 159);
    border: .5/@rem solid rgba(7, 17, 27, .1);
    background: #fff;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
}
</style>
