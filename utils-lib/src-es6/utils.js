import {isArray} from './type'

function each(obj, fn) {
    if (!obj || !fn) return

    if (isArray) {
        for (let i = 0, len = obj.length; i < len; i++) {
            if (fn.call(obj, obj[i], i) === false) return
        }
    } else {
        let keys = Object.keys(obj)
        for (let i = 0, len = keys.length; i < len; i++) {
            let k = keys[i]
            if (fn.call(obj, obj[k], k) === false) return
        }
    }
}

// 扩展对象
function extendObj(targetObj, obj, isOverwrite) {
    isOverwrite = isOverwrite || false;
    let keys = Object.keys(obj)

    for (let i = 0, len = keys.length; i < len; i++) {
        let key = keys[i]
        if (isOverwrite || !(key in targetObj)) {
            targetObj[key] = obj[key]
        }
    }

    return targetObj
}

export {each, extendObj}
export * from './type'
