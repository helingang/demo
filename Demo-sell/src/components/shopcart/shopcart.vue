<template>
    <div>
        <div id="shopcart">
            <div class="content" @click="toggleList">
                <div class="content-left">
                    <div class="logo-wrapper">
                        <div class="logo iconfont icon-ai-cart" :class="{'highlight': totalCount > 0}"></div>
                        <div v-show="totalCount > 0" class="count">{{ totalCount }}</div>
                    </div>
                    <div class="price" :class="{'highlight': totalPrice > 0}">¥{{ totalPrice }}</div>
                    <div class="line"></div>
                    <div class="description">另需配送费¥ {{ deliveryPrice }}元</div>
                </div>
                <div class="content-right">
                    <div class="sell-price" :class="payClass" @click.stop.prevent="pay($event)">{{ payDescription }}</div>
                </div>
            </div>
            <!-- <div class="ball-wrapper">
                <transition-group name="drop">
                    <div v-for="(ball, index) in balls" v-show="ball.show" :key="index" class="ball"></div>
                </transition-group>
            </div> -->
            <transition name="shopcart-list">
                <div class="shopcart-list" v-show="listShow">
                    <div class="list-header">
                        <h1 class="title">购物车</h1>
                        <span class="empty" @click="empty">清空</span>
                    </div>

                    <div class="list-content" ref="listwrapper">
                        <ul>
                            <li v-for="(food, index) in selectFoods" :key="index" class="list-data">
                                <span class="name">{{ food.name }}</span>
                                <div class="price">
                                    <span>¥{{ food.price*food.count }}</span>
                                </div>
                                <div class="cartcontrol-wrapper">
                                    <Cartcontrol :food="food"></Cartcontrol>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </transition>
        </div>
        <transition name='lm'>
            <div class="list-mask" v-show="listShow" @click="maskClick"></div>
        </transition>
    </div>
</template>

<script>
import Cartcontrol from '@/components/common/cartcontrol/cartcontrol.vue';
import BScroll from 'better-scroll';
export default {
    data(){
        return {
            fold: true,
            isClick: false
        };
    },
    mounted(){
        setTimeout(this._initScroll1, 20);
    },
    components: {
        'Cartcontrol': Cartcontrol
    },
    props: {
        selectFoods: {
            type: Array,
            default(){
                return [];
            }
        },
        goods: {
            type: Array,
            default(){
                return [];
            }
        },
        deliveryPrice: {
            type: Number,
            default: 0
        },
        minPrice: {
            type: Number,
            default: 0
        }
    },
    computed: {
        totalPrice(){
            let total = 0;
            this.selectFoods.forEach((val) => {
                total += val.price * val.count;
            });
            return total;
        },
        totalCount(){
            let count = 0;
            this.selectFoods.forEach((val) => {
                count += val.count;
            });
            return count;
        },
        payDescription(){
            if (this.totalPrice === 0){
                return `¥${this.minPrice}元起送`;
            } else if (this.totalPrice < this.minPrice){
                let diff = this.minPrice - this.totalPrice;
                return `还差¥${diff}元起送`;
            } else {
                return '闪开,我要付钱了';
            }
        },
        payClass(){
            if (this.totalPrice >= this.minPrice){
                return 'enough';
            } else {
                return 'not-enough';
            }
        },
        /* eslint-disable */ 
        listShow(){
            if (this.totalCount > 0) {
                this.fold = false;
            } else {
                this.isClick = false;
                this.fold = true;
            }
            if (this.isClick === true) {
                if (!this.fold) {
                    // 在展开的时候初始化或者刷新滚动对象
                    this.$nextTick(() => {
                        if (!this.scroll) {
                            this.scroll = new BScroll(this.$refs.listwrapper, {
                                click: true
                            });
                        } else {
                            this.scroll.refresh();
                        }
                        
                    })
                }
                return !this.fold;
            } else {
                return false
            }
            
        }
    },
    methods: {
        toggleList(){
            this.isClick = !this.isClick;
            if (this.totalCount) {
                this.fold = false;
            } else {
                this.fold = true;
            }
        },
        empty(){
            this.selectFoods.forEach(food => {
                food.count = 0;
            })
        },
        maskClick(){
            this.fold = true;
            this.isClick = false;
        },
        pay(e){
            if(this.totalPrice >= this.minPrice){
                let r = window.confirm('pay')
                if (r) {
                    this.$router.push({path: '/payPage'})
                }
            }
        }
    }
};
</script>

