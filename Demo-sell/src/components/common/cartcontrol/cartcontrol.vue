<template>
    <div class="cartcontrol">
        <transition name="cart-decrease">
            <div v-show="food.count > 0" class="cart-decrease iconfont icon-iconless" @click.stop.prevent='decreaseCart($event)'></div>
        </transition>
        <transition name="cart-count">
            <div v-show="food.count > 0" class="cart-count">{{ food.count }}</div>
        </transition>
        <div class="cart-add iconfont icon-tianjia" @click.stop.prevent='addCart($event)'></div>
    </div>
</template>

<script>
import Vue from 'vue';
export default {
    name: 'cartcontrol',
    props: {
        food: {
            type: Object
        }
    },
    methods: {
        // food如果没有count这个属性,则添加时不会绑定到DOM
        addCart(){
            if (!this.food.count) {
                Vue.set(this.food, 'count', 1);
            } else {
                this.food.count += 1;
            }
        },
        decreaseCart(){
            if (this.food.count !== 0){
                this.food.count--;
            }
        }
    }
};
</script>

<style>
.cartcontrol {
    font-size: 0;
}
.cartcontrol .cart-decrease, .cart-add {
    display: inline-block;
    vertical-align: top;
    padding: 12px;
    font-size: 20px;
    color: rgb(0, 160, 220);
    line-height: 24px;
}
.cartcontrol .cart-count {
    display: inline-block;
    width: 18px;
    font-size: 16px;
    color: rgb(147, 153, 159);
    line-height: 48px;
    text-align: center;
    opacity: 1;
}
.cart-decrease-enter-active, .cart-decrease-leave-active {
    transition: all .5s;
}
.cart-decrease-enter, .cart-decrease-leave-to {
    transform: translateX(60px) rotate(180deg);
    opacity: 1;
}
.cart-count-enter-active, .cart-count-leave-active {
    transition: all .5s;
}
.cart-count-enter, .cart-count-leave-to {
    transform: translateX(36px);
    opacity: 1;
}
</style>
