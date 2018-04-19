<template>
    <div class="player" v-show="playList.length > 0">
        <transition name="normal-player" @enter="enter" @afterenter="afterenter" @leave="leave" @afterleave="afterleave">
            <div class="normal-player" v-show="fullScreen" ref="normalplayer">
                <div class="background">
                    <img :src="currentSong.image" alt="" width="100%" height="100%">
                </div>
                    <div class="top">
                        <div class="back" @click="foldToBottom">
                            <i class="icon-back"></i>
                        </div>
                        <h1 class="title" v-html="currentSong.songname"></h1>
                        <h2 class="subtitle" v-html="currentSong.singer"></h2>
                    </div>
                <div class="middle" @touchstart.prevent="middleTouchStart" @touchmove.prevent="middleTouchMove" @touchend.prevent="middleTouchEnd">
                    <div class="middle-l" ref="cd">
                        <div class="cd-wrapper" ref="cdwrapper">
                            <div class="cd play" :class="cdClass">
                                <img class="image" :src="currentSong.image" alt="">
                            </div>
                        </div>
                        <div class="playing-lyric-wrapper">
                            <div class="playing-lyric">{{ playingLyric }}</div>
                        </div>
                    </div>
                    <scroll class="middle-r" ref="lyriclist" :data="currentLyric && currentLyric.lines">
                        <div class="lyric-wrapper">
                            <div v-if="currentLyric">
                                <p class="text" ref="lyricline" v-for="(line, index) in currentLyric.lines" :key="index" :class="{'current': currentLineNum === index}">{{ line.txt }}</p>
                            </div>
                        </div>
                    </scroll>
                </div>
                <div class="bottom">
                    <div class="dot-wrapper">
                        <div class="dot" :class="{'active': currentShow === 'cd'}"></div>
                        <div class="dot" :class="{'active': currentShow === 'lyric'}"></div>
                    </div>
                    <div class="progress-wrapper">
                        <span class="time time-l">{{ currentTime | formatTime }}</span>
                        <div class="progress-bar-wrapper">
                            <progressBar :percent="percent" @changeP="onPercentChange"></progressBar>
                        </div>
                        <span class="time time-r">{{ currentSong.duration | formatTime }}</span>
                    </div>
                    <div class="operators">
                        <div class="icon i-left" @click="clickChangeMode">
                            <i :class="playModeClass"></i>
                        </div>
                        <div class="icon i-left" :class="disableClass">
                            <i class="icon-prev" @click="pre"></i>
                        </div>
                        <div class="icon i-center" :class="disableClass" >
                            <i :class="playIcon" @click="togglePlaying"></i>
                        </div>
                        <div class="icon i-right" :class="disableClass" >
                            <i class="icon-next" @click="next"></i>
                        </div>
                        <div class="icon i-right">
                            <div class="icon icon-not-favorite"></div>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
        <transition name="mini-player">
            <div class="mini-player" v-show="!fullScreen" @click="unfoldToFullScreen">
                <div class="icon">
                    <img :src="currentSong.image" class="play" :class="cdClass" alt="" width="40" height="40">
                </div>
                <div class="text">
                    <h2 class="name" v-html="currentSong.songname"></h2>
                    <p class="desc" v-html="currentSong.singer"></p>
                </div>
                <div class="control">
                    <i :class="miniIcon" @click.stop.prevent="togglePlaying"></i>
                </div>
                <div class="control">
                    <i class="icon-playlist"></i>
                </div>
            </div>
        </transition>
        <audio :src="currentSong.url" ref="audio" @canplay="ready" @error="error" @ended="ended" @timeupdate="updateTime"></audio>
    </div>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex';