<style lang="less">
@rem: 36rem;
#shopcart{
    position: fixed;
    z-index: 50;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 48px;
    background: rgb(19, 29, 38);
}
#shopcart .content{
    display: flex;
}
#shopcart .content .content-left{
    flex: 1;
    font-size: 0;
}
#shopcart .content .content-left .logo-wrapper{
    display: inline-block;
    position: relative;
    z-index: 50;
    margin-top: -10px;
    margin-left: 6px;
    width: 58px;
    height: 58px;
    border-radius: 50%;
    background: rgb(19, 29, 38);
}
#shopcart .content .content-left .logo-wrapper .logo{
    position: absolute;
    left: 6px;
    top: 6px;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: rgb(43, 52, 60);
    text-align: center;
    line-height: 44px;
    font-size: 24px;
    color: rgb(128, 133, 138);
}
#shopcart .content .content-left .logo-wrapper .logo.highlight{
    background-color: #00a0dc;
    color: #fff;
}
#shopcart .content .content-left .logo-wrapper .count{
    position: absolute;
    left: 36px;
    width: 24px;
    height: 16px;
    background: rgb(240, 20, 20);
    font-size: 9px;
    font-weight: 700;
    color: #fff;
    line-height: 16px;
    text-align: center;
    border-radius: 16px;

}
#shopcart .content .content-left .price{
    vertical-align: top;
    display: inline-block;
    font-size: 16px;
    margin-left: 10px;
    line-height: 48px;
    font-weight: 700;
    color: #919396;
    box-shadow: 0px 4px 8px 0 rgba(0, 0, 0, .4);
}
#shopcart .content .content-left .price.highlight{
    color: #fff;
}
#shopcart .content .content-left .line{
    vertical-align: top;
    display: inline-block;
    margin: 9px 12px 0 12px;
    height: 30px;
    width: 1px;
    border-left: 0.5/@rem solid rgb(44, 52, 61);
}
#shopcart .content .content-left .description{
    display: inline-block;
    vertical-align: top;
    font-size: 14px;
    color: rgb(139, 141, 144);
    line-height: 48px;
    font-weight: 700;
}
#shopcart .content .content-right{
    flex: 0 0 105px;
    width: 105px;
}
#shopcart .content .content-right .sell-price{
    font-size: 12px;
    line-height: 48px;
    font-weight: 700;
    text-align: center;
}
#shopcart .content .content-right .sell-price.not-enough{
    background: #2b333b;
    color: rgba(255, 255, 255, .4);
}
#shopcart .content .content-right .sell-price.enough{
    background: #0d9754;
    color: #fff;
}
.shopcart-list-enter-active, .shopcart-list-leave-active{
    transition: all .5s;
}
.shopcart-list-enter, .shopcart-list-leave-to{
    opacity: 0;
}
#shopcart .shopcart-list{
    position: absolute;
    left: 0;
    bottom: 48px;
    z-index: 40;
    width: 100%;
}
#shopcart .shopcart-list .list-header{
    height: 40px;
    line-height: 40px;
    padding: 0 18px;
    background: #f3f5f7;
    border-bottom: 1/@rem solid rgba(7, 17, 27, .1);
}
#shopcart .shopcart-list .list-header .title{
    float: left;
    font-size: 14px;
    color: rgb(7, 17, 27);
}
#shopcart .shopcart-list .list-header .empty{
    float: right;
    font-size: 12px;
    color: rgb(0, 160, 220);
}
#shopcart .shopcart-list .list-content{
    padding: 0 18px;
    max-height: 217px;
    overflow: hidden;
    background: #fff;
}
#shopcart .shopcart-list .list-content .list-data{
    position: relative;
    // box-sizing: border-box;
    padding: 12px 0;
    line-height: 32px;
    border-bottom: 1/@rem solid rgba(7, 17, 27, .1);
}
#shopcart .shopcart-list .list-content .list-data .name{
    font-size: 14px;
    line-height: 36px;
    color: rgb(7, 17, 27);
}
#shopcart .shopcart-list .list-content .list-data .price{
    position: absolute;
    right: 110px;
    bottom: 24px;
    font-size: 14px;
    line-height: 10px;
    font-weight: 700;
    color: rgb(240, 20, 20);
}
#shopcart .shopcart-list .list-content .list-data .cartcontrol-wrapper{
    position: absolute;
    right: 0px;
    bottom: 6px;
}
.list-mask{
    position: fixed;
    z-index: 40;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(7, 17, 27, 0.6);
}
.lm-enter-active, .lm-leave-active{
    transition: all .5s;
    background: rgba(7, 17, 27, 0.6);
}
.lm-enter, .lm-leave-to{
    opacity: 0;
    background: rgba(7, 17, 27, 0);
}
</style>
