<template>
    <div class="ratingselect">
        <div class="rating-type">
            <span class="block positive" :class="{'active': this.selectType === 2}" @click.stop.prevent="select(2, $event)">{{ desc.all }}<span class="count">{{ ratings.length }}</span> </span>
            <span class="block positive" :class="{'active': this.selectType === 0}" @click.stop.prevent="select(0, $event)">{{ desc.positive }}<span class="count">{{ positives.length }}</span></span>
            <span class="block negative" :class="{'active': this.selectType === 1}" @click.stop.prevent="select(1, $event)">{{ desc.negative }}<span class="count">{{ negatives.length }}</span></span>
        </div>
        <div class="switch" :class="{'on': onlyContent === true}" @click.stop.prevent="toggleSwitchOnlyContent($event)">
            <span class="iconfont icon-queren"></span>
            <span class="text">只看有内容的评价</span>
        </div>
    </div>
</template>

<script>
const POSITIVE = 0;
const NEGATIVE = 1;
const ALL = 2;
export default {
    // 需要接收父级的四个参数
    props: {
        // 每个点击食物下的rating
        ratings: {
            type: Array,
            default(){
                return [];
            }
        },
        selectType: {
            type: Number,
            default: ALL
        },
        onlyContent: {
            type: Boolean,
            default: true
        },
        desc: {
            type: Object,
            default(){
                return {
                    all: '全部',
                    positive: '满意',
                    negative: '不满意'
                };
            }
        }

    },
    methods: {
        select(type, e){
            this.selectType = type;
            // console.log(this.selectType);
            // 这里修改selectType后不会修改父组件的selectType,所以需要下面派发事件
            this.$emit('ratingTypeSelect', type);
        },
        toggleSwitchOnlyContent(e){
            this.onlyContent = !this.onlyContent;
            this.$emit('contentToggle', {onlyContent: this.onlyContent});
        }
    },
    computed: {
        positives(){
            return this.ratings.filter(a => {
                return a.rateType === POSITIVE;
            });
        },
        negatives(){
            return this.ratings.filter(a => {
                return a.rateType === NEGATIVE;
            });
        }
    }
};
</script>

<style lang="less">
@rem: 36rem;
.ratingselect .rating-type{
    padding: 18px 0px;
    margin: 0 18px;
    border-bottom: .5/@rem solid rgba(7, 17, 27, .1);
    font-size: 0;
}
.ratingselect .rating-type .block{
    display: inline-block;
    padding: 8px 12px;
    margin-right: 8px;
    border-radius: 2px;
    font-size: 12px;
    color: rgb(77, 85, 93);
    line-height: 16px;
}
.ratingselect .rating-type .count{
    margin-left: 2px;
    font-size: 8px;
}
.ratingselect .rating-type .block.positive{
    background: rgba(0, 160, 220, .2);
}
.ratingselect .rating-type .block.negative{
    background: rgba(77, 85, 93, .2);
}
.ratingselect .rating-type .positive.active{
    background: rgb(0, 160, 220);
    color: #fff;
}
.ratingselect .rating-type .negative.active{
    background: rgb(77, 85, 93);
    color: #fff;
}
.ratingselect .switch{
    padding: 12px 18px;
    border-bottom: 1/@rem solid rgba(7, 17, 27, .1);
    color: rgb(147, 153, 159);
    font-size: 0;
}
.ratingselect .switch .iconfont{
    display: inline-block;
    margin-right: 4px;
    font-size: 24px;
    line-height: 24px;
}
.ratingselect .switch.on .iconfont{
    color: #00c850;
}
.ratingselect .switch.on .text{
    color: #000;
}
.ratingselect .switch .text{
    display: inline-block;
    vertical-align: top;
    font-size: 12px;
    line-height: 24px;
}
</style>
