import {isArray} from './type'

function each(obj, fn) {
    if (!obj) return

    if (isArray) {
        for (let i = 0, len = obj.length; i < len; i++) {
            if (fn.call(obj, obj[i], i) === false) return
        }
    } else {
        for (let k in obj) {
            if (fn.call(obj, obj[k], k) === false) return
        }
    }
}

// 扩展对象
function extendObj(targetObj, obj, isOverwrite) {
    isOverwrite = isOverwrite || false;
    var key;

    for (key in obj) {
        if (obj.hasOwnProperty(key) && (isOverwrite || !(key in targetObj))) {
            targetObj[key] = obj[key];
        }
    }
    return targetObj;
}

export {each, extendObj}
export * from './type'
