// DOM操作的方法
export function addClass(el, className){
    if (hasClass(el, className)) {
        return;
    }
    let newClass = el.className.split(' ');
    newClass.push(className);
    el.className = newClass.join(' ');
};

function hasClass(el, className){
    let reg = new RegExp('(^|\\s)' + className + '(\\s|$)');
    return reg.test(el.className);
};

// 获取data-属性中的值
export function getData(el, name, val){
    if (val) {
        el.setAttribute(name, val);
    } else {
        return el.getAttribute(name);
    }
};
