<template>
    <div id="goods">

        <!-- 商品栏的左侧目录 -->
        <!-- better-scroll作用于子元素，所以要有一层wrapper封装 -->
        <div class="menu-wrapper" ref="menuwrapper">
            <ul class='menu'>
                <li class='menu-item menu-item-hook' v-for='(item,index) in goods' :key='index' :class="{'current': currentIndex === index}" @click="selectMenu(index, $event)">
                    <icon :size='1' :type="classMap[item.type]" v-show="item.type>0"></icon>
                    <span class='name'>
                        {{ item.name }}
                    </span>
                </li>
            </ul>
        </div>

        <!-- 商品栏的data区 -->
        <!-- better-scroll作用于子元素，所以要有一层wrapper封装 -->
        <div class="foods-wrapper" ref="foodwrapper">
            <ul class='goods'>
                <li v-for='(item,index) in goods' :key='index' class='food-list foot-list-hook'>
                    <h1 class='title'>{{ item.name }}</h1>
                    <ul>
                        <li class='food-item' v-for='(food,index) in item.foods' :key='index'>
                            <div class="icon" @click="selectFood(food, $event)">
                                <img :src="food.icon" alt="" width='57' height='57'>
                            </div>
                            <div class="content">
                                <div class="name">{{ food.name }}</div>
                                <p class="description">{{ food.description }}</p>
                                <div class="extra">
                                    <span class='sellCount'>月售{{ food.sellCount }}份</span>
                                    <span class="rating">好评率{{ food.rating }}%</span>
                                </div>
                                <div class="price">
                                    <span class='now'>¥{{ food.price }}</span>
                                    <span class='old' v-show='food.oldPrice'>¥{{ food.oldPrice }}</span>
                                </div>
                            </div>
                            <div class="cartcontrol-wrapper">
                                <Cartcontrol :food="food" ></Cartcontrol>
                            </div>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>

        <!-- 购物车 -->
        <shopcart ref="shopcart" :deliveryPrice="seller.deliveryPrice" :minPrice="seller.minPrice" :goods="goods" :selectFoods="selectFoods"></shopcart>

        <!-- 商品详情(选中的单个商品) -->
        <Food :food="selectOneFood" :selectFoods="selectFoods" ref="food"></Food>
    </div>
</template>

<script>
import axios from 'axios';
import Icon from '@/components/common/icon/icon.vue';
import BScroll from 'better-scroll';
import $ from 'jquery';
import Shopcart from '@/components/shopcart/shopcart.vue';
import Cartcontrol from '@/components/common/cartcontrol/cartcontrol.vue';
import Food from '@/components/food/food.vue';
var appData = require('../../../data.json');

// 判断收到接口中的errno是否为0
const ERR_OK = 0;
export default {
    name: 'goods',
    props: {
        seller: {
            type: Object,
            require: true
        }
    },
    components: {
        Icon,
        Shopcart,
        Cartcontrol,
        Food
    },
    data(){
        return {
            goods: [],
            listHeight: [],
            scrollY: 0,
            selectOneFood: {}
        };
    },
    created(){
        axios.get('/api/goods')
        .then(res => {
            if (res.data.errno === ERR_OK){
                this.goods = res.data.data;
                this.$nextTick(() => {
                    // Vue构造器里的data值被修改完成后会调用nextTick这个方法
                    // DOM真正的变化在nextTick函数中以及之后

                    // 有bug会报错 Uncaught TypeError: list[i] is not a function
                    this._initScroll();
                    this._calculateHeight();
                });
                // setTimeout(this._initScroll, 20);
                // setTimeout(this._calculateHeight, 20);
            };
        });
        this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
    },
    // mounted(){
    //     setTimeout(this._initScroll, 30);
    //     setTimeout(this._calculateHeight, 30);
    // },
    methods: {
        // 初始化滚动组件
        // this.$refs.foodwrapper可以拿到原生DOM
        _initScroll(){
            this.menuScroll = new BScroll(this.$refs.menuwrapper, {
                click: true
            });
            this.foodsScroll = new BScroll(this.$refs.foodwrapper, {
                probeType: 3,
                click: true
            });
            // 监控foodswrapper的Y值用于对应menuwrapper的index
            this.foodsScroll.on('scroll', pos => {
                // console.log(pos);
                this.scrollY = Math.abs(Math.round(pos.y));
            });
        },
        // 获取foodswrapper的区间高度
        _calculateHeight(){
            // 获取footlist对象
            let foodList = this.$refs.foodwrapper.getElementsByClassName('foot-list-hook');
            let height = 0;
            this.listHeight.push(height);
            for (let i = 0; i < foodList.length; i++) {
                height += foodList[i].clientHeight;
                this.listHeight.push(height);
            }
        },
        selectMenu(i, e){
            let foodList = this.$refs.foodwrapper.getElementsByClassName('foot-list-hook');
            let el = foodList[i];
            // better-scroll方法动画滚动到指定对象上
            this.foodsScroll.scrollToElement(el, 20);
        },
        selectFood(food, e){
            this.selectOneFood = food;
            this.$refs.food.show();
        }
    },
    computed: {
        currentIndex(){
            for (let i = 0; i < this.listHeight.length; i++) {
                let height1 = this.listHeight[i];
                let height2 = this.listHeight[i + 1];
                if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
                    return i;
                }
            }
            return 0;
        },
        // 已选择的foods, food的count发生变化时重新计算
        selectFoods(){
            let foods = [];
            this.goods.forEach((good) => {
                good.foods.forEach((food) => {
                    if (food.count){
                       foods.push(food);
                    }
                });
            });
            return foods;
        }
    }
};
</script>

