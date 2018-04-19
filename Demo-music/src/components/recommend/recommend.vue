<template>
    <div>
        <scroll class="recommend" ref="scroll" :data="discList">
            <div class="recommend-content">

                <!-- 轮播图 -->
                <!-- recommends.length获取到数据的时候再加载DOM -->
                <div v-if="recommends.length" class="slider-wrapper">
                    <slider ref='slider'>
                        <!-- 循环每一个silder -->
                        <div v-for="item in recommends" :key="item.id">
                            <a :href="item.linkUrl">
                                <img :src="item.picUrl" alt="" width="100%" class="needsclick">
                            </a>
                        </div>
                    </slider>
                </div>

                <!-- 推荐列表 -->
                <div class="recommend-list">
                    <h1 class="list-title">热门歌单推荐</h1>
                    <ul>
                        <li class="item" v-for="(item, index) in discList" :key="index" @click="linkTodisc(item)">
                            <div class="icon">
                                <img v-lazy="item.imgurl" alt="" class="icon" width="60" height="60" @load="loadImage">
                            </div>
                            <div class="text">
                                <div class="name" v-html="item.creator.name"></div>
                                <div class="desc" v-html="item.dissname"></div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="loading-container" v-show="!discList.length">
                <loading></loading>
            </div>
        </scroll>
        <router-view></router-view>
    </div>
</template>

<script>
import {getRecommend, getDiscList, getDisc} from 'api/recommend.js';
import {ERR_OK} from 'api/config.js';
import Slider from 'base/slider/slider.vue';
import BScroll from 'better-scroll';
import axios from 'axios';
import Scroll from 'base/scroll/scroll.vue';
import Loading from 'base/loading/loading.vue';
import {mapMutations, mapGetters} from 'vuex';
export default {
    data(){
        return {
            recommends: [],
            discList: [],
            checkLoaded: false
        };
    },
    created(){
        this._getRecommend();
        this._getDiscList();
    },
    methods: {
        _getRecommend(){
            getRecommend().then((res) => {
                if (res.code === ERR_OK) {
                    this.recommends = res.data.slider;
                }
            }).catch((err) => {
                alert(err);
            });
        },
        _getDiscList() {
            getDiscList().then((res) => {
                this.discList = res.data.list;
            }).catch(er => {
                console.log(er);
            });
        },
        loadImage(){
            this.$refs.scroll.refresh();
        },
        linkTodisc(disc){
            this.$router.push({
                path: `/recommend/${disc.dissid}`
            });
            this.setDisc(disc);
        },
        ...mapMutations(
            {
                setDisc: 'SET_DISC'
            }
        )
    },
    components: {
        Slider,
        Scroll,
        Loading
    }
};
</script>

<style lang="stylus" scoped>
@import "~common/stylus/variable"
.recommend
    position fixed
    width 100%
    top 88px
    bottom 0
    overflow hidden
    .recommend-content
        overflow hidden
        .slider-wrapper
            position relative
            width 100%
            overflow hidden
        .recommend-list
            .list-title
                height 65px
                line-height 65px
                text-align center
                font-size $font-size-medium
                color $color-theme
            .item
                display flex
                box-sizing border-box
                align-items center
                padding 0 20px 20px 20px
                .icon
                    flex 0 0 60px
                    width 60px
                    padding-right 20px
                .text
                    display flex
                    flex-direction column
                    justify-content center
                    flex 1
                    line-height 20px
                    overflow hidden
                    font-size $font-size-medium
                    .name
                        margin-bottom 10px
                        color $color-text
                    .desc
                        color $color-text-d
        .loading-container
            position absolute
            width 100%
            top 50%
            transform translateY(-50%)

</style>
