<template>
    <div class="progress-bar">
        <div class="bar-inner" ref="bar" @click="progressClick">
            <div class="progress" ref="progress"></div>
            <div class="progress-btn-wrapper" ref="progressbtnwrapper" @touchstart="progressTouchStart" @touchmove="progressTouchMove" @touchend="progressTouchEnd">
                <div class="progress-btn"></div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        percent: {
            type: Number,
            default: 0
        }
    },
    created(){
        this.touch = {};
    },
    methods: {
        progressTouchStart(e){
            this.touch.initiated = true;
            this.touch.startX = e.touches[0].pageX;
            this.touch.left = this.$refs.progress.clientWidth;
        },
        progressTouchMove(e){
            if (this.touch.initiated) {
                const deltaX = e.touches[0].pageX - this.touch.startX;
                const offsetWidth = Math.min(this.$refs.bar.clientWidth, Math.max(0, this.touch.left + deltaX));
                this._offset(offsetWidth);
            }
        },
        progressTouchEnd(){
            this.touch.initiated = false;
            let p = this.$refs.progress.clientWidth / this.$refs.bar.clientWidth;
            this.$emit('changeP', p);
        },
        progressClick(e){
            this._offset(e.offsetX - 7);
            let p = (e.offsetX - 7) / this.$refs.bar.clientWidth;
            console.log(p);
            this.$emit('changeP', p);
        },
        _offset(a){
            this.$refs.progressbtnwrapper.style.transform = `translateX(${a + 'px'})`;
            this.$refs.progress.style.width = a + 'px';
        }
    },
    watch: {
        percent(){
            if (this.percent >= 0 && this.touch.initiated === false) {
                this._offset(this.$refs.bar.clientWidth * this.percent);
            }
        }
    }
};
</script>

<style lang="stylus" scoped>
@import "~common/stylus/variable"
.progress-bar
    height 30px
    .bar-inner
        position relative
        top 13px
        height 4px
        background rgba(0, 0, 0, .3)
        .progress
            position absolute
            height 100%
            background $color-theme
        .progress-btn-wrapper
            position absolute
            left -8px
            top -13px
            width 30px
            height 30px
            .progress-btn
                position relative
                top 7px
                left 7px
                box-sizing border-box
                width 16px
                height 16px
                border 3px solid $color-text
                border-radius 50%
                background $color-theme
</style>
