<template>
    <transition name="toplist">
        <music-list :bgImage="bgImage" :title="title" :songs="musicList" :isRank="true"></music-list>
    </transition>
</template>

<script>
import MusicList from 'components/music-list/music-list.vue';
import {mapGetters} from 'vuex';
import {getTopList} from 'api/rank.js';
import {createSong} from 'common/js/song.js';
export default {
    data(){
        return {
            songs: []
        };
    },
    components: {
        MusicList
    },
    computed: {
        bgImage(){
            if (this.songs.length) {
                return this.songs[0].image;
            }
            return '';
        },
        title(){
            return this.topList.topTitle;
        },
        musicList(){
            return this.songs;
        },
        ...mapGetters(
            [
                'topList'
            ]
        )
    },
    created(){
        this._getMusicList();
    },
    methods: {
        _getMusicList(){
            if (!this.topList.id) {
                this.$router.back();
            }
            getTopList(this.topList.id).then(res => {
                if (res.code === 0) {
                    this.songs = this._normalizeSong(res.songlist);
                }
            });
        },
        _normalizeSong(list){
            let arr = [];
            list.forEach(item => {
                if (item.data.songid && item.data.albumid) {
                    arr.push(createSong(item.data));
                }
            });
            return arr;
        }
    }
};
</script>

<style lang="stylus" scoped>
.toplist-enter, .toplist-leave-to
    transform translate3d(100%, 0, 0)
.toplist-enter-active, .toplist-leave-active
    transition all 0.3s
</style>