<style lang='less'>
@rem: 36rem;
#goods{
    display: flex;
    position: absolute;
    top: 174px;
    bottom: 46px;
    width: 100%;
    overflow: hidden;
}
#goods .menu-wrapper{
    flex: 0 0 80px;
    width: 80px;
    background: #f3f5f7;
}
#goods .menu-wrapper li.current{
    background-color: #fff;
}
#goods .menu-wrapper li.current .name{
    font-weight: 700;
}
#goods .menu-wrapper li.menu-item{
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    height: 54px;
    width: 64px;
    line-height: 14px;
    padding: 0 8px;
    border-bottom: 0.5/@rem solid rgba(7, 17, 27, .1);
    font-weight: 200;
}
#goods .menu-wrapper li.menu-item:last-of-type{
    border-bottom: none;
}
#goods .menu-wrapper li.menu-item .icon{
    flex: 0.3;
    width: 12px;
    height: 12px;
}
#goods .menu-wrapper li.menu-item .icon span{
    display: block;
    width: 100%;
    height: 100%;
    background-size: 12px 12px;
}
#goods .menu-wrapper li.menu-item .name{
    flex: 1;
    width: 56px;
    font-size: 12px;
    line-height: 14px;
}
#goods .foods-wrapper{
    flex: 1;
}
#goods .foods-wrapper .title{
    padding-left: 14px;
    height: 26px;
    font-size: 12px;
    color: rgb(147, 153, 159);
    line-height: 26px;
    background: #f3f5f7;
    border-left: 2px solid #D9DDE1;
}
#goods .foods-wrapper .food-item{
    position: relative;
    display: flex;
    margin: 18px 18px 0 18px;
    padding: 0 0 18px 0;
    border-bottom: .5/@rem solid rgba(7, 17, 27, .1);
}
#goods .foods-wrapper .food-item:last-of-type{
    border-bottom: 0;
}
#goods .foods-wrapper .food-item .icon{
    flex: 0 0 57px;
    margin-right: 10px;
}
#goods .foods-wrapper .food-item .content{
    flex: 1;
}
#goods .foods-wrapper .food-item .content .name{
    margin-top: 2px;
    font-size: 14px;
    line-height: 14px;
    color: rgb(7, 17, 27);
}
#goods .foods-wrapper .food-item .content .description{
    font-size: 10px;
    margin: 8px 0;
    color: rgb(147, 153, 159);
    line-height: 12px;
}
#goods .foods-wrapper .food-item .content .extra{
    line-height: 10px;
    font-size: 10px;
    color: rgb(147, 153, 159);
}
#goods .foods-wrapper .food-item .content .extra span{
    margin-right: 12px;
}
#goods .foods-wrapper .food-item .content .price{
    line-height: 24px;
    font-weight: 700;
    overflow: hidden;
}
#goods .foods-wrapper .food-item .content .price .now{
    float: left;
    color: rgb(240, 20, 20);
    font-size: 14px;
    margin-right: 8px;
}
#goods .foods-wrapper .food-item .content .price .old{
    float: left;
    text-decoration: line-through;
    font-size: 10px;
    color: rgb(147, 153, 159);
}
#goods .foods-wrapper .food-item .cartcontrol-wrapper{
    position: absolute;
    right: 0;
    bottom: 12px;
}
</style>
