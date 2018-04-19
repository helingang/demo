<template>
    <div class="wrapper" ref="wrapper">
        <slot></slot>
    </div>
</template>

<script>
import BScroll from 'better-scroll';
export default {
    props: {
        // probeType为3的时候实时派发scroll事件
        probeType: {
            type: Number,
            default: 1
        },
        click: {
            type: Boolean,
            default: true
        },
        data: {
            type: Array,
            default: null
        },
        listenScroll: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        _initScroll(){
            if (!this.$refs.wrapper) {
                console.log('scroll wrapper不存在');
                return;
            }
            if (!this.scroll) {
                this.scroll = new BScroll(this.$refs.wrapper, {
                    click: this.click,
                    probeType: this.probeType
                });
            } else {
                this.scroll.refresh();
            }
            if (this.listenScroll) {
                let _this = this;
                this.scroll.on('scroll', (pos) => {
                    _this.$emit('scroll', pos);
                });
            }
        },
        enable(){
            this.scroll && this.scroll.enable();
        },
        disable(){
            this.scroll && this.scroll.disable();
        },
        refresh(){
            this.scroll && this.scroll.refresh();
        },
        scrollTo(){
            this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments);
        },
        scrollToElement(){
            this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments);
        }
    },
    mounted(){
        setTimeout(() => {
            this._initScroll();
        }, 20);
    },
    watch: {
        data(){
            setTimeout(() => {
                this.refresh();
            }, 20);
        }
    }
};
</script>
