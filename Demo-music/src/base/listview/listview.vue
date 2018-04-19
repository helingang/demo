<template>
    <scroll class="listview" :data="data" ref='listview' :listenScroll="listenScroll" @scroll="scroll" :probeType="probeType">
        <ul>
            <li class="list-group" v-for="(group, index) in data" :key="index" ref="listgroup">
                <h2 class="list-group-title">{{ group.title }}</h2>
                <ul>
                    <li class="list-group-item" v-for="(item, index) in group.items" :key="index" ref="listgroupitem" @click="selectItem(item)">
                        <img v-lazy="item.avatar" alt="" class="avatar">
                        <span class="name">{{ item.name }}</span>
                    </li>
                </ul>
            </li>
        </ul>
        <div class="list-shortcut" @touchstart="onShortcutTouchstart($event)" @touchmove.stop.prevent="onShortcutTouchmove($event)">
            <ul ref="listshortcut">
                <li class="item" v-for="(item, index) in shortcutList" :key="index" :data-index="index" :class="{'current':currentIndex===index}" ref="listshortcutitem">{{ item }}</li>
            </ul>
        </div>
        <div class="list-fixed" v-show="fixedTitle" ref="listfix">
            <h1 class="fixed-title">{{ fixedTitle }}</h1>
        </div>
        <div class="loading-container">
            <loading v-show="!data.length"></loading>
        </div>
    </scroll>
</template>

<script>
import Scroll from 'base/scroll/scroll.vue';
import Loading from 'base/loading/loading.vue';
import {getData} from 'common/js/dom.js';
import singerVue from '../../components/singer/singer.vue';
const SHORTCUT_HEIGHT = 18;
const FIX_HEIGHT = 30;
export default {
    data(){
        return {
            scrollY: 0,
            currentIndex: 0,
            // fix距离
            diff: -1
        };
    },
    props: {
        data: {
            type: Array,
            default(){
                return [];
            }
        }
    },
    created(){
        // this.touch是点击shortcut时的参数
        // 不创建在data中是因为在data中的对象会被Vue所监听,而被绑定在DOM中,这里this.touch不需要被监听所以不需要在data中定义
        this.touch = {};
        this.listenScroll = true;
        this.probeType = 3;
        this.singersHeightArray = [];
    },
    computed: {
        shortcutList(){
            return this.data.map((item) => {
                return item.title.substr(0, 1);
            });
        },
        fixedTitle(){
            if (this.scrollY > 0) {
                return false;
            }
            return this.data[this.currentIndex] ? this.data[this.currentIndex].title : false;
        }
    },
    methods: {
        refresh(){
            this.$refs.listview.refresh();
        },
        selectItem(item){
            this.$emit('select', item);
        },
        onShortcutTouchstart(e){
            let firstTouch = e.touches[0];
            this.touch.y1 = firstTouch.pageY;
            // 点击shortcut的index
            let singerIndex = getData(e.target, 'data-index') * 1;
            this.touch.initIndex = singerIndex;
            this._scrollTo(singerIndex);
        },
        onShortcutTouchmove(e){
            let firstTouch = e.touches[0];
            let initY = e.touches[0].pageY;
            this.touch.y2 = firstTouch.pageY;
            let deltar = this.touch.y2 - this.touch.y1;
            // 与Math.floor相同
            let index = deltar / SHORTCUT_HEIGHT | 0;
            let singerIndex = index + this.touch.initIndex;
            this._scrollTo(singerIndex);
        },
        // 计算listgroup的height,执行的时机是: 当接收父级的data参数改变时
        _calculateHeight(){
            this.singersHeightArray = [];
            let h = 0;
            this.singersHeightArray.push(h);
            this.$refs.listgroup.forEach((item, index) => {
                h += item.clientHeight;
                this.singersHeightArray.push(h);
            });
        },
        scroll(pos){
            this.scrollY = pos.y;
        },
        _scrollTo(index){
            if (index < 0) {
                index = 0;
            } else if (index > this.singersHeightArray.length - 2){
                index = this.singersHeightArray.length - 2;
            }
            if (index === null) {
                return;
            }
            this.currentIndex = index;
            // console.log(this.singersHeightArray, index)
            this.scrollY = -this.singersHeightArray[index];
            this.$refs.listview.scrollToElement(this.$refs.listgroup[index], 0);
        }
    },
    components: {
        Scroll,
        Loading
    },
    watch: {
        data(){
            setTimeout(() => {
                this._calculateHeight();
            }, 20);
        },
        scrollY(){
            let arr = this.singersHeightArray;
            for (let i = 0; i < arr.length; i++) {
                let h1 = arr[i];
                let h2 = arr[i + 1];
                // 当滚动到顶部的外面
                if (this.scrollY > 0) {
                    this.currentIndex = 0;
                    return;
                }
                // 当滚动到底部的外面
                if (-this.scrollY >= arr[arr.length - 1] - this.$refs.listview.$el.clientHeight) {
                    this.currentIndex = arr.length - 2;
                    return;
                }
                // 在列表中间滚动
                if (h2 && (-this.scrollY >= h1 && -this.scrollY < h2)) {
                    this.currentIndex = i;
                    this.diff = h2 - (-this.scrollY);
                    return;
                }
            }
            this.currentIndex = 0;
        },
        diff(){
            let t;
            if (this.diff <= FIX_HEIGHT) {
                t = this.diff - FIX_HEIGHT - 1;
            } else {
                t = -1;
            }
            this.$refs.listfix.style.transform = `translate3D(0, ${t}px, 0)`;
        }
    }
};
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable.styl'
.listview
    position relative
    width 100%
    height 100%
    overflow hidden
    background $color-background
    .list-group
        padding-bottom 30px
        .list-group-title
            height 39ox
            line-height 30px
            padding-left 20px
            font-size $font-size-small
            color $color-text-l
            background $color-highlight-background
        .list-group-item
            display flex
            align-items center
            padding 20px 0 0 30px
            .avatar
                width 50px
                height 50px
                border-radius 50%
            .name
                margin-left 20px
                color: $color-text-l
                font-size $font-size-medium
    .list-shortcut
        position absolute
        z-index 30
        right 0
        top 50%
        transform translateY(-50%)
        width 20px
        border-radius 10px
        text-align center
        background $color-background-d
        font-family Helvetica
        .item
            padding 3px
            line-height 1
            color $color-text-l
            font-size $font-size-small
            &.current
                color: $color-theme
    .list-fixed
        position absolute
        top 0
        left 0
        width 100%
        .fixed-title
            height: 30px
            line-height: 30px
            padding-left: 20px
            font-size: $font-size-small
            color: $color-text-l
            background: $color-highlight-background
    .loading-container
        position absolute
        width 100%
        top 50%
        transform translateY(-50%)
</style>
