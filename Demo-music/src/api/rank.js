import axios from 'axios';
import jsonp from 'common/js/jsonp.js';
import {options} from 'api/config.js';

export function getRank(){
    let url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg';
    let data = {
        g_tk: 230618853,
        uin: 0,
        format: 'jsonp',
        inCharset: 'utf-8',
        outCharset: 'utf-8',
        notice: 0,
        platform: 'h5',
        needNewCode: 1
    };
    return jsonp(url, data, options);
}

export function getTopList(id){
    let url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg?';
    let data = {
        g_tk: 5381,
        uin: 0,
        format: 'jsonp',
        inCharset: 'utf-8',
        outCharset: 'utf-8',
        notice: 0,
        platform: 'h5',
        needNewCode: 1,
        tpl: 3,
        page: 'detail',
        type: 'top',
        topid: id
    };
    return jsonp(url, data, options);
}