// jsonp原生的方法
import originJSONP from 'jsonp';

// url 和 json对象 参数分开传递, 因为原始的originJSONP方法必须手动先拼接好
export default function jsonp(url, data, option){
    // 判断拼接前的url是否包含?
    url += (url.indexOf('?') < 0 ? '?' : '&') + param(data);
    return new Promise((resolve, reject) => {
        // 这里 err 和 data 是回调参数, err为none的时候表示成功
        originJSONP(url, option, (err, data) => {
            if (!err) {
                resolve(data);
            } else {
                reject(err);
            }
        });
    });
}

// 作用是拼接data对象中的键值对到url中,并返回url
function param(data){
    let url = '';
    for (var k in data) {
        let value = data[k] !== undefined ? data[k] : '';
        // 拼接参数到url中
        url += `&${k}=${encodeURIComponent(value)}`;
    }
    // 去掉url中第一个&
    return url ? url.substring(1) : '';
}