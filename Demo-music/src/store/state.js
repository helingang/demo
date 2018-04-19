import {playMode} from 'common/js/config.js';

const state = {
    // 歌手列表中点击选中singer的信息
    singer: {},
    // 是否正在播放
    playing: false,
    // 是否全屏
    fullScreen: false,
    // 播放列表
    playList: [],
    // 序列化后的播放列表(根据播放模式来排序)
    sequenceList: [],
    // 播放模式(sequence: 0, loop: 1, random: 2)
    mode: playMode.sequence,
    // 当前播放的索引
    currentIndex: -1,
    // 这里不需要全局保存当前播放的song,因为song可以通过list和index得到

    disc: {},
    topList: {}
};

export default state;
