import {mapGetters} from 'vuex';
export const playlistMixin = {
    computed: {
        ...mapGetters(
            [
                'playList'
            ]
        )
    },
    mounted(){
        this.handlePlayList(this.playList);
    },
    activated(){
        this.handlePlayList(this.playList);
    },
    watch: {
        playList(){
            this.handlePlayList(this.playList);
        }
    },
    methods: {
        handlePlayList(){
            throw new Error('组件必须执行handlePlayList函数');
        }
    }
};