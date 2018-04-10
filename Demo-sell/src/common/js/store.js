// 数据存储

export function saveToLoacl(id, key, val){
    // localStorage.__seller__中的seller是字符串型的JSON
    let seller = window.localStorage.__seller__;
    if (id === undefined){
        id = 'default';
    }
    if (!seller){
        seller = {};
        seller[id] = {};
    } else {
        seller = JSON.parse(seller);
        if (!seller[id]){
            seller[id] = {};
        }
    }
    seller[id][key] = val;
    window.localStorage.__seller__ = JSON.stringify(seller);
}

// def -> 默认值
// 根据id读取key对应的value
export function loadFromLocal(id, key, def){
    let seller = window.localStorage.__seller__;
    if (!seller){
        return def;
    }
    seller = JSON.parse(seller)[id];
    if (!seller){
        return def;
    }
    let ret = seller[key];
    return ret || def;
}
