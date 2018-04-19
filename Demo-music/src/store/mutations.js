// mutations就是一个方法,去修改
import * as types from './mutation-types.js';

const mutations = {
    // 在调用的使用将传入的singer赋值给state中的singer
    [types.SET_SINGER](state, singer){
        state.singer = singer;
    },
    [types.SET_PLAYING](state, boolean){
        state.playing = boolean;
    },
    [types.SET_FULLSCREEN](state, boolean){
        state.fullScreen = boolean;
    },
    [types.SET_PLAYLIST](state, playListArray){
        state.playList = playListArray;
    },
    [types.SET_SEQUENCELIST](state, sequenceListArray){
        state.sequenceList = sequenceListArray;
    },
    [types.SET_MODE](state, modeNumber){
        state.mode = modeNumber;
    },
    [types.SET_CURRENTINDEX](state, currentIndex){
        state.currentIndex = currentIndex;
    },
    [types.SET_CURRENTSONG](state, currentSong){
        state.currentSong = currentSong;
    },
    [types.SET_CURRENTSONGLYRIC](state, currentSongLyric){
        state.currentSongLyric = currentSongLyric;
    },
    [types.SET_DISC](state, disc){
        state.disc = disc;
    },
    [types.SET_TOPLIST](state, topList){
        state.topList = topList;
    }
};

export default mutations;
