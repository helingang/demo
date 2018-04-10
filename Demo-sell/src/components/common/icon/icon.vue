<template>
    <div class="icon" :class='iconSize'>
        <span :class='iconType'></span>
    </div>
</template>

<script>
export default {
    props: {
        size: {
            type: Number,
            require: true
        },
        type: {
            type: String,
            requier: true
        }
    },
    computed: {
        iconSize(){
            return 'iconsize-' + this.size;
        },
        iconType(){
            return this.type;
        }
    }
};
</script>

<style lang="stylus">
@import "../../../common/stylus/mixin.styl"
r = 36rem
.icon
    &.iconsize-2
        span
            display inline-block
            width 16px
            height 16px
            background-size 16px 16px
            background-repeat no-repeat
            &.decrease
                bg-image('decrease_4')
            &.discount
                bg-image('discount_4')
            &.guarantee
                bg-image('guarantee_4')
            &.invoice
                bg-image('invoice_4')
            &.special
                bg-image('special_4')
    &.iconsize-1
        span
            display inline-block
            width 12px
            height 12px
            background-size 12px 12px
            background-repeat no-repeat
            &.decrease
                bg-image('decrease_3')
            &.discount
                bg-image('discount_3')
            &.guarantee
                bg-image('guarantee_3')
            &.invoice
                bg-image('invoice_3')
            &.special
                bg-image('special_3')
</style>
