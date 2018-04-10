<template>
    <div id="star" :class='starSize'>
        <!-- itemClasses ['on', 'on', ..., 'off'] -->
        <span v-for='(itemClass, index) in itemClasses' :class='itemClass' class='star-item' v-bind:key='index'></span>
    </div>
</template>

<script>
const STAR_LEVEL = 5;
const CLS_ON = 'on';
const CLS_HALF = 'half';
const CLS_OFF = 'off';

export default {
    props: {
        // 24 36 48
        size: {
            type: Number,
            default: 48,
            require: true
        },
        // 实际分数
        score: {
            type: Number,
            default: 5,
            require: true
        }
    },
    computed: {
        starSize(){
            return 'star-' + this.size;
        },
        itemClasses(){
            let res = [];
            let score = Math.floor(this.score * 2) / 2;
            let hasDecimal = score % 1 !== 0;
            let integer = Math.floor(score);
            for (let i = 0; i < integer; i++) {
                res.push(CLS_ON);
            }
            if (hasDecimal) {
                res.push(CLS_HALF);
            }
            while (res.length < STAR_LEVEL) {
                res.push(CLS_OFF);
            };
            return res;
        }
    }
};
</script>

<style lang='stylus'>
@import "../../../common/stylus/mixin.styl"
r = 36rem
#star
    font-size 0
    .star-item
        display inline-block
        background-repeat  no-repeat
    &.star-48
        .star-item
            width 20px
            height 20px
            margin-right 20px
            background-size 20px 20px
            &.last-child
                margin-right 0
            &.on
                bg-image('star48_on')
            &.half
                bg-image('star48_half')
            &.off
                bg-image('star48_off')
    &.star-36
        .star-item
            width 15px
            height 15px
            margin-right 5px
            background-size 15px 15px
            &.last-child
                margin-right 0
            &.on
                bg-image('star36_on')
            &.half
                bg-image('star36_half')
            &.off
                bg-image('star36_off')
    &.star-24
        .star-item
            width 10px
            height 10px
            margin-right 3px
            background-size 10px 10px
            &.last-child
                margin-right 0
            &.on
                bg-image('star24_on')
            &.half
                bg-image('star24_half')
            &.off
                bg-image('star24_off')
</style>
