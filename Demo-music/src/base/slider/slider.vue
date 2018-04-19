<template>
    <div class="slider" ref='slider'>
        <div class="slider-group" ref='slidergroup'>
            <!-- slot被slider标签中的DOM所替代 -->
            <slot></slot>
        </div>
        <div class="dots">
            <span class="dot" v-for="(item, index) in dots" :key="index" :class="{'active': currentPageIndex === index}"></span>
        </div>
    </div>
</template>

<script>
import BScroll from 'better-scroll';
import {addClass} from 'common/js/dom.js';
export default {
    data(){
        return {
            dots: [],
            currentPageIndex: 0
        };
    },
    // 外部传入的参数,可以控制轮播的属性
    props: {
        loop: {
            type: Boolean,
            default: true
        },
        autoPlay: {
            type: Boolean,
            default: true
        },
        interval: {
            type: Number,
            default: 1000
        },
        direction: {
            type: Number,
            default: 1
        }
    },
    mounted(){
        setTimeout(() => {
            this._initSliderWidth();
            this._initDots();
            this._initSliderBScroll();
            if (this.autoPlay) {
                this._play();
            }
        }, 20);
        window.addEventListener('resize', () => {
            if (this.sliderScroll) {
                this._initSliderWidth(false);
                this._initSliderBScroll();
            };
        });
    },
    destroyed(){
        clearTimeout(this.timer);
    },
    methods: {
        // 定义slider的宽度
        _initSliderWidth(noResize){
            noResize = true || noResize;
            this.children = this.$refs.slidergroup.children;
            // console.log(this.children.length);
            let width = 0;
            let sliderWidth = this.$refs.slider.clientWidth;
            for (let i = 0; i < this.children.length; i++) {
                let child = this.children[i];
                addClass(child, 'slider-item');
                child.style.width = sliderWidth + 'px';
                width += sliderWidth;
            }
            // 在resize的时候不需要再添加width
            if (this.loop && noResize) {
                width += 2 * sliderWidth;
            }
            this.$refs.slidergroup.style.width = width + 'px';
        },
        _initSliderBScroll(){
            if (!this.sliderScroll) {
                this.sliderScroll = new BScroll(this.$refs.slider, {
                    click: true,
                    scrollX: true,
                    scrollY: false,
                    // 惯性
                    momentum: false,
                    snap: {
                        loop: true,
                        threshold: 0.1
                    },
                    bounce: true
                });
                // 滚动完成后事件,执行bs的函数获取index
                this.sliderScroll.on('scrollEnd', () => {
                    let pageIndex = this.sliderScroll.getCurrentPage().pageX;
                    this.currentPageIndex = pageIndex;
                    // 滚动完成后再次执行自动滚动
                    if (this.autoPlay) {
                        this._play();
                    }
                });
            } else {
                this.sliderScroll.refresh();
            }
        },
        // 获取dots的长度
        _initDots(){
            this.dots = new Array(this.children.length);
        },
        _play(){
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                if (this.loop) {
                    if (this.direction){
                        this.currentPageIndex += 1;
                        this.currentPageIndex %= this.children.length - 2;
                    } else {
                        this.currentPageIndex -= 1;
                        this.currentPageIndex = this.currentPageIndex === -1 ? this.children.length - 2 : this.currentPageIndex;
                    }
                }
                this.sliderScroll.goToPage(this.currentPageIndex, 0, 400);
                // console.log(this.currentPageIndex);
            }, this.interval);
        }
    }
};
</script>

<style lang="stylus">
@import "~common/stylus/variable"
.slider
    min-height: 1px
    .slider-group
        position: relative
        overflow: hidden
        white-space: nowrap
        .slider-item
            float: left
            box-sizing: border-box
            overflow: hidden
            text-align: center
            a
                display: block
                width: 100%
                overflow: hidden
                text-decoration: none
            img
                display: block
                width: 100%
    .dots
        position: absolute
        right: 0
        left: 0
        bottom: 12px
        text-align: center
        font-size: 0
        .dot
            display: inline-block
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-text-l
            &.active
                width: 20px
                border-radius: 5px
                background: $color-text-ll
</style>
