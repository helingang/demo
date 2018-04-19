import * as types from './mutation-types.js';
import {playMode} from 'common/js/config.js';
import { shuffle } from 'common/js/util.js';

export const selectPlay = function({commit, state}, {items, i}){
    commit(types.SET_SEQUENCELIST, items);
    if (state.mode === playMode.random){
        let randomList = shuffle(items);
        let index = randomList.findIndex(item => {
            return item.songid === items[i].songid;
        });
        commit(types.SET_PLAYLIST, randomList);
        commit(types.SET_CURRENTINDEX, index);
    } else {
        commit(types.SET_PLAYLIST, items);
        commit(types.SET_CURRENTINDEX, i);
    }
    commit(types.SET_FULLSCREEN, true);
    commit(types.SET_PLAYING, true);
};

export const randomPlay = function({commit, state}, {items}){
    commit(types.SET_MODE, playMode.random);
    let randomList = shuffle(items);
    commit(types.SET_SEQUENCELIST, randomList);
    commit(types.SET_PLAYLIST, randomList);
    commit(types.SET_FULLSCREEN, true);
    commit(types.SET_PLAYING, true);
    commit(types.SET_CURRENTINDEX, 0);
};
