import jsonp from 'common/js/jsonp.js';
import {commonParams, options} from './config.js';
import axios from 'axios';

export function getSingers(filter){
    // https://c.y.qq.com/v8/fcg-bin/v8.fcg?channel=singer&page=list&key=all_all_all&pagesize=100&pagenum=1&g_tk=5381&jsonpCallback=GetSingerListCallback&loginUin=0&hostUin=0&format=jsonp&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq&needNewCode=0
    let url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg';
    let data = {
        channel: 'singer',
        page: 'list',
        key: `all_all_${filter}`,
        pagesize: 100,
        pagenum: 1,
        g_tk: 2075181306,
        loginUin: 0,
        hostUin: 0,
        format: 'jsonp',
        inCharset: 'utf8',
        outCharset: 'utf-8',
        notice: 0,
        platform: 'yqq',
        needNewCode: 0
    };
    return jsonp(url, data, options);
}

export function getMusicList(mid){
    let url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg';
    let data = {
        g_tk: 230618853,
        loginUin: 0,
        hostUin: 0,
        format: 'jsonp',
        inCharset: 'utf8',
        outCharset: 'utf-8',
        notice: 0,
        platform: 'yqq',
        needNewCode: 0,
        singermid: mid,
        order: 'listen',
        begin: 0,
        num: 100,
        songstatus: 1
    };
    return jsonp(url, data, options);
}

export function getLyric(musicid) {
    const url = '/api/lyric';
    const data = ({
        pcachetime: new Date(),
        songmid: musicid,
        g_tk: 230618853,
        loginUin: 0,
        hostUin: 0,
        format: 'jsonp',
        inCharset: 'utf8',
        outCharset: 'utf-8',
        notice: 0,
        platform: 'yqq',
        needNewCode: 0
    });

    return axios.get(url, {
        params: data
    });
}