import animations from 'create-keyframe-animation';
import progressBar from 'base/progress-bar/progress-bar.vue';
import progressCircle from 'base/progress-circle/progress-circle.vue';
import {playMode} from 'common/js/config.js';
import {shuffle} from 'common/js/util.js';
import Lyric from 'lyric-parser';
import Scroll from 'base/scroll/scroll';
export default {
    data(){
        return {
            songReady: false,
            currentTime: 0,
            currentLyric: null,
            currentLineNum: 0,
            currentShow: 'cd',
            playingLyric: ''
        };
    },
    components: {
        progressBar,
        progressCircle,
        Scroll
    },
    filters: {
        formatTime(time){
            // 向下取整
            time = time | 0;
            let minutes = time / 60 | 0;
            let seconds = time % 60 + '';
            seconds = ('00' + seconds).substr(seconds.length);
            return `${minutes}:${seconds}`;
        }
    },
    created(){
        // 用来关联touchstart和touchmove和touchend
        this.touch = {};
    },
    computed: {
        playIcon(){
            return this.playing ? 'icon-pause' : 'icon-play';
        },
        miniIcon(){
            return this.playing ? 'icon-pause-mini' : 'icon-play-mini';
        },
        disableClass(){
            return this.songReady ? '' : 'disable';
        },
        cdClass(){
            return this.playing ? 'play' : 'play pause';
        },
        playModeClass(){
            return this.mode === 0 ? 'icon-sequence' : this.mode === 1 ? 'icon-loop' : 'icon-random';
        },
        ...mapGetters(
            [
                'playing',
                'fullScreen',
                'playList',
                'sequenceList',
                'mode',
                'currentIndex',
                'currentSong'
            ]
        ),
        percent(){
            return this.currentTime / this.currentSong.duration;
        }
    },
    methods: {
        foldToBottom(){
            this.setFullScreen(false);
        },
        unfoldToFullScreen(){
            this.setFullScreen(true);
        },
        togglePlaying(){
            if (!this.songReady) {
                return;
            }
            if (!this.playing) {
                this.setPlaying(!this.playing);
            } else {
                this.setPlaying(!this.playing);
            }
            if (this.currentLyric) {
                this.currentLyric.togglePlay();
            }
        },
        next(){
            if (!this.songReady) {
                return;
            }
            if (this.mode !== playMode.loop) {
                let index = this.currentIndex + 1;
                if (index === this.playList.length){
                    index = 0;
                }
                this.setCurrentIndex(index);
                this.songReady = false;
            } else {
                this.$refs.audio.currentTime = 0;
                this.$refs.audio.play();
            }
            this.setPlaying(true);
            if (this.currentLyric) {
                this.currentLyric.seek();
            }
        },
        pre(){
            if (!this.songReady) {
                return;
            }
            if (this.mode !== playMode.loop) {
                let index = this.currentIndex - 1;
                if (index === -1){
                    index = this.playList.length - 1;
                }
                this.setCurrentIndex(index);
                this.songReady = false;
            } else {
                this.$refs.audio.currentTime = 0;
                this.$refs.audio.play();
            }
            if (this.currentLyric) {
                this.currentLyric.seek();
            }
        },
        loop(){
        },
        ready(){
            this.songReady = true;
        },
        error(){
            this.songReady = true;
        },
        ended(){
            if (this.mode === playMode.loop) {
                this.$refs.audio.currentTime = 0;
                this.$refs.audio.play();
            } else {
                this.next();
            }
            if (this.currentLyric) {
                this.currentLyric.seek();
            }
        },
        updateTime(e){
            this.currentTime = e.target.currentTime;
        },
        onPercentChange(p){
            const currentTime = p * this.currentSong.duration;
            this.$refs.audio.currentTime = currentTime;
            if (!this.playing) {
                this.togglePlaying();
            }
            if (this.currentLyric) {
                this.currentLyric.seek(currentTime * 1000);
            }
        },
        clickChangeMode(){
            let index = (this.mode + 1) % 3;
            this.setMode(index);
            let list = null;
            if (this.mode === playMode.random) {
                list = shuffle(this.sequenceList);
            } else {
                list = this.sequenceList;
            }
            let i = list.findIndex((item) => {
                return item.songid === this.currentSong.songid;
            });
            this.setCurrentIndex(i);
            this.setPlayList(list);
        },
        middleTouchStart(e){
            this.touch.init = true;
            const touch = e.touches[0];
            this.touch.startX = touch.pageX;
            this.touch.startY = touch.pageY;
        },
        middleTouchMove(e){
            if (this.touch.init) {
                const touch = e.touches[0];
                let deltaX = touch.pageX - this.touch.startX;
                let deltaY = touch.pageY - this.touch.startY;
                if (Math.abs(deltaX) > Math.abs(deltaY)) {
                    const left = this.currentShow === 'cd' ? 0 : -window.innerWidth;
                    const width = Math.min(0, Math.max(-window.innerWidth, left + deltaX));
                    this.touch.percent = Math.abs(width / window.innerWidth);
                    this.$refs.lyriclist.$el.style.transform = `translate3D(${width}px, 0, 0)`;
                    this.$refs.cd.style.transform = `translate3D(${width}px, 0, 0)`;
                    this.$refs.lyriclist.$el.style.transition = `all 0s`;
                    this.$refs.cd.style.transition = `all 0s`;
                }
            }
        },
        middleTouchEnd(){
            let width;
            if (!this.touch.init) {
                return;
            }
            if (this.currentShow === 'cd') {
                if (this.touch.percent > 0.3){
                    width = -window.innerWidth;
                    this.currentShow = 'lyric';
                } else {
                    width = 0;
                }
            } else {
                if (this.touch.percent < 0.7) {
                    width = 0;
                    this.currentShow = 'cd';
                } else {
                    width = -window.innerWidth;
                }
            }
            this.$refs.lyriclist.$el.style.transform = `translate3D(${width}px, 0, 0)`;
            this.$refs.lyriclist.$el.style.transition = `all 0.4s`;
            this.$refs.cd.style.transform = `translate3D(${width}px, 0, 0)`;
            this.$refs.cd.style.transition = `all 0.4s`;
            this.touch.init = false;
        },
        enter(el, done){
            const {x, y, scale} = this._getPosAndScale();
            // let animation = {
            //     0: {
            //         transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
            //     },
            //     100: {
            //         transform: `translate3d(0, 0, 0) scale(1)`
            //     }
            // };
            // animations.registerAnimation({
            //     name: 'move',
            //     animation,
            //     presets: {
            //         duration: 1000,
            //         easing: 'linear'
            //     }
            // });
            // animations.runAnimation(this.$refs.cdwrapper, 'move', done);
        },
        afterenter(){
            // animations.unregisterAnimation('move');
            // this.$refs.cdwrapper.style.animation = '';
        },
        leave(el, done){
            const {x, y, scale} = this._getPosAndScale();
            // this.$refs.cdwrapper.style.transition = 'all 0.4s';
            // this.$refs.cdwrapper.style.transition = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
            // this.$refs.cdwrapper.addEventListener('animationend', done);
        },
        afterleave(){
            // this.$refs.cdwrapper.style.animation = '';
        },
        _getPosAndScale(){
            const targetWidth = 40;
            const paddingLeft = 40;
            const paddingBottom = 30;
            const paddingTop = 80;
            const width = window.innerWidth * 0.8;
            const scale = targetWidth / width;
            const x = -(window.innerWidth / 2 - paddingLeft);
            const y = window.innerHeight - paddingTop - width / 2 - paddingBottom;
            return {
                x,
                y,
                scale
            };
        },
        handleLyric({lineNum, txt}){
            this.currentLineNum = lineNum;
            // this.playingLyric = this.$refs.lyricline[this.currentLineNum].innerHTML;
            if (lineNum > 6) {
                let lineEl = this.$refs.lyricline[lineNum - 5];
                this.$refs.lyriclist.scrollToElement(lineEl, 1000);
            } else {
                this.$refs.lyriclist.scrollTo(0, 0, 1000);
            }
            this.playingLyric = txt;
        },
        ...mapMutations(
            {
                setFullScreen: 'SET_FULLSCREEN',
                setPlaying: 'SET_PLAYING',
                setCurrentIndex: 'SET_CURRENTINDEX',
                setMode: 'SET_MODE',
                setPlayList: 'SET_PLAYLIST'
            }
        )
    },
    watch: {
        currentSong(newSong, oldSong){
            if (newSong.songid === oldSong.songid) {
                return;
            }
            setTimeout(() => {
                this.$refs.audio.play();
                this.setPlaying(true);
                // 执行当前歌曲这个类下的获取歌词的函数
                if (this.currentLyric) {
                    this.currentLyric.stop();
                }
                this.currentSong.getLy().then(lyric => {
                    this.currentLyric = new Lyric(lyric, this.handleLyric);
                    if (this.playing) {
                        this.currentLyric.play();
                    }
                }).catch(() => {
                    this.currentLyric = null;
                    this.playingLyric = '';
                    this.currentLineNum = 0;
                });
            });
        },
        playing(){
            const audio = this.$refs.audio;
            this.$nextTick(() => {
                if (this.playing) {
                    audio.play();
                } else {
                    audio.pause();
                }
            });
        },
        songReady(){
            if (!this.songReady) {
                this.setPlaying(false);
            }
        }
    }
};
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable'
@import '~common/stylus/mixin'

