import {Base64} from 'js-base64';
import {getLyric} from 'api/singer.js';
import {ERR_OK} from 'api/config.js';

export class Song{
    constructor({songid, songmid, songname, singer, albumname, duration, image, url}){
        this.songid = songid;
        this.songmid = songmid;
        this.singer = singer;
        this.albumname = albumname;
        this.duration = duration;
        this.image = image;
        this.url = url;
        this.songname = songname;
    };
    getLy(){
        if (this.lyric) {
            return Promise.resolve(this.lyric);
        }
        return new Promise((resolve, reject) => {
            getLyric(this.songmid).then(res => {
                if (res.data.code === ERR_OK) {
                    this.lyric = Base64.decode(res.data.lyric);
                    resolve(this.lyric);
                }
            });
        });
    }
}

export function createSong(musicData){
    return new Song({
        songid: musicData.songid,
        songmid: musicData.songmid,
        songname: musicData.songname,
        singer: filterSinger(musicData.singer),
        albumname: musicData.albumname,
        duration: musicData.interval,
        image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
        url: `http://thirdparty.gtimg.com/C100${musicData.songmid}.m4a?fromtag=38`
        // http://thirdparty.gtimg.com/C100${musicData.songmid}.m4a?fromtag=38
    });
};

function filterSinger(singer){
    let singers = [];
    if (!singer) {
        return [];
    }
    singer.forEach(item => {
        singers.push(item.name);
    });
    return singers.join('/');
}