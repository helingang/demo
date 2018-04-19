<template>
    <transition name="slide">
        <music-list :title="title" :bgImage="bgImage" :songs="discs"></music-list>
    </transition>
</template>

<script>
import MusicList from 'components/music-list/music-list.vue';
import {mapGetters} from 'vuex';
import {getDisc} from 'api/recommend.js';
import {options, ERR_OK} from 'api/config.js';
import {createSong} from 'common/js/song.js';
export default {
    data(){
        return {
            discs: []
        };
    },
    created(){
        this._getDisc();
    },
    components: {
        MusicList
    },
    computed: {
        title(){
            return this.disc.dissname;
        },
        bgImage(){
            return this.disc.imgurl;
        },
        ...mapGetters(
            [
                'disc'
            ]
        )
    },
    methods: {
        _getDisc(){
            if (!this.disc.dissid) {
                this.$router.back();
            }
            getDisc(this.disc.dissid).then(res => {
                res = JSON.parse(res.slice(options.param.length, -1));
                if (res.code === ERR_OK) {
                    res = res.cdlist;
                    this.discs = this._normalizeSongs(res[0].songlist);
                    // console.log(this.discs);
                }
            });
        },
        _normalizeSongs(list){
            let arr = [];
            list.forEach(item => {
                if (item.songid & item.albumid) {
                    arr.push(createSong(item));
                }
            });
            return arr;
        }
    }
};
</script>

<style lang="stylus" scoped>
.slide-enter, .slide-leave-to
    transform translate3d(100%, 0, 0)
.slide-enter-active, .slide-leave-active
    transition all 0.4s
</style>