.player
    .normal-player
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: 150
      background: $color-background
      &.normal-player-enter, &.normal-player-leave-to
        transform translate3d(0, 100%, 0)
      &.normal-player-enter-active, &.normal-player-leave-active
        transition: all .3s
      .background
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
      .top
        position: relative
        margin-bottom: 25px
        .back
          position absolute
          top: 0
          left: 6px
          z-index: 50
          .icon-back
            display: block
            padding: 9px
            font-size: $font-size-large-x
            color: $color-theme
            transform: rotate(-90deg)
        .title
          width: 70%
          margin: 0 auto
          line-height: 40px
          text-align: center
          no-wrap()
          font-size: $font-size-large
          color: $color-text
        .subtitle
          line-height: 20px
          text-align: center
          font-size: $font-size-medium
          color: $color-text
      .middle
        position: fixed
        width: 100%
        top: 80px
        bottom: 170px
        white-space: nowrap
        font-size: 0
        .middle-l
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          .cd-wrapper
            position: absolute
            left: 10%
            top: 0
            width: 80%
            height: 100%
            .cd
              width: 100%
              height: 100%
              box-sizing: border-box
              border: 10px solid rgba(255, 255, 255, 0.1)
              border-radius: 50%
              &.play
                animation: rotate 40s linear infinite
              &.pause
                animation-play-state: paused
              .image
                width: 100%
                height: 100%
                border-radius: 50%

          .playing-lyric-wrapper
            width: 80%
            margin: 30px auto 0 auto
            overflow: hidden
            text-align: center
            .playing-lyric
              height: 20px
              line-height: 20px
              font-size: $font-size-medium
              color: $color-text-l
        .middle-r
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden
          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
              &.current
                color: $color-text
      .bottom
        position: absolute
        bottom: 50px
        width: 100%
        .dot-wrapper
          text-align: center
          font-size: 0
          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-text-l
            &.active
              width: 20px
              border-radius: 5px
              background: $color-text-ll
        .progress-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0px auto
          padding: 10px 0
          .time
            color: $color-text
            font-size: $font-size-small
            flex: 0 0 30px
            line-height: 30px
            width: 30px
            &.time-l
              text-align: left
            &.time-r
              text-align: right
          .progress-bar-wrapper
            flex: 1
        .operators
          display: flex
          align-items: center
          .icon
            flex: 1
            color: $color-theme
            &.disable
              color: $color-theme-d
            i
              font-size: 30px
          .i-left
            text-align: right
          .i-center
            padding: 0 20px
            text-align: center
            i
              font-size: 40px
          .i-right
            text-align: left
          .icon-favorite
            color: $color-sub-theme
    .mini-player
      display: flex
      align-items: center
      position: fixed
      left: 0
      bottom: 0
      z-index: 180
      width: 100%
      height: 60px
      background: $color-highlight-background
      &.mini-player-enter-active, &.mini-player-leave-active
        transform: translate3d(0, -100%, 0);
      &.mini-player-enter, &.mini-player-leave-to
        opacity: 0
      .icon
        flex: 0 0 40px
        width: 40px
        padding: 0 10px 0 20px
        img
          border-radius: 50%
          &.play
            animation: rotate 20s linear infinite
          &.pause
            animation-play-state: paused
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          margin-bottom: 2px
          no-wrap()
          font-size: $font-size-medium
          color: $color-text
        .desc
          no-wrap()
          font-size: $font-size-small
          color: $color-text-d
      .control
        flex: 0 0 30px
        width: 30px
        padding: 0 10px
        .icon-play-mini, .icon-pause-mini, .icon-playlist
          font-size: 30px
          color: $color-theme-d
        .icon-mini
          font-size: 32px
          position: absolute
          left: 0
          top: 0

  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>
