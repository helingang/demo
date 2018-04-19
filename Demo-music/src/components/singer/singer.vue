<template>
    <div class="singer" ref="singer">
        <Listview :data="singers" @select="link1" ref="list"></Listview>
        <router-view></router-view>
    </div>
</template>

<script>
import {getSingers} from 'api/singer.js';
import Singer from 'common/js/singer.js';
import {ERR_OK} from 'api/config';
import Listview from 'base/listview/listview.vue';
import {mapMutations, mapGetters} from 'vuex';
import {playlistMixin} from 'common/js/mixin.js';
const HOT_NAME = '热门';
const HOT_SINGER_LENGTH = 10;
export default {
    mixins: [
        playlistMixin
    ],
    components: {
        Listview
    },
    data(){
        return {
            singers: [],
            singerfilter: 'all'
        };
    },
    created(){
        this._getSingers(this.singerfilter);
    },
    methods: {
        handlePlayList(playList){
            const bottom = playList.length > 0 ? '60px' : '';
            this.$refs.singer.style.bottom = bottom;
            this.$refs.list.refresh();
        },
        // link(singer)中的singer是viewList组件通过emit传递过来的
        link1(singer){
            this.$router.push(
                {
                    // 使用路由做当前页面和详情页的切换(已在index中配置子路由)
                    path: `/singer/${singer.mid}`
                }
            );
            // 相当于调用this.$store.commit(this.setSinger, singer)
            // 执行后就相当于点击歌手后才为state中的singer赋值 (通过子组件的点击事件触发)
            this.setSinger(singer);
        },
        // 获取singer数据
        _getSingers(singerfilter){
            getSingers(singerfilter).then((res) => {
                if (res.code === ERR_OK){
                    this.singers = res.data.list;
                    this.singers = this._normalizeSinger(this.singers);
                }
            }).catch((err) => {
                console.log(err);
            });
        },
        // 格式化获取的singers数据
        _normalizeSinger(list){
            if (!list.length) {
                return;
            }
            let map = {
                hot: {
                    title: HOT_NAME,
                    items: []
                }
            };
            list.forEach((item, index) => {
                if (index < HOT_SINGER_LENGTH){
                    map.hot.items.push(new Singer({
                        mid: item.Fsinger_mid,
                        name: item.Fsinger_name
                    }));
                }
                const key = item.Findex;
                if (!map[key]) {
                    map[key] = {
                        title: key,
                        items: []
                    };
                }
                map[key].items.push(new Singer({
                    mid: item.Fsinger_mid,
                    name: item.Fsinger_name
                }));
            });
            // console.log(map);
            // 为了得到有序列表,需要处理map对象
            let hot = [];
            let rest = [];
            let num = {
                title: '其他',
                items: []
            };
            for (let k in map) {
                if (map[k].title.match(/[A-Za-z]/)) {
                    rest.push(map[k]);
                } else if (map[k].title === HOT_NAME) {
                    hot.push(map[k]);
                } else if (map[k].title.match(/[0-9]/)) {
                    num.items = num.items.concat(map[k].items);
                }
            };
            rest.sort((a, b) => {
                return a.title.charCodeAt(0) - b.title.charCodeAt(0);
            });
            let arr = [].concat(hot, rest, num);
            return arr;
        },
        ...mapMutations(
            {
                setSinger: 'SET_SINGER'
            }
        )
    }
};
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable.styl'
.singer
    position fixed
    top 88px
    bottom 0
    width 100%
</style>
