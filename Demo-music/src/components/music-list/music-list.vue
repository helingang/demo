<template>
    <div class="music-list">
        <div class="back" @click="linkBack">
            <span class="icon-back"></span>
        </div>
        <h1 class="title" ref="title">{{ title }}</h1>
        <div class="bg-image" :style="bgStyle" ref="bgimage">
            <div class="filter" ref='filter'></div>
            <div class="play-wrapper" v-show="songs.length" ref="play">
                <div class="play" @click="playRandom">
                    <i class="icon-play"></i>
                    <span class="text">随机播放全部</span>
                </div>
            </div>
        </div>
        <div class="bg-layer" ref="layer"></div>
        <scroll :data="songs" class="list" ref="songlistwrapper" :listenScroll="listenScroll" @scroll="scroll" :probeType="probeType">
            <div class="song-list-wrapper">
                <SongList :songs="songs" @select="selectItem" :rank="isRank"></SongList>
            </div>
        </scroll>
        <div class="loading-wrapper" v-show="!songs.length">
            <loading></loading>
        </div>
    </div>
</template>

<script>
import SongList from 'base/song-list/song-list.vue';
import Scroll from 'base/scroll/scroll.vue';
import Loading from 'base/loading/loading.vue';
import {mapMutations, mapActions, mapGetters} from 'vuex';
import {getLyric} from 'api/singer.js';
import {ERR_OK} from 'api/config.js';
import {playlistMixin} from 'common/js/mixin.js';
export default {
    mixins: [
        playlistMixin
    ],
    data(){
        return {
            scrollY: 0
        };
    },
    // 组件用在多个地方,因此需要传入不同的参数
    props: {
        isRank: {
            type: Boolean,
            default: false
        },
        bgImage: {
            type: String,
            default: ''
        },
        songs: {
            type: Array,
            default(){
                return [];
            }
        },
        title: {
            type: String,
            default: ''
        }
    },
    created(){
        this.probeType = 3;
        this.listenScroll = true;
    },
    mounted(){
        // 将songlistwrapper的top设置成底图的height
        this.$refs.songlistwrapper.$el.style.top = this.$refs.bgimage.clientHeight + 'px';
        this.imgHeight = this.$refs.bgimage.clientHeight;
    },
    computed: {
        bgStyle(){
            return `background-image: url(${this.bgImage})`;
        }
    },
    components: {
        SongList,
        Scroll,
        Loading
    },
    methods: {
        linkBack(){
            this.$router.back();
        },
        scroll(pos){
            // 此组件需要维护一个纵向滚动的值
            this.scrollY = pos.y;
        },
        // 子组件传递的参数是item和index,因为这里子组件就只关心自己点击的歌曲,而父组件用不用这些参数则不会关心
        selectItem(item, index){
            this.selectPlay({
                items: this.songs,
                i: index
            });
        },
        playRandom(){
            this.randomPlay({
                items: this.songs
            });
        },
        ...mapActions(
            [
                'selectPlay',
                'randomPlay'
            ]
        ),
        handlePlayList(playList){
            const bottom = playList.length > 0 ? '60px' : '';
            this.$refs.songlistwrapper.$el.style.bottom = bottom;
            this.$refs.songlistwrapper.refresh();
        }
    },
    watch: {
        scrollY(){
            let minY = -(this.imgHeight - this.$refs.title.clientHeight);
            let nowY = Math.max(minY, this.scrollY);
            this.$refs.layer.style.transform = `translate3D(0, ${nowY}px, 0)`;
            this.$refs.bgimage.style.height += this.scrollY + 'px';
            let zIndex = 0;
            let scale = 1;
            const p = Math.abs(this.scrollY / this.imgHeight);
            let blur = 0;
            // 如果滚到顶部
            if (this.scrollY < nowY){
                zIndex = 10;
                this.$refs.bgimage.style.paddingTop = 0;
                this.$refs.bgimage.style.height = this.$refs.title.clientHeight + 'px';
                this.$refs.play.style.display = 'none';
            } else {
                this.$refs.bgimage.style.paddingTop = 70 + '%';
                this.$refs.bgimage.style.height = 0;
                this.$refs.play.style.display = 'block';
            }
            if (this.scrollY > 0) {
                scale += p;
                zIndex = 15;
            }
            if (this.scrollY <= 0) {
                blur = Math.min(20 * p, 20);
            }
            this.$refs.bgimage.style.transform = `scale(${scale})`;
            this.$refs.bgimage.style.zIndex = zIndex;
            this.$refs.filter.style.backdropFilter = `blur(${blur}px)`;
        }
    }
};
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable.styl'
.music-list
    position fixed
    z-index 100
    top 0
    left 0
    bottom 0
    right 0
    background $color-background
    .back
        position absolute
        top 0
        left 6px
        z-index 50
        .icon-back
            display block
            padding 10px
            font-size $font-size-large-x
            color $color-theme
    .title
        position absolute
        top 0
        left 10%
        z-index 40
        width 80%
        no-wrap()
        text-align center
        line-height 40px
        font-size $font-size-large
        color $color-text
        white-space nowrap
        text-overflow ellipsis
        overflow hidden
    .bg-image
        position relative
        width 100%
        height 0
        padding-top 70%
        transform-origin top
        background-size cover
        .play-wrapper
            position absolute
            bottom 20px
            z-index 50
            width 100%
            .play
                box-sizing: border-box
                width: 135px
                padding: 7px 0
                margin: 0 auto
                text-align: center
                border: 1px solid $color-theme
                color: $color-theme
                border-radius: 100px
                font-size: 0
                .icon-play
                    display: inline-block
                    vertical-align: middle
                    margin-right: 6px
                    font-size: $font-size-medium-x
                .text
                    display: inline-block
                    vertical-align: middle
                    font-size: $font-size-small
        .filter
            position: absolute
            top: 0
            left: 0
            width: 100%
            height: 100%
            background: rgba(7, 17, 27, 0.4)
    .bg-layer
        position: relative
        height: 100%
        background: $color-background
        overflow hidden
    .list
        position: fixed
        top: 0
        bottom: 0
        width: 100%
        // overflow hidden
        background: $color-background
        .song-list-wrapper
            padding: 20px 30px
        .loading-container
            position: absolute
            width: 100%
            top: 50%
            transform: translateY(-50%)
    .loading-wrapper
        position absolute
        width 100%
        top 50%
        transform translateY(-50%)
</style>
