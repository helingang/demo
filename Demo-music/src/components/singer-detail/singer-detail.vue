<template>
    <transition name="singerdetail">
        <music-list :songs="songs" :bgImage="singer.avatar" :title="singer.name" ></music-list>
    </transition>
</template>

<script>
import {mapGetters} from 'vuex';
import {getSingers, getMusicList, getLyric} from 'api/singer.js';
import {ERR_OK} from 'api/config.js';
import {Song, createSong} from 'common/js/song.js';
import axios from 'axios';
import MusicList from 'components/music-list/music-list';
export default {
    data(){
        return {
            songs: []
        };
    },
    computed: {
        ...mapGetters(
            [
                // 对应getters.js中的singer
                // 可以在当前组件中拿到这个singer
                'singer'
            ]
        )
        // ...mapState(
        //     ['singer']
        // )
    },
    mounted(){
    },
    created(){
        this._getMusicList();
    },
    methods: {
        _getMusicList(){
            // 当在detail页面刷新时,会找不到this.singer,因为this.singer是在点击歌手头像时赋值到state中的
            if (!this.singer.mid) {
                this.$router.push('/singer');
                return;
            }
            getMusicList(this.singer.mid).then((res) => {
                if (res.code === ERR_OK) {
                    this.songs = this._normalizeSongs(res.data.list);
                }
            });
        },
        _normalizeSongs(list){
            let arr = [];
            list.forEach(item => {
                // 赋值结构,只需要musicData
                let {musicData} = item;
                if (musicData.songid && musicData.albummid) {
                    arr.push(createSong(musicData));
                }
            });
            return arr;
        }
    },
    components: {
        MusicList
    }
};
</script>

<style lang="stylus" scoped>
@import "~common/stylus/variable"

.singerdetail-enter, .singerdetail-leave-to{
    transform: translate3d(100%, 0, 0);
}
.singerdetail-enter-active, .singerdetail-leave-active{
    transition: all .3s;
}
</style>
