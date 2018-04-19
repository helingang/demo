<template>
    <div id="app">
        <!-- 顶部样式 -->
        <m-header></m-header>
        <!-- 导航栏 -->
        <tab></tab>
        <!-- 导航栏-路由区 -->
        <!-- keep-alive会将DOM缓存到内存中,刷新后清除 -->
        <keep-alive>
            <router-view></router-view>
        </keep-alive>
        <player></player>
    </div>
</template>

<script>
import MHeader from 'components/m-header/m-header';
import Tab from 'components/tab/tab';
import Player from 'components/player/player';
export default {
    name: 'App',
    methods: {
        test(){
        }
    },
    components: {
        MHeader,
        Tab,
        Player
    }
};
</script>

<style lang="stylus">
@import "common/stylus/variable.styl"

</style>
